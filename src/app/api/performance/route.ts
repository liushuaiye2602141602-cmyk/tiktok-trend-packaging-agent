import { NextRequest, NextResponse } from 'next/server';
import { getPerformances, addPerformance } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recommendationId = searchParams.get('recommendation_id');
  const filters = recommendationId ? { recommendation_id: Number(recommendationId) } : undefined;
  return NextResponse.json(getPerformances(filters));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addPerformance(body);
  return NextResponse.json({ id, success: true });
}
