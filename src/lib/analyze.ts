import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  Verdict,
  SubClaim,
  RedFlag,
  Source,
  SearchQuery,
  AnalysisResult,
} from "./types";
import { calculateConfidence, classifySourceTier } from "./scorer";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SENSATIONAL_PATTERNS = [
  /shocking|must see|you won't believe|they don't want you to know|secret|sensational/i,
  /breaking:|exposed:|urgent:|just revealed/i,
  /this is what they don't want you to see|don't scroll past/i,
];

const EMOTIONAL_PATTERNS = [
  /outrageous|disgusting|heartbreaking|devastating|i can't even/i,
  /you should be ashamed|this will blow your mind/i,
];

const OLD_DATE_PATTERNS = [
  /\b(last year|yesterday|this week|this month)\b/i,
  /\b(2020|2021|2022|2023)\b.*(?!\b202[56]\b)/,
];

import Anthropic from "@anthropic-ai/sdk";

export async function analyzeWithGemini(
  claim: string,
  _queries: Omit<SearchQuery, "results">[],
  searchResults: SearchQuery[]
): Promise<AnalysisResult> {
  const searchContext = searchResults
    .map((q) => `[${q.type}]\nQuery: ${q.query}\n${q.results.map((r) => `  - ${r.title} (${r.url}): ${r.content}`).join("\n")}`)
    .join("\n\n");

  const prompt = `You are a rigorous fact-checker. Given a claim and web search results, produce a detailed analysis.

CLAIM TO VERIFY: "${claim}"

SEARCH RESULTS:
${searchContext}

Your task:
1. Decompose the claim into atomic sub-assertions and rate each TRUE / FALSE / MISLEADING
2. Identify red flags (sensational language, missing attribution, emotional appeal, unverifiable claims, outdated dates)
3. List all sources found with their TIER (T1=Reuters/AP/BBBC/Snopes, T2=PolitiFact/FactCheck.org, T3=Major news, T4=Blogs, T5=Unknown)
4. Classify each source's verdict on the claim: CONFIRM / DENY / UNVERIFIED
5. Find direct links to fact-check articles
6. Note any nuance the reader should know
7. Detect if this is an old story being recirculated as new

Respond STRICTLY in this JSON format (no markdown, no extra text):
{
  "verdict": "REAL|FAKE|MISLEADING|UNVERIFIED|SATIRE",
  "confidence": 0-100,
  "subClaims": [{"assertion": "...", "rating": "TRUE|FALSE|MISLEADING", "explanation": "...", "supportingSources": ["url1", "url2"]}],
  "redFlags": [{"type": "sensational|no_attribution|emotional|old_date|unverifiable|outdated_claim", "text": "...", "severity": "high|medium|low"}],
  "sources": [{"title": "...", "url": "...", "tier": "T1-T5", "verdict": "CONFIRM|DENY|UNVERIFIED", "snippet": "..."}],
  "directFactCheckLinks": [{"title": "...", "url": "..."}],
  "contextNote": "...",
  "isRecirculation": true|false,
  "recirculationNote": "..."
}`;

  let rawResponse = "";

  if (process.env.GROQ_API_KEY) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a factual JSON-only outputting fact checker." },
          { role: "user", content: prompt }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      })
    });
    if (!res.ok) {
      throw new Error(`Groq API error: ${await res.text()}`);
    }
    const data = await res.json();
    rawResponse = data.choices[0].message.content || "";
  } else if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      temperature: 0,
      system: "You are a factual JSON-only outputting fact checker.",
      messages: [{ role: "user", content: prompt }]
    });
    rawResponse = msg.content[0].type === "text" ? msg.content[0].text : "";
  } else {
    // Fallback to gemini-2.5-flash
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt]);
    rawResponse = result.response.text();
  }

  // try to parse the ai json response
  let parsed: Partial<AnalysisResult> = {};
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    // whatever, if parsing fails just leave it empty
  }

  // quickly check for some obvious red flags by regexing the claim text
  const detectedRedFlags: RedFlag[] = [];

  if (SENSATIONAL_PATTERNS.some((p) => p.test(claim))) {
    detectedRedFlags.push({ type: "sensational", text: "used sensational language", severity: "high" });
  }

  if (EMOTIONAL_PATTERNS.some((p) => p.test(claim))) {
    detectedRedFlags.push({ type: "emotional", text: "Emotional appeal language detected", severity: "medium" });
  }

  if (OLD_DATE_PATTERNS.some((p) => p.test(claim))) {
    detectedRedFlags.push({ type: "old_date", text: "Possible outdated date reference", severity: "medium" });
  }

  if (!/[A-Z][a-z]+.*(?:said|reported|announced|stated|according to)/i.test(claim)) {
    detectedRedFlags.push({ type: "no_attribution", text: "Claim lacks attribution to named source", severity: "high" });
  }

  // automatically classify source tiers and get rid of dupes
  const allSources = searchResults.flatMap((q) =>
    q.results.map((r) => ({
      title: r.title,
      url: r.url,
      tier: classifySourceTier(r.url),
      verdict: "UNVERIFIED" as const,
      snippet: r.content.slice(0, 200),
    }))
  );

  const seenUrls = new Set<string>();
  const dedupedSources = allSources.filter((s) => {
    if (seenUrls.has(s.url)) return false;
    seenUrls.add(s.url);
    return true;
  });

  const redFlags = [...detectedRedFlags, ...(parsed.redFlags ?? [])];
  const sources = [...dedupedSources, ...(parsed.sources ?? [])];

  const confidence = parsed.confidence ?? calculateConfidence(sources, redFlags);
  const verdict = parsed.verdict ?? (confidence >= 80 ? "REAL" : confidence >= 60 ? "REAL" : confidence >= 40 ? "MISLEADING" : confidence >= 20 ? "UNVERIFIED" : "FAKE");

  return {
    verdict: verdict as Verdict,
    confidence,
    subClaims: parsed.subClaims ?? [{ assertion: claim, rating: "MISLEADING", explanation: "Unable to fully verify claim", supportingSources: [] }],
    redFlags,
    sources: dedupedSources.slice(0, 20),
    directFactCheckLinks: parsed.directFactCheckLinks ?? [],
    contextNote: parsed.contextNote ?? "Analysis based on available search results.",
    isRecirculation: parsed.isRecirculation ?? false,
    recirculationNote: parsed.recirculationNote,
    rawResponse,
  };
}
