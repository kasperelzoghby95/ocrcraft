import { NextResponse } from "next/server";

const HF_ENDPOINTS = [
  "https://router.huggingface.co/hf-inference/models/baidu/Unlimited-OCR",
  "https://api-inference.huggingface.co/models/baidu/Unlimited-OCR",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.error("[OCR] HUGGINGFACE_API_KEY is not set in environment");
      console.error("[OCR] Available env keys:", Object.keys(process.env).filter(k => !k.includes("SECRET") && !k.includes("KEY")).join(", "));
      return NextResponse.json({ error: "API key not configured. Set HUGGINGFACE_API_KEY in .env" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let lastError: unknown;

    for (const endpoint of HF_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: buffer,
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[OCR] Endpoint ${endpoint} returned ${response.status}:`, errorText);

          if (response.status === 503) {
            return NextResponse.json(
              { error: "Model is loading. Please try again in a moment." },
              { status: 503 }
            );
          }

          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          continue;
        }

        const result = await response.json();

        let extractedText = "";

        if (Array.isArray(result)) {
          extractedText = result
            .map((item: { generated_text?: string }) => item.generated_text || "")
            .filter(Boolean)
            .join("\n");
        } else if (result.generated_text) {
          extractedText = result.generated_text;
        } else if (result.text) {
          extractedText = result.text;
        } else {
          extractedText = JSON.stringify(result);
        }

        return NextResponse.json({ text: extractedText });
      } catch (err) {
        console.error(`[OCR] Endpoint ${endpoint} failed:`, err instanceof Error ? err.message : err);
        lastError = err;
      }
    }

    const message = lastError instanceof Error ? lastError.message : "All endpoints failed";
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return NextResponse.json({ error: "Cannot reach Hugging Face API. Check your network or DNS settings." }, { status: 502 });
    }

    return NextResponse.json({ error: `OCR failed: ${message}` }, { status: 502 });
  } catch (error) {
    console.error("[OCR] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
