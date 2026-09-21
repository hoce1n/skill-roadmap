import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  exportMarkdown,
  lockSession,
  listItems,
  toggleItem,
  updateItem,
} from "@/lib/items.functions";
import { PRIORITY_TIERS, type ItemLink, type PriorityTier, type RoadmapItem } from "@/lib/types";
import { ItemRow } from "@/components/item-row";
import { ProgressLine } from "@/components/progress-line";
import { cn } from "@/lib/cn";

type PriorityFilter = "all" | PriorityTier | "untagged";

function matchesFilter(
  item: RoadmapItem,
  uncheckedOnly: boolean,
  priority: PriorityFilter,
): boolean {
  if (uncheckedOnly && item.checked) return false;
  if (priority === "all") return true;
  if (priority === "untagged") return item.priorityTier === null;
  return item.priorityTier === priority;
}

function downloadMarkdown(markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "full-stack-skill-roadmap-en.md";
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function Checklist({ initialItems }: { initialItems: RoadmapItem[] }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [uncheckedOnly, setUncheckedOnly] = useState(false);
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: items = initialItems } = useQuery({
    queryKey: ["items"],
    queryFn: () => listItems(),
    initialData: initialItems,
  });

  const toggleMutation = useMutation({
    mutationFn: (vars: { id: string; checked: boolean }) =>
      toggleItem({ data: vars }),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const prev = queryClient.getQueryData<RoadmapItem[]>(["items"]);
      queryClient.setQueryData<RoadmapItem[]>(["items"], (old) =>
        (old ?? []).map((item) =>
          item.id === vars.id ? { ...item, checked: vars.checked } : item,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["items"], ctx.prev);
    },
  });

  const totals = useMemo(() => {
    const done = items.filter((i) => i.checked).length;
    return { done, total: items.length };
  }, [items]);

  const sections = useMemo(() => {
    const order: string[] = [];
    const bySection = new Map<string, RoadmapItem[]>();
    for (const item of items) {
      if (!bySection.has(item.section)) {
        bySection.set(item.section, []);
        order.push(item.section);
      }
      bySection.get(item.section)!.push(item);
    }
    return order.map((section) => {
      const all = bySection.get(section) ?? [];
      const visible = all.filter((item) =>
        matchesFilter(item, uncheckedOnly, priority),
      );
      const done = all.filter((i) => i.checked).length;
      return { section, all, visible, done, total: all.length };
    });
  }, [items, uncheckedOnly, priority]);

  async function saveItem(
    id: string,
    patch: {
      notes: string;
      links: ItemLink[];
      priorityTier: PriorityTier | null;
    },
  ) {
    await updateItem({ data: { id, ...patch } });
    queryClient.setQueryData<RoadmapItem[]>(["items"], (old) =>
      (old ?? []).map((item) =>
        item.id === id
          ? {
              ...item,
              notes: patch.notes,
              links: patch.links,
              priorityTier: patch.priorityTier,
            }
          : item,
      ),
    );
  }

  async function onExport() {
    setExporting(true);
    try {
      const md = await exportMarkdown();
      downloadMarkdown(md);
    } finally {
      setExporting(false);
    }
  }

  async function onLock() {
    await lockSession();
    queryClient.clear();
    await navigate({ to: "/unlock" });
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-rule bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-base font-medium tracking-tight sm:text-lg">
                Skill Roadmap
              </h1>
              <ProgressLine done={totals.done} total={totals.total} />
            </div>
            <nav className="flex shrink-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 pt-0.5 text-sm">
              <button
                type="button"
                onClick={() => void onExport()}
                disabled={exporting}
                className="text-muted underline decoration-rule underline-offset-4 hover:text-fg disabled:opacity-50"
              >
                {exporting ? "Exporting…" : "Export .md"}
              </button>
              <button
                type="button"
                onClick={() => void onLock()}
                className="text-muted underline decoration-rule underline-offset-4 hover:text-fg"
              >
                Lock
              </button>
            </nav>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="button"
              role="checkbox"
              aria-checked={uncheckedOnly}
              onClick={() => setUncheckedOnly((v) => !v)}
              className="flex min-h-11 items-center gap-2 text-sm"
            >
              <span aria-hidden="true">{uncheckedOnly ? "[x]" : "[ ]"}</span>
              <span>unchecked only</span>
            </button>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <span className="text-muted">priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityFilter)}
                className="min-h-11 border border-rule bg-bg px-2 text-fg"
              >
                <option value="all">All</option>
                {PRIORITY_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
                <option value="untagged">Untagged</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {sections.every((s) => s.visible.length === 0) ? (
          <p className="text-sm text-muted">No items match these filters.</p>
        ) : (
          sections.map((group) => {
            if (group.visible.length === 0) return null;
            const subsections: Array<{
              name: string | null;
              items: RoadmapItem[];
            }> = [];
            for (const item of group.visible) {
              const last = subsections[subsections.length - 1];
              if (!last || last.name !== item.subsection) {
                subsections.push({ name: item.subsection, items: [item] });
              } else {
                last.items.push(item);
              }
            }
            return (
              <section key={group.section} className="mb-10">
                <header className="mb-3 border-b border-rule pb-2">
                  <h2 className="text-base font-medium tracking-tight">
                    {`## ${group.section}`}
                  </h2>
                  <ProgressLine
                    done={group.done}
                    total={group.total}
                    width={16}
                    className="mt-1"
                  />
                </header>
                {subsections.map((sub) => (
                  <div key={sub.name ?? "_"} className="mb-4">
                    {sub.name ? (
                      <h3 className="mb-1 mt-4 text-sm text-muted">{`### ${sub.name}`}</h3>
                    ) : null}
                    <ul>
                      {sub.items.map((item) => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          expanded={expandedId === item.id}
                          onToggle={(checked) =>
                            toggleMutation.mutate({ id: item.id, checked })
                          }
                          onExpand={() =>
                            setExpandedId((cur) =>
                              cur === item.id ? null : item.id,
                            )
                          }
                          onSave={(patch) => saveItem(item.id, patch)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          })
        )}
      </main>
    </div>
  );
}

export function ChecklistSkeleton() {
  return (
    <div className={cn("min-h-dvh bg-bg px-4 py-8 font-mono text-sm text-muted")}>
      Loading checklist…
    </div>
  );
}
