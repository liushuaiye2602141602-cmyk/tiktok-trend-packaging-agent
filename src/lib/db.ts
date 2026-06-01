import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface DbData {
  trends: Record<string, unknown>[];
  recommendations: Record<string, unknown>[];
  competitors: Record<string, unknown>[];
  performance: Record<string, unknown>[];
  inspiration_videos: Record<string, unknown>[];
  daily_hot_videos: Record<string, unknown>[];
  account_update_logs: Record<string, unknown>[];
  nextIds: { trends: number; recommendations: number; competitors: number; performance: number; inspiration_videos: number; daily_hot_videos: number; account_update_logs: number };
}

let dbData: DbData | null = null;

function loadDb(): DbData {
  if (dbData) return dbData;
  if (fs.existsSync(DB_PATH)) {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbData = JSON.parse(raw);
    // Migration: add inspiration_videos if missing
    if (!dbData!.inspiration_videos) {
      dbData!.inspiration_videos = [];
    }
    if (!dbData!.nextIds.inspiration_videos) {
      dbData!.nextIds.inspiration_videos = 1;
    }
    // Migration: add daily_hot_videos if missing
    if (!dbData!.daily_hot_videos) {
      dbData!.daily_hot_videos = [];
    }
    if (!dbData!.nextIds.daily_hot_videos) {
      dbData!.nextIds.daily_hot_videos = 1;
    }
    // Migration: add account_update_logs if missing
    if (!dbData!.account_update_logs) {
      dbData!.account_update_logs = [];
    }
    if (!dbData!.nextIds.account_update_logs) {
      dbData!.nextIds.account_update_logs = 1;
    }
  } else {
    dbData = {
      trends: [],
      recommendations: [],
      competitors: [],
      performance: [],
      inspiration_videos: [],
      daily_hot_videos: [],
      account_update_logs: [],
      nextIds: { trends: 1, recommendations: 1, competitors: 1, performance: 1, inspiration_videos: 1, daily_hot_videos: 1, account_update_logs: 1 },
    };
  }
  return dbData!;
}

function saveDb() {
  if (!dbData) return;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
}

// Trends
export function getTrends(filters?: { date?: string; country?: string }): Record<string, unknown>[] {
  const db = loadDb();
  let rows = db.trends;
  if (filters?.date) rows = rows.filter((r) => r.date === filters.date);
  if (filters?.country) rows = rows.filter((r) => r.country === filters.country);
  return rows.slice(-200).reverse();
}

export function addTrend(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.trends++;
  const row = {
    id,
    date: data.date || new Date().toISOString().split('T')[0],
    country: data.country || 'EU',
    trend_type: data.trend_type || 'keyword',
    keyword: data.keyword,
    source: data.source || 'manual',
    description: data.description || '',
    heat_score: data.heat_score ?? 50,
    b2b_fit_score: data.b2b_fit_score ?? 50,
    packaging_fit_score: data.packaging_fit_score ?? 50,
    created_at: new Date().toISOString(),
  };
  db.trends.push(row);
  saveDb();
  return id;
}

export function deleteTrend(id: number): boolean {
  const db = loadDb();
  const idx = db.trends.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.trends.splice(idx, 1);
  saveDb();
  return true;
}

// Recommendations
export function getRecommendations(filters?: { date?: string; product?: string; market?: string }): Record<string, unknown>[] {
  const db = loadDb();
  let rows = db.recommendations;
  if (filters?.date) rows = rows.filter((r) => r.date === filters.date);
  if (filters?.product) rows = rows.filter((r) => r.product_type === filters.product);
  if (filters?.market) rows = rows.filter((r) => r.target_market === filters.market);
  return rows.sort((a, b) => ((a.priority as number) || 5) - ((b.priority as number) || 5));
}

export function addRecommendation(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.recommendations++;
  const row = { id, ...data, created_at: new Date().toISOString() };
  db.recommendations.push(row);
  saveDb();
  return id;
}

export function countRecommendationsByDate(date: string): number {
  const db = loadDb();
  return db.recommendations.filter((r) => r.date === date).length;
}

export function deleteRecommendationsByDate(date: string): number {
  const db = loadDb();
  const before = db.recommendations.length;
  db.recommendations = db.recommendations.filter((r) => r.date !== date);
  const deleted = before - db.recommendations.length;
  if (deleted > 0) saveDb();
  return deleted;
}

