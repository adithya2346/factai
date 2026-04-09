import { searchClaim, buildSearchQueries } from "./search";
import { analyzeWithGemini } from "./analyze";
import { storeReport } from "./reportStore";
import type { VerificationReport } from "./types";

export async function runPipeline(claim: string): Promise<VerificationReport> {
  const start = Date.now();

  // Build queries (pre-search planning)
  const queries = buildSearchQueries(claim);

  // Run all 4 searches
  const searchResults = await searchClaim(claim);

  // Analyze with Gemini using all search results
  const analysis = await analyzeWithGemini(claim, queries, searchResults);

  const processingTimeMs = Date.now() - start;

  // Store and return report
  const report = storeReport({
    claim,
    queries,
    searchResults,
    analysis,
    processingTimeMs,
  });

  return report;
}
