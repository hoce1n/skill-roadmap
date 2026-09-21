import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/cn";
import { PRIORITY_TIERS, type ItemLink, type PriorityTier, type RoadmapItem } from "@/lib/types";

function PriorityTag({ tier }: { tier: PriorityTier | null }) {
  if (!tier) {
    return (
      <span className="shrink-0 text-xs tracking-wide text-faint" title="Untagged">
        —
      </span>
    );
  }
  return (
    <span
      className={cn(
        "shrink-0 text-xs tracking-wide",
        tier === "Very High" ? "text-fg" : "text-muted",
      )}
    >
      {tier}
    </span>
  );
}

export function ItemRow({
  item,
  expanded,
  onToggle,
  onExpand,
  onSave,
}: {
  item: RoadmapItem;
  expanded: boolean;
  onToggle: (checked: boolean) => void;
  onExpand: () => void;
  onSave: (patch: {
    notes: string;
    links: ItemLink[];
    priorityTier: PriorityTier | null;
  }) => Promise<void>;
}) {
  const [notes, setNotes] = useState(item.notes);
  const [links, setLinks] = useState<ItemLink[]>(item.links);
  const [priorityTier, setPriorityTier] = useState<PriorityTier | null>(
    item.priorityTier,
  );
  const [editingNotes, setEditingNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!expanded) return;
    setNotes(item.notes);
    setLinks(item.links);
    setPriorityTier(item.priorityTier);
    setEditingNotes(!item.notes.trim());
    setError(null);
  }, [expanded, item.id, item.notes, item.links, item.priorityTier]);

  useEffect(() => {
    if (editingNotes && expanded) notesRef.current?.focus();
  }, [editingNotes, expanded]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave({ notes, links, priorityTier });
      setSavedAt(Date.now());
      if (notes.trim()) setEditingNotes(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "https://" }]);
  }

  return (
    <li className="border-b border-rule">
      <div className="flex items-start gap-2 py-1">
        <button
          type="button"
          aria-checked={item.checked}
          role="checkbox"
          onClick={() => onToggle(!item.checked)}
          className={cn(
            "relative mt-0.5 shrink-0 px-1 font-mono text-base leading-none",
            "min-h-11 min-w-11 after:absolute after:inset-0",
            item.checked ? "text-checked" : "text-fg",
          )}
        >
          {item.checked ? "[x]" : "[ ]"}
        </button>
        <button
          type="button"
          onClick={onExpand}
          aria-expanded={expanded}
          className="min-h-11 flex-1 py-2 text-left"
        >
          <span className="flex items-start justify-between gap-3">
            <span
              className={cn(
                "text-pretty text-sm leading-snug sm:text-[0.9375rem]",
                item.checked && "text-checked line-through",
              )}
            >
              {item.title}
            </span>
            <PriorityTag tier={item.priorityTier} />
          </span>
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-rule/80 pb-4 pl-12 pr-1 pt-3 sm:pl-14">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-muted">
              Priority
              <select
                value={priorityTier ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setPriorityTier(v === "" ? null : (v as PriorityTier));
                }}
                className="border border-rule bg-bg px-2 py-1 text-fg"
              >
                <option value="">Untagged</option>
                {PRIORITY_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="border border-rule px-3 py-1 text-fg hover:bg-fill disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {savedAt ? <span className="text-xs text-muted">Saved</span> : null}
          </div>

          <div className="mb-4">
            <div className="mb-1 text-xs uppercase tracking-wide text-muted">
              Notes
            </div>
            {editingNotes || !notes.trim() ? (
              <textarea
                ref={notesRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => void save()}
                rows={6}
                placeholder="Markdown notes…"
                className="w-full resize-y border border-rule bg-bg p-3 font-sans text-sm leading-normal text-fg placeholder:text-faint"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingNotes(true)}
                className="notes-md block w-full rounded-sm border border-transparent p-3 text-left font-sans text-sm leading-normal text-fg hover:border-rule"
              >
                <Markdown
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {notes}
                </Markdown>
              </button>
            )}
          </div>

          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-muted">
              Links
            </div>
            <ul className="space-y-2">
              {links.map((link, i) => (
                <li key={i} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={link.label}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((l, idx) =>
                          idx === i ? { ...l, label: e.target.value } : l,
                        ),
                      )
                    }
                    onBlur={() => void save()}
                    placeholder="Label"
                    className="min-h-11 flex-1 border border-rule bg-bg px-2 py-1 text-sm text-fg placeholder:text-faint"
                  />
                  <input
                    value={link.url}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((l, idx) =>
                          idx === i ? { ...l, url: e.target.value } : l,
                        ),
                      )
                    }
                    onBlur={() => void save()}
                    placeholder="https://"
                    inputMode="url"
                    className="min-h-11 flex-[2] border border-rule bg-bg px-2 py-1 text-sm text-fg placeholder:text-faint"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLinks((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="min-h-11 px-2 text-sm text-muted hover:text-fg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addLink}
              className="mt-2 text-sm text-muted underline decoration-rule underline-offset-4 hover:text-fg"
            >
              Add link
            </button>
          </div>

          {error ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
