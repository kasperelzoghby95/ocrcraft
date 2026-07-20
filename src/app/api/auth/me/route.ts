import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getSessionFromCookies(request.cookies);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return NextResponse.json({ user });
}