// Competitors
export function getCompetitors(): Record<string, unknown>[] {
  const db = loadDb();
  return [...db.competitors].reverse();
}

export function addCompetitor(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.competitors++;
  const row = {
    id,
    platform: data.platform || 'TikTok',
    account_name: data.account_name,
    profile_url: data.profile_url || '',
    country: data.country || '',
    product_focus: data.product_focus || '',
    content_style: data.content_style || '',
    notes: data.notes || '',
    created_at: new Date().toISOString(),
  };
  db.competitors.push(row);
  saveDb();
  return id;
}

export function deleteCompetitor(id: number): boolean {
  const db = loadDb();
  const idx = db.competitors.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.competitors.splice(idx, 1);
  saveDb();
  return true;
}

// Performance
export function getPerformances(filters?: { recommendation_id?: number }): Record<string, unknown>[] {
  const db = loadDb();
  let rows = db.performance;
  if (filters?.recommendation_id) {
    rows = rows.filter((r) => r.recommendation_id === filters.recommendation_id);
  }
  // Enjoin with recommendation title
  return rows.slice(-100).reverse().map((p) => {
    const rec = db.recommendations.find((r) => r.id === p.recommendation_id);
    return {
      ...p,
      recommendation_title: rec?.title_cn || rec?.title_en || null,
      product_type: rec?.product_type || null,
    };
  });
}

export function addPerformance(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.performance++;
  const row = {
    id,
    recommendation_id: data.recommendation_id || null,
    platform: data.platform || 'TikTok',
    publish_date: data.publish_date || new Date().toISOString().split('T')[0],
    video_url: data.video_url || '',
    views: data.views ?? 0,
    likes: data.likes ?? 0,
    comments: data.comments ?? 0,
    shares: data.shares ?? 0,
    inquiries: data.inquiries ?? 0,
    notes: data.notes || '',
    created_at: new Date().toISOString(),
  };
  db.performance.push(row);
  saveDb();
  return id;
}

// Inspiration Videos
export function getInspirationVideos(filters?: {
  platform?: string;
  video_type?: string;
  product_type?: string;
  reference_industry?: string;
  value_level?: string;
  status?: string;
  search?: string;
}): Record<string, unknown>[] {
  const db = loadDb();
  let rows = [...db.inspiration_videos].reverse();
  if (filters?.platform) rows = rows.filter((r) => r.platform === filters.platform);
  if (filters?.video_type) rows = rows.filter((r) => r.video_type === filters.video_type);
  if (filters?.product_type) rows = rows.filter((r) => r.product_type === filters.product_type);
  if (filters?.reference_industry) rows = rows.filter((r) => r.reference_industry === filters.reference_industry);
  if (filters?.value_level) rows = rows.filter((r) => r.value_level === filters.value_level);
  if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((r) =>
      String(r.account_name || '').toLowerCase().includes(q) ||
      String(r.title_or_note || '').toLowerCase().includes(q) ||
      String(r.why_good || '').toLowerCase().includes(q) ||
      String(r.how_to_adapt_for_factory || '').toLowerCase().includes(q) ||
      String(r.transferable_points || '').toLowerCase().includes(q)
    );
  }
  return rows;
}

export function getInspirationVideoById(id: number): Record<string, unknown> | undefined {
  const db = loadDb();
  return db.inspiration_videos.find((r) => r.id === id);
}

