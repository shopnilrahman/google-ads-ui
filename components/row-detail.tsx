"use client"

import { cn } from "@/lib/utils"
import type { SearchTerm, TermStatus } from "@/lib/search-terms-data"
import { statusMeta } from "@/lib/search-terms-data"
import {
  Ban,
  Crosshair,
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  Undo2,
} from "lucide-react"

type ActionKey = "exclude" | "tighten" | "flag"

const actions: {
  key: ActionKey
  label: string
  description: string
  icon: typeof Ban
  tone: "danger" | "default"
  resultsIn: TermStatus
}[] = [
  {
    key: "exclude",
    label: "Exclude this query",
    description: "Add as a negative keyword so it never triggers your ads.",
    icon: Ban,
    tone: "danger",
    resultsIn: "excluded",
  },
  {
    key: "tighten",
    label: "Tighten match type",
    description: "Move from broad toward phrase or exact match.",
    icon: Crosshair,
    tone: "default",
    resultsIn: "tightened",
  },
  {
    key: "flag",
    label: "Flag for AI retraining",
    description: "Tell the model this match missed the intent.",
    icon: Brain,
    tone: "default",
    resultsIn: "flagged",
  },
]

export function RowDetail({
  term,
  status,
  onAction,
  onRestore,
}: {
  term: SearchTerm
  status: TermStatus
  onAction: (action: ActionKey) => void
  onRestore: () => void
}) {
  const isActive = status === "active"

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
          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3 text-sm">
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
            <div>
              <dt className="text-xs text-muted-foreground">Relevance</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {term.relevanceScore}/100
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Take action</h3>

        {!isActive && (
          <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-accent p-3">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-accent-foreground">
                {statusMeta[status].label}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {statusMeta[status].description}
              </p>
            </div>
            <button
              type="button"
              onClick={onRestore}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Undo2 className="size-3" aria-hidden="true" />
              Undo
            </button>
          </div>
        )}

        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon
            const isApplied = status === action.resultsIn
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => onAction(action.key)}
                aria-pressed={isApplied}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  isApplied
                    ? "border-primary bg-accent"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary",
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
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {action.label}
                    {isApplied && (
                      <CheckCircle2
                        className="size-3.5 text-primary"
                        aria-hidden="true"
                      />
                    )}
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
