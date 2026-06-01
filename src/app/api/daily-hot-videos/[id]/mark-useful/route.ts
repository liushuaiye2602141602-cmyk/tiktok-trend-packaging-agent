import { NextRequest, NextResponse } from 'next/server';
import { updateDailyHotVideo, getDailyHotVideoById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const existing = getDailyHotVideoById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}
  const useful = body.useful !== false;
  updateDailyHotVideo(id, {
    verification_status: useful ? 'useful' : 'not_useful',
    verified_by_user: true,
    can_add_to_inspiration: useful,
  });
  return NextResponse.json({ success: true });
}
