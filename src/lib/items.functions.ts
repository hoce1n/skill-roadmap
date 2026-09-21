import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { itemsToMarkdown } from "@/lib/export-markdown";
import {
  clearSessionCookie,
  ensureSettings,
  hashPasscode,
  readUnlocked,
  requireUnlocked,
  verifyPasscode,
  writeSessionCookie,
} from "@/lib/session.server";
import type {
  ItemLink,
  PriorityTier,
  RoadmapItem,
  UnlockState,
} from "@/lib/types";
import { PRIORITY_TIERS } from "@/lib/types";

type ItemRow = {
  id: string;
  section: string;
  subsection: string | null;
  sort_order: number;
  title: string;
  priority_tier: string | null;
  checked: boolean;
  notes: string;
  links: unknown;
};

function asLinks(raw: unknown): ItemLink[] {
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  const links: ItemLink[] = [];
  for (const entry of value) {
    if (
      entry &&
      typeof entry === "object" &&
      "label" in entry &&
      "url" in entry &&
      typeof entry.label === "string" &&
      typeof entry.url === "string"
    ) {
      links.push({ label: entry.label, url: entry.url });
    }
  }
  return links;
}

function asTier(value: string | null): PriorityTier | null {
  if (value && (PRIORITY_TIERS as readonly string[]).includes(value)) {
    return value as PriorityTier;
  }
  return null;
}

function mapItem(row: ItemRow): RoadmapItem {
  return {
    id: String(row.id),
    section: row.section,
    subsection: row.subsection,
    sortOrder: Number(row.sort_order),
    title: row.title,
    priorityTier: asTier(row.priority_tier),
    checked: row.checked === true,
    notes: row.notes ?? "",
    links: asLinks(row.links),
  };
}

async function loadAllItems(): Promise<RoadmapItem[]> {
  await requireUnlocked();
  const sql = await getSql();
  const rows = await sql<ItemRow>`
    select id, section, subsection, sort_order, title, priority_tier,
           checked, notes, links
    from items
    order by sort_order asc
  `;
  return rows.map(mapItem);
}

function parsePasscode(data: unknown): string {
  if (!data || typeof data !== "object" || !("passcode" in data)) {
    throw new Error("Passcode is required.");
  }
  const passcode = data.passcode;
  if (typeof passcode !== "string") throw new Error("Passcode is required.");
  const trimmed = passcode.trim();
  if (trimmed.length < 4) throw new Error("Use at least 4 characters.");
  if (trimmed.length > 200) throw new Error("Passcode is too long.");
  return trimmed;
}

export const getUnlockState = createServerFn({ method: "GET" }).handler(
  async (): Promise<UnlockState> => {
    const settings = await ensureSettings();
    return {
      hasPasscode: Boolean(settings.passcode_hash),
      unlocked: await readUnlocked(settings.session_secret),
    };
  },
);

export const setPasscode = createServerFn({ method: "POST" })
  .validator(parsePasscode)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const settings = await ensureSettings();
    if (settings.passcode_hash) {
      throw new Error("A passcode is already set.");
    }
    const hashed = await hashPasscode(data);
    const sql = await getSql();
    await sql`
      update site_settings
      set passcode_hash = ${hashed}, updated_at = now()
      where id = 'default'
    `;
    await writeSessionCookie(settings.session_secret);
    return { ok: true };
  });

export const unlockWithPasscode = createServerFn({ method: "POST" })
  .validator(parsePasscode)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const settings = await ensureSettings();
    if (!settings.passcode_hash) {
      throw new Error("No passcode is set yet.");
    }
    const ok = await verifyPasscode(data, settings.passcode_hash);
    if (!ok) throw new Error("That passcode does not match.");
    await writeSessionCookie(settings.session_secret);
    return { ok: true };
  });

export const lockSession = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true }> => {
    clearSessionCookie();
    return { ok: true };
  },
);

export const listItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<RoadmapItem[]> => loadAllItems(),
);

export const toggleItem = createServerFn({ method: "POST" })
  .validator((data: { id: string; checked: boolean }) => {
    if (!data?.id || typeof data.id !== "string") throw new Error("Invalid item.");
    if (typeof data.checked !== "boolean") throw new Error("Invalid item.");
    return { id: data.id, checked: data.checked };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireUnlocked();
    const sql = await getSql();
    const rows = await sql.query<{ id: string }>(
      "update items set checked = $1, updated_at = now() where id = $2 returning id",
      [data.checked, data.id],
    );
    if (!rows[0]) throw new Error("Item not found.");
    return { ok: true };
  });

export const updateItem = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid item.");
    const body = data as {
      id?: unknown;
      notes?: unknown;
      links?: unknown;
      priorityTier?: unknown;
    };
    if (typeof body.id !== "string" || !body.id) throw new Error("Invalid item.");
    if (typeof body.notes !== "string") throw new Error("Notes must be text.");
    if (body.notes.length > 20_000) throw new Error("Notes are too long.");
    if (!Array.isArray(body.links)) throw new Error("Invalid links.");
    const links: ItemLink[] = [];
    for (const entry of body.links) {
      if (!entry || typeof entry !== "object") throw new Error("Invalid links.");
      const label = "label" in entry ? String(entry.label ?? "").trim() : "";
      const url = "url" in entry ? String(entry.url ?? "").trim() : "";
      if (!url || url === "https://" || url === "http://") continue;
      if (!/^https?:\/\//i.test(url)) {
        throw new Error("Links must start with http:// or https://");
      }
      if (url.length > 2000) throw new Error("Link URL is too long.");
      links.push({ label: label.slice(0, 120), url });
      if (links.length > 20) throw new Error("Too many links.");
    }
    let priorityTier: PriorityTier | null = null;
    if (body.priorityTier !== null && body.priorityTier !== undefined) {
      if (
        typeof body.priorityTier !== "string" ||
        !(PRIORITY_TIERS as readonly string[]).includes(body.priorityTier)
      ) {
        throw new Error("Invalid priority.");
      }
      priorityTier = body.priorityTier as PriorityTier;
    }
    return { id: body.id, notes: body.notes, links, priorityTier };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireUnlocked();
    const sql = await getSql();
    const rows = await sql.query<{ id: string }>(
      `update items
         set notes = $1,
             links = $2::jsonb,
             priority_tier = $3,
             updated_at = now()
       where id = $4
       returning id`,
      [data.notes, JSON.stringify(data.links), data.priorityTier, data.id],
    );
    if (!rows[0]) throw new Error("Item not found.");
    return { ok: true };
  });

export const exportMarkdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    const items = await loadAllItems();
    return itemsToMarkdown(items);
  },
);
