import { NextRequest, NextResponse } from 'next/server';
import { getDailyHotVideos, addDailyHotVideo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: Record<string, string> = {};
  for (const key of ['date', 'country', 'source_type', 'confidence_level', 'verification_status', 'reference_industry', 'video_type', 'added_to_inspiration', 'search']) {
    const v = sp.get(key);
    if (v) filters[key] = v;
  }
  return NextResponse.json(getDailyHotVideos(filters));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = addDailyHotVideo(body);
  return NextResponse.json({ id, success: true });
}
