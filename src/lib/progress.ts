export function blockBar(done: number, total: number, width = 20): string {
  if (total <= 0) return "░".repeat(width);
  const filled = Math.max(0, Math.min(width, Math.round((done / total) * width)));
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export function percent(done: number, total: number): number {
  if (total <= 0 || done <= 0) return 0;
  if (done >= total) return 100;
  const raw = Math.round((done / total) * 100);
  return Math.max(1, Math.min(99, raw));
}

export function progressLabel(done: number, total: number): string {
  return `${done}/${total} · ${percent(done, total)}%`;
}
