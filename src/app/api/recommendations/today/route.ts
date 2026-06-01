import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const product = searchParams.get('product') || undefined;
  const market = searchParams.get('market') || undefined;
  return NextResponse.json(getRecommendations({ date, product, market }));
}
