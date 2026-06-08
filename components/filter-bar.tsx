"use client"

import { cn } from "@/lib/utils"
import type { RelevanceScore } from "@/lib/search-terms-data"
import { scoreMeta } from "@/lib/search-terms-data"
import { Search } from "lucide-react"

type FilterValue = RelevanceScore | "all"

const dotColor: Record<RelevanceScore, string> = {
  green: "bg-score-green",
  yellow: "bg-score-yellow",
  red: "bg-score-red",
}

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All queries" },
  { value: "green", label: scoreMeta.green.label },
  { value: "yellow", label: scoreMeta.yellow.label },
  { value: "red", label: scoreMeta.red.label },
]

export function FilterBar({
  active,
  onChange,
  counts,
  query,
  onQueryChange,
}: {
  active: FilterValue
  onChange: (value: FilterValue) => void
  counts: Record<FilterValue, number>
  query: string
  onQueryChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Relevance
        </span>
        {filters.map((f) => {
          const isActive = active === f.value
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
              )}
            >
              {f.value !== "all" && (
                <span
                  className={cn("size-2 rounded-full", dotColor[f.value])}
                  aria-hidden="true"
                />
              )}
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative sm:w-64">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search terms"
          aria-label="Search within terms"
          className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>
    </div>
  )
}

export type { FilterValue }
