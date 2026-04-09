import type { SearchQuery, SearchResult } from "./types";
import { tavily } from "@tavily/core";
const FACT_CHECK_DOMAINS = [
  "snopes.com",
  "reuters.com",
  "apnews.com",
  "politifact.com",
  "factcheck.org",
  "bbc.co.uk/reality-check",
];

function buildSearchQueries(claim: string): Omit<SearchQuery, "results">[] {
  return [
    { type: "raw_claim", query: claim },
    { type: "fact_check_topic", query: `fact check ${claim}` },
    { type: "named_entity", query: `${claim} site:${FACT_CHECK_DOMAINS.join(" OR site:")}` },
    { type: "fact_checker_sweep", query: `${claim} false OR fake OR misleading OR debunked site:${FACT_CHECK_DOMAINS.join(" OR site:")}` },
  ];
}

async function searchWithTavily(query: string): Promise<SearchResult[]> {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is not set in environment.");
  }
  const tvlyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
  const response = await tvlyClient.search(query, {
    searchDepth: "basic",
    maxResults: 6,
  });

  return response.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score || 1,
  }));
}

async function searchWithApify(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://api.apify.com/v2/acts/desmond-dev~duckduckgo-web-search/runs?token=${process.env.APIFY_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchQuery: query,
        maxResults: 8,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Apify search failed: ${response.statusText}`);
  }

  const data = await response.json();
  const runId = data.data?.runId;

  // Poll for results
  let attempts = 0;
  while (attempts < 20) {
    await new Promise((r) => setTimeout(r, 1000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/desmond-dev~duckduckgo-web-search/runs/${runId}/status?token=${process.env.APIFY_API_KEY}`
    );
    const statusData = await statusRes.json();
    if (statusData.data?.status === "finished") break;
    attempts++;
  }

  // Get results
  const itemsRes = await fetch(
    `https://api.apify.com/v2/acts/desmond-dev~duckduckgo-web-search/runs/${runId}/dataset/items?token=${process.env.APIFY_API_KEY}`
  );
  const items = await itemsRes.json();

  return (Array.isArray(items) ? items : []).map((item: Record<string, unknown>) => ({
    title: String(item.title ?? ""),
    url: String(item.url ?? ""),
    content: String(item.snippet ?? item.description ?? ""),
    score: 1,
  }));
}

async function searchWithFallback(query: string): Promise<SearchResult[]> {
  // Free fallback using SerpAPI-style DuckDuckGo via public API
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambiguation=1`;
  const response = await fetch(url);
  const data = await response.json();

  const results: SearchResult[] = [];

  if (data.RelatedTopics) {
    for (const topic of data.RelatedTopics.slice(0, 8)) {
      if (topic.Text && topic.FirstURL) {
        results.push({
          title: topic.Text.slice(0, 100),
          url: topic.FirstURL,
          content: topic.Text,
          score: 1,
        });
      }
    }
  }

  if (data.AbstractText) {
    results.unshift({
      title: data.Heading || query,
      url: data.AbstractURL || "",
      content: data.AbstractText,
      score: 1,
    });
  }

  return results;
}

async function executeSearches(queries: Omit<SearchQuery, "results">[]): Promise<SearchQuery[]> {
  const results = await Promise.all(
    queries.map(async (q) => {
      try {
        let searchResults: SearchResult[];
        if (process.env.TAVILY_API_KEY) {
          searchResults = await searchWithTavily(q.query);
        } else if (process.env.APIFY_API_KEY && !process.env.APIFY_API_KEY.includes("/")) {
          searchResults = await searchWithApify(q.query);
        } else {
          searchResults = await searchWithFallback(q.query);
        }
        return { ...q, results: searchResults };
      } catch (err) {
        console.warn(`Search failed for "${q.type}":`, err);
        return { ...q, results: [] };
      }
    })
  );
  return results;
}

async function searchClaim(claim: string): Promise<SearchQuery[]> {
  const queries = buildSearchQueries(claim);
  return executeSearches(queries);
}

export { searchClaim, buildSearchQueries, executeSearches };
