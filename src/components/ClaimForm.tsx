"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type UploadState = "idle" | "dragover" | "uploading" | "done" | "error";

interface ExtractedData {
  claim: string;
  description: string;
}

export function ClaimForm() {
  const [claim, setClaim] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFile = useCallback(async (file: File) => {
    setUploadError("");
    setUploadState("uploading");
    setFileName(file.name);

    // Show preview for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-claim", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze media");
      }

      const data: ExtractedData = await res.json();

      if (data.claim) {
        setClaim(data.claim);
      }

      setUploadState("done");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("idle");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Verification failed");
      }

      const report = await res.json();
      router.push(`/report/${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setUploadState("idle");
    setPreviewUrl(null);
    setFileName("");
    setUploadError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setUploadState("dragover"); }}
        onDragLeave={() => setUploadState(uploadState === "dragover" ? "idle" : uploadState)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          ${uploadState === "idle" ? "glass-panel border-glass-border hover:border-neon-cyan" : ""}
          ${uploadState === "dragover" ? "glass-panel border-neon-cyan neon-glow-cyan animate-pulse-neon" : ""}
          ${uploadState === "uploading" ? "glass-panel border-neon-purple" : ""}
          ${uploadState === "done" ? "glass-panel border-neon-green" : ""}
          ${uploadState === "error" ? "glass-panel border-neon-red" : ""}
        `}
      >
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={uploadState === "uploading"}
        />

        {uploadState === "uploading" && (
          <div className="flex flex-col items-center justify-center py-10">
            <svg className="animate-spin-slow w-10 h-10 text-[#bf5fff] mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-[#8888aa] text-sm">Analyzing media with AI vision...</span>
          </div>
        )}

        {uploadState === "done" && (
          <div className="flex items-center gap-4 p-4">
            {previewUrl && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-glass-border">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); resetUpload(); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-neon-red rounded-full text-white text-xs flex items-center justify-center neon-glow-red"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-neon-cyan text-sm font-medium truncate">{fileName}</p>
              <p className="text-text-secondary text-xs mt-1">Claim extracted — edit below before verifying</p>
            </div>
          </div>
        )}

        {(uploadState === "idle" || uploadState === "dragover") && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-4xl mb-3">
              {uploadState === "dragover" ? "📥" : "🖼️"}
            </div>
            <p className="text-[#e0e0e0] font-medium">
              {uploadState === "dragover" ? "Drop to analyze" : "Drag & drop or click"}
            </p>
            <p className="text-[#8888aa] text-xs mt-1">Images & videos supported — AI will extract the claim</p>
          </div>
        )}

        {uploadState === "error" && (
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-[#ff3131] text-sm">{uploadError}</span>
            <button type="button" onClick={resetUpload} className="text-xs text-[#8888aa] mt-2 hover:text-[#00f5ff]">
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Claim textarea */}
      <div>
        <label htmlFor="claim" className="block text-sm font-medium mb-2 text-[#e0e0e0]">
          Claim to verify
        </label>
        <textarea
          id="claim"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Paste or type a claim to verify..."
          className="w-full px-4 py-3 bg-bg-primary/50 glass-panel focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-white placeholder-text-secondary resize-none transition-all outline-none"
          rows={4}
          maxLength={2000}
          disabled={loading}
        />
        <div className="text-right text-xs text-[#8888aa] mt-1">
          {claim.length}/2000
        </div>
      </div>

      {error && (
        <div className="text-[#ff3131] text-sm bg-[#ff3131]/10 px-4 py-2 rounded border border-[#ff3131]/30">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !claim.trim()}
          className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all neon-glow-cyan"
        >
          {loading ? "Verifying..." : "Verify Claim"}
        </button>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-[#8888aa]">
            <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running 4 searches...
          </div>
        )}
      </div>

      <p className="text-xs text-[#8888aa]">
        4 structured searches across Snopes, Reuters, AP, PolitiFact, FactCheck.org & BBC Reality Check
      </p>
    </form>
  );
}
