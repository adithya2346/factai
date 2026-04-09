import type { RedFlag } from "@/lib/types";

const FLAG_STYLES = {
  high: { bg: "bg-[#ff3131]/10", text: "text-[#ff3131]", border: "border-[#ff3131]/30" },
  medium: { bg: "bg-[#ffe135]/10", text: "text-[#ffe135]", border: "border-[#ffe135]/30" },
  low: { bg: "bg-[#8888aa]/10", text: "text-[#8888aa]", border: "border-[#8888aa]/30" },
};

const FLAG_ICONS: Record<RedFlag["type"], string> = {
  sensational: "⚡",
  no_attribution: "🔗",
  emotional: "💢",
  old_date: "📅",
  unverifiable: "❓",
  outdated_claim: "🔄",
};

interface RedFlagPillsProps {
  redFlags: RedFlag[];
}

export function RedFlagPills({ redFlags }: RedFlagPillsProps) {
  if (!redFlags.length) return null;

  return (
    <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
      <h2 className="text-lg font-bold text-[#e0e0e0] mb-3 flex items-center gap-2">
        <span className="text-[#ff3131]">🚩</span> Red Flags
      </h2>
      <div className="flex flex-wrap gap-2">
        {redFlags.map((flag, i) => {
          const style = FLAG_STYLES[flag.severity];
          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${style.bg} ${style.text} ${style.border}`}
            >
              <span>{FLAG_ICONS[flag.type]}</span>
              {flag.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
