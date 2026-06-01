import { NextRequest, NextResponse } from 'next/server';
import { getInspirationVideos } from '@/lib/db';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const items = getInspirationVideos({ value_level: 'high' });

  return NextResponse.json({
    success: true,
    data: {
      count: items.length,
      videos: items.map((v) => ({
        id: v.id,
        platform: v.platform,
        account_name: v.account_name,
        video_type: v.video_type,
        reference_industry: v.reference_industry,
        why_good: v.why_good,
        total_score: v.total_score,
        value_level: v.value_level,
        transfer_difficulty: v.transfer_difficulty,
      })),
    },
  });
}
