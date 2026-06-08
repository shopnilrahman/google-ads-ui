import { cn } from "@/lib/utils"
import type { RelevanceScore } from "@/lib/search-terms-data"
import { scoreMeta } from "@/lib/search-terms-data"

const colorMap: Record<RelevanceScore, string> = {
  green: "bg-score-green",
  yellow: "bg-score-yellow",
  red: "bg-score-red",
}

export function ScoreDot({
  score,
  withLabel = false,
  className,
}: {
  score: RelevanceScore
  withLabel?: boolean
  className?: string
}) {
  const meta = scoreMeta[score]
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "size-2.5 shrink-0 rounded-full ring-2",
          colorMap[score],
        )}
        style={{ boxShadow: "0 0 0 3px var(--background)" }}
        aria-hidden="true"
      />
      {withLabel ? (
        <span className="text-sm font-medium text-foreground">
          {meta.label}
        </span>
      ) : (
        <span className="sr-only">{meta.label}</span>
      )}
    </span>
  )
}
