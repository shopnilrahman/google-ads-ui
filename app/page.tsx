import { RelevanceTable } from "@/components/relevance-table"
import { searchTerms, scoreMeta } from "@/lib/search-terms-data"
import { Sparkles, Info, ChevronRight } from "lucide-react"

function SummaryCard({
  score,
  count,
  total,
}: {
  score: "green" | "yellow" | "red"
  count: number
  total: number
}) {
  const meta = scoreMeta[score]
  const dot =
    score === "green"
      ? "bg-score-green"
      : score === "yellow"
        ? "bg-score-yellow"
        : "bg-score-red"
  const pct = Math.round((count / total) * 100)
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${dot}`} aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            {meta.label}
          </span>
        </div>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {pct}%
        </span>
      </div>
      <p className="mt-2 text-2xl font-medium tabular-nums text-foreground">
        {count}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {meta.description}
      </p>
    </div>
  )
}

export default function Page() {
  const total = searchTerms.length
  const counts = {
    green: searchTerms.filter((t) => t.score === "green").length,
    yellow: searchTerms.filter((t) => t.score === "yellow").length,
    red: searchTerms.filter((t) => t.score === "red").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top app bar */}
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">A</span>
            </span>
            <span className="text-base font-medium text-foreground">
              Google Ads
            </span>
          </div>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Search terms</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Breadcrumb / title */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span>Reports</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span>Search terms</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="text-foreground">Relevance Explainer</span>
        </nav>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <h1 className="text-pretty text-xl font-medium text-foreground">
                AI Relevance Explainer
              </h1>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              See why AI matched each search query to your ads, how far it
              stretched from your original intent, and take action in one tap.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            <Info className="size-4" aria-hidden="true" />
            How scoring works
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard score="green" count={counts.green} total={total} />
          <SummaryCard score="yellow" count={counts.yellow} total={total} />
          <SummaryCard score="red" count={counts.red} total={total} />
        </div>

        {/* Table */}
        <div className="mt-6">
          <RelevanceTable />
        </div>
      </main>
    </div>
  )
}
