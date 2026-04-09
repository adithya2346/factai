import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { writeFile, unlink } from "fs/promises";
import path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Save temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() ?? "bin";
    const tmpPath = path.join("/tmp", `factcheck-${Date.now()}.${ext}`);
    await writeFile(tmpPath, buffer);

    try {
      const isImage = file.type.startsWith("image/");

      if (isImage) {
        // Single image — vision analysis
        const base64 = buffer.toString("base64");
        const mediaType = file.type === "image/png" ? "image/png" : "image/jpeg";

        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType as "image/png" | "image/jpeg", data: base64 },
              },
              {
                type: "text",
                text: `You are an AI analyzing a screenshot or image for factual claims. Your task:
1. OCR: Extract ALL visible text verbatim (headlines, captions, social media posts, article text, etc.)
2. Describe: Summarize what factual claims, assertions, or statements are being made in this image
3. If the image contains a meme, screenshot of a post, or article — identify what the "claim" is

Return JSON: { "extractedText": "...", "claim": "...", "description": "..." }`,
              },
            ],
          }],
        });

        const text = message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { extractedText: "", claim: text, description: "" };

        return NextResponse.json({
          claim: parsed.claim ?? parsed.extractedText ?? "",
          extractedText: parsed.extractedText ?? "",
          description: parsed.description ?? "",
        });
      } else {
        // Video — treat as image for now (sample the first frame)
        // Client-side frame extraction would be needed for full video support
        const firstFrameBase64 = buffer.toString("base64").slice(0, Math.min(buffer.toString("base64").length, 500000));

        const framePrompt = `Analyze this video frame. Describe what factual claims, assertions, or statements are being made.
Return JSON: { "claim": "...", "description": "..." }`;

        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: firstFrameBase64 },
              },
              { type: "text", text: framePrompt },
            ],
          }],
        });

        const text = message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { claim: text, overallDescription: "" };

        return NextResponse.json({
          claim: parsed.claim ?? "",
          description: parsed.description ?? "",
        });
      }
    } finally {
      // Clean up temp file
      await unlink(tmpPath).catch(() => {});
    }
  } catch (err) {
    console.error("Extract error:", err);
    return NextResponse.json({ error: "Failed to process media" }, { status: 500 });
  }
}
