import { NextRequest, NextResponse } from 'next/server';
import { generateDailyChecklist } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const date = body.date || new Date().toISOString().split('T')[0];
  const items = generateDailyChecklist(date);
  return NextResponse.json({ success: true, count: items.length, items });
}
