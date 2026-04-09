export type Verdict =
  | "REAL"
  | "FAKE"
  | "MISLEADING"
  | "UNVERIFIED"
  | "SATIRE";

export type SubClaimRating = "TRUE" | "FALSE" | "MISLEADING";

export type SourceTier = "T1" | "T2" | "T3" | "T4" | "T5";

export type SourceVerdict = "CONFIRM" | "DENY" | "UNVERIFIED";

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface SearchQuery {
  type: "raw_claim" | "fact_check_topic" | "named_entity" | "fact_checker_sweep";
  query: string;
  results: SearchResult[];
}

export interface SubClaim {
  assertion: string;
  rating: SubClaimRating;
  explanation: string;
  supportingSources: string[];
}

export interface RedFlag {
  type: "sensational" | "no_attribution" | "emotional" | "old_date" | "unverifiable" | "outdated_claim";
  text: string;
  severity: "high" | "medium" | "low";
}

export interface Source {
  title: string;
  url: string;
  tier: SourceTier;
  verdict: SourceVerdict;
  snippet: string;
  credibilityNote?: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  subClaims: SubClaim[];
  redFlags: RedFlag[];
  sources: Source[];
  directFactCheckLinks: { title: string; url: string }[];
  contextNote: string;
  isRecirculation: boolean;
  recirculationNote?: string;
  rawResponse: string;
}

export interface VerificationReport {
  id: string;
  claim: string;
  timestamp: string;
  queries: Omit<SearchQuery, "results">[];
  searchResults: SearchQuery[];
  analysis: AnalysisResult;
  processingTimeMs: number;
}

export interface PipelineConfig {
  maxSearchResults?: number;
  includeSnippets?: boolean;
}
