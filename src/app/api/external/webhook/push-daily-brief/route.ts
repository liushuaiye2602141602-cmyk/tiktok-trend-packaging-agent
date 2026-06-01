import { NextRequest, NextResponse } from 'next/server';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const body = await req.json().catch(() => ({}));
  const webhookUrl = body.webhook_url || process.env.N8N_WEBHOOK_URL || process.env.OPENCLAW_WEBHOOK_URL;

  if (!webhookUrl) {
    return apiError('NO_WEBHOOK', 'No webhook URL provided. Set N8N_WEBHOOK_URL or OPENCLAW_WEBHOOK_URL in .env, or pass webhook_url in request body.');
  }

  // Fetch daily brief data
  const baseUrl = req.nextUrl.origin;
  const briefRes = await fetch(`${baseUrl}/api/external/daily-brief`, {
    headers: { 'x-api-key': process.env.API_AUTH_TOKEN || '' },
  });
  const briefData = await briefRes.json();

  // Push to webhook
  try {
    const pushRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(briefData),
    });

    return NextResponse.json({
      success: true,
      data: {
        webhook_url: webhookUrl,
        webhook_status: pushRes.status,
        brief: briefData,
      },
    });
  } catch {
    return apiError('WEBHOOK_FAILED', `Failed to push to webhook: ${webhookUrl}`);
  }
}
