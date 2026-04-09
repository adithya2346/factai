"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VerdictCard } from "@/components/VerdictCard";
import { ClaimBreakdown } from "@/components/ClaimBreakdown";
import { RedFlagPills } from "@/components/RedFlagPills";
import { SourceList } from "@/components/SourceList";
import { SearchTransparency } from "@/components/SearchTransparency";
import { RecirculationWarning } from "@/components/RecirculationWarning";
import type { VerificationReport } from "@/lib/types";

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/report/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🔍</div>
          <p className="text-[#8888aa] font-mono text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ff3131]">{error || "Report not found"}</p>
          <a href="/" className="text-[#00f5ff] hover:underline mt-2 block">← New claim</a>
        </div>
      </div>
    );
  }

  const { analysis } = report;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#2a2a3e] bg-[#12121a]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-[#00f5ff]/30 flex items-center justify-center text-xl neon-glow-cyan">
              🔍
            </div>
            <div>
              <h1 className="text-xl font-black text-[#e0e0e0]">
                FactCheck<span className="text-[#00f5ff]">AI</span>
              </h1>
              <p className="text-xs text-[#8888aa]">Verification Report</p>
            </div>
          </div>
          <a href="/" className="text-sm text-[#00f5ff] hover:underline font-mono">← New claim</a>
        </div>
      </header>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00f5ff]/40 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        {/* Claim */}
        <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
          <p className="text-xs text-[#8888aa] uppercase tracking-widest mb-2 font-mono">// CLAIM UNDER INVESTIGATION</p>
          <p className="text-lg text-[#e0e0e0] leading-relaxed font-mono">"{report.claim}"</p>
          <p className="text-xs text-[#8888aa] mt-4 font-mono">
            Processed in {report.processingTimeMs}ms · {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Verdict */}
        <VerdictCard verdict={analysis.verdict} confidence={analysis.confidence} />

        {/* Context note */}
        {analysis.contextNote && (
          <div className="bg-[#00f5ff]/5 border border-[#00f5ff]/30 rounded-xl p-4">
            <p className="text-sm text-[#e0e0e0]">
              <span className="font-bold text-[#00f5ff]">💡 Context: </span>
              {analysis.contextNote}
            </p>
          </div>
        )}

        {/* Recirculation warning */}
        {analysis.isRecirculation && (
          <RecirculationWarning note={analysis.recirculationNote} />
        )}

        {/* Red flags */}
        <RedFlagPills redFlags={analysis.redFlags} />

        {/* Claim breakdown */}
        <ClaimBreakdown subClaims={analysis.subClaims} />

        {/* Sources */}
        <SourceList sources={analysis.sources} />

        {/* Fact-check links */}
        {analysis.directFactCheckLinks.length > 0 && (
          <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e0e0e0] mb-4 flex items-center gap-2">
              <span className="text-[#00f5ff]">◈</span> Direct Fact-Check Articles
            </h2>
            <ul className="space-y-2">
              {analysis.directFactCheckLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00f5ff] hover:underline text-sm font-mono"
                  >
                    → {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search transparency */}
        <SearchTransparency queries={report.queries} />
      </div>
    </main>
  );
}
