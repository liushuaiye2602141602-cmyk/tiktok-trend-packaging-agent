import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: 'ok',
      app: 'tiktok-trend-packaging-agent',
      version: '1.0.0',
      time: new Date().toISOString(),
    },
  });
}
