"use client"

import { cn } from "@/lib/utils"
import type { SearchTerm } from "@/lib/search-terms-data"
import { Ban, Crosshair, Brain, Sparkles, Zap } from "lucide-react"

const actions = [
  {
    key: "exclude",
    label: "Exclude this query",
    description: "Add as a negative keyword so it never triggers your ads.",
    icon: Ban,
    tone: "danger" as const,
  },
  {
    key: "tighten",
    label: "Tighten match type",
    description: "Move from broad toward phrase or exact match.",
    icon: Crosshair,
    tone: "default" as const,
  },
  {
    key: "flag",
    label: "Flag for AI retraining",
    description: "Tell the model this match missed the intent.",
    icon: Brain,
    tone: "default" as const,
  },
]

export function RowDetail({ term }: { term: SearchTerm }) {
  return (
    <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Explanation */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Why this query matched
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {term.explanation}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-secondary/60 p-4">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Signal that drove the decision
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {term.signalDriver}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  "h-full rounded-full",
                  term.signalStrength >= 70
                    ? "bg-score-green"
                    : term.signalStrength >= 45
                      ? "bg-score-yellow"
                      : "bg-score-red",
                )}
                style={{ width: `${term.signalStrength}%` }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {term.signalStrength}% confidence
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Matched keyword</dt>
              <dd className="font-medium text-foreground">
                {term.matchedKeyword}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Match type</dt>
              <dd className="font-medium text-foreground">{term.matchType}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Take action</h3>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.key}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                    action.tone === "danger"
                      ? "bg-score-red-bg text-score-red"
                      : "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
