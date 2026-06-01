export interface Trend {
  id: number;
  date: string;
  country: string;
  trend_type: string;
  keyword: string;
  source: string;
  description: string;
  heat_score: number;
  b2b_fit_score: number;
  packaging_fit_score: number;
  created_at: string;
}

export interface Recommendation {
  id: number;
  date: string;
  title_en: string;
  title_cn: string;
  product_type: string;
  target_market: string;
  target_customer: string;
  hook: string;
  script_en: string;
  shot_list: string;
  shot_list_cn: string;
  caption: string;
  hashtags: string;
  cta: string;
  priority: number;
  difficulty: string;
  platforms: string;
  status: string;
  created_at: string;
}

export interface Competitor {
  id: number;
  platform: string;
  account_name: string;
  profile_url: string;
  country: string;
  product_focus: string;
  content_style: string;
  notes: string;
  created_at: string;
}

export interface Performance {
  id: number;
  recommendation_id: number | null;
  platform: string;
  publish_date: string;
  video_url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  inquiries: number;
  notes: string;
  created_at: string;
}

export const PRODUCT_TYPES = [
  'retort pouch',
  'flat bottom pouch',
  'quad seal pouch',
  'bag in box',
  'pet food packaging',
  'spout pouch',
  'stand up pouch',
] as const;

export const PRODUCT_LABELS: Record<string, string> = {
  'retort pouch': '蒸煮袋 Retort Pouch',
  'flat bottom pouch': '平底袋 Flat Bottom Pouch',
  'quad seal pouch': '四边封袋 Quad Seal Pouch',
  'bag in box': '盒中袋 Bag in Box',
  'pet food packaging': '宠物食品包装 Pet Food Packaging',
  'spout pouch': '吸嘴袋 Spout Pouch',
  'stand up pouch': '自立袋 Stand Up Pouch',
};

export const MARKETS = [
  'UK',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Poland',
] as const;

export const MARKET_LABELS: Record<string, string> = {
  'UK': '英国 UK',
  'Germany': '德国 Germany',
  'France': '法国 France',
  'Italy': '意大利 Italy',
  'Spain': '西班牙 Spain',
  'Netherlands': '荷兰 Netherlands',
  'Poland': '波兰 Poland',
  'EU': '欧洲综合 EU',
};

export const TREND_TYPES = [
  'hashtag',
  'sound',
  'video format',
  'industry topic',
  'competitor topic',
] as const;

export const TREND_TYPE_LABELS: Record<string, string> = {
  'hashtag': '话题标签 Hashtag',
  'sound': '热门声音 Sound',
  'video format': '视频形式 Video Format',
  'industry topic': '行业话题 Industry Topic',
  'competitor topic': '竞争对手内容 Competitor Topic',
};

export const STATUS_LABELS: Record<string, string> = {
  'draft': '未拍摄',
  'filmed': '已拍摄',
  'published': '已发布',
  'reviewed': '已复盘',
};

export const DIFFICULTY_LABELS: Record<string, { text: string; cls: string }> = {
  'easy': { text: '简单', cls: 'badge-green' },
  'medium': { text: '一般', cls: 'badge-yellow' },
  'hard': { text: '较难', cls: 'badge-red' },
};

export const PRIORITY_LABELS: Record<number, { text: string; cls: string }> = {
  1: { text: '高', cls: 'badge-red' },
  2: { text: '中', cls: 'badge-yellow' },
  3: { text: '低', cls: 'badge-gray' },
};

export const PLATFORM_LABELS: Record<string, string> = {
  'TikTok': 'TikTok',
  'Reels': 'Instagram Reels',
  'Shorts': 'YouTube Shorts',
  'LinkedIn': 'LinkedIn',
};

// --- Inspiration Videos ---

export interface InspirationVideo {
  id: number;
  platform: string;
  video_url: string;
  account_name: string;
  country: string;
  language: string;
  reference_industry: string;
  video_type: string;
  product_type: string;
  title_or_note: string;
  first_second_hook: string;
  main_visual: string;
  hook_style: string;
  shot_style: string;
  subtitle_style: string;
  editing_style: string;
  cta_style: string;
  why_good: string;
  what_to_learn: string;
  what_not_to_copy: string;
  how_to_adapt_for_factory: string;
  transferable_points: string;
  adaptation_method: string;
  adaptation_risk: string;
  soft_packaging_version: string;
  transfer_difficulty: string;
  b2b_fit_score: number;
  packaging_fit_score: number;
  visual_score: number;
  hook_score: number;
  adaptation_score: number;
  transfer_score: number;
  total_score: number;
  value_level: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const INSPIRATION_PLATFORMS = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
  'Facebook Reels',
] as const;