export function addInspirationVideo(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.inspiration_videos++;
  const now = new Date().toISOString();
  const totalScore = computeTotalScore(data);
  const valueLevel = computeValueLevel(totalScore);
  const row = {
    id,
    platform: data.platform || 'TikTok',
    video_url: data.video_url || '',
    account_name: data.account_name || '',
    country: data.country || '',
    language: data.language || '',
    reference_industry: data.reference_industry || 'other b2b manufacturing',
    video_type: data.video_type || 'other',
    product_type: data.product_type || '',
    title_or_note: data.title_or_note || '',
    first_second_hook: data.first_second_hook || '',
    main_visual: data.main_visual || '',
    hook_style: data.hook_style || '',
    shot_style: data.shot_style || '',
    subtitle_style: data.subtitle_style || '',
    editing_style: data.editing_style || '',
    cta_style: data.cta_style || '',
    why_good: data.why_good || '',
    what_to_learn: data.what_to_learn || '',
    what_not_to_copy: data.what_not_to_copy || '',
    how_to_adapt_for_factory: data.how_to_adapt_for_factory || '',
    transferable_points: data.transferable_points || '',
    adaptation_method: data.adaptation_method || '',
    adaptation_risk: data.adaptation_risk || '',
    soft_packaging_version: data.soft_packaging_version || '',
    transfer_difficulty: data.transfer_difficulty || 'medium',
    b2b_fit_score: data.b2b_fit_score ?? 0,
    packaging_fit_score: data.packaging_fit_score ?? 0,
    visual_score: data.visual_score ?? 0,
    hook_score: data.hook_score ?? 0,
    adaptation_score: data.adaptation_score ?? 0,
    transfer_score: data.transfer_score ?? 0,
    total_score: totalScore,
    value_level: valueLevel,
    status: data.status || 'pending',
    created_at: now,
    updated_at: now,
  };
  db.inspiration_videos.push(row);
  saveDb();
  return id;
}

export function updateInspirationVideo(id: number, data: Record<string, unknown>): boolean {
  const db = loadDb();
  const idx = db.inspiration_videos.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  const existing = db.inspiration_videos[idx];
  const merged: Record<string, unknown> = { ...existing, ...data, id, updated_at: new Date().toISOString() };
  merged.total_score = computeTotalScore(merged);
  merged.value_level = computeValueLevel(merged.total_score as number);
  db.inspiration_videos[idx] = merged;
  saveDb();
  return true;
}

export function deleteInspirationVideo(id: number): boolean {
  const db = loadDb();
  const idx = db.inspiration_videos.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.inspiration_videos.splice(idx, 1);
  saveDb();
  return true;
}

function computeTotalScore(data: Record<string, unknown>): number {
  return (
    (Number(data.hook_score) || 0) +
    (Number(data.visual_score) || 0) +
    (Number(data.b2b_fit_score) || 0) +
    (Number(data.packaging_fit_score) || 0) +
    (Number(data.adaptation_score) || 0) +
    (Number(data.transfer_score) || 0)
  );
}

function computeValueLevel(total: number): string {
  if (total >= 28) return 'high';
  if (total >= 21) return 'medium';
  return 'low';
}

// Daily Hot Videos
export function getDailyHotVideos(filters?: {
  date?: string;
  country?: string;
  source_type?: string;
  confidence_level?: string;
  verification_status?: string;
  reference_industry?: string;
  video_type?: string;
  added_to_inspiration?: string;
  search?: string;
}): Record<string, unknown>[] {
  const db = loadDb();
  let rows = [...db.daily_hot_videos].reverse();
  if (filters?.date) rows = rows.filter((r) => r.collected_date === filters.date);
  if (filters?.country) rows = rows.filter((r) => r.country === filters.country);
  if (filters?.source_type) rows = rows.filter((r) => r.source_type === filters.source_type);
  if (filters?.confidence_level) rows = rows.filter((r) => r.confidence_level === filters.confidence_level);
  if (filters?.verification_status) rows = rows.filter((r) => r.verification_status === filters.verification_status);
  if (filters?.reference_industry) rows = rows.filter((r) => r.reference_industry === filters.reference_industry);
  if (filters?.video_type) rows = rows.filter((r) => r.video_type === filters.video_type);
  if (filters?.added_to_inspiration === 'true') rows = rows.filter((r) => r.can_add_to_inspiration === true);
  if (filters?.added_to_inspiration === 'false') rows = rows.filter((r) => r.can_add_to_inspiration !== true);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter((r) =>
      String(r.keyword || '').toLowerCase().includes(q) ||
      String(r.hashtag || '').toLowerCase().includes(q) ||
      String(r.title_or_caption || '').toLowerCase().includes(q) ||
      String(r.creator_name || '').toLowerCase().includes(q) ||
      String(r.source_name || '').toLowerCase().includes(q) ||
      String(r.user_note || '').toLowerCase().includes(q)
    );
  }
  return rows;
}

