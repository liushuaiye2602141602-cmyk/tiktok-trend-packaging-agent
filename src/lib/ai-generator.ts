import {
  PRODUCT_DIRECTIONS,
  SCENE_DIRECTIONS,
  PAIN_POINT_DIRECTIONS,
  DEFAULT_HOOKS,
  DEFAULT_CAPTION_TEMPLATES,
  DEFAULT_HASHTAG_SETS,
  DEFAULT_CTAS,
} from './content-library';
import { PRODUCT_TYPES, MARKETS } from './types';

const SCRIPT_TEMPLATES = [
  (p: string, m: string) =>
    `For ${p}, the package must protect the product, look professional on the shelf, and work smoothly on the filling line. That is why many European brands choose custom ${p} with strong sealing, high barrier materials, and brand-quality printing.`,
  (p: string, m: string) =>
    `When choosing ${p}, brands in ${m} care about three things: material quality, print accuracy, and reliable sealing. We test every batch before it ships to make sure your product is protected.`,
  (p: string, m: string) =>
    `This is how we make custom ${p}. From material selection to printing, lamination, bag making, and quality inspection, every step is controlled in our factory.`,
  (p: string, m: string) =>
    `Bad packaging can cost you customers. Leakage, poor sealing, and faded printing are common problems. Here is how we solve them with proper ${p} production.`,
  (p: string, m: string) =>
    `European brands need packaging that works with their filling machines, protects the product, and looks great on the shelf. That is exactly what our ${p} are designed for.`,
];

const SHOT_TEMPLATES: Record<string, string[]> = {
  'factory production': [
    'Show factory exterior or entrance',
    'Show raw material rolls',
    'Show printing machine in action',
    'Show lamination process',
    'Show bag making machine',
    'Show quality inspection',
    'Show finished bags packed and ready',
  ],
  'sealing quality test': [
    'Show empty bag close-up',
    'Show sealing machine',
    'Show seal being made',
    'Show pull test on sealed edge',
    'Show result with no leakage',
  ],
  'packaging comparison': [
    'Show poor quality bag (faded, wrinkled)',
    'Show our bag side by side',
    'Highlight differences in print, seal, material',
    'Show shelf presence comparison',
  ],
  'sample testing': [
    'Show sample bag arriving',
    'Show filling test',
    'Show sealing test',
    'Show drop test or pressure test',
    'Show final approved sample',
  ],
  default: [
    'Show the product or bag close-up',
    'Show key feature (zipper, seal, print)',
    'Show the bag in use or being filled',
    'Show the final result on shelf or packed',
  ],
};

