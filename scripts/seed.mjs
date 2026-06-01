import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;
if (fs.existsSync(DB_PATH)) {
  db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
} else {
  db = { trends: [], recommendations: [], competitors: [], performance: [], inspiration_videos: [], daily_hot_videos: [], account_update_logs: [], nextIds: { trends: 1, recommendations: 1, competitors: 1, performance: 1, inspiration_videos: 1, daily_hot_videos: 1, account_update_logs: 1 } };
}
// Migration
if (!db.inspiration_videos) db.inspiration_videos = [];
if (!db.nextIds.inspiration_videos) db.nextIds.inspiration_videos = 1;
if (!db.daily_hot_videos) db.daily_hot_videos = [];
if (!db.nextIds.daily_hot_videos) db.nextIds.daily_hot_videos = 1;
if (!db.account_update_logs) db.account_update_logs = [];
if (!db.nextIds.account_update_logs) db.nextIds.account_update_logs = 1;

const today = new Date().toISOString().split('T')[0];

const seedTrends = [
  { country: 'EU', type: 'hashtag', keyword: '#petfoodpackaging', desc: '宠物食品包装趋势持续增长', heat: 85, b2b: 90, pack: 95 },
  { country: 'UK', type: 'video format', keyword: 'factory tour', desc: '工厂幕后花絮视频热度上升', heat: 78, b2b: 85, pack: 80 },
  { country: 'Germany', type: 'industry topic', keyword: 'sustainable packaging', desc: '品牌方寻找环保包装方案', heat: 82, b2b: 75, pack: 85 },
  { country: 'France', type: 'hashtag', keyword: '#packagingdesign', desc: '创意包装设计内容受欢迎', heat: 70, b2b: 65, pack: 90 },
  { country: 'Netherlands', type: 'sound', keyword: 'satisfying packaging', desc: 'ASMR 风格包装内容热度高', heat: 88, b2b: 50, pack: 70 },
  { country: 'Italy', type: 'competitor topic', keyword: 'food packaging supplier', desc: '品牌搜索包装供应商', heat: 72, b2b: 95, pack: 90 },
  { country: 'Spain', type: 'video format', keyword: 'how it is made', desc: '生产流程视频受欢迎', heat: 80, b2b: 80, pack: 75 },
  { country: 'Poland', type: 'hashtag', keyword: '#flexiblepackaging', desc: '软包装行业关注度增长', heat: 65, b2b: 85, pack: 90 },
  { country: 'EU', type: 'industry topic', keyword: 'stand up pouch', desc: '自立袋搜索量增加', heat: 75, b2b: 90, pack: 95 },
  { country: 'UK', type: 'video format', keyword: 'packaging comparison', desc: '包装质量对比视频热度上升', heat: 73, b2b: 80, pack: 85 },
];

for (const t of seedTrends) {
  db.trends.push({
    id: db.nextIds.trends++,
    date: today,
    country: t.country,
    trend_type: t.type,
    keyword: t.keyword,
    source: 'seed',
    description: t.desc,
    heat_score: t.heat,
    b2b_fit_score: t.b2b,
    packaging_fit_score: t.pack,
    created_at: new Date().toISOString(),
  });
}

const seedCompetitors = [
  { platform: 'TikTok', name: '@packagingpro', url: '', country: 'UK', focus: 'flexible packaging', style: 'factory tours', notes: '工厂内容互动率高' },
  { platform: 'TikTok', name: '@petfoodbags', url: '', country: 'Germany', focus: 'pet food packaging', style: 'product demos', notes: '专注自立袋展示' },
  { platform: 'TikTok', name: '@foodpackfactory', url: '', country: 'Netherlands', focus: 'food packaging', style: 'satisfying videos', notes: '生产流程视频播放量高' },
  { platform: 'Instagram', name: '@flexiblepackaging', url: '', country: 'France', focus: 'custom packaging', style: 'design showcase', notes: '高端品牌风格' },
];