export function getDailyHotVideoById(id: number): Record<string, unknown> | undefined {
  const db = loadDb();
  return db.daily_hot_videos.find((r) => r.id === id);
}

export function addDailyHotVideo(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.daily_hot_videos++;
  const now = new Date().toISOString();
  const row = {
    id,
    collected_date: data.collected_date || new Date().toISOString().split('T')[0],
    collected_at: now,
    platform: data.platform || 'TikTok',
    source_type: data.source_type || 'Manual Input',
    source_name: data.source_name || '',
    source_url: data.source_url || '',
    video_url: data.video_url || '',
    search_url: data.search_url || '',
    country: data.country || 'EU',
    region: data.region || '',
    keyword: data.keyword || '',
    hashtag: data.hashtag || '',
    title_or_caption: data.title_or_caption || '',
    creator_name: data.creator_name || '',
    reference_industry: data.reference_industry || 'flexible packaging',
    video_type: data.video_type || 'other',
    product_relevance: data.product_relevance || '',
    trend_reason: data.trend_reason || '',
    heat_evidence: data.heat_evidence || '',
    rank_position: data.rank_position ?? 0,
    views_count: data.views_count ?? 0,
    likes_count: data.likes_count ?? 0,
    comments_count: data.comments_count ?? 0,
    shares_count: data.shares_count ?? 0,
    confidence_level: data.confidence_level || 'medium',
    verification_status: data.verification_status || 'unverified',
    verified_by_user: data.verified_by_user || false,
    user_note: data.user_note || '',
    ai_summary: data.ai_summary || '',
    why_worth_watching: data.why_worth_watching || '',
    what_to_observe: data.what_to_observe || '',
    can_add_to_inspiration: data.can_add_to_inspiration || false,
    created_at: now,
    updated_at: now,
  };
  db.daily_hot_videos.push(row);
  saveDb();
  return id;
}

export function updateDailyHotVideo(id: number, data: Record<string, unknown>): boolean {
  const db = loadDb();
  const idx = db.daily_hot_videos.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  const existing = db.daily_hot_videos[idx];
  const merged = { ...existing, ...data, id, updated_at: new Date().toISOString() };
  db.daily_hot_videos[idx] = merged;
  saveDb();
  return true;
}

export function deleteDailyHotVideo(id: number): boolean {
  const db = loadDb();
  const idx = db.daily_hot_videos.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.daily_hot_videos.splice(idx, 1);
  saveDb();
  return true;
}

