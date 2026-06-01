import { NextRequest, NextResponse } from 'next/server';
import { getDailyHotVideos, getRecommendations, getInspirationVideos } from '@/lib/db';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const today = new Date().toISOString().split('T')[0];
  const hotVideos = getDailyHotVideos({ date: today });
  const recommendations = getRecommendations({ date: today });
  const inspirations = getInspirationVideos({ value_level: 'high' });

  const unverified = hotVideos.filter((r) => r.verification_status === 'unverified');
  const useful = hotVideos.filter((r) => r.verification_status === 'useful');

  return NextResponse.json({
    success: true,
    data: {
      date: today,
      hot_videos_count: hotVideos.length,
      unverified_count: unverified.length,
      useful_count: useful.length,
      recommendations_count: recommendations.length,
      high_value_inspirations: inspirations.length,
      today_recommendations: recommendations.slice(0, 5).map((r) => ({
        id: r.id,
        title_cn: r.title_cn,
        title_en: r.title_en,
        product_type: r.product_type,
        target_market: r.target_market,
        priority: r.priority,
      })),
      hot_video_entries: hotVideos.slice(0, 10).map((r) => ({
        id: r.id,
        source_type: r.source_type,
        keyword: r.keyword,
        country: r.country,
        confidence_level: r.confidence_level,
        verification_status: r.verification_status,
      })),
      suggested_observations: [
        '查看 TikTok Creative Center 最新趋势',
        '检查未验证的热点入口',
        '观察高价值参考视频的拍摄手法',
      ],
    },
  });
}
