import { blockBar, progressLabel } from "@/lib/progress";
import { cn } from "@/lib/cn";

export function ProgressLine({
  done,
  total,
  width = 20,
  className,
}: {
  done: number;
  total: number;
  width?: number;
  className?: string;
}) {
  const label = progressLabel(done, total);
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm tabular-nums",
        className,
      )}
    >
      <span className="tracking-tight text-fg" aria-hidden="true">
        {blockBar(done, total, width)}
      </span>
      <span className="text-muted">{label}</span>
      <span className="sr-only">
        {done} of {total} complete
      </span>
    </div>
  );
}
