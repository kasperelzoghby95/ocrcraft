import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const histories = await prisma.extractionHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ histories });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName, fileType, extractedText } = await req.json();
    if (!fileName || !extractedText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const history = await prisma.extractionHistory.create({
      data: {
        userId: session.user.id,
        fileName,
        fileType: fileType || "unknown",
        extractedText,
      },
    });

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
  }
}
