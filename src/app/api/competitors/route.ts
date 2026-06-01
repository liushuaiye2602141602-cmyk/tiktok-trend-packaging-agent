import { NextRequest, NextResponse } from 'next/server';
import { getCompetitors, addCompetitor, deleteCompetitor } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getCompetitors());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addCompetitor(body);
  return NextResponse.json({ id, success: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  deleteCompetitor(Number(id));
  return NextResponse.json({ success: true });
}