export function generateDailyChecklist(date: string): Record<string, unknown>[] {
  const db = loadDb();
  const existing = db.daily_hot_videos.filter((r) => r.collected_date === date);
  if (existing.length > 0) return [];

  const now = new Date().toISOString();
  const items: Record<string, unknown>[] = [];

  // A. TikTok Creative Center entries
  const ccCountries = ['UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Poland'];
  const ccKeywords = [
    { kw: 'packaging', label: 'packaging' },
    { kw: 'food packaging', label: 'food packaging' },
    { kw: 'packaging factory', label: 'packaging factory' },
    { kw: 'custom packaging', label: 'custom packaging' },
    { kw: 'flexible packaging', label: 'flexible packaging' },
    { kw: 'pet food packaging', label: 'pet food packaging' },
    { kw: 'factory production', label: 'factory production' },
    { kw: 'how it is made', label: "how it's made" },
    { kw: 'packaging process', label: 'packaging process' },
    { kw: 'packaging test', label: 'packaging test' },
  ];

  for (const country of ccCountries) {
    const encoded = encodeURIComponent(ccKeywords[0].kw);
    const id = db.nextIds.daily_hot_videos++;
    items.push({
      id,
      collected_date: date,
      collected_at: now,
      platform: 'TikTok',
      source_type: 'TikTok Creative Center',
      source_name: `TikTok Creative Center - ${country}`,
      source_url: `https://ads.tiktok.com/business/creativecenter/inspiration/popular/pc/en`,
      video_url: '',
      search_url: '',
      country,
      region: 'Europe',
      keyword: ccKeywords.map((k) => k.kw).join(', '),
      hashtag: '',
      title_or_caption: `TikTok Creative Center 官方趋势 - ${country}`,
      creator_name: '',
      reference_industry: 'flexible packaging',
      video_type: 'trend overview',
      product_relevance: '可查看当前市场热门话题和创意方向',
      trend_reason: 'TikTok 官方趋势发现工具，展示各市场热门内容',
      heat_evidence: '官方趋势入口',
      rank_position: 0,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      confidence_level: 'high',
      verification_status: 'unverified',
      verified_by_user: false,
      user_note: '',
      ai_summary: '',
      why_worth_watching: '官方趋势入口，可信度高，可了解当前市场热门方向',
      what_to_observe: '关注 packaging、factory、manufacturing 相关话题的热度变化',
      can_add_to_inspiration: false,
      created_at: now,
      updated_at: now,
    });
  }

  // B. TikTok Search entries
  const searchKeywords = [
    'food packaging',
    'flexible packaging',
    'packaging factory',
    'packaging machinery',
    'factory production process',
    'injection molding factory',
    'printing factory',
    'label printing process',
    'food factory production',
    'pet food factory',
    'packaging test',
    'sealing test packaging',
    'satisfying packaging',
    'packing orders',
    'packaging mistakes',
    'before and after packaging',
    'custom packaging factory',
    'export factory',
  ];

  for (const kw of searchKeywords) {
    const encoded = encodeURIComponent(kw);
    const id = db.nextIds.daily_hot_videos++;
    items.push({
      id,
      collected_date: date,
      collected_at: now,
      platform: 'TikTok',
      source_type: 'TikTok Search',
      source_name: `TikTok 搜索: ${kw}`,
      source_url: '',
      video_url: '',
      search_url: `https://www.tiktok.com/search?q=${encoded}`,
      country: 'EU',
      region: 'Europe',
      keyword: kw,
      hashtag: '',
      title_or_caption: `TikTok 搜索入口: ${kw}`,
      creator_name: '',
      reference_industry: 'flexible packaging',
      video_type: 'trend overview',
      product_relevance: '搜索结果可发现相关行业热门视频',
      trend_reason: 'TikTok 搜索入口，可人工查看当前搜索结果中的热门内容',
      heat_evidence: 'TikTok 搜索结果入口',
      rank_position: 0,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      confidence_level: 'medium',
      verification_status: 'unverified',
      verified_by_user: false,
      user_note: '',
      ai_summary: '',
      why_worth_watching: '搜索入口，需人工打开查看当前搜索结果中的热门视频',
      what_to_observe: '查看搜索结果前列视频的播放量、内容形式和拍摄手法',
      can_add_to_inspiration: false,
      created_at: now,
      updated_at: now,
    });
  }

  // C. B2B manufacturing cross-industry search
  const b2bKeywords = [
    'injection molding process',
    'metal stamping factory',
    'cosmetics production line',
    'electronics assembly factory',
    'warehouse logistics process',
    'food production line',
    'printing press operation',
    'label manufacturing process',
  ];

  for (const kw of b2bKeywords) {
    const encoded = encodeURIComponent(kw);
    const id = db.nextIds.daily_hot_videos++;
    items.push({
      id,
      collected_date: date,
      collected_at: now,
      platform: 'TikTok',
      source_type: 'TikTok Search',
      source_name: `B2B制造业搜索: ${kw}`,
      source_url: '',
      video_url: '',
      search_url: `https://www.tiktok.com/search?q=${encoded}`,
      country: 'EU',
      region: 'Global',
      keyword: kw,
      hashtag: '',
      title_or_caption: `B2B制造业参考搜索: ${kw}`,
      creator_name: '',
      reference_industry: 'other b2b manufacturing',
      video_type: 'trend overview',
      product_relevance: '跨行业参考，可学习其他B2B行业的短视频拍摄方法',
      trend_reason: 'B2B制造业跨行业参考入口',
      heat_evidence: 'TikTok 搜索结果入口',
      rank_position: 0,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      confidence_level: 'medium',
      verification_status: 'unverified',
      verified_by_user: false,
      user_note: '',
      ai_summary: '',
      why_worth_watching: '跨行业B2B制造业参考，可学习其他行业的视频拍摄方法并迁移到软包装',
      what_to_observe: '关注视频结构、Hook方式、镜头语言和CTA设计',
      can_add_to_inspiration: false,
      created_at: now,
      updated_at: now,
    });
  }

  // D. Competitor accounts
  const competitors = db.competitors;
  for (const comp of competitors) {
    const id = db.nextIds.daily_hot_videos++;
    items.push({
      id,
      collected_date: date,
      collected_at: now,
      platform: comp.platform || 'TikTok',
      source_type: 'Competitor Account',
      source_name: `竞争对手: ${comp.account_name}`,
      source_url: comp.profile_url || '',
      video_url: '',
      search_url: '',
      country: comp.country || 'EU',
      region: 'Europe',
      keyword: String(comp.product_focus || ''),
      hashtag: '',
      title_or_caption: `待观察竞争对手: ${comp.account_name}`,
      creator_name: String(comp.account_name || ''),
      reference_industry: 'flexible packaging',
      video_type: 'competitor content',
      product_relevance: '竞争对手账号，需人工打开查看最新内容',
      trend_reason: '已保存的竞争对手账号，定期观察其内容策略',
      heat_evidence: '竞争对手账号待观察',
      rank_position: 0,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      confidence_level: 'medium',
      verification_status: 'unverified',
      verified_by_user: false,
      user_note: '',
      ai_summary: '',
      why_worth_watching: `竞争对手 ${comp.account_name} 的内容策略观察`,
      what_to_observe: `关注其内容形式、发布频率、互动数据和内容方向`,
      can_add_to_inspiration: false,
      created_at: now,
      updated_at: now,
    });
  }

  // Save all items
  for (const item of items) {
    db.daily_hot_videos.push(item);
  }
  saveDb();

  return items;
}