export const INSPIRATION_PLATFORM_LABELS: Record<string, string> = {
  'TikTok': 'TikTok',
  'Instagram Reels': 'Instagram Reels',
  'YouTube Shorts': 'YouTube Shorts',
  'Facebook Reels': 'Facebook Reels',
};

export const REFERENCE_INDUSTRIES = [
  'flexible packaging',
  'packaging machinery',
  'printing',
  'label paper packaging',
  'injection molding',
  'metal parts',
  'food factory',
  'pet food factory',
  'cosmetics factory',
  'electronics manufacturing',
  'logistics warehouse',
  'industrial supplier',
  'export factory',
  'other b2b manufacturing',
] as const;

export const REFERENCE_INDUSTRY_LABELS: Record<string, string> = {
  'flexible packaging': '软包装 Flexible Packaging',
  'packaging machinery': '包装机械 Packaging Machinery',
  'printing': '印刷 Printing',
  'label paper packaging': '标签/纸盒 Label & Paper Packaging',
  'injection molding': '注塑/模具 Injection Molding',
  'metal parts': '五金加工 Metal Parts',
  'food factory': '食品工厂 Food Factory',
  'pet food factory': '宠物食品工厂 Pet Food Factory',
  'cosmetics factory': '化妆品工厂 Cosmetics Factory',
  'electronics manufacturing': '电子元件 Electronics Manufacturing',
  'logistics warehouse': '物流/仓储 Logistics & Warehouse',
  'industrial supplier': '工业品供应 Industrial Supplier',
  'export factory': '外贸工厂 Export Factory',
  'other b2b manufacturing': '其他 B2B制造业 Other B2B Manufacturing',
};

export const TRANSFER_DIFFICULTY_LABELS: Record<string, { text: string; cls: string }> = {
  'easy': { text: '简单', cls: 'badge-green' },
  'medium': { text: '中等', cls: 'badge-yellow' },
  'hard': { text: '较难', cls: 'badge-red' },
};

export const INSPIRATION_VIDEO_TYPES = [
  'factory showcase',
  'production process',
  'product showcase',
  'test experiment',
  'packaging knowledge',
  'problem comparison',
  'customer pain point',
  'asmr satisfying',
  'packing shipping',
  'exhibition content',
  'other',
] as const;

export const INSPIRATION_VIDEO_TYPE_LABELS: Record<string, string> = {
  'factory showcase': '工厂展示',
  'production process': '生产过程',
  'product showcase': '产品展示',
  'test experiment': '测试实验',
  'packaging knowledge': '包装知识',
  'problem comparison': '问题对比',
  'customer pain point': '客户痛点',
  'asmr satisfying': 'ASMR/Satisfying',
  'packing shipping': '打包发货',
  'exhibition content': '展会内容',
  'other': '其他',
};

export const INSPIRATION_PRODUCT_TYPES = [
  'retort pouch',
  'flat bottom pouch',
  'quad seal pouch',
  'bag in box',
  'pet food packaging',
  'dry pet food packaging',
  'wet pet food packaging',
  'spout pouch',
  'stand up pouch',
  'custom flexible packaging',
] as const;

export const INSPIRATION_PRODUCT_LABELS: Record<string, string> = {
  'retort pouch': '蒸煮袋 Retort Pouch',
  'flat bottom pouch': '平底袋 Flat Bottom Pouch',
  'quad seal pouch': '四边封袋 Quad Seal Pouch',
  'bag in box': '盒中袋 Bag in Box',
  'pet food packaging': '宠物食品包装 Pet Food Packaging',
  'dry pet food packaging': '干宠物食品包装 Dry Pet Food Packaging',
  'wet pet food packaging': '湿宠物食品包装 Wet Pet Food Packaging',
  'spout pouch': '吸嘴袋 Spout Pouch',
  'stand up pouch': '自立袋 Stand Up Pouch',
  'custom flexible packaging': '定制软包装 Custom Flexible Packaging',
};

export const INSPIRATION_STATUS_LABELS: Record<string, string> = {
  'pending': '待观察',
  'watched': '已观看',
  'analyzed': '已拆解',
  'adaptable': '可改编',
  'adapted': '已生成改编方案',
  'filmed': '已拍摄',
  'not_suitable': '不适合',
};

export const VALUE_LEVEL_LABELS: Record<string, { text: string; cls: string }> = {
  'high': { text: '高价值参考', cls: 'badge-green' },
  'medium': { text: '可参考', cls: 'badge-yellow' },
  'low': { text: '暂不优先', cls: 'badge-gray' },
};

export const HOOK_STYLES = [
  '问题型',
  '数字型',
  '对比型',
  '悬念型',
  '直接展示',
  '痛点型',
] as const;

