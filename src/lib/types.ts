export const PRIORITY_TIERS = [
  "Very High",
  "High",
  "Medium",
  "Secondary",
] as const;

export type PriorityTier = (typeof PRIORITY_TIERS)[number];

export type ItemLink = {
  label: string;
  url: string;
};

export type RoadmapItem = {
  id: string;
  section: string;
  subsection: string | null;
  sortOrder: number;
  title: string;
  priorityTier: PriorityTier | null;
  checked: boolean;
  notes: string;
  links: ItemLink[];
};

export type UnlockState = {
  unlocked: boolean;
  hasPasscode: boolean;
};
