import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations, addRecommendation, countRecommendationsByDate, deleteRecommendationsByDate } from '@/lib/db';
import { generateDailyRecommendations } from '@/lib/ai-generator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const date = body.date || new Date().toISOString().split('T')[0];
  const count = body.count || 8;

  const existing = countRecommendationsByDate(date);

  if (existing > 0 && !body.force) {
    return NextResponse.json({
      success: true,
      message: `Already have ${existing} recommendations for ${date}`,
      count: existing,
      date,
    });
  }

  if (body.force) {
    deleteRecommendationsByDate(date);
  }

  const recommendations = generateDailyRecommendations(count, date);

  for (const r of recommendations) {
    addRecommendation({
      date,
      title_en: r.title_en,
      title_cn: r.title_cn,
      product_type: r.product_type,
      target_market: r.target_market,
      target_customer: r.target_customer,
      hook: r.hook,
      script_en: r.script_en,
      shot_list: JSON.stringify(r.shot_list),
      shot_list_cn: JSON.stringify(r.shot_list_cn),
      caption: r.caption,
      hashtags: r.hashtags,
      cta: r.cta,
      priority: r.priority,
      difficulty: r.difficulty,
      platforms: r.platforms,
      status: 'draft',
    });
  }

  return NextResponse.json({
    success: true,
    message: `Generated ${recommendations.length} recommendations for ${date}`,
    count: recommendations.length,
    date,
  });
}
