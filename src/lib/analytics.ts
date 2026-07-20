import { db } from './db';

export async function trackToolUsage(toolName: string): Promise<void> {
  await db.toolAnalytics.upsert({
    where: { toolName },
    update: {
      executionCount: { increment: 1 },
      lastUsedAt: new Date(),
    },
    create: {
      toolName,
      executionCount: 1,
    },
  });
}

export async function getToolStats() {
  return db.toolAnalytics.findMany({
    orderBy: { executionCount: 'desc' },
  });
}
