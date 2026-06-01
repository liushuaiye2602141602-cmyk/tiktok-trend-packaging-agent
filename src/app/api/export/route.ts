import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const recommendations = getRecommendations({ date });

  if (format === 'markdown') {
    let md = `# TikTok Packaging Trend Report - ${date}\n\n`;
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `## Today's Recommendations (${recommendations.length})\n\n`;

    for (const r of recommendations) {
      md += `### ${r.priority}. ${r.title_en}\n`;
      md += `- **Product**: ${r.product_type}\n`;
      md += `- **Market**: ${r.target_market}\n`;
      md += `- **Customer**: ${r.target_customer}\n`;
      md += `- **Hook**: ${r.hook}\n`;
      md += `- **Script**: ${r.script_en}\n`;
      md += `- **Caption**: ${r.caption}\n`;
      md += `- **Hashtags**: ${r.hashtags}\n`;
      md += `- **CTA**: ${r.cta}\n`;
      md += `- **Difficulty**: ${r.difficulty}\n\n`;
    }

    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="trends-${date}.md"`,
      },
    });
  }

  // CSV format
  const headers = [
    'Priority', 'Title', 'Product', 'Market', 'Customer',
    'Hook', 'Script', 'Caption', 'Hashtags', 'CTA', 'Difficulty', 'Status',
  ];

  const escapeCsv = (val: unknown) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  let csv = headers.join(',') + '\n';
  for (const r of recommendations) {
    csv += [
      r.priority, r.title_en, r.product_type, r.target_market, r.target_customer,
      r.hook, r.script_en, r.caption, r.hashtags, r.cta, r.difficulty, r.status,
    ].map(escapeCsv).join(',') + '\n';
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="trends-${date}.csv"`,
    },
  });
}