export const SHOT_STYLES = [
  '近景特写',
  '中景展示',
  '远景全景',
  '手部动作',
  '多角度切换',
  '固定机位',
  '移动跟拍',
] as const;

export const SUBTITLE_STYLES = [
  '问题型',
  '知识型',
  '过程型',
  '销售型',
] as const;

export const EDITING_STYLES = [
  '快剪',
  '慢展示',
  '节奏感强',
  '平稳过渡',
] as const;

export const CTA_STYLES = [
  '强销售',
  '轻引导',
  '互动型',
  '信息型',
] as const;

// --- Daily Hot Videos ---

export interface DailyHotVideo {
  id: number;
  collected_date: string;
  collected_at: string;
  platform: string;
  source_type: string;
  source_name: string;
  source_url: string;
  video_url: string;
  search_url: string;
  country: string;
  region: string;
  keyword: string;
  hashtag: string;
  title_or_caption: string;
  creator_name: string;
  reference_industry: string;
  video_type: string;
  product_relevance: string;
  trend_reason: string;
  heat_evidence: string;
  rank_position: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  confidence_level: string;
  verification_status: string;
  verified_by_user: boolean;
  user_note: string;
  ai_summary: string;
  why_worth_watching: string;
  what_to_observe: string;
  can_add_to_inspiration: boolean;
  created_at: string;
  updated_at: string;
}

export const SOURCE_TYPES = [
  'TikTok Creative Center',
  'TikTok Search',
  'TikTok Hashtag Page',
  'TikTok Account',
  'Google Trends',
  'Manual Input',
  'Competitor Account',
  'Other B2B Source',
  'AI Suggested Only',
] as const;

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  'TikTok Creative Center': 'TikTok Creative Center 官方趋势',
  'TikTok Search': 'TikTok 搜索入口',
  'TikTok Hashtag Page': 'TikTok 标签页',
  'TikTok Account': 'TikTok 账号',
  'Google Trends': 'Google Trends 趋势',
  'Manual Input': '手动录入',
  'Competitor Account': '竞争对手账号',
  'Other B2B Source': '其他B2B来源',
  'AI Suggested Only': 'AI推测方向',
};

export const CONFIDENCE_LEVELS = [
  'high',
  'medium',
  'low',
] as const;

export const CONFIDENCE_LABELS: Record<string, { text: string; cls: string }> = {
  'high': { text: '高', cls: 'badge-green' },
  'medium': { text: '中', cls: 'badge-yellow' },
  'low': { text: '低', cls: 'badge-red' },
};

export const VERIFICATION_STATUSES = [
  'unverified',
  'opened',
  'verified',
  'useful',
  'not_useful',
  'invalid',
] as const;

export const VERIFICATION_STATUS_LABELS: Record<string, { text: string; cls: string }> = {
  'unverified': { text: '未验证', cls: 'badge-gray' },
  'opened': { text: '已打开查看', cls: 'badge-yellow' },
  'verified': { text: '已确认真实', cls: 'badge-green' },
  'useful': { text: '值得参考', cls: 'badge-green' },
  'not_useful': { text: '不值得参考', cls: 'badge-gray' },
  'invalid': { text: '链接失效', cls: 'badge-red' },
};

export const HEAT_EVIDENCE_TYPES = [
  '官方趋势入口',
  'TikTok 搜索结果入口',
  '用户手动发现',
  '竞争对手账号待观察',
  'Google Trends 辅助趋势',
  'AI 生成的观察方向，未验证',
] as const;

export const DAILY_COUNTRIES = [
  'UK',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Poland',
  'EU',
] as const;

export const DAILY_PLATFORMS = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
  'Google Trends',
] as const;

export const DAILY_VIDEO_TYPES = [
  'factory showcase',
  'production process',
  'product showcase',
  'test experiment',
  'packaging knowledge',
  'problem comparison',
  'customer pain point',
  'asmr satisfying',
  'packing shipping',
  'exhibition content',
  'trend overview',
  'competitor content',
  'other',
] as const;

export const DAILY_VIDEO_TYPE_LABELS: Record<string, string> = {
  'factory showcase': '工厂展示',
  'production process': '生产过程',
  'product showcase': '产品展示',
  'test experiment': '测试实验',
  'packaging knowledge': '包装知识',
  'problem comparison': '问题对比',
  'customer pain point': '客户痛点',
  'asmr satisfying': 'ASMR/Satisfying',
  'packing shipping': '打包发货',
  'exhibition content': '展会内容',
  'trend overview': '趋势总览',
  'competitor content': '竞争对手内容',
  'other': '其他',
};
