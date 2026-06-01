import { NextRequest, NextResponse } from 'next/server';
import { updateDailyHotVideo, getDailyHotVideoById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const existing = getDailyHotVideoById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const status = body.status || 'verified';
  updateDailyHotVideo(id, {
    verification_status: status,
    verified_by_user: true,
  });
  return NextResponse.json({ success: true });
}
