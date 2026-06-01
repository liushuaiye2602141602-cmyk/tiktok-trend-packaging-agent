import { NextRequest, NextResponse } from 'next/server';
import { getCompetitors } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const competitors = getCompetitors();
  const today = new Date().toISOString().split('T')[0];
  return NextResponse.json({
    success: true,
    data: {
      date: today,
      count: competitors.length,
      accounts: competitors.map((c) => ({
        id: c.id,
        platform: c.platform,
        account_name: c.account_name,
        profile_url: c.profile_url,
        country: c.country,
        product_focus: c.product_focus,
      })),
    },
  });
}
