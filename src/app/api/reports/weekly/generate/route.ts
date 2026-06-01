import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyReport } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  const report = generateWeeklyReport();
  return NextResponse.json({ success: true, data: report });
}
