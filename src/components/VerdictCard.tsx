import type { Verdict } from "@/lib/types";

const VERDICT_STYLES: Record<Verdict, { label: string; color: string; glow: string; bg: string }> = {
  REAL: { label: "REAL", color: "text-[#39ff14]", glow: "neon-glow-green", bg: "bg-[#39ff14]/10" },
  FAKE: { label: "FAKE", color: "text-[#ff3131]", glow: "neon-glow-red", bg: "bg-[#ff3131]/10" },
  MISLEADING: { label: "MISLEADING", color: "text-[#ffe135]", glow: "neon-glow-yellow", bg: "bg-[#ffe135]/10" },
  UNVERIFIED: { label: "UNVERIFIED", color: "text-[#8888aa]", glow: "", bg: "bg-[#8888aa]/10" },
  SATIRE: { label: "SATIRE", color: "text-[#bf5fff]", glow: "neon-glow-purple", bg: "bg-[#bf5fff]/10" },
};

interface VerdictCardProps {
  verdict: Verdict;
  confidence: number;
}

export function VerdictCard({ verdict, confidence }: VerdictCardProps) {
  const style = VERDICT_STYLES[verdict];

  return (
    <div className={`${style.bg} border border-[#2a2a3e] rounded-xl p-6 ${style.glow}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-3xl font-black uppercase tracking-widest ${style.color}`}>
          {style.label}
        </span>
        <span className="text-sm text-[#8888aa]">Confidence</span>
      </div>

      <div className="mb-2">
        <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden border border-[#2a2a3e]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              confidence >= 80 ? "bg-gradient-to-r from-[#39ff14] to-[#00f5ff]" :
              confidence >= 60 ? "bg-gradient-to-r from-[#00f5ff] to-[#39ff14]" :
              confidence >= 40 ? "bg-gradient-to-r from-[#ffe135] to-[#ff6b35]" :
              confidence >= 20 ? "bg-gradient-to-r from-[#ff6b35] to-[#ff3131]" :
              "bg-gradient-to-r from-[#ff3131] to-[#bf5fff]"
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[#8888aa]">0</span>
          <span className={`text-xl font-black ${style.color}`}>{confidence}%</span>
          <span className="text-xs text-[#8888aa]">100</span>
        </div>
      </div>
    </div>
  );
}
