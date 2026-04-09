import type { Source } from "@/lib/types";

const TIER_LABELS = {
  T1: { label: "T1 — Premier", bg: "bg-[#00f5ff]/10", text: "text-[#00f5ff]", border: "border-[#00f5ff]/30" },
  T2: { label: "T2 — Established", bg: "bg-[#39ff14]/10", text: "text-[#39ff14]", border: "border-[#39ff14]/30" },
  T3: { label: "T3 — Major News", bg: "bg-[#bf5fff]/10", text: "text-[#bf5fff]", border: "border-[#bf5fff]/30" },
  T4: { label: "T4 — Secondary", bg: "bg-[#ff6b35]/10", text: "text-[#ff6b35]", border: "border-[#ff6b35]/30" },
  T5: { label: "T5 — Unknown", bg: "bg-[#8888aa]/10", text: "text-[#8888aa]", border: "border-[#8888aa]/30" },
};

const VERDICT_BADGES = {
  CONFIRM: { bg: "bg-[#39ff14]/10", text: "text-[#39ff14]", label: "CONFIRMS", border: "border-[#39ff14]/30" },
  DENY: { bg: "bg-[#ff3131]/10", text: "text-[#ff3131]", label: "DENIES", border: "border-[#ff3131]/30" },
  UNVERIFIED: { bg: "bg-[#8888aa]/10", text: "text-[#8888aa]", label: "UNVERIFIED", border: "border-[#8888aa]/30" },
};

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources.length) return null;

  return (
    <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
      <h2 className="text-lg font-bold text-[#e0e0e0] mb-4 flex items-center gap-2">
        <span className="text-[#00f5ff]">◈</span> Sources Found
      </h2>
      <div className="space-y-3">
        {sources.map((source, i) => {
          const tier = TIER_LABELS[source.tier];
          const verdict = VERDICT_BADGES[source.verdict];
          return (
            <div key={i} className="border border-[#2a2a3e] rounded-lg p-3 bg-[#0a0a0f]">
              <div className="flex items-start justify-between gap-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#00f5ff] hover:underline"
                >
                  {source.title}
                </a>
                <div className="flex gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${verdict.bg} ${verdict.text} ${verdict.border}`}>
                    {verdict.label}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${tier.bg} ${tier.text} ${tier.border}`}>
                    {tier.label}
                  </span>
                </div>
              </div>
              {source.snippet && (
                <p className="text-xs text-[#8888aa] mt-2 line-clamp-2">{source.snippet}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