for (const c of seedCompetitors) {
  db.competitors.push({
    id: db.nextIds.competitors++,
    platform: c.platform,
    account_name: c.name,
    profile_url: c.url,
    country: c.country,
    product_focus: c.focus,
    content_style: c.style,
    notes: c.notes,
    created_at: new Date().toISOString(),
  });
}

// 用户指定的 3 条示例选题
const seedRecommendations = [
  {
    date: today,
    title_en: 'How we make custom pet food packaging with flat bottom pouches',
    title_cn: '我们如何生产定制宠物食品平底袋包装',
    product_type: 'flat bottom pouch',
    target_market: 'Germany',
    target_customer: 'pet food brands, premium pet food companies, co-packers',
    hook: 'Your pet food deserves packaging that keeps it fresh and looks great on the shelf.',
    script_en: 'When choosing flat bottom pouches for pet food, brands in Germany care about three things: material quality, print accuracy, and reliable sealing. We test every batch before it ships to make sure your product is protected. Custom flat bottom pouches with strong sealing, high barrier materials, and brand-quality printing help your product stand out.',
    shot_list: JSON.stringify([
      'Show flat bottom pouch close-up',
      'Show printing process on machine',
      'Show zipper and seal detail',
      'Show pouch being filled with pet food',
      'Show finished product on shelf',
    ]),
    shot_list_cn: JSON.stringify([
      '展示平底袋特写',
      '展示印刷机印刷过程',
      '展示拉链和封口细节',
      '展示袋子灌装宠物食品',
      '展示成品在货架上的效果',
    ]),
    caption: 'Custom flat bottom pouches for pet food brands in Germany. Strong sealing, high barrier, shelf-ready. DM for samples!',
    hashtags: '#petfoodpackaging #flatbottompouch #flexiblepackaging #packagingmanufacturer #petfoodbrand',
    cta: 'Comment SAMPLE to get free pouch samples shipped to your door.',
    priority: 1,
    difficulty: 'medium',
    platforms: 'TikTok',
    status: 'draft',
  },
  {
    date: today,
    title_en: 'Retort pouch production process: from raw material to finished bag',
    title_cn: '蒸煮袋生产流程：从原材料到成品袋',
    product_type: 'retort pouch',
    target_market: 'UK',
    target_customer: 'ready meal brands, soup manufacturers, food processors',
    hook: 'Ever wonder how retort pouches survive 121 degrees Celsius? Here is the process.',
    script_en: 'This is how we make custom retort pouches. From material selection to printing, lamination, bag making, and quality inspection, every step is controlled in our factory. Retort pouches must withstand high-temperature sterilization while keeping food safe and fresh. We use multi-layer film structures designed for maximum barrier performance.',
    shot_list: JSON.stringify([
      'Show factory exterior',
      'Show raw material film rolls',
      'Show printing machine in action',
      'Show lamination process',
      'Show bag making machine',
      'Show retort test chamber',
      'Show finished retort pouches packed',
    ]),
    shot_list_cn: JSON.stringify([
      '展示工厂外观',
      '展示原材料薄膜卷',
      '展示印刷机运转',
      '展示复合工艺',
      '展示制袋机',
      '展示蒸煮测试舱',
      '展示成品蒸煮袋打包',
    ]),
    caption: 'From raw material to finished retort pouch. Every step quality-controlled in our factory. DM for MOQ and pricing!',
    hashtags: '#retrouchpouch #foodpackaging #packagingfactory #flexiblepackaging #readyMealpackaging',
    cta: 'Drop a comment if you want to see our full quality test process.',
    priority: 1,
    difficulty: 'hard',
    platforms: 'TikTok',
    status: 'draft',
  },
  {
    date: today,
    title_en: 'Bag in box packaging for European wine and juice brands',
    title_cn: '面向欧洲葡萄酒和果汁品牌的盒中袋包装',
    product_type: 'bag in box',
    target_market: 'France',
    target_customer: 'wine producers, juice brands, beverage companies',
    hook: 'Bag in box packaging is trending in Europe. Here is why brands are switching.',
    script_en: 'European brands need packaging that works with their filling machines, protects the product, and looks great on the shelf. That is exactly what our bag in box packaging is designed for. The inner bag keeps the product fresh after opening, while the outer box provides excellent branding space. Perfect for wine, juice, and liquid food products.',
    shot_list: JSON.stringify([
      'Show bag in box product close-up',
      'Show inner bag structure',
      'Show filling valve detail',
      'Show box printing and assembly',
      'Show final product being used',
    ]),
    shot_list_cn: JSON.stringify([
      '展示盒中袋产品特写',
      '展示内袋结构',
      '展示灌装阀细节',
      '展示纸盒印刷和组装',
      '展示最终产品使用场景',
    ]),
    caption: 'Bag in box packaging for wine and juice. Keeps products fresh, reduces waste, and maximizes shelf impact.',
    hashtags: '#baginbox #winepackaging #juicepackaging #sustainablepackaging #flexiblepackaging',
    cta: 'Send us a DM for custom bag in box solutions for your brand.',
    priority: 2,
    difficulty: 'medium',
    platforms: 'TikTok',
    status: 'draft',
  },
];

