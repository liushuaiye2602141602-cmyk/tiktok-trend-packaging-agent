import { NextRequest, NextResponse } from 'next/server';
import { getAccountUpdateLogs, addAccountUpdateLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: Record<string, string | number> = {};
  const cid = sp.get('competitor_id');
  if (cid) filters.competitor_id = Number(cid);
  const date = sp.get('date');
  if (date) filters.date = date;
  return NextResponse.json(getAccountUpdateLogs(filters));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addAccountUpdateLog(body);
  return NextResponse.json({ id, success: true });
}
