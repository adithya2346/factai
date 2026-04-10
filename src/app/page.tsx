"use client";

import { ClaimForm } from "@/components/ClaimForm";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="text-center mt-10 mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon-cyan/20">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">System Active</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Verify reality with <br />
          <span className="text-gradient">AI precision</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg text-text-secondary">
          Instantly run 4 comprehensive structured web searches across premier fact-checkers to verify any claim.
        </p>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { step: "01", label: "Submit claim", icon: "📝", color: "neon-cyan" },
          { step: "02", label: "4 web searches", icon: "🌐", color: "neon-purple" },
          { step: "03", label: "AI analysis", icon: "🧠", color: "neon-green" },
          { step: "04", label: "Verdict report", icon: "📊", color: "neon-orange" },
        ].map(({ step, label, icon, color }) => (
          <div key={step} className={`hover:-translate-y-1 transition-transform duration-300 glass-panel rounded-2xl p-6 flex flex-col items-center gap-3 border-${color}/20 hover:border-${color}/50`}>
            <span className={`text-4xl filter drop-shadow-[0_0_10px_var(--${color})]`}>{icon}</span>
            <div className="text-center">
              <div className={`text-sm font-black text-[var(--${color})] mb-1`}>STEP {step}</div>
              <div className="text-xs font-medium text-text-secondary">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Fact Check Form */}
      <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow behind the form */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-neon-cyan/20 blur-[80px] -z-10" />
        
        <ClaimForm />
      </div>

      {/* Examples Grid */}
      <div className="w-full max-w-3xl mt-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-glass-border" />
          <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Try an Example</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-glass-border" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { claim: "Nelson Mandela was the first Black president of South Africa", label: "History", color: "green" },
            { claim: "Global warming is a hoax and Earth's climate has not been changing", label: "Climate", color: "red" },
            { claim: "The Earth is flat and NASA feeds the public fake space footage", label: "Conspiracy", color: "purple" },
            { claim: "The speed of light in a vacuum is approximately 299,792 km/s", label: "Science", color: "cyan" },
          ].map(({ claim, label, color }, i) => (
            <button
              key={i}
              onClick={() => {
                const textarea = document.querySelector("textarea");
                if (textarea) {
                  // @ts-ignore
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                  nativeInputValueSetter?.call(textarea, claim);
                  textarea.dispatchEvent(new Event("input", { bubbles: true }));
                  
                  // Scroll to form
                  textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="text-left group glass-panel rounded-xl p-5 hover:border-neon-cyan/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-neon-${color}`} />
              <div className={`text-[var(--neon-${color})] text-[10px] font-bold uppercase tracking-wider mb-2`}>{label}</div>
              <p className="text-sm text-text-secondary group-hover:text-white transition-colors line-clamp-2">"{claim}"</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