// Account Update Logs
export function getAccountUpdateLogs(filters?: { competitor_id?: number; date?: string }): Record<string, unknown>[] {
  const db = loadDb();
  let rows = [...db.account_update_logs].reverse();
  if (filters?.competitor_id) rows = rows.filter((r) => r.competitor_id === filters.competitor_id);
  if (filters?.date) rows = rows.filter((r) => r.log_date === filters.date);
  return rows.map((r) => {
    const comp = db.competitors.find((c) => c.id === r.competitor_id);
    return { ...r, account_name: comp?.account_name || null, platform: comp?.platform || null };
  });
}

export function addAccountUpdateLog(data: Record<string, unknown>): number {
  const db = loadDb();
  const id = db.nextIds.account_update_logs++;
  const now = new Date().toISOString();
  const row = {
    id,
    competitor_id: data.competitor_id || null,
    log_date: data.log_date || new Date().toISOString().split('T')[0],
    content_summary: data.content_summary || '',
    new_video_count: data.new_video_count ?? 0,
    content_direction: data.content_direction || '',
    notable_videos: data.notable_videos || '',
    user_note: data.user_note || '',
    created_at: now,
  };
  db.account_update_logs.push(row);
  saveDb();
  return id;
}

export function deleteAccountUpdateLog(id: number): boolean {
  const db = loadDb();
  const idx = db.account_update_logs.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.account_update_logs.splice(idx, 1);
  saveDb();
  return true;
}

// Weekly Report
export function generateWeeklyReport(): Record<string, unknown> {
  const db = loadDb();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  const hotVideos = db.daily_hot_videos.filter((r) => String(r.collected_date || '') >= weekAgoStr);
  const useful = hotVideos.filter((r) => r.verification_status === 'useful');
  const inspirations = db.inspiration_videos.filter((r) => String(r.created_at || '') >= weekAgo.toISOString());
  const recommendations = db.recommendations.filter((r) => String(r.date || '') >= weekAgoStr);
  const performance = db.performance.filter((r) => String(r.publish_date || '') >= weekAgoStr);

  const totalViews = performance.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const totalLikes = performance.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);

  return {
    period: { from: weekAgoStr, to: todayStr },
    hot_videos_collected: hotVideos.length,
    hot_videos_verified_useful: useful.length,
    new_inspirations: inspirations.length,
    new_recommendations: recommendations.length,
    published_videos: performance.length,
    total_views: totalViews,
    total_likes: totalLikes,
    top_useful_videos: useful.slice(0, 5).map((v) => ({
      id: v.id,
      keyword: v.keyword,
      source_type: v.source_type,
      why_worth_watching: v.why_worth_watching,
    })),
  };
}
