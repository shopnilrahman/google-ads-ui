export type RelevanceScore = "green" | "yellow" | "red"

export type MatchType = "Broad" | "Phrase" | "Exact"

export type TermStatus = "active" | "excluded" | "tightened" | "flagged"

export const statusMeta: Record<
  TermStatus,
  { label: string; description: string }
> = {
  active: { label: "Active", description: "This query can trigger your ads." },
  excluded: {
    label: "Excluded",
    description: "Added as a negative keyword. It will no longer trigger ads.",
  },
  tightened: {
    label: "Match tightened",
    description: "Match type narrowed to reduce loose AI matches.",
  },
  flagged: {
    label: "Flagged for retraining",
    description: "Sent to the model as a mismatched example.",
  },
}

// How the relevance score is calculated — surfaced in the explainer dialog.
export const scoringFactors: {
  name: string
  weight: number
  description: string
}[] = [
  {
    name: "Keyword overlap",
    weight: 35,
    description:
      "How directly the query text matches your keyword and its close variants.",
  },
  {
    name: "Commercial intent",
    weight: 30,
    description:
      "Signals that the searcher intends to buy rather than research or troubleshoot.",
  },
  {
    name: "Historical conversions",
    weight: 20,
    description:
      "Whether similar queries have converted for advertisers in your category.",
  },
  {
    name: "Semantic distance",
    weight: 15,
    description:
      "How far the AI stretched from your original intent to make the match.",
  },
]

export const scoreBands: Record<
  RelevanceScore,
  { range: string; label: string }
> = {
  green: { range: "80–100", label: "Tight match" },
  yellow: { range: "45–79", label: "AI stretched" },
  red: { range: "0–44", label: "Beyond intent" },
}

export type SearchTerm = {
  id: string
  query: string
  score: RelevanceScore
  relevanceScore: number
  matchReason: string
  matchedKeyword: string
  matchType: MatchType
  conversionRate: number
  clickQuality: number
  clicks: number
  impressions: number
  cost: number
  // expanded detail
  explanation: string
  signalDriver: string
  signalStrength: number
}

export const scoreMeta: Record<
  RelevanceScore,
  { label: string; description: string }
> = {
  green: {
    label: "Tight match",
    description: "Query closely matches your keyword intent.",
  },
  yellow: {
    label: "AI stretched",
    description: "AI broadened the match using related signals.",
  },
  red: {
    label: "Beyond intent",
    description: "AI matched significantly beyond original intent.",
  },
}

export const searchTerms: SearchTerm[] = [
  {
    id: "1",
    query: "wireless noise cancelling headphones",
    score: "green",
    relevanceScore: 94,
    matchReason: "Direct match to your keyword with matching purchase intent.",
    matchedKeyword: "noise cancelling headphones",
    matchType: "Phrase",
    conversionRate: 6.8,
    clickQuality: 92,
    clicks: 1240,
    impressions: 18400,
    cost: 2480,
    explanation:
      "The query contains your exact keyword phrase plus a closely related modifier (“wireless”). Searcher intent aligns directly with the product category you advertise, with strong commercial signals.",
    signalDriver: "Exact keyword phrase present in query",
    signalStrength: 96,
  },
  {
    id: "2",
    query: "best headphones for working from home",
    score: "yellow",
    relevanceScore: 62,
    matchReason: "AI inferred relevance from use-case and category overlap.",
    matchedKeyword: "noise cancelling headphones",
    matchType: "Broad",
    conversionRate: 3.1,
    clickQuality: 71,
    clicks: 860,
    impressions: 22100,
    cost: 1290,
    explanation:
      "AI connected the “working from home” use case to noise cancellation benefits. While the searcher didn't specify noise cancelling, behavioral data shows this audience frequently converts on similar products.",
    signalDriver: "Use-case to product-benefit inference",
    signalStrength: 68,
  },
  {
    id: "3",
    query: "how to fix airpods not connecting",
    score: "red",
    relevanceScore: 24,
    matchReason: "AI matched on brand adjacency, not purchase intent.",
    matchedKeyword: "wireless earbuds",
    matchType: "Broad",
    conversionRate: 0.4,
    clickQuality: 28,
    clicks: 410,
    impressions: 31200,
    cost: 615,
    explanation:
      "This is a support/troubleshooting query with no purchase intent. AI matched it to your earbuds keyword via brand and category adjacency, but the searcher is looking to fix an existing device, not buy a new one.",
    signalDriver: "Category adjacency without commercial intent",
    signalStrength: 22,
  },
  {
    id: "4",
    query: "sony wh-1000xm5",
    score: "green",
    relevanceScore: 97,
    matchReason: "Model-specific query matching a product you sell.",
    matchedKeyword: "sony headphones",
    matchType: "Exact",
    conversionRate: 8.2,
    clickQuality: 95,
    clicks: 720,
    impressions: 8900,
    cost: 1640,
    explanation:
      "A high-intent, model-specific search. The searcher knows exactly which product they want, which strongly correlates with conversion. This is your highest-quality traffic segment.",
    signalDriver: "Branded model number with high purchase intent",
    signalStrength: 98,
  },
  {
    id: "5",
    query: "gym earbuds that stay in",
    score: "yellow",
    relevanceScore: 58,
    matchReason: "AI matched on a product attribute you advertise.",
    matchedKeyword: "wireless earbuds",
    matchType: "Broad",
    conversionRate: 4.5,
    clickQuality: 74,
    clicks: 540,
    impressions: 12700,
    cost: 810,
    explanation:
      "AI mapped the “stay in” requirement to your sport-fit earbuds feature. The intent is commercial and category-aligned, though the specific attribute focus introduces moderate uncertainty.",
    signalDriver: "Attribute-based intent matching",
    signalStrength: 64,
  },
  {
    id: "6",
    query: "are expensive headphones worth it",
    score: "red",
    relevanceScore: 33,
    matchReason: "Research-stage query with weak commercial signals.",
    matchedKeyword: "premium headphones",
    matchType: "Broad",
    conversionRate: 0.9,
    clickQuality: 35,
    clicks: 320,
    impressions: 19800,
    cost: 480,
    explanation:
      "An informational, top-of-funnel query. AI matched on the “expensive/premium” association, but the searcher is evaluating whether to spend at all, not ready to purchase a specific product.",
    signalDriver: "Topical keyword overlap, research intent",
    signalStrength: 31,
  },
  {
    id: "7",
    query: "bluetooth headphones with mic",
    score: "green",
    relevanceScore: 89,
    matchReason: "Feature-complete query matching your product specs.",
    matchedKeyword: "bluetooth headphones",
    matchType: "Phrase",
    conversionRate: 5.6,
    clickQuality: 88,
    clicks: 980,
    impressions: 15300,
    cost: 1760,
    explanation:
      "The query specifies features (bluetooth, mic) that directly match your product listings. Clear commercial intent with feature specificity that filters for qualified buyers.",
    signalDriver: "Feature-specific keyword match",
    signalStrength: 91,
  },
  {
    id: "8",
    query: "headphone stand wooden",
    score: "red",
    relevanceScore: 16,
    matchReason: "AI matched on category, but it's an accessory query.",
    matchedKeyword: "headphones",
    matchType: "Broad",
    conversionRate: 0.2,
    clickQuality: 19,
    clicks: 150,
    impressions: 9200,
    cost: 225,
    explanation:
      "The searcher wants a headphone accessory (a stand), not headphones themselves. AI matched on the shared root term, but you don't sell this product, resulting in wasted spend.",
    signalDriver: "Root term overlap, mismatched product type",
    signalStrength: 14,
  },
]
