import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations, getTrends } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const date = body.date || new Date().toISOString().split('T')[0];

  const recommendations = getRecommendations({ date });

  if (recommendations.length === 0) {
    return NextResponse.json({
      success: false,
      message: `No recommendations found for ${date}. Generate them first.`,
    });
  }

  const trends = getTrends({ date });

  const payload = {
    date,
    title: `Europe TikTok Packaging Trend Report - ${date}`,
    summary: `${recommendations.length} recommendations, ${trends.length} trends identified`,
    recommendations: recommendations.map((r) => ({
      title: r.title_en,
      product: r.product_type,
      market: r.target_market,
      hook: r.hook,
      script: r.script_en,
      caption: r.caption,
      hashtags: r.hashtags,
      cta: r.cta,
      priority: r.priority,
    })),
    trends: trends.map((t) => ({
      keyword: t.keyword,
      country: t.country,
      type: t.trend_type,
      heat: t.heat_score,
    })),
    generated_at: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    message: 'Webhook payload generated. Configure target URLs to forward.',
    payload,
  });
}
