import { NextRequest, NextResponse } from 'next/server';
import { getInspirationVideoById, addRecommendation, updateInspirationVideo } from '@/lib/db';
import { generateAdaptation } from '@/lib/ai-generator';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const video = getInspirationVideoById(id);
  if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const adaptation = generateAdaptation(video);
  const today = new Date().toISOString().split('T')[0];

  const recId = addRecommendation({
    date: today,
    title_en: adaptation.title_en,
    title_cn: adaptation.title_cn,
    product_type: adaptation.product_type,
    target_market: adaptation.target_market,
    target_customer: adaptation.target_customer,
    hook: adaptation.hook,
    script_en: adaptation.script_en,
    shot_list: JSON.stringify(adaptation.shot_list),
    shot_list_cn: JSON.stringify(adaptation.shot_list_cn),
    caption: adaptation.caption,
    hashtags: adaptation.hashtags,
    cta: adaptation.cta,
    priority: adaptation.priority,
    difficulty: adaptation.difficulty,
    platforms: adaptation.platforms,
    status: 'draft',
  });

  // Update video status to 'adapted'
  updateInspirationVideo(id, { status: 'adapted' });

  return NextResponse.json({ success: true, recommendation_id: recId, adaptation });
}
