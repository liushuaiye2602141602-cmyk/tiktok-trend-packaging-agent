import { NextRequest, NextResponse } from 'next/server';
import { getDailyHotVideos, getCompetitors, getInspirationVideos, getRecommendations } from '@/lib/db';
import { checkApiAuth, apiError } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

function confidenceLabel(level: string): string {
  if (level === 'high') return '高';
  if (level === 'low') return '低';
  return '中';
}

function verificationLabel(status: string): string {
  if (status === 'verified') return '已验证';
  if (status === 'useful') return '值得参考';
  if (status === 'not_useful') return '不值得';
  return '待验证';
}

export async function GET(req: NextRequest) {
  const auth = checkApiAuth(req);
  if (!auth.authorized) return apiError('UNAUTHORIZED', auth.error!, 401);

  const today = new Date().toISOString().split('T')[0];

  // 1. Today's hot video entries
  const hotVideos = getDailyHotVideos({ date: today });

  // 2. Competitor accounts (today checklist)
  const competitors = getCompetitors();

  // 3. High-value inspiration videos
  const inspirations = getInspirationVideos({ value_level: 'high' });

  // 4. Today's recommendations
  const recommendations = getRecommendations({ date: today });

  // Build Markdown
  const lines: string[] = [];

  lines.push('# 今日欧洲 TikTok B2B 热点观察简报');
  lines.push('');
  lines.push(`> 日期: ${today}`);
  lines.push('');

  // Section 1: Hot video entries
  lines.push('## 1. 今日待观察热点入口');
  lines.push('');

  if (hotVideos.length === 0) {
    lines.push('今日暂无热点入口。请先在页面点击"生成今日热点采集清单"。');
    lines.push('');
  } else {
    // Group by source type
    const ccEntries = hotVideos.filter(v => v.source_type === 'TikTok Creative Center');
    const searchEntries = hotVideos.filter(v => v.source_type === 'TikTok Search');
    const manualEntries = hotVideos.filter(v => v.source_type === 'Manual Input');
    const competitorEntries = hotVideos.filter(v => v.source_type === 'Competitor Account');
    const otherEntries = hotVideos.filter(v =>
      !['TikTok Creative Center', 'TikTok Search', 'Manual Input', 'Competitor Account'].includes(String(v.source_type))
    );

    if (ccEntries.length > 0) {
      lines.push(`### TikTok Creative Center (${ccEntries.length} 条)`);
      lines.push('');
      for (const v of ccEntries.slice(0, 10)) {
        const link = v.source_url ? `[打开链接](${v.source_url})` : '无链接';
        lines.push(`- **${v.keyword}** | ${v.country} | 可信度: ${confidenceLabel(String(v.confidence_level || 'medium'))} | ${verificationLabel(String(v.verification_status || 'unverified'))} | ${link}`);
      }
      lines.push('');
    }

    if (searchEntries.length > 0) {
      lines.push(`### TikTok 搜索入口 (${searchEntries.length} 条)`);
      lines.push('');
      for (const v of searchEntries.slice(0, 15)) {
        const link = v.search_url ? `[打开搜索](${v.search_url})` : '无链接';
        lines.push(`- **${v.keyword}** | ${v.country} | 可信度: ${confidenceLabel(String(v.confidence_level || 'medium'))} | ${verificationLabel(String(v.verification_status || 'unverified'))} | ${link}`);
      }
      lines.push('');
    }

    if (competitorEntries.length > 0) {
      lines.push(`### 竞争对手账号 (${competitorEntries.length} 条)`);
      lines.push('');
      for (const v of competitorEntries.slice(0, 10)) {
        const link = v.source_url ? `[打开主页](${v.source_url})` : '无链接';
        lines.push(`- **${v.creator_name || v.source_name}** | ${v.country} | ${verificationLabel(String(v.verification_status || 'unverified'))} | ${link}`);
      }
      lines.push('');
    }

    if (manualEntries.length > 0) {
      lines.push(`### 手动录入 (${manualEntries.length} 条)`);
      lines.push('');
      for (const v of manualEntries.slice(0, 10)) {
        const link = v.video_url ? `[打开视频](${v.video_url})` : '无链接';
        lines.push(`- **${v.keyword || v.title_or_caption}** | ${v.country} | ${verificationLabel(String(v.verification_status || 'unverified'))} | ${link}`);
      }
      lines.push('');
    }

    if (otherEntries.length > 0) {
      lines.push(`### 其他来源 (${otherEntries.length} 条)`);
      lines.push('');
      for (const v of otherEntries.slice(0, 5)) {
        lines.push(`- **${v.keyword || v.source_name}** | ${v.source_type} | ${v.country}`);
      }
      lines.push('');
    }
  }

  // Section 2: Accounts to check
  lines.push('## 2. 今日待检查账号');
  lines.push('');

  if (competitors.length === 0) {
    lines.push('暂无监控账号。可在"竞争对手"页面添加。');
    lines.push('');
  } else {
    for (const c of competitors) {
      const link = c.profile_url ? `[打开主页](${c.profile_url})` : '无主页链接';
      lines.push(`- **${c.account_name}** | ${c.platform} | ${c.country} | 行业: ${c.product_focus || '未设置'} | ${link}`);
    }
    lines.push('');
    lines.push('> 以上账号需人工打开检查是否有新内容更新。无真实更新记录时不会标注"已更新"。');
    lines.push('');
  }

  // Section 3: High-value inspiration videos
  lines.push('## 3. 高价值参考视频');
  lines.push('');

  if (inspirations.length === 0) {
    lines.push('暂无高价值参考视频。可在每日热点中标记"值得参考"后自动加入。');
    lines.push('');
  } else {
    for (const v of inspirations.slice(0, 8)) {
      const link = v.video_url ? `[原链接](${v.video_url})` : '无原链接';
      lines.push(`- **${v.title_or_note || v.account_name || '未命名'}** | ${v.platform} | 行业: ${v.reference_industry} | 适合产品: ${v.product_type || '未设置'} | 总分: ${v.total_score}/36`);
      if (v.why_good) {
        lines.push(`  - 为什么值得学习: ${v.why_good}`);
      }
      lines.push(`  - ${link}`);
    }
    lines.push('');
  }

  // Section 4: Today's recommendations
  lines.push('## 4. 今日推荐选题');
  lines.push('');

  if (recommendations.length === 0) {
    lines.push('今日暂无推荐选题。可在首页点击"生成今日选题"。');
    lines.push('');
  } else {
    for (const r of recommendations.slice(0, 5)) {
      lines.push(`### ${r.title_en || 'Untitled'}`);
      lines.push('');
      if (r.title_cn) lines.push(`- 中文解释: ${r.title_cn}`);
      if (r.product_type) lines.push(`- 适合产品: ${r.product_type}`);
      if (r.target_market) lines.push(`- 目标市场: ${r.target_market}`);
      if (r.hook) lines.push(`- Hook: ${r.hook}`);
      if (r.tiktok_caption) lines.push(`- TikTok Caption: ${r.tiktok_caption}`);
      if (r.cta) lines.push(`- CTA: ${r.cta}`);
      lines.push('');
    }
  }

  // Section 5: Suggested actions
  lines.push('## 5. 今日建议动作');
  lines.push('');
  lines.push('1. 打开 5-10 个热点入口，快速浏览搜索结果');
  lines.push('2. 保存 3-5 个真实视频链接到每日热点表');
  lines.push('3. 标记值得参考的视频，加入优秀视频观察库');
  lines.push('4. 至少拆解 1 条视频的拍摄手法和内容结构');
  lines.push('5. 生成 1 条软包装改编方案');
  lines.push('');
  lines.push('---');
  lines.push('*由 tiktok-trend-packaging-agent 自动生成*');

  const markdown = lines.join('\n');

  return NextResponse.json({
    success: true,
    data: {
      date: today,
      markdown,
    },
    message: 'ok',
  });
}
