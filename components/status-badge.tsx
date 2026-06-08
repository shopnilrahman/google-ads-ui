import { cn } from "@/lib/utils"
import type { TermStatus } from "@/lib/search-terms-data"
import { statusMeta } from "@/lib/search-terms-data"
import { Ban, Crosshair, Brain } from "lucide-react"

const styleMap: Record<
  Exclude<TermStatus, "active">,
  { className: string; icon: typeof Ban }
> = {
  excluded: {
    className: "bg-score-red-bg text-score-red",
    icon: Ban,
  },
  tightened: {
    className: "bg-accent text-accent-foreground",
    icon: Crosshair,
  },
  flagged: {
    className: "bg-score-yellow-bg text-score-yellow",
    icon: Brain,
  },
}

export function StatusBadge({ status }: { status: TermStatus }) {
  if (status === "active") return null
  const meta = statusMeta[status]
  const { className, icon: Icon } = styleMap[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </span>
  )
}
