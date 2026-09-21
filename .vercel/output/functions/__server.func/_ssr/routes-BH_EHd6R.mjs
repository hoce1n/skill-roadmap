import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PRIORITY_TIERS } from "./types-BeZkSTl-.mjs";
import { a as listItems, c as toggleItem, i as exportMarkdown, o as lockSession, r as Route$1, u as updateItem } from "./router-0FfQY5pb.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BH_EHd6R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function PriorityTag({ tier }) {
	if (!tier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "shrink-0 text-xs tracking-wide text-faint",
		title: "Untagged",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("shrink-0 text-xs tracking-wide", tier === "Very High" ? "text-fg" : "text-muted"),
		children: tier
	});
}
function ItemRow({ item, expanded, onToggle, onExpand, onSave }) {
	const [notes, setNotes] = (0, import_react.useState)(item.notes);
	const [links, setLinks] = (0, import_react.useState)(item.links);
	const [priorityTier, setPriorityTier] = (0, import_react.useState)(item.priorityTier);
	const [editingNotes, setEditingNotes] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [savedAt, setSavedAt] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const notesRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!expanded) return;
		setNotes(item.notes);
		setLinks(item.links);
		setPriorityTier(item.priorityTier);
		setEditingNotes(!item.notes.trim());
		setError(null);
	}, [
		expanded,
		item.id,
		item.notes,
		item.links,
		item.priorityTier
	]);
	(0, import_react.useEffect)(() => {
		if (editingNotes && expanded) notesRef.current?.focus();
	}, [editingNotes, expanded]);
	async function save() {
		setSaving(true);
		setError(null);
		try {
			await onSave({
				notes,
				links,
				priorityTier
			});
			setSavedAt(Date.now());
			if (notes.trim()) setEditingNotes(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(false);
		}
	}
	function addLink() {
		setLinks((prev) => [...prev, {
			label: "",
			url: "https://"
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-rule",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2 py-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-checked": item.checked,
				role: "checkbox",
				onClick: () => onToggle(!item.checked),
				className: cn("relative mt-0.5 shrink-0 px-1 font-mono text-base leading-none", "min-h-11 min-w-11 after:absolute after:inset-0", item.checked ? "text-checked" : "text-fg"),
				children: item.checked ? "[x]" : "[ ]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onExpand,
				"aria-expanded": expanded,
				className: "min-h-11 flex-1 py-2 text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-pretty text-sm leading-snug sm:text-[0.9375rem]", item.checked && "text-checked line-through"),
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityTag, { tier: item.priorityTier })]
				})
			})]
		}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-rule/80 pb-4 pl-12 pr-1 pt-3 sm:pl-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-muted",
							children: ["Priority", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: priorityTier ?? "",
								onChange: (e) => {
									const v = e.target.value;
									setPriorityTier(v === "" ? null : v);
								},
								className: "border border-rule bg-bg px-2 py-1 text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Untagged"
								}), PRIORITY_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: tier,
									children: tier
								}, tier))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void save(),
							disabled: saving,
							className: "border border-rule px-3 py-1 text-fg hover:bg-fill disabled:opacity-50",
							children: saving ? "Saving…" : "Save"
						}),
						savedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Saved"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs uppercase tracking-wide text-muted",
						children: "Notes"
					}), editingNotes || !notes.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: notesRef,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						onBlur: () => void save(),
						rows: 6,
						placeholder: "Markdown notes…",
						className: "w-full resize-y border border-rule bg-bg p-3 font-sans text-sm leading-normal text-fg placeholder:text-faint"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setEditingNotes(true),
						className: "notes-md block w-full rounded-sm border border-transparent p-3 text-left font-sans text-sm leading-normal text-fg hover:border-rule",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
							components: { a: ({ href, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href,
								target: "_blank",
								rel: "noopener noreferrer",
								onClick: (e) => e.stopPropagation(),
								children
							}) },
							children: notes
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs uppercase tracking-wide text-muted",
						children: "Links"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: links.map((link, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: link.label,
									onChange: (e) => setLinks((prev) => prev.map((l, idx) => idx === i ? {
										...l,
										label: e.target.value
									} : l)),
									onBlur: () => void save(),
									placeholder: "Label",
									className: "min-h-11 flex-1 border border-rule bg-bg px-2 py-1 text-sm text-fg placeholder:text-faint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: link.url,
									onChange: (e) => setLinks((prev) => prev.map((l, idx) => idx === i ? {
										...l,
										url: e.target.value
									} : l)),
									onBlur: () => void save(),
									placeholder: "https://",
									inputMode: "url",
									className: "min-h-11 flex-[2] border border-rule bg-bg px-2 py-1 text-sm text-fg placeholder:text-faint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setLinks((prev) => prev.filter((_, idx) => idx !== i));
									},
									className: "min-h-11 px-2 text-sm text-muted hover:text-fg",
									children: "Remove"
								})
							]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: addLink,
						className: "mt-2 text-sm text-muted underline decoration-rule underline-offset-4 hover:text-fg",
						children: "Add link"
					})
				] }),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					role: "alert",
					children: error
				}) : null
			]
		}) : null]
	});
}
function blockBar(done, total, width = 20) {
	if (total <= 0) return "░".repeat(width);
	const filled = Math.max(0, Math.min(width, Math.round(done / total * width)));
	return "█".repeat(filled) + "░".repeat(width - filled);
}
function percent(done, total) {
	if (total <= 0) return 0;
	return Math.round(done / total * 100);
}
function progressLabel(done, total) {
	return `${done}/${total} · ${percent(done, total)}%`;
}
function ProgressLine({ done, total, width = 20, className }) {
	const label = progressLabel(done, total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm tabular-nums", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tracking-tight text-fg",
				"aria-hidden": "true",
				children: blockBar(done, total, width)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [
					done,
					" of ",
					total,
					" complete"
				]
			})
		]
	});
}
function matchesFilter(item, uncheckedOnly, priority) {
	if (uncheckedOnly && item.checked) return false;
	if (priority === "all") return true;
	if (priority === "untagged") return item.priorityTier === null;
	return item.priorityTier === priority;
}
function downloadMarkdown(markdown) {
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
function Checklist({ initialItems }) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [uncheckedOnly, setUncheckedOnly] = (0, import_react.useState)(false);
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [expandedId, setExpandedId] = (0, import_react.useState)(null);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const { data: items = initialItems } = useQuery({
		queryKey: ["items"],
		queryFn: () => listItems(),
		initialData: initialItems
	});
	const toggleMutation = useMutation({
		mutationFn: (vars) => toggleItem({ data: vars }),
		onMutate: async (vars) => {
			await queryClient.cancelQueries({ queryKey: ["items"] });
			const prev = queryClient.getQueryData(["items"]);
			queryClient.setQueryData(["items"], (old) => (old ?? []).map((item) => item.id === vars.id ? {
				...item,
				checked: vars.checked
			} : item));
			return { prev };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) queryClient.setQueryData(["items"], ctx.prev);
		}
	});
	const totals = (0, import_react.useMemo)(() => {
		return {
			done: items.filter((i) => i.checked).length,
			total: items.length
		};
	}, [items]);
	const sections = (0, import_react.useMemo)(() => {
		const order = [];
		const bySection = /* @__PURE__ */ new Map();
		for (const item of items) {
			if (!bySection.has(item.section)) {
				bySection.set(item.section, []);
				order.push(item.section);
			}
			bySection.get(item.section).push(item);
		}
		return order.map((section) => {
			const all = bySection.get(section) ?? [];
			return {
				section,
				all,
				visible: all.filter((item) => matchesFilter(item, uncheckedOnly, priority)),
				done: all.filter((i) => i.checked).length,
				total: all.length
			};
		});
	}, [
		items,
		uncheckedOnly,
		priority
	]);
	async function saveItem(id, patch) {
		await updateItem({ data: {
			id,
			...patch
		} });
		queryClient.setQueryData(["items"], (old) => (old ?? []).map((item) => item.id === id ? {
			...item,
			notes: patch.notes,
			links: patch.links,
			priorityTier: patch.priorityTier
		} : item));
	}
	async function onExport() {
		setExporting(true);
		try {
			downloadMarkdown(await exportMarkdown());
		} finally {
			setExporting(false);
		}
	}
	async function onLock() {
		await lockSession();
		queryClient.clear();
		await navigate({ to: "/unlock" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-rule bg-bg/95 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-base font-medium tracking-tight sm:text-lg",
							children: "Skill Roadmap"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressLine, {
							done: totals.done,
							total: totals.total
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex shrink-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 pt-0.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void onExport(),
							disabled: exporting,
							className: "text-muted underline decoration-rule underline-offset-4 hover:text-fg disabled:opacity-50",
							children: exporting ? "Exporting…" : "Export .md"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void onLock(),
							className: "text-muted underline decoration-rule underline-offset-4 hover:text-fg",
							children: "Lock"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "checkbox",
						"aria-checked": uncheckedOnly,
						onClick: () => setUncheckedOnly((v) => !v),
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: uncheckedOnly ? "[x]" : "[ ]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "unchecked only" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: priority,
							onChange: (e) => setPriority(e.target.value),
							className: "min-h-11 border border-rule bg-bg px-2 text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All"
								}),
								PRIORITY_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: tier,
									children: tier
								}, tier)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "untagged",
									children: "Untagged"
								})
							]
						})]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8",
			children: sections.every((s) => s.visible.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No items match these filters."
			}) : sections.map((group) => {
				if (group.visible.length === 0) return null;
				const subsections = [];
				for (const item of group.visible) {
					const last = subsections[subsections.length - 1];
					if (!last || last.name !== item.subsection) subsections.push({
						name: item.subsection,
						items: [item]
					});
					else last.items.push(item);
				}
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-3 border-b border-rule pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium tracking-tight",
							children: `## ${group.section}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressLine, {
							done: group.done,
							total: group.total,
							width: 16,
							className: "mt-1"
						})]
					}), subsections.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [sub.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 mt-4 text-sm text-muted",
							children: `### ${sub.name}`
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: sub.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemRow, {
							item,
							expanded: expandedId === item.id,
							onToggle: (checked) => toggleMutation.mutate({
								id: item.id,
								checked
							}),
							onExpand: () => setExpandedId((cur) => cur === item.id ? null : item.id),
							onSave: (patch) => saveItem(item.id, patch)
						}, item.id)) })]
					}, sub.name ?? "_"))]
				}, group.section);
			})
		})]
	});
}
function Home() {
	const items = Route$1.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checklist, { initialItems: items });
}
//#endregion
export { Home as component };
