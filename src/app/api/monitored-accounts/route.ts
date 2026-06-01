import { NextRequest, NextResponse } from 'next/server';
import { getCompetitors, addCompetitor } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getCompetitors());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addCompetitor(body);
  return NextResponse.json({ id, success: true });
}
