"use client";

import { ClaimForm } from "@/components/ClaimForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#2a2a3e] bg-[#12121a]">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0a0a0f] border border-[#00f5ff]/30 flex items-center justify-center text-2xl neon-glow-cyan">
              🔍
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#e0e0e0] tracking-tight">
                FactCheck<span className="text-[#00f5ff]">AI</span>
              </h1>
              <p className="text-sm text-[#8888aa]">
                Live verification pipeline — 4 structured web searches minimum
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Scanline decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00f5ff]/40 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* How it works */}
        <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#00f5ff] text-sm font-bold tracking-widest uppercase">System Active</span>
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { step: "01", label: "Submit claim" },
              { step: "02", label: "4 web searches" },
              { step: "03", label: "AI analysis" },
              { step: "04", label: "Verdict report" },
            ].map(({ step, label }) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-[#00f5ff] neon-glow-cyan">{step}</span>
                <span className="text-xs text-[#8888aa]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Claim form */}
        <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
          <ClaimForm />
        </div>

        {/* Example claims — click to load */}
        <div className="mt-8">
          <p className="text-xs text-[#8888aa] uppercase tracking-widest mb-3">Try a real-world example</p>
          <div className="flex flex-col gap-2">
            {[
              { claim: "The AIDS virus HIV has never been proven to cause AIDS", label: "HIV/AIDS denialism" },
              { claim: "Vaccines cause autism and other neurological disorders", label: "Vaccine-autism myth" },
              { claim: "The 2020 US presidential election was stolen through widespread voter fraud", label: "Election fraud claim" },
              { claim: "Global warming is a hoax and Earth's climate has not been changing", label: "Climate denial" },
              { claim: "The Earth is flat and NASA feeds the public fake space footage", label: "Flat Earth conspiracy" },
            ].map(({ claim, label }, i) => (
              <button
                key={i}
                onClick={() => {
                  const textarea = document.querySelector("textarea");
                  if (textarea) {
                    // @ts-ignore
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                    nativeInputValueSetter?.call(textarea, claim);
                    textarea.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }}
                className="text-left text-sm text-[#8888aa] bg-[#12121a] border border-[#2a2a3e] hover:border-[#00f5ff]/50 rounded-lg px-4 py-3 transition-all"
              >
                <span className="text-[#00f5ff] font-mono text-xs mr-2">{label}</span>
                <span className="text-[#e0e0e0]">"{claim}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
