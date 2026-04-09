import { v4 as uuidv4 } from "uuid";
import type { VerificationReport } from "./types";

const reports = new Map<string, VerificationReport>();

export function storeReport(report: Omit<VerificationReport, "id" | "timestamp">): VerificationReport {
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  const fullReport: VerificationReport = { ...report, id, timestamp };
  reports.set(id, fullReport);
  return fullReport;
}

export function getReport(id: string): VerificationReport | undefined {
  return reports.get(id);
}