for (const r of seedRecommendations) {
  db.recommendations.push({
    id: db.nextIds.recommendations++,
    ...r,
    created_at: new Date().toISOString(),
  });
}

// 示例优秀视频观察记录
const seedInspirations = [
  {
    platform: 'TikTok',
    video_url: '',
    account_name: '@packagingexample1',
    country: 'EU',
    language: 'English',
    reference_industry: 'flexible packaging',
    video_type: 'production process',
    product_type: 'pet food packaging',
    title_or_note: 'flat bottom pouch filling and sealing process',
    first_second_hook: 'Close-up of a flat bottom pouch being filled with dry pet food',
    main_visual: 'Factory production line with bags moving on conveyor',
    hook_style: '直接展示',
    shot_style: '近景特写',
    subtitle_style: '过程型',
    editing_style: '快剪',
    cta_style: '轻引导',
    why_good: '适合学习生产过程类视频的镜头顺序，可以改编成宠物食品平底袋的灌装、拉链和封口展示',
    what_to_learn: '镜头从空袋到灌装到封口的完整流程，节奏紧凑',
    what_not_to_copy: '不能使用对方工厂画面和客户品牌，只能用我们自己的袋子和工厂重新拍',
    how_to_adapt_for_factory: '用我们自己的平底袋，拍摄空袋展示、倒入干粮、展示拉链、展示封口和多尺寸组合',
    transferable_points: '生产流程类视频的镜头编排方式、从空袋到成品的完整展示逻辑',
    adaptation_method: '用我们自己的平底袋和工厂产线，按照相同镜头顺序重新拍摄',
    adaptation_risk: '低风险，直接使用自有产品和工厂',
    soft_packaging_version: '宠物食品平底袋版本：展示灌装、拉链封口、多规格组合',
    transfer_difficulty: 'easy',
    b2b_fit_score: 4,
    packaging_fit_score: 5,
    visual_score: 4,
    hook_score: 4,
    adaptation_score: 5,
    transfer_score: 4,
    total_score: 26,
    value_level: 'high',
    status: 'analyzed',
  },
  {
    platform: 'TikTok',
    video_url: '',
    account_name: '@packagingexample2',
    country: 'EU',
    language: 'English',
    reference_industry: 'flexible packaging',
    video_type: 'test experiment',
    product_type: 'retort pouch',
    title_or_note: 'food pouch sealing test',
    first_second_hook: 'Hand holding a sealed pouch, pulling the seal apart',
    main_visual: 'Close-up of seal being tested with force',
    hook_style: '悬念型',
    shot_style: '近景特写',
    subtitle_style: '知识型',
    editing_style: '慢展示',
    cta_style: '互动型',
    why_good: '适合学习用测试画面建立信任，可以改编成蒸煮袋封口强度和耐高温应用说明',
    what_to_learn: '用实际测试画面代替文字承诺，更有说服力',
    what_not_to_copy: '不能使用对方的测试设备画面和产品，只能用我们自己的蒸煮袋和测试设备',
    how_to_adapt_for_factory: '用我们自己的蒸煮袋做封口拉力测试、高温蒸煮测试，展示测试前后对比',
    transferable_points: '用测试实验建立产品信任的方法论、近景特写展示质量细节的技巧',
    adaptation_method: '用我们自己的蒸煮袋和测试设备，拍摄封口拉力测试和高温蒸煮测试',
    adaptation_risk: '低风险，使用自有产品和自有测试设备',
    soft_packaging_version: '蒸煮袋耐温测试版本：封口拉力测试、121°C蒸煮测试、前后对比',
    transfer_difficulty: 'easy',
    b2b_fit_score: 5,
    packaging_fit_score: 5,
    visual_score: 4,
    hook_score: 5,
    adaptation_score: 5,
    transfer_score: 5,
    total_score: 29,
    value_level: 'high',
    status: 'analyzed',
  },
  {
    platform: 'TikTok',
    video_url: '',
    account_name: '@packagingexample3',
    country: 'EU',
    language: 'English',
    reference_industry: 'flexible packaging',
    video_type: 'asmr satisfying',
    product_type: 'spout pouch',
    title_or_note: 'satisfying liquid pouch display',
    first_second_hook: 'Slow motion of liquid being poured into a spout pouch',
    main_visual: 'Close-up of spout cap being opened and closed',
    hook_style: '直接展示',
    shot_style: '手部动作',
    subtitle_style: '过程型',
    editing_style: '慢展示',
    cta_style: '轻引导',
    why_good: '适合学习手部动作、近景和重复动作，可以改编成吸嘴袋灌水测试、旋盖展示和站立稳定性展示',
    what_to_learn: '用手部动作和慢镜头创造满足感，重复动作增加记忆点',
    what_not_to_copy: '不能使用对方的液体产品和品牌，只能用清水或我们的样品',
    how_to_adapt_for_factory: '用我们自己的吸嘴袋做灌水测试、旋盖开合展示、倒置不漏测试，配合慢镜头和手部特写',
    transferable_points: 'ASMR风格的手部特写和慢镜头技巧、重复动作创造记忆点的方法',
    adaptation_method: '用我们自己的吸嘴袋，拍摄灌水、旋盖、倒置不漏测试，配合慢镜头手部特写',
    adaptation_risk: '低风险，使用清水和自有产品即可拍摄',
    soft_packaging_version: '吸嘴袋ASMR版本：灌水慢镜头、旋盖开合、倒置不漏、站立稳定性',
    transfer_difficulty: 'easy',
    b2b_fit_score: 3,
    packaging_fit_score: 4,
    visual_score: 5,
    hook_score: 4,
    adaptation_score: 4,
    transfer_score: 3,
    total_score: 23,
    value_level: 'medium',
    status: 'analyzed',
  },
];

