import { NextRequest, NextResponse } from 'next/server';
import { getToolStats, trackToolUsage } from '@/lib/analytics';

export async function GET() {
  const stats = await getToolStats();
  return NextResponse.json({ stats });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.toolName) {
    return NextResponse.json({ error: 'toolName required' }, { status: 400 });
  }
  await trackToolUsage(body.toolName);
  return NextResponse.json({ success: true });
}