const SHOT_TEMPLATES_CN: Record<string, string[]> = {
  'factory production': [
    '展示工厂外观或入口',
    '展示原材料卷材',
    '展示印刷机运转',
    '展示复合工艺',
    '展示制袋机',
    '展示质检环节',
    '展示成品袋打包待发',
  ],
  'sealing quality test': [
    '展示空袋特写',
    '展示封口机',
    '展示封口过程',
    '展示封边拉力测试',
    '展示无泄漏测试结果',
  ],
  'packaging comparison': [
    '展示劣质袋（褪色、起皱）',
    '将我方袋子并排对比',
    '突出印刷、封口、材质差异',
    '展示货架陈列效果对比',
  ],
  'sample testing': [
    '展示样品袋到货',
    '展示灌装测试',
    '展示封口测试',
    '展示跌落或压力测试',
    '展示最终确认样品',
  ],
  default: [
    '展示产品或袋子特写',
    '展示关键特点（拉链、封口、印刷）',
    '展示袋子使用或灌装过程',
    '展示最终货架或打包效果',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateShotList(scene: string): { en: string[]; cn: string[] } {
  for (const [key, shots] of Object.entries(SHOT_TEMPLATES)) {
    if (scene.toLowerCase().includes(key)) {
      return { en: shots, cn: SHOT_TEMPLATES_CN[key] || SHOT_TEMPLATES_CN.default };
    }
  }
  return { en: SHOT_TEMPLATES.default, cn: SHOT_TEMPLATES_CN.default };
}

export interface GeneratedRecommendation {
  title_en: string;
  title_cn: string;
  product_type: string;
  target_market: string;
  target_customer: string;
  hook: string;
  script_en: string;
  shot_list: string[];
  shot_list_cn: string[];
  caption: string;
  hashtags: string;
  cta: string;
  priority: number;
  difficulty: string;
  platforms: string;
}

export function generateDailyRecommendations(
  count: number = 8,
  date?: string
): GeneratedRecommendation[] {
  const results: GeneratedRecommendation[] = [];
  const today = date || new Date().toISOString().split('T')[0];

  const shuffledProducts = [...PRODUCT_TYPES].sort(() => Math.random() - 0.5);
  const shuffledScenes = [...SCENE_DIRECTIONS].sort(() => Math.random() - 0.5);
  const shuffledPains = [...PAIN_POINT_DIRECTIONS].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const product = shuffledProducts[i % shuffledProducts.length];
    const market = pickRandom([...MARKETS]);
    const scene = shuffledScenes[i % shuffledScenes.length];
    const pain = shuffledPains[i % shuffledPains.length];
    const hook = pickRandom(DEFAULT_HOOKS);
    const template = pickRandom(SCRIPT_TEMPLATES);
    const captionTemplate = pickRandom(DEFAULT_CAPTION_TEMPLATES);
    const hashtags = pickRandom(DEFAULT_HASHTAG_SETS);
    const cta = pickRandom(DEFAULT_CTAS);

    const isProblemFocused = i % 3 === 0;
    const isFactoryFocused = i % 3 === 1;

    let title_en: string;
    let title_cn: string;
    let script_en: string;
    let target_customer: string;

    if (isProblemFocused) {
      title_en = `Why ${pain} happens and how to fix it with better ${product}`;
      title_cn = `为什么会出现${pain}，如何通过更好的${product}解决`;
      script_en = `Many brands face ${pain} when using low quality packaging. Here is how proper ${product} with the right material structure and sealing can solve this problem.`;
      target_customer = 'brands with packaging quality issues';
    } else if (isFactoryFocused) {
      title_en = `How we make custom ${product} in our factory`;
      title_cn = `我们在工厂里如何生产定制${product}`;
      script_en = template(product, market);
      target_customer = 'pet food brands, food factories, co-packers';
    } else {
      title_en = `${product}: what European brands need to know`;
      title_cn = `${product}：欧洲品牌需要了解的关键点`;
      script_en = template(product, market);
      target_customer = 'importers, private label brands, packaging buyers';
    }

    const shotList = generateShotList(scene);
    const caption = captionTemplate
      .replace('{product}', product)
      .replace('{customer}', target_customer)
      .replace('{project}', scene);

    const difficulties: Array<{ d: string; p: number }[]> = [
      [{ d: 'easy', p: 1 }, { d: 'medium', p: 2 }, { d: 'hard', p: 3 }],
    ];

    results.push({
      title_en,
      title_cn,
      product_type: product,
      target_market: market,
      target_customer,
      hook,
      script_en,
      shot_list: shotList.en,
      shot_list_cn: shotList.cn,
      caption,
      hashtags,
      cta,
      priority: Math.floor(Math.random() * 3) + 1,
      difficulty: ['easy', 'medium', 'hard'][i % 3],
      platforms: 'TikTok',
    });
  }

  return results.sort((a, b) => a.priority - b.priority);
}

export function generateSingleRecommendation(params: {
  product_type: string;
  target_market?: string;
  scene?: string;
}): GeneratedRecommendation {
  const product = params.product_type || pickRandom([...PRODUCT_TYPES]);
  const market = params.target_market || pickRandom([...MARKETS]);
  const scene = params.scene || pickRandom(SCENE_DIRECTIONS);
  const hook = pickRandom(DEFAULT_HOOKS);
  const template = pickRandom(SCRIPT_TEMPLATES);
  const captionTemplate = pickRandom(DEFAULT_CAPTION_TEMPLATES);
  const hashtags = pickRandom(DEFAULT_HASHTAG_SETS);
  const cta = pickRandom(DEFAULT_CTAS);
  const shotList = generateShotList(scene);

  return {
    title_en: `Custom ${product} for ${market} market`,
    title_cn: `面向${market}市场的定制${product}`,
    product_type: product,
    target_market: market,
    target_customer: 'pet food brands, food factories, co-packers, importers',
    hook,
    script_en: template(product, market),
    shot_list: shotList.en,
    shot_list_cn: shotList.cn,
    caption: captionTemplate.replace('{product}', product).replace('{customer}', 'European brands').replace('{project}', scene),
    hashtags,
    cta,
    priority: 3,
    difficulty: 'medium',
    platforms: 'TikTok',
  };
}

// --- Adaptation generator from inspiration video (cross-industry) ---

const CROSS_INDUSTRY_ADAPTATIONS: Record<string, {
  transferable: string;
  softProduct: string;
  hooks: string[];
  scriptFn: (p: string, m: string) => string;
  shotListEn: string[];
  shotListCn: string[];
}> = {
  'packaging machinery': {
    transferable: '学习机器动作、重复节奏和近景细节，展现设备精度和自动化水平',
    softProduct: 'spout pouch',
    hooks: [
      'Watch how spout pouches are sealed and checked before shipment.',
      'This is the speed your custom packaging is made at.',
      'Every pouch goes through this quality check.',
    ],
    scriptFn: (p, m) => `This is how we make sure every ${p} meets your quality standards. From film feeding to sealing, cutting, and final inspection, our production line runs with precision. We control every step to make sure your packaging works perfectly on your filling line.`,
    shotListEn: ['Show film feeding into machine', 'Show sealing station in action', 'Show cutting and shaping', 'Show quality check sensor', 'Show finished pouches stacking', 'Show final packed boxes'],
    shotListCn: ['展示薄膜进料', '展示封口工位运转', '展示切割成型', '展示质检传感器', '展示成品袋堆叠', '展示打包封箱'],
  },
  'injection molding': {
    transferable: '学习"原料 → 加工 → 成品"流程结构，模具精度展示和质检环节',
    softProduct: 'flat bottom pouch',
    hooks: [
      'From printed film to finished pouch: how custom packaging bags are made.',
      'This is the journey from raw material to your branded packaging.',
      'Every custom pouch starts with this step.',
    ],
    scriptFn: (p, m) => `This is how a custom ${p} goes from raw film to finished product. First we print your brand design, then laminate the material layers, form the bag shape, add the zipper, and test every seal. The result is a pouch that protects your product and looks great on the shelf.`,
    shotListEn: ['Show raw film rolls', 'Show printing process', 'Show lamination', 'Show bag forming machine', 'Show zipper application', 'Show finished pouch close-up'],
    shotListCn: ['展示原材料薄膜卷', '展示印刷过程', '展示复合工艺', '展示制袋机', '展示拉链安装', '展示成品袋特写'],
  },
  'food factory': {
    transferable: '从客户使用场景反推包装需求，学习灌装、封口、保鲜的展示逻辑',
    softProduct: 'retort pouch',
    hooks: [
      'How to choose the right pouch for liquid or wet food filling.',
      'Your filling line needs packaging that works every time.',
      'This is what food-safe packaging looks like inside our factory.',
    ],
    scriptFn: (p, m) => `If you are filling wet food or ready meals, you need a ${p} that handles high-temperature sterilization. We test every batch for seal strength, barrier performance, and filling line compatibility. Your product stays fresh, and your line keeps running.`,
    shotListEn: ['Show retort pouch close-up', 'Show filling simulation', 'Show sealing test', 'Show retort chamber test', 'Show final product on shelf'],
    shotListCn: ['展示蒸煮袋特写', '展示灌装模拟', '展示封口测试', '展示蒸煮舱测试', '展示最终产品上架'],
  },
  'pet food factory': {
    transferable: '学习宠物食品从原料到包装的完整流程，展示保鲜和密封性能',
    softProduct: 'pet food packaging',
    hooks: [
      'What pet food brands need to know about packaging freshness.',
      'This is how we keep pet food fresh from factory to bowl.',
      'The right packaging makes all the difference for pet food.',
    ],
    scriptFn: (p, m) => `Pet food needs packaging that keeps kibble fresh and crunchy. Our ${p} uses multi-layer barrier film that blocks moisture and oxygen. Strong zippers let pet owners reseal easily. We test every bag to make sure it protects your product.`,
    shotListEn: ['Show pet food pouch close-up', 'Show barrier film layers', 'Show zipper mechanism', 'Show freshness test', 'Show bag being filled with kibble', 'Show sealed pouch on shelf'],
    shotListCn: ['展示宠物食品袋特写', '展示阻隔膜层', '展示拉链机构', '展示保鲜测试', '展示袋子灌装干粮', '展示密封袋上架'],
  },
  'metal parts': {
    transferable: '学习五金加工的精度展示、尺寸检测和批量生产的镜头节奏',
    softProduct: 'custom flexible packaging',
    hooks: [
      'Precision matters in packaging too. Here is how we measure every bag.',
      'Every millimeter counts when your packaging goes on an automated line.',
      'This is how we make sure your bags are always the right size.',
    ],
    scriptFn: (p, m) => `Precision matters in packaging. Every ${p} is measured and tested to make sure dimensions are consistent, seals are strong, and the bag runs smoothly on your filling line. We control tolerances so your packaging always works.`,
    shotListEn: ['Show bag dimension measurement', 'Show seal strength test', 'Show bags on filling line', 'Show quality inspection', 'Show approved batch packing'],
    shotListCn: ['展示袋子尺寸测量', '展示封口强度测试', '展示袋子在灌装线上', '展示质量检验', '展示合格批次打包'],
  },
  'printing': {
    transferable: '学习印刷过程的色彩展示、细节特写和成品对比',
    softProduct: 'custom flexible packaging',
    hooks: [
      'This is how your brand design gets printed on packaging.',
      'From digital file to printed pouch: see the color matching process.',
      'Every color is tested before your packaging is printed.',
    ],
    scriptFn: (p, m) => `Your brand deserves packaging with sharp, accurate printing. We match colors from your design file, test on sample film, and then run full production. Every ${p} is printed with food-grade inks on high-quality rotogravure machines.`,
    shotListEn: ['Show design file on screen', 'Show color matching process', 'Show printing machine running', 'Show print detail close-up', 'Show finished printed film', 'Show final pouch with print'],
    shotListCn: ['展示设计文件', '展示调色过程', '展示印刷机运转', '展示印刷细节特写', '展示印刷完成的膜', '展示最终印刷袋'],
  },
  'cosmetics factory': {
    transferable: '学习化妆品工厂的洁净环境展示、产品质感表达和品牌调性',
    softProduct: 'stand up pouch',
    hooks: [
      'Premium packaging for premium products. Here is how we make it.',
      'Your brand packaging should feel as good as your product.',
      'Clean room packaging for sensitive products.',
    ],
    scriptFn: (p, m) => `Premium products need premium packaging. Our ${p} uses high-quality materials with smooth finishes, strong zippers, and precise printing. We work with cosmetics and personal care brands across Europe to create packaging that reflects their brand quality.`,
    shotListEn: ['Show pouch material texture', 'Show zipper detail', 'Show print quality close-up', 'Show pouch standing on counter', 'Show different size options'],
    shotListCn: ['展示袋子材质纹理', '展示拉链细节', '展示印刷质量特写', '展示袋子站立在台面', '展示不同尺寸选择'],
  },
  'electronics manufacturing': {
    transferable: '学习电子元件的精密检测、无尘环境和防静电包装展示',
    softProduct: 'custom flexible packaging',
    hooks: [
      'Sensitive products need protective packaging. Here is our approach.',
      'This is how we protect products during shipping and storage.',
      'Anti-static and moisture-proof packaging for sensitive goods.',
    ],
    scriptFn: (p, m) => `Some products need more than basic protection. Our ${p} can be made with anti-static layers, moisture barriers, and puncture-resistant materials. We test every batch to make sure your products arrive safely.`,
    shotListEn: ['Show protective film layers', 'Show moisture barrier test', 'Show puncture resistance test', 'Show sealed package drop test', 'Show product safely packed'],
    shotListCn: ['展示保护膜层', '展示阻湿测试', '展示抗穿刺测试', '展示密封包装跌落测试', '展示产品安全包装'],
  },
  'logistics warehouse': {
    transferable: '学习物流仓储的打包效率展示、空间利用和运输保护',
    softProduct: 'stand up pouch',
    hooks: [
      'Packaging that saves space in your warehouse and on the shelf.',
      'How the right packaging reduces your shipping costs.',
      'Flat-packed pouches save 60 percent storage space vs rigid containers.',
    ],
    scriptFn: (p, m) => `Flexible ${p} saves space compared to rigid containers. They ship flat, fill fast on your line, and stand upright on the shelf. Less space wasted in transit, more product on the shelf. That is the advantage of flexible packaging.`,
    shotListEn: ['Show flat pouch vs rigid container size comparison', 'Show pouches being packed flat', 'Show filling process', 'Show pouch standing on shelf', 'Show space savings calculation'],
    shotListCn: ['展示平袋与硬容器尺寸对比', '展示袋子平铺打包', '展示灌装过程', '展示袋子站立在货架', '展示节省空间计算'],
  },
  'industrial supplier': {
    transferable: '学习工业品供应商的批量展示、样品寄送和询盘引导',
    softProduct: 'custom flexible packaging',
    hooks: [
      'Factory direct custom packaging for European brands.',
      'OEM and ODM flexible packaging from our factory to your door.',
      'This is how we serve packaging buyers across Europe.',
    ],
    scriptFn: (p, m) => `We are a factory direct supplier of custom ${p} for European brands. OEM and ODM service, low MOQ for samples, fast lead time for production. Send us your bag size and product type, and we will handle the rest.`,
    shotListEn: ['Show factory overview', 'Show sample bags', 'Show different pouch styles', 'Show printing options', 'Show packed boxes ready to ship', 'Show contact info overlay'],
    shotListCn: ['展示工厂概览', '展示样品袋', '展示不同袋型', '展示印刷选项', '展示打包待发货', '展示联系信息叠加'],
  },
  'export factory': {
    transferable: '学习外贸工厂的订单流程展示、出口标准说明和客户沟通方式',
    softProduct: 'custom flexible packaging',
    hooks: [
      'How European brands order custom packaging from our factory.',
      'From inquiry to delivery: the custom packaging order process.',
      'We export flexible packaging to 30 plus European countries.',
    ],
    scriptFn: (p, m) => `Ordering custom ${p} is simple. Send us your bag size, material preference, and design file. We send samples within 7 days. After approval, production takes 15-20 days. We handle export documentation and ship directly to your warehouse.`,
    shotListEn: ['Show inquiry email on screen', 'Show sample bag preparation', 'Show production line', 'Show quality inspection', 'Show export packaging', 'Show container loading'],
    shotListCn: ['展示询盘邮件', '展示样品准备', '展示生产线', '展示质量检验', '展示出口包装', '展示装柜'],
  },
  default: {
    transferable: '学习视频结构、镜头语言和表达方式，改编成软包装工厂内容',
    softProduct: 'custom flexible packaging',
    hooks: [
      'Most brands do not realize this about their packaging.',
      'Here is something you should know about flexible packaging.',
      'This is how European brands choose custom packaging.',
    ],
    scriptFn: (p, m) => `When choosing ${p} for the European market, brands need to consider material quality, print accuracy, and reliable sealing. We test every batch to make sure your product is protected and your brand looks great on the shelf.`,
    shotListEn: ['Show the product or bag close-up', 'Show a key feature (seal, zipper, print)', 'Show the bag in use or being filled', 'Show the final result on shelf or packed'],
    shotListCn: ['展示产品或袋子特写', '展示关键特点（封口、拉链、印刷）', '展示袋子使用或灌装过程', '展示最终货架或打包效果'],
  },
};

function getCrossIndustryKey(referenceIndustry: string): string {
  const mapping: Record<string, string> = {
    'packaging machinery': 'packaging machinery',
    'injection molding': 'injection molding',
    'food factory': 'food factory',
    'pet food factory': 'pet food factory',
    'metal parts': 'metal parts',
    'printing': 'printing',
    'cosmetics factory': 'cosmetics factory',
    'electronics manufacturing': 'electronics manufacturing',
    'logistics warehouse': 'logistics warehouse',
    'industrial supplier': 'industrial supplier',
    'export factory': 'export factory',
  };
  return mapping[referenceIndustry] || 'default';
}

export interface AdaptationResult {
  title_en: string;
  title_cn: string;
  product_type: string;
  target_market: string;
  target_customer: string;
  hook: string;
  script_en: string;
  shot_list: string[];
  shot_list_cn: string[];
  caption: string;
  hashtags: string;
  cta: string;
  priority: number;
  difficulty: string;
  platforms: string;
  transferable_points: string;
  adaptation_method: string;
  adaptation_risk: string;
  soft_packaging_version: string;
  transfer_difficulty: string;
}

export function generateAdaptation(video: Record<string, unknown>): AdaptationResult {
  const referenceIndustry = (video.reference_industry as string) || 'other b2b manufacturing';
  const videoType = (video.video_type as string) || 'default';
  const market = pickRandom([...MARKETS]);

  // Get cross-industry adaptation or default
  const crossKey = getCrossIndustryKey(referenceIndustry);
  const adaptation = CROSS_INDUSTRY_ADAPTATIONS[crossKey] || CROSS_INDUSTRY_ADAPTATIONS.default;

  // Pick product: use video's product if it's soft packaging, otherwise use the adaptation's recommended product
  const isSoftPkg = referenceIndustry === 'flexible packaging';
  const product = isSoftPkg
    ? ((video.product_type as string) || pickRandom([...PRODUCT_TYPES]))
    : adaptation.softProduct;

  const hook = pickRandom(adaptation.hooks);
  const script_en = adaptation.scriptFn(product, market);
  const captionTemplate = pickRandom(DEFAULT_CAPTION_TEMPLATES);
  const caption = captionTemplate
    .replace('{product}', product)
    .replace('{customer}', 'European brands')
    .replace('{project}', videoType);
  const hashtags = pickRandom(DEFAULT_HASHTAG_SETS);
  const cta = pickRandom(DEFAULT_CTAS);

  const whyGood = (video.why_good as string) || '';
  const industryLabel = referenceIndustry.replace(/_/g, ' ');

  let title_cn: string;
  let title_en: string;
  let adaptation_method: string;
  let adaptation_risk: string;
  let soft_packaging_version: string;
  let transfer_difficulty: string;

  if (isSoftPkg) {
    title_en = `Custom ${product} for ${market} market`;
    title_cn = `面向${market}市场的定制${product}`;
    adaptation_method = `直接学习该视频的${videoType}拍摄结构，用我们的${product}重新拍摄`;
    adaptation_risk = '行业相同，可直接参考结构和镜头语言，注意不要使用对方品牌信息';
    soft_packaging_version = `用我们自己的${product}，按照视频结构重新拍摄`;
    transfer_difficulty = 'easy';
  } else {
    title_en = `Custom ${product} inspired by ${industryLabel} video structure`;
    title_cn = `学习${industryLabel}行业${videoType}视频结构的${product}改编方案`;
    adaptation_method = `学习该${industryLabel}视频的${videoType}结构：${adaptation.transferable}，然后用我们的软包装产品重新拍摄`;
    adaptation_risk = `原视频来自${industryLabel}行业，不能照搬产品和行业术语，只能学习视频结构和镜头语言`;
    soft_packaging_version = `用我们的${product}替代原视频中的产品，保持相同的视频结构和节奏`;
    transfer_difficulty = 'medium';
  }

  return {
    title_en,
    title_cn,
    product_type: product,
    target_market: market,
    target_customer: 'pet food brands, food factories, co-packers, importers, private label brands',
    hook,
    script_en,
    shot_list: adaptation.shotListEn,
    shot_list_cn: adaptation.shotListCn,
    caption,
    hashtags,
    cta,
    priority: isSoftPkg ? 2 : 1,
    difficulty: isSoftPkg ? 'medium' : 'easy',
    platforms: 'TikTok',
    transferable_points: adaptation.transferable,
    adaptation_method,
    adaptation_risk,
    soft_packaging_version,
    transfer_difficulty,
  };
}
