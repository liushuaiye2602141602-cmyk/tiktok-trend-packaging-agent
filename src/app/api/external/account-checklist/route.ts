import { NextRequest, NextResponse } from 'next/server';
import { getCompetitors } from '@/lib/db';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const competitors = getCompetitors();

  return NextResponse.json({
    success: true,
    data: {
      date: new Date().toISOString().split('T')[0],
      count: competitors.length,
      accounts: competitors.map((c) => ({
        id: c.id,
        platform: c.platform,
        account_name: c.account_name,
        profile_url: c.profile_url,
        country: c.country,
        product_focus: c.product_focus,
        content_style: c.content_style,
      })),
    },
  });
}
