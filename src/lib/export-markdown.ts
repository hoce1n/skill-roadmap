import type { RoadmapItem } from "./types";

function indentNotes(notes: string): string {
  const lines = notes.replace(/\r\n/g, "\n").split("\n");
  return lines
    .map((line, i) => (i === 0 ? `  - ${line}` : `    ${line}`))
    .join("\n");
}

export function itemsToMarkdown(items: RoadmapItem[]): string {
  const ordered = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const parts: string[] = ["# Full-Stack Skill Roadmap", ""];

  let lastSection = "";
  let lastSubsection: string | null | undefined = undefined;

  for (const item of ordered) {
    if (item.section !== lastSection) {
      parts.push(`## ${item.section}`, "");
      lastSection = item.section;
      lastSubsection = undefined;
    }
    if (item.subsection && item.subsection !== lastSubsection) {
      parts.push(`### ${item.subsection}`, "");
      lastSubsection = item.subsection;
    }
    if (!item.subsection) lastSubsection = null;

    const mark = item.checked ? "x" : " ";
    parts.push(`- [${mark}] ${item.title}`);

    const notes = item.notes.trim();
    if (notes) parts.push(indentNotes(notes));
    for (const link of item.links) {
      const label = link.label.trim() || link.url;
      parts.push(`  - [${label}](${link.url})`);
    }
  }

  if (parts[parts.length - 1] !== "") parts.push("");
  return parts.join("\n");
}
