import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";
import { storeReport, getReport } from "@/lib/reportStore";
import { getMockReport } from "@/lib/mockData";

export async function POST(request: Request) {
  try {
    const { claim } = await request.json();

    if (!claim || typeof claim !== "string" || claim.trim().length === 0) {
      return NextResponse.json({ error: "Claim is required" }, { status: 400 });
    }

    if (claim.length > 2000) {
      return NextResponse.json({ error: "Claim too long (max 2000 chars)" }, { status: 400 });
    }

    try {
      const report = await runPipeline(claim.trim());
      return NextResponse.json(report);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("Live pipeline failed — falling back to demo mode:", message);
      const mock = getMockReport(claim.trim());
      const stored = storeReport({
        claim: mock.claim,
        queries: mock.queries,
        searchResults: mock.searchResults,
        analysis: mock.analysis,
        processingTimeMs: mock.processingTimeMs,
      });
      return NextResponse.json(stored);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Verification error:", message);
    return NextResponse.json({ error: `Verification failed: ${message}` }, { status: 500 });
  }
}
