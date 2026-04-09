import type { Source, RedFlag, Verdict } from "./types";

const TIER_WEIGHTS: Record<string, number> = {
  T1: 25,
  T2: 15,
  T3: 10,
  T4: 5,
  T5: 0,
};

export function calculateConfidence(
  sources: Source[],
  redFlags: RedFlag[]
): number {
  let score = 50; // baseline

  for (const source of sources) {
    score += TIER_WEIGHTS[source.tier] ?? 0;
  }

  for (const flag of redFlags) {
    const penalty = flag.severity === "high" ? 15 : flag.severity === "medium" ? 10 : 5;
    score -= penalty;
  }

  return Math.max(0, Math.min(100, score));
}

export function getVerdict(confidence: number): Verdict {
  if (confidence >= 80) return "REAL";
  if (confidence >= 60) return "REAL";
  if (confidence >= 40) return "MISLEADING";
  if (confidence >= 20) return "UNVERIFIED";
  return "FAKE";
}

export function classifySourceTier(url: string): "T1" | "T2" | "T3" | "T4" | "T5" {
  const lower = url.toLowerCase();
  if (/reuters\.com|apnews\.com|bbc\.co\.uk|bbc\.com|snopes\.com/.test(lower)) return "T1";
  if (/politifact\.com|factcheck\.org|fullfact\.org/.test(lower)) return "T2";
  if (/nytimes\.com|washingtonpost\.com|theguardian\.com|cnn\.com|bbc\.com|wsj\.com/.test(lower)) return "T3";
  if (/wikipedia|blog|medium|substack|linkedin/.test(lower)) return "T4";
  return "T5";
}
