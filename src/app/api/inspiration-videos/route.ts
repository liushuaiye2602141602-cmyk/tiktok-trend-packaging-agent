import { NextRequest, NextResponse } from 'next/server';
import { getInspirationVideos, addInspirationVideo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: Record<string, string> = {};
  for (const key of ['platform', 'video_type', 'product_type', 'value_level', 'status', 'search']) {
    const v = sp.get(key);
    if (v) filters[key] = v;
  }
  return NextResponse.json(getInspirationVideos(filters));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.video_url) {
    return NextResponse.json({ error: 'video_url is required' }, { status: 400 });
  }
  const id = addInspirationVideo(body);
  return NextResponse.json({ id, success: true });
}
