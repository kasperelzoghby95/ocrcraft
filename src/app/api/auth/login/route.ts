import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
