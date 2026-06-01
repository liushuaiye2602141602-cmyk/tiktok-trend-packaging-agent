import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyReport } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: true, data: generateWeeklyReport() });
}
