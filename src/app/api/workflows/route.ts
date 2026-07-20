import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { z } from 'zod';

const workflowSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  workflowData: z.string(),
  isPublic: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const session = getSessionFromCookies(request.cookies);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workflows = await db.savedWorkflow.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ workflows });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies(request.cookies);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = workflowSchema.parse(body);

    const workflow = await db.savedWorkflow.create({
      data: {
        ...data,
        userId: session.userId,
      },
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
