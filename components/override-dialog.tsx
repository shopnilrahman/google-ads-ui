"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { SearchTerm, MatchType, TermStatus } from "@/lib/search-terms-data"
import { ScoreDot } from "@/components/score-dot"
import { Ban, RotateCcw } from "lucide-react"

const matchTypes: { value: MatchType; label: string; hint: string }[] = [
  {
    value: "Broad",
    label: "Broad match",
    hint: "Widest reach. Lets AI stretch the most.",
  },
  {
    value: "Phrase",
    label: "Phrase match",
    hint: "Balanced. Query must include your phrase meaning.",
  },
  {
    value: "Exact",
    label: "Exact match",
    hint: "Tightest control. Minimal AI stretching.",
  },
]

export function OverrideDialog({
  term,
  open,
  onOpenChange,
  onApply,
}: {
  term: SearchTerm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (
    id: string,
    update: { matchType: MatchType; status: TermStatus },
  ) => void
}) {
  const [matchType, setMatchType] = useState<MatchType>("Broad")

  useEffect(() => {
    if (term) setMatchType(term.matchType)
  }, [term])

  if (!term) return null

  const changed = matchType !== term.matchType
  const tightening =
    (term.matchType === "Broad" && matchType !== "Broad") ||
    (term.matchType === "Phrase" && matchType === "Exact")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Override match</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Adjust how this query is matched to your ads, or exclude it
            entirely.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-secondary/50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-medium text-foreground">
              {term.query}
            </p>
            <ScoreDot score={term.score} withLabel />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Currently {term.matchType} match · matched to &ldquo;
            {term.matchedKeyword}&rdquo;
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-foreground">
            Match type
          </legend>
          <RadioGroup
            value={matchType}
            onValueChange={(v) => setMatchType(v as MatchType)}
            className="gap-2"
          >
            {matchTypes.map((m) => {
              const isActive = matchType === m.value
              return (
                <label
                  key={m.value}
                  htmlFor={`mt-${m.value}`}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    isActive
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <RadioGroupItem
                    id={`mt-${m.value}`}
                    value={m.value}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {m.label}
                      {m.value === term.matchType && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (current)
                        </span>
                      )}
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">
                      {m.hint}
                    </span>
                  </span>
                </label>
              )
            })}
          </RadioGroup>
        </fieldset>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => {
              onApply(term.id, { matchType: term.matchType, status: "excluded" })
              onOpenChange(false)
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-score-red/30 bg-card px-3 py-2 text-sm font-medium text-score-red transition-colors hover:bg-score-red-bg"
          >
            <Ban className="size-4" aria-hidden="true" />
            Exclude query
          </button>
          <button
            type="button"
            disabled={!changed}
            onClick={() => {
              onApply(term.id, {
                matchType,
                status: tightening ? "tightened" : "active",
              })
              onOpenChange(false)
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gads-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Apply change
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