for (const v of seedInspirations) {
  const now = new Date().toISOString();
  db.inspiration_videos.push({
    id: db.nextIds.inspiration_videos++,
    ...v,
    created_at: now,
    updated_at: now,
  });
}

// 示例每日热点采集记录
const seedDailyHot = [
  {
    collected_date: today,
    platform: 'TikTok',
    source_type: 'TikTok Creative Center',
    source_name: 'TikTok Creative Center - UK',
    source_url: 'https://ads.tiktok.com/business/creativecenter/inspiration/popular/pc/en',
    video_url: '',
    search_url: '',
    country: 'UK',
    region: 'Europe',
    keyword: 'packaging, food packaging, packaging factory',
    hashtag: '',
    title_or_caption: 'TikTok Creative Center 官方趋势 - UK',
    creator_name: '',
    reference_industry: 'flexible packaging',
    video_type: 'trend overview',
    product_relevance: '可查看UK市场热门话题和创意方向',
    trend_reason: 'TikTok 官方趋势发现工具',
    heat_evidence: '官方趋势入口',
    confidence_level: 'high',
    verification_status: 'unverified',
    why_worth_watching: '官方趋势入口，可信度高，可了解UK市场热门方向',
    what_to_observe: '关注 packaging、factory、manufacturing 相关话题热度',
  },
  {
    collected_date: today,
    platform: 'TikTok',
    source_type: 'TikTok Search',
    source_name: 'TikTok 搜索: food packaging',
    source_url: '',
    video_url: '',
    search_url: 'https://www.tiktok.com/search?q=food%20packaging',
    country: 'EU',
    region: 'Europe',
    keyword: 'food packaging',
    hashtag: '',
    title_or_caption: 'TikTok 搜索入口: food packaging',
    creator_name: '',
    reference_industry: 'flexible packaging',
    video_type: 'trend overview',
    product_relevance: '搜索结果可发现食品包装热门视频',
    trend_reason: 'TikTok 搜索入口，可人工查看当前搜索结果',
    heat_evidence: 'TikTok 搜索结果入口',
    confidence_level: 'medium',
    verification_status: 'unverified',
    why_worth_watching: '搜索入口，需人工打开查看当前搜索结果中的热门视频',
    what_to_observe: '查看搜索结果前列视频的播放量、内容形式和拍摄手法',
  },
  {
    collected_date: today,
    platform: 'TikTok',
    source_type: 'TikTok Search',
    source_name: 'TikTok 搜索: packaging factory',
    source_url: '',
    video_url: '',
    search_url: 'https://www.tiktok.com/search?q=packaging%20factory',
    country: 'EU',
    region: 'Europe',
    keyword: 'packaging factory',
    hashtag: '',
    title_or_caption: 'TikTok 搜索入口: packaging factory',
    creator_name: '',
    reference_industry: 'flexible packaging',
    video_type: 'trend overview',
    product_relevance: '搜索结果可发现包装工厂类热门视频',
    trend_reason: 'TikTok 搜索入口',
    heat_evidence: 'TikTok 搜索结果入口',
    confidence_level: 'medium',
    verification_status: 'unverified',
    why_worth_watching: '搜索入口，需人工打开查看当前搜索结果中的热门视频',
    what_to_observe: '关注工厂类视频的内容形式和互动数据',
  },
  {
    collected_date: today,
    platform: 'TikTok',
    source_type: 'Manual Input',
    source_name: '手动录入示例',
    source_url: '',
    video_url: '',
    search_url: '',
    country: 'Germany',
    region: 'Europe',
    keyword: 'pet food packaging',
    hashtag: '#petfoodpackaging',
    title_or_caption: '示例：手动录入的真实视频链接位置',
    creator_name: '',
    reference_industry: 'flexible packaging',
    video_type: 'production process',
    product_relevance: '示例记录，展示手动录入功能',
    trend_reason: '用户手动发现的视频',
    heat_evidence: '用户手动发现',
    confidence_level: 'medium',
    verification_status: 'unverified',
    why_worth_watching: '这是示例记录，实际使用时请替换为真实视频链接',
    what_to_observe: '请替换为真实的TikTok视频链接后使用',
  },
];

for (const v of seedDailyHot) {
  const now = new Date().toISOString();
  db.daily_hot_videos.push({
    id: db.nextIds.daily_hot_videos++,
    ...v,
    rank_position: 0,
    views_count: 0,
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    verified_by_user: false,
    user_note: '',
    ai_summary: '',
    can_add_to_inspiration: false,
    created_at: now,
    updated_at: now,
  });
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

console.log(`Seeded ${seedTrends.length} trends, ${seedCompetitors.length} competitors, ${seedRecommendations.length} recommendations, ${seedInspirations.length} inspiration videos, and ${seedDailyHot.length} daily hot entries for ${today}`);
console.log(`Database saved to: ${DB_PATH}`);
