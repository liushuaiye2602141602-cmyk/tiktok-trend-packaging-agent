import { NextRequest, NextResponse } from 'next/server';
import { getDailyHotVideoById, addInspirationVideo, updateDailyHotVideo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = getDailyHotVideoById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const inspirationId = addInspirationVideo({
    platform: item.platform || 'TikTok',
    video_url: item.video_url || item.source_url || item.search_url || '',
    account_name: item.creator_name || '',
    country: item.country || 'EU',
    reference_industry: item.reference_industry || 'flexible packaging',
    video_type: item.video_type || 'other',
    title_or_note: item.title_or_caption || item.keyword || '',
    why_good: item.why_worth_watching || '',
    what_to_learn: item.what_to_observe || '',
    status: 'pending',
  });

  updateDailyHotVideo(id, { can_add_to_inspiration: true });

  return NextResponse.json({ success: true, inspiration_id: inspirationId });
}
