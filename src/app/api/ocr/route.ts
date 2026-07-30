import { NextResponse } from "next/server";

const HF_API_URL = "https://api-inference.huggingface.co/models/baidu/Unlimited-OCR";

async function callHF(
  buffer: Buffer,
  mimeType: string,
  apiKey: string,
  signal: AbortSignal
): Promise<Response> {
  return fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": mimeType,
    },
    body: new Uint8Array(buffer),
    signal,
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Set HUGGINGFACE_API_KEY." },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "application/octet-stream";

    let response = await callHF(buffer, mimeType, apiKey, AbortSignal.timeout(30000));

    if (response.status === 503) {
      const errorBody = await response.text();
      console.warn(`[OCR] Model loading (503), retrying after 3s. Body: ${errorBody}`);
      await new Promise((r) => setTimeout(r, 3000));
      response = await callHF(buffer, mimeType, apiKey, AbortSignal.timeout(60000));
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[OCR] HF returned ${response.status}:`, errorBody);
      return NextResponse.json(
        { error: `HF API error (${response.status}): ${errorBody || response.statusText}` },
        { status: response.status }
      );
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[OCR] Unhandled error:", message);
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return NextResponse.json(
        { error: "Cannot reach Hugging Face API. Check your network or DNS settings." },
        { status: 502 }
      );
    }
    if (message.includes("timed out") || message.includes("Timeout")) {
      return NextResponse.json(
        { error: "Request to Hugging Face API timed out." },
        { status: 504 }
      );
    }
    return NextResponse.json({ error: `OCR failed: ${message}` }, { status: 500 });
  }
}
