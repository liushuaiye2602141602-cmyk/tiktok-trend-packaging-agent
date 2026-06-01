import { NextRequest, NextResponse } from 'next/server';
import { getInspirationVideoById, updateInspirationVideo } from '@/lib/db';
import { generateAdaptation } from '@/lib/ai-generator';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const video = getInspirationVideoById(id);
  if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const adaptation = generateAdaptation(video);

  // Update video status to 'adapted'
  updateInspirationVideo(id, { status: 'adapted' });

  return NextResponse.json({ success: true, adaptation });
}
