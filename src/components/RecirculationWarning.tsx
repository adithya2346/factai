interface RecirculationWarningProps {
  note?: string;
}

export function RecirculationWarning({ note }: RecirculationWarningProps) {
  return (
    <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl p-4 flex items-start gap-3 neon-glow-yellow">
      <span className="text-2xl">🔄</span>
      <div>
        <h3 className="font-bold text-[#ff6b35] text-sm">Recirculation Warning</h3>
        <p className="text-sm text-[#ffe135] mt-1">
          {note ?? "This story may be old news being spread as current. Check the publication date and context."}
        </p>
      </div>
    </div>
  );
}
