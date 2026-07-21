import { NextResponse } from "next/server";

const HF_API_URL = "https://api-inference.huggingface.co/models/baidu/Unlimited-OCR";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", response.status, errorText);

      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading. Please try again in a moment." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `OCR failed: ${response.statusText}` },
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
    console.error("OCR route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
