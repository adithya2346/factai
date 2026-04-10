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

    // write it to a temp path so we can parse it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() ?? "bin";
    const tmpPath = path.join("/tmp", `factcheck-${Date.now()}.${ext}`);
    await writeFile(tmpPath, buffer);

    try {
      const isImage = file.type.startsWith("image/");

      if (isImage) {
        // standard image upload - process through vision models
        const base64 = buffer.toString("base64");
        const mediaType = file.type === "image/png" ? "image/png" : "image/jpeg";

        let text = "";

        if (process.env.GROQ_API_KEY) {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: "llama-3.2-90b-vision-preview",
              messages: [{
                role: "user",
                content: [
                  { type: "text", text: `You are an AI analyzing a screenshot or image for factual claims. Your task:\n1. OCR: Extract ALL visible text verbatim\n2. Describe: Summarize what factual claims are being made\n3. If it contains a meme/screenshot — identify the "claim"\n\nReturn JSON: { "extractedText": "...", "claim": "...", "description": "..." }` },
                  { type: "image_url", image_url: { url: `data:${mediaType};base64,${base64}` } }
                ]
              }],
              temperature: 0,
              response_format: { type: "json_object" }
            })
          });
          const data = await res.json();
          text = data.choices?.[0]?.message?.content || "";
        } else if (process.env.ANTHROPIC_API_KEY) {
          const message = await client.messages.create({
            model: "claude-3-5-sonnet-20240620",
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
                  text: `You are an AI analyzing a screenshot or image for factual claims. Your task:\n1. OCR: Extract ALL visible text verbatim\n2. Describe: Summarize what factual claims are being made\n3. If it contains a meme/screenshot — identify the "claim"\n\nReturn JSON: { "extractedText": "...", "claim": "...", "description": "..." }`,
                },
              ],
            }],
          });
          text = message.content[0].type === "text" ? message.content[0].text : "";
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { extractedText: "", claim: text, description: "" };

        return NextResponse.json({
          claim: parsed.claim ?? parsed.extractedText ?? "",
          extractedText: parsed.extractedText ?? "",
          description: parsed.description ?? "",
        });
      } else {
        // user gave us a video. just grab the very first frame for now 
        // to avoid doing heavy client-side ffmpeg stuff
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
