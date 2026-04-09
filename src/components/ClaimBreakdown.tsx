import type { SubClaim } from "@/lib/types";

const RATING_STYLES = {
  TRUE: { bg: "bg-[#39ff14]/10", text: "text-[#39ff14]", border: "border-[#39ff14]/30", label: "TRUE" },
  FALSE: { bg: "bg-[#ff3131]/10", text: "text-[#ff3131]", border: "border-[#ff3131]/30", label: "FALSE" },
  MISLEADING: { bg: "bg-[#ffe135]/10", text: "text-[#ffe135]", border: "border-[#ffe135]/30", label: "MISLEADING" },
};

interface ClaimBreakdownProps {
  subClaims: SubClaim[];
}

export function ClaimBreakdown({ subClaims }: ClaimBreakdownProps) {
  if (!subClaims.length) return null;

  return (
    <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
      <h2 className="text-lg font-bold text-[#e0e0e0] mb-4 flex items-center gap-2">
        <span className="text-[#00f5ff]">◈</span> Claim Breakdown
      </h2>
      <div className="space-y-4">
        {subClaims.map((sub, i) => {
          const style = RATING_STYLES[sub.rating];
          return (
            <div key={i} className={`border-b border-[#2a2a3e] pb-4 last:border-0 last:pb-0`}>
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 text-xs font-black rounded border ${style.bg} ${style.text} ${style.border}`}>
                  {style.label}
                </span>
                <p className="text-sm text-[#e0e0e0] flex-1">{sub.assertion}</p>
              </div>
              <p className="text-sm text-[#8888aa] mt-2 ml-12">{sub.explanation}</p>
              {sub.supportingSources.length > 0 && (
                <div className="mt-2 ml-12">
                  <span className="text-xs text-[#8888aa]">Sources: </span>
                  {sub.supportingSources.map((src, j) => (
                    <a
                      key={j}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00f5ff] hover:underline ml-1"
                    >
                      {new URL(src).hostname}{j < sub.supportingSources.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
