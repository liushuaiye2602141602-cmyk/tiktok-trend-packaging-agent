import { NextRequest, NextResponse } from 'next/server';
import { getTrends, addTrend, deleteTrend } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || undefined;
  const country = searchParams.get('country') || undefined;
  return NextResponse.json(getTrends({ date, country }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addTrend(body);
  return NextResponse.json({ id, success: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  deleteTrend(Number(id));
  return NextResponse.json({ success: true });
}
