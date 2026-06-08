"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { scoringFactors, scoreBands } from "@/lib/search-terms-data"
import { Info } from "lucide-react"

const bandStyles: Record<string, { dot: string; text: string }> = {
  green: { dot: "bg-score-green", text: "text-score-green" },
  yellow: { dot: "bg-score-yellow", text: "text-score-yellow" },
  red: { dot: "bg-score-red", text: "text-score-red" },
}

export function ScoringInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <Info className="size-4" aria-hidden="true" />
          How scoring works
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How the relevance score works</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Each search query gets a 0&ndash;100 relevance score that measures
            how closely the AI match aligns with your original keyword intent.
          </DialogDescription>
        </DialogHeader>

        {/* Score bands */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Score bands
          </h3>
          <div className="grid gap-2">
            {(["green", "yellow", "red"] as const).map((key) => {
              const band = scoreBands[key]
              const style = bandStyles[key]
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                >
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${style.dot}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {band.label}
                  </span>
                  <span
                    className={`ml-auto text-sm font-medium tabular-nums ${style.text}`}
                  >
                    {band.range}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weighted factors */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            What goes into the score
          </h3>
          <div className="space-y-3">
            {scoringFactors.map((factor) => (
              <div key={factor.name}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {factor.name}
                  </span>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {factor.weight}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${factor.weight}%` }}
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
