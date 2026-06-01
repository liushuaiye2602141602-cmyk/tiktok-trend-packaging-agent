import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/db';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const today = new Date().toISOString().split('T')[0];
  const items = getRecommendations({ date: today });

  return NextResponse.json({
    success: true,
    data: {
      date: today,
      count: items.length,
      recommendations: items.map((r) => ({
        id: r.id,
        title_en: r.title_en,
        title_cn: r.title_cn,
        product_type: r.product_type,
        target_market: r.target_market,
        hook: r.hook,
        priority: r.priority,
        difficulty: r.difficulty,
        status: r.status,
      })),
    },
  });
}
