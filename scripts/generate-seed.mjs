// @ts-check
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { itemTier, ROADMAP } from "./roadmap-data.mjs";

function esc(value) {
  return String(value).replaceAll("'", "''");
}

function sqlNull(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${esc(value)}'`;
}

const rows = [];
let sortOrder = 0;

for (const section of ROADMAP) {
  for (const group of section.groups) {
    for (const title of group.items) {
      sortOrder += 1;
      const tier = itemTier(section.section, title, section.tier);
      rows.push({
        id: randomUUID(),
        section: section.section,
        subsection: group.subsection,
        sortOrder,
        title,
        tier,
      });
    }
  }
}

const inserts = rows.map(
  (row) =>
    `insert into items (id, section, subsection, sort_order, title, priority_tier, checked, notes, links) values ('${row.id}', '${esc(row.section)}', ${sqlNull(row.subsection)}, ${row.sortOrder}, '${esc(row.title)}', ${sqlNull(row.tier)}, false, '', '[]'::jsonb);`,
);

const sql = `-- Seed: ${rows.length} checklist items from the skill roadmap (the imported source sections).
-- sort_order is original file order. Section 25 is not imported.

${inserts.join("\n")}
`;

writeFileSync(new URL("../migrations/0003_seed.sql", import.meta.url), sql);

const bySection = new Map();
for (const row of rows) {
  bySection.set(row.section, (bySection.get(row.section) ?? 0) + 1);
}
const medium = rows.filter((r) => r.tier === "Medium").map((r) => r.title);
console.log(`items: ${rows.length}`);
console.log("medium overrides:", medium.join(", "));
for (const [section, n] of bySection) console.log(`  ${n}\t${section}`);
