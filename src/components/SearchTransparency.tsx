import type { SearchQuery } from "@/lib/types";

const QUERY_LABELS: Record<SearchQuery["type"], string> = {
  raw_claim: "1️⃣ Raw Claim",
  fact_check_topic: "2️⃣ Fact-Check Query",
  named_entity: "3️⃣ Named-Entity Search",
  fact_checker_sweep: "4️⃣ Fact-Checker Sweep",
};

const QUERY_COLORS: Record<SearchQuery["type"], string> = {
  raw_claim: "text-[#00f5ff]",
  fact_check_topic: "text-[#bf5fff]",
  named_entity: "text-[#39ff14]",
  fact_checker_sweep: "text-[#ffe135]",
};

interface SearchTransparencyProps {
  queries: Omit<SearchQuery, "results">[];
}

export function SearchTransparency({ queries }: SearchTransparencyProps) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
      <h2 className="text-lg font-bold text-[#e0e0e0] mb-4 flex items-center gap-2">
        <span className="text-[#00f5ff]">🔍</span> All Search Queries Used
      </h2>
      <p className="text-xs text-[#8888aa] mb-4">
        Full transparency — every search the AI ran to form this verdict.
      </p>
      <div className="space-y-3">
        {queries.map((q, i) => (
          <div key={i} className="bg-[#0a0a0f] rounded-lg p-3 border border-[#2a2a3e]">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold ${QUERY_COLORS[q.type]}`}>
                {QUERY_LABELS[q.type]}
              </span>
            </div>
            <code className="text-sm text-[#e0e0e0] break-all font-mono">{q.query}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
