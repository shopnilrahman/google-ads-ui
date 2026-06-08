"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { searchTerms, statusMeta } from "@/lib/search-terms-data"
import type {
  SearchTerm,
  MatchType,
  TermStatus,
} from "@/lib/search-terms-data"
import { ScoreDot } from "@/components/score-dot"
import { RowDetail } from "@/components/row-detail"
import { FilterBar, type FilterValue } from "@/components/filter-bar"
import { OverrideDialog } from "@/components/override-dialog"
import { StatusBadge } from "@/components/status-badge"
import { ChevronRight, SlidersHorizontal, Undo2 } from "lucide-react"

function QualityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 70
              ? "bg-score-green"
              : value >= 45
                ? "bg-score-yellow"
                : "bg-score-red",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export function RelevanceTable() {
  const [filter, setFilter] = useState<FilterValue>("all")
  const [query, setQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>("3")

  // Per-row mutable state: status + (possibly overridden) match type
  const [overrides, setOverrides] = useState<
    Record<string, { matchType: MatchType; status: TermStatus }>
  >({})

  const [dialogTerm, setDialogTerm] = useState<SearchTerm | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Merge base data with any overrides applied
  const rows: SearchTerm[] = searchTerms.map((t) => {
    const o = overrides[t.id]
    return o ? { ...t, matchType: o.matchType } : t
  })

  function statusOf(id: string): TermStatus {
    return overrides[id]?.status ?? "active"
  }

  const counts = {
    all: rows.length,
    green: rows.filter((t) => t.score === "green").length,
    yellow: rows.filter((t) => t.score === "yellow").length,
    red: rows.filter((t) => t.score === "red").length,
  }

  const visible = rows.filter((t) => {
    const matchesFilter = filter === "all" || t.score === filter
    const matchesQuery = t.query.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  function toggle(id: string) {
    setExpandedId((cur) => (cur === id ? null : id))
  }

  function openOverride(term: SearchTerm) {
    setDialogTerm(term)
    setDialogOpen(true)
  }

  function setStatus(id: string, status: TermStatus, matchType?: MatchType) {
    setOverrides((cur) => ({
      ...cur,
      [id]: {
        matchType: matchType ?? cur[id]?.matchType ?? "Broad",
        status,
      },
    }))
  }

  function restore(id: string, queryText: string) {
    setOverrides((cur) => {
      const next = { ...cur }
      delete next[id]
      return next
    })
    toast.success("Override removed", {
      description: `"${queryText}" is active again.`,
    })
  }

  // Apply from override dialog
  function applyOverride(
    id: string,
    update: { matchType: MatchType; status: TermStatus },
  ) {
    const term = searchTerms.find((t) => t.id === id)
    setStatus(id, update.status, update.matchType)
    if (update.status === "excluded") {
      toast.success("Query excluded", {
        description: `"${term?.query}" was added as a negative keyword.`,
      })
    } else if (update.status === "tightened") {
      toast.success("Match type tightened", {
        description: `"${term?.query}" is now ${update.matchType} match.`,
      })
    } else {
      toast.success("Match type updated", {
        description: `"${term?.query}" is now ${update.matchType} match.`,
      })
    }
  }

  // Action handlers from the expanded detail panel
  function handleAction(term: SearchTerm, action: "exclude" | "tighten" | "flag") {
    if (action === "exclude") {
      setStatus(term.id, "excluded")
      toast.success("Query excluded", {
        description: `"${term.query}" was added as a negative keyword.`,
        action: {
          label: "Undo",
          onClick: () => restore(term.id, term.query),
        },
      })
    } else if (action === "tighten") {
      const next: MatchType = term.matchType === "Broad" ? "Phrase" : "Exact"
      setStatus(term.id, "tightened", next)
      toast.success("Match type tightened", {
        description: `"${term.query}" moved to ${next} match.`,
        action: {
          label: "Undo",
          onClick: () => restore(term.id, term.query),
        },
      })
    } else {
      setStatus(term.id, "flagged")
      toast.success("Flagged for AI retraining", {
        description: "Thanks — this signal helps the model improve matches.",
        action: {
          label: "Undo",
          onClick: () => restore(term.id, term.query),
        },
      })
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <FilterBar
        active={filter}
        onChange={setFilter}
        counts={counts}
        query={query}
        onQueryChange={setQuery}
      />

      {/* Table header */}
      <div className="hidden grid-cols-[minmax(0,2.4fr)_1fr_minmax(0,2.4fr)_0.9fr_1fr_auto] items-center gap-4 border-b border-border bg-secondary/50 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
        <span>Search query</span>
        <span>Relevance</span>
        <span>Match reason</span>
        <span className="text-right">Conv. rate</span>
        <span>Click quality</span>
        <span className="sr-only">Override</span>
      </div>

      <ul className="divide-y divide-border">
        {visible.map((term) => {
          const isOpen = expandedId === term.id
          const status = statusOf(term.id)
          const isExcluded = status === "excluded"
          return (
            <li
              key={term.id}
              className={cn(
                isOpen && "bg-secondary/30",
                isExcluded && "opacity-70",
              )}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggle(term.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggle(term.id)
                  }
                }}
                className="grid cursor-pointer grid-cols-[auto_1fr] items-start gap-x-3 gap-y-2 px-5 py-3.5 outline-none transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring/40 lg:grid-cols-[minmax(0,2.4fr)_1fr_minmax(0,2.4fr)_0.9fr_1fr_auto] lg:items-center lg:gap-4"
              >
                {/* Chevron + query */}
                <ChevronRight
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform lg:hidden",
                    isOpen && "rotate-90",
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 lg:order-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={cn(
                        "truncate text-sm font-medium text-foreground",
                        isExcluded && "line-through",
                      )}
                    >
                      {term.query}
                    </p>
                    <StatusBadge status={status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {term.clicks.toLocaleString()} clicks ·{" "}
                    {term.impressions.toLocaleString()} impr. · {term.matchType}
                  </p>
                </div>

                {/* Relevance */}
                <div className="flex items-center gap-2 lg:order-2">
                  <ScoreDot score={term.score} withLabel />
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                    {term.relevanceScore}
                  </span>
                </div>

                {/* Match reason */}
                <p className="col-span-2 text-sm leading-relaxed text-muted-foreground lg:order-3 lg:col-span-1">
                  {term.matchReason}
                </p>

                {/* Conv rate */}
                <div className="lg:order-4 lg:text-right">
                  <span className="text-xs text-muted-foreground lg:hidden">
                    Conv.{" "}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {term.conversionRate}%
                  </span>
                </div>

                {/* Click quality */}
                <div className="lg:order-5">
                  <QualityBar value={term.clickQuality} />
                </div>

                {/* Override / Restore */}
                <div className="col-span-2 lg:order-6 lg:col-span-1">
                  {status === "active" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openOverride(term)
                      }}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-card px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent lg:w-auto"
                    >
                      <SlidersHorizontal
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      Override
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        restore(term.id, term.query)
                      }}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary lg:w-auto"
                    >
                      <Undo2 className="size-3.5" aria-hidden="true" />
                      Restore
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border bg-background/60">
                  <RowDetail
                    term={term}
                    status={status}
                    onAction={(a) => handleAction(term, a)}
                    onRestore={() => restore(term.id, term.query)}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {visible.length === 0 && (
        <div className="px-5 py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            No matching search terms
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different relevance filter or search.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <span>
          Showing {visible.length} of {rows.length} search terms
        </span>
        <span>
          {Object.keys(overrides).length > 0
            ? `${Object.keys(overrides).length} override${
                Object.keys(overrides).length === 1 ? "" : "s"
              } pending`
            : "Last updated 4 minutes ago"}
        </span>
      </div>

      <OverrideDialog
        term={dialogTerm}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApply={applyOverride}
      />
    </div>
  )
}

export type { SearchTerm }
export { statusMeta }
