'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  INSPIRATION_PLATFORMS, INSPIRATION_PLATFORM_LABELS,
  INSPIRATION_VIDEO_TYPES, INSPIRATION_VIDEO_TYPE_LABELS,
  INSPIRATION_PRODUCT_TYPES, INSPIRATION_PRODUCT_LABELS,
  INSPIRATION_STATUS_LABELS,
  REFERENCE_INDUSTRIES, REFERENCE_INDUSTRY_LABELS,
  VALUE_LEVEL_LABELS, TRANSFER_DIFFICULTY_LABELS,
  HOOK_STYLES, SHOT_STYLES, SUBTITLE_STYLES, EDITING_STYLES, CTA_STYLES,
} from '@/lib/types';

interface Video {
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
}

interface Adaptation {
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

const emptyForm = {
  platform: 'TikTok', video_url: '', account_name: '', country: '', language: '',
  reference_industry: 'other b2b manufacturing', video_type: 'other', product_type: '', title_or_note: '',
  first_second_hook: '', main_visual: '', hook_style: '', shot_style: '',
  subtitle_style: '', editing_style: '', cta_style: '',
  why_good: '', what_to_learn: '', what_not_to_copy: '', how_to_adapt_for_factory: '',
  transferable_points: '', adaptation_method: '', adaptation_risk: '',
  soft_packaging_version: '', transfer_difficulty: 'medium',
  b2b_fit_score: 3, packaging_fit_score: 3, visual_score: 3, hook_score: 3,
  adaptation_score: 3, transfer_score: 3,
  status: 'pending',
};

const SEARCH_LINKS: Record<string, { label: string; queries: { text: string; url: string }[] }> = {
  'food': {
    label: '食品包装',
    queries: [
      { text: 'food packaging', url: 'https://www.tiktok.com/search?q=food%20packaging' },
      { text: 'custom food packaging', url: 'https://www.tiktok.com/search?q=custom%20food%20packaging' },
      { text: 'food packaging supplier', url: 'https://www.tiktok.com/search?q=food%20packaging%20supplier' },
    ],
  },
  'flexible': {
    label: '软包装',
    queries: [
      { text: 'flexible packaging', url: 'https://www.tiktok.com/search?q=flexible%20packaging' },
      { text: 'custom pouch packaging', url: 'https://www.tiktok.com/search?q=custom%20pouch%20packaging' },
      { text: 'stand up pouch', url: 'https://www.tiktok.com/search?q=stand%20up%20pouch' },
    ],
  },
  'factory': {
    label: '包装工厂',
    queries: [
      { text: 'packaging factory', url: 'https://www.tiktok.com/search?q=packaging%20factory' },
      { text: 'factory packaging process', url: 'https://www.tiktok.com/search?q=factory%20packaging%20process' },
      { text: "how it's made packaging", url: 'https://www.tiktok.com/search?q=how%20it%27s%20made%20packaging' },
      { text: 'factory behind the scenes', url: 'https://www.tiktok.com/search?q=factory%20behind%20the%20scenes' },
    ],
  },
  'petfood': {
    label: '宠物食品包装',
    queries: [
      { text: 'pet food packaging', url: 'https://www.tiktok.com/search?q=pet%20food%20packaging' },
      { text: 'dog food packaging', url: 'https://www.tiktok.com/search?q=dog%20food%20packaging' },
      { text: 'pet treat packaging', url: 'https://www.tiktok.com/search?q=pet%20treat%20packaging' },
      { text: 'flat bottom pouch pet food', url: 'https://www.tiktok.com/search?q=flat%20bottom%20pouch%20pet%20food' },
    ],
  },
  'retort': {
    label: '蒸煮袋',
    queries: [
      { text: 'retort pouch', url: 'https://www.tiktok.com/search?q=retort%20pouch' },
      { text: 'ready meal packaging', url: 'https://www.tiktok.com/search?q=ready%20meal%20packaging' },
      { text: 'shelf stable food packaging', url: 'https://www.tiktok.com/search?q=shelf%20stable%20food%20packaging' },
    ],
  },
  'test': {
    label: '包装测试',
    queries: [
      { text: 'packaging test', url: 'https://www.tiktok.com/search?q=packaging%20test' },
      { text: 'sealing test packaging', url: 'https://www.tiktok.com/search?q=sealing%20test%20packaging' },
      { text: 'drop test packaging', url: 'https://www.tiktok.com/search?q=drop%20test%20packaging' },
    ],
  },
  'learn': {
    label: '容易学习的形式',
    queries: [
      { text: 'satisfying packaging', url: 'https://www.tiktok.com/search?q=satisfying%20packaging' },
      { text: 'packing orders', url: 'https://www.tiktok.com/search?q=packing%20orders' },
      { text: 'packaging mistakes', url: 'https://www.tiktok.com/search?q=packaging%20mistakes' },
      { text: 'before and after packaging', url: 'https://www.tiktok.com/search?q=before%20and%20after%20packaging' },
    ],
  },
  'b2b_mfg': {
    label: 'B2B制造业参考',
    queries: [
      { text: 'packaging machinery', url: 'https://www.tiktok.com/search?q=packaging%20machinery' },
      { text: 'factory production process', url: 'https://www.tiktok.com/search?q=factory%20production%20process' },
      { text: 'injection molding factory', url: 'https://www.tiktok.com/search?q=injection%20molding%20factory' },
      { text: 'printing factory', url: 'https://www.tiktok.com/search?q=printing%20factory' },
      { text: 'label printing process', url: 'https://www.tiktok.com/search?q=label%20printing%20process' },
      { text: 'food factory production', url: 'https://www.tiktok.com/search?q=food%20factory%20production' },
      { text: 'pet food factory', url: 'https://www.tiktok.com/search?q=pet%20food%20factory' },
      { text: 'metal parts manufacturing', url: 'https://www.tiktok.com/search?q=metal%20parts%20manufacturing' },
      { text: 'cosmetic packaging factory', url: 'https://www.tiktok.com/search?q=cosmetic%20packaging%20factory' },
      { text: 'electronics manufacturing', url: 'https://www.tiktok.com/search?q=electronics%20manufacturing' },
      { text: 'industrial supplier', url: 'https://www.tiktok.com/search?q=industrial%20supplier' },
      { text: 'export factory', url: 'https://www.tiktok.com/search?q=export%20factory' },
      { text: 'quality inspection factory', url: 'https://www.tiktok.com/search?q=quality%20inspection%20factory' },
      { text: 'product testing factory', url: 'https://www.tiktok.com/search?q=product%20testing%20factory' },
      { text: "how it's made factory", url: 'https://www.tiktok.com/search?q=how%20it%27s%20made%20factory' },
    ],
  },
};

export default function InspirationPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<number | null>(null);
  const [analysisVideo, setAnalysisVideo] = useState<Video | null>(null);
  const [adaptation, setAdaptation] = useState<Adaptation | null>(null);
  const [adaptLoading, setAdaptLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showLinks, setShowLinks] = useState(false);

  // Filters
  const [fPlatform, setFPlatform] = useState('');
  const [fVideoType, setFVideoType] = useState('');
  const [fProductType, setFProductType] = useState('');
  const [fIndustry, setFIndustry] = useState('');
  const [fValueLevel, setFValueLevel] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fSearch, setFSearch] = useState('');

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fPlatform) params.set('platform', fPlatform);
      if (fVideoType) params.set('video_type', fVideoType);
      if (fProductType) params.set('product_type', fProductType);
      if (fIndustry) params.set('reference_industry', fIndustry);
      if (fValueLevel) params.set('value_level', fValueLevel);
      if (fStatus) params.set('status', fStatus);
      if (fSearch) params.set('search', fSearch);
      const res = await fetch(`/api/inspiration-videos?${params}`);
      setVideos(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [fPlatform, fVideoType, fProductType, fIndustry, fValueLevel, fStatus, fSearch]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleSave = async () => {
    if (!form.video_url.trim()) return;
    const url = editingId ? `/api/inspiration-videos/${editingId}` : '/api/inspiration-videos';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setShowAdd(false);
    setEditingId(null);
    fetchVideos();
  };

  const handleEdit = (v: Video) => {
    setForm({
      platform: v.platform, video_url: v.video_url, account_name: v.account_name,
      country: v.country, language: v.language, reference_industry: v.reference_industry || 'other b2b manufacturing',
      video_type: v.video_type, product_type: v.product_type, title_or_note: v.title_or_note,
      first_second_hook: v.first_second_hook, main_visual: v.main_visual,
      hook_style: v.hook_style, shot_style: v.shot_style,
      subtitle_style: v.subtitle_style, editing_style: v.editing_style,
      cta_style: v.cta_style, why_good: v.why_good,
      what_to_learn: v.what_to_learn, what_not_to_copy: v.what_not_to_copy,
      how_to_adapt_for_factory: v.how_to_adapt_for_factory,
      transferable_points: v.transferable_points || '',
      adaptation_method: v.adaptation_method || '',
      adaptation_risk: v.adaptation_risk || '',
      soft_packaging_version: v.soft_packaging_version || '',
      transfer_difficulty: v.transfer_difficulty || 'medium',
      b2b_fit_score: v.b2b_fit_score, packaging_fit_score: v.packaging_fit_score,
      visual_score: v.visual_score, hook_score: v.hook_score,
      adaptation_score: v.adaptation_score, transfer_score: v.transfer_score || 3,
      status: v.status,
    });
    setEditingId(v.id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条视频记录？')) return;
    await fetch(`/api/inspiration-videos/${id}`, { method: 'DELETE' });
    fetchVideos();
  };

  const openAnalysis = (v: Video) => {
    setAnalysisVideo({ ...v });
    setShowAnalysis(v.id);
    setAdaptation(null);
  };

  const saveAnalysis = async () => {
    if (!analysisVideo) return;
    await fetch(`/api/inspiration-videos/${analysisVideo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analysisVideo),
    });
    setShowAnalysis(null);
    setAnalysisVideo(null);
    fetchVideos();
  };

  const handleGenerateAdaptation = async (id: number) => {
    setAdaptLoading(true);
    setAdaptation(null);
    try {
      const res = await fetch(`/api/inspiration-videos/${id}/generate-adaptation`, { method: 'POST' });
      const data = await res.json();
      setAdaptation(data.adaptation);
    } catch (e) { alert('生成改编方案失败'); }
    setAdaptLoading(false);
  };

  const handleAddToRecommendations = async (id: number) => {
    try {
      const res = await fetch(`/api/inspiration-videos/${id}/add-to-recommendations`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`已加入今日推荐选题！选题 ID: ${data.recommendation_id}`);
        fetchVideos();
      }
    } catch (e) { alert('加入选题失败'); }
  };

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', '平台', '参考行业', '视频链接', '账号', '视频类型', '适合产品', '状态', '总分', '价值等级', '可迁移点', '如何改编'];
    const rows = videos.map(v => [
      v.id,
      INSPIRATION_PLATFORM_LABELS[v.platform] || v.platform,
      REFERENCE_INDUSTRY_LABELS[v.reference_industry] || v.reference_industry,
      v.video_url, v.account_name,
      INSPIRATION_VIDEO_TYPE_LABELS[v.video_type] || v.video_type,
      INSPIRATION_PRODUCT_LABELS[v.product_type] || v.product_type,
      INSPIRATION_STATUS_LABELS[v.status] || v.status,
      v.total_score,
      VALUE_LEVEL_LABELS[v.value_level]?.text || v.value_level,
      v.transferable_points, v.adaptation_method,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `inspiration_videos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleExportMD = () => {
    const lines = videos.map(v => {
      const vl = VALUE_LEVEL_LABELS[v.value_level]?.text || v.value_level;
      return `## ${v.title_or_note || v.account_name || 'Untitled'}\n\n` +
        `- **平台**: ${INSPIRATION_PLATFORM_LABELS[v.platform] || v.platform}\n` +
        `- **参考行业**: ${REFERENCE_INDUSTRY_LABELS[v.reference_industry] || v.reference_industry}\n` +
        `- **链接**: ${v.video_url}\n` +
        `- **视频类型**: ${INSPIRATION_VIDEO_TYPE_LABELS[v.video_type] || v.video_type}\n` +
        `- **总分**: ${v.total_score}/30 (${vl})\n` +
        `- **可迁移点**: ${v.transferable_points}\n` +
        `- **改编方法**: ${v.adaptation_method}\n`;
    });
    const md = `# 优秀视频观察库\n\n${lines.join('\n---\n\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `inspiration_videos_${new Date().toISOString().split('T')[0]}.md`;
    a.click(); URL.revokeObjectURL(url);
  };

  const getValueBadge = (level: string) => {
    const vl = VALUE_LEVEL_LABELS[level] || { text: level, cls: 'badge-gray' };
    return <span className={`badge ${vl.cls}`}>{vl.text}</span>;
  };

  const getStatusBadge = (status: string) => {
    const label = INSPIRATION_STATUS_LABELS[status] || status;
    const cls = status === 'adapted' ? 'badge-green' : status === 'filmed' ? 'badge-blue' : status === 'not_suitable' ? 'badge-gray' : 'badge-yellow';
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const calcTotal = (v: { hook_score?: number; visual_score?: number; b2b_fit_score?: number; packaging_fit_score?: number; adaptation_score?: number; transfer_score?: number }) =>
    (v.hook_score || 0) + (v.visual_score || 0) + (v.b2b_fit_score || 0) + (v.packaging_fit_score || 0) + (v.adaptation_score || 0) + (v.transfer_score || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">优秀视频观察库</h1>
          <p className="text-sm text-gray-500 mt-1">
            用于收集和拆解欧洲 TikTok 上值得学习的 B2B 制造业视频，包括软包装、包装机械、印刷、注塑、五金、食品工厂、工业品等内容。只学习视频结构、镜头语言和表达方式，并将其改编成适合软包装袋工厂自己的视频选题和脚本。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLinks(!showLinks)} className="btn-secondary text-xs">
            {showLinks ? '隐藏推荐入口' : '推荐观察入口'}
          </button>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowAdd(!showAdd); }} className="btn-primary">
            {showAdd ? '取消' : '+ 添加视频'}
          </button>
        </div>
      </div>

      {/* Compliance notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        本工具允许学习其他 B2B 制造业视频的拍摄结构和表达方式，但不能搬运、下载、复制对方视频，也不能冒充其客户案例。所有改编内容都必须使用我们自己的产品、工厂、测试和真实能力重新拍摄。
      </div>

      {/* Recommended observation links */}
      {showLinks && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">推荐观察入口</h2>
          <p className="text-xs text-gray-500 mb-3">以下入口用于寻找值得学习的视频。请打开后人工观看、判断和收藏，不要直接搬运视频。</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SEARCH_LINKS).map(([key, group]) => (
              <div key={key}>
                <h3 className="text-sm font-medium text-gray-700 mb-1">{group.label}</h3>
                <div className="space-y-1">
                  {group.queries.map((q) => (
                    <a key={q.text} href={q.url} target="_blank" rel="noopener noreferrer"
                      className="block text-xs text-blue-600 hover:underline">
                      TikTok 搜索：{q.text}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {showAdd && (
        <div className="card p-5">
          <h3 className="font-semibold mb-3">{editingId ? '编辑视频记录' : '添加新视频'}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">视频链接 *</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="label">平台</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                {INSPIRATION_PLATFORMS.map((p) => <option key={p} value={p}>{INSPIRATION_PLATFORM_LABELS[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">参考行业</label>
              <select value={form.reference_industry} onChange={(e) => setForm({ ...form, reference_industry: e.target.value })} className="input-field">
                {REFERENCE_INDUSTRIES.map((i) => <option key={i} value={i}>{REFERENCE_INDUSTRY_LABELS[i]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">账号名称</label>
              <input value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} className="input-field" placeholder="@account" />
            </div>
            <div>
              <label className="label">视频类型</label>
              <select value={form.video_type} onChange={(e) => setForm({ ...form, video_type: e.target.value })} className="input-field">
                {INSPIRATION_VIDEO_TYPES.map((t) => <option key={t} value={t}>{INSPIRATION_VIDEO_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">适合产品</label>
              <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} className="input-field">
                <option value="">请选择</option>
                {INSPIRATION_PRODUCT_TYPES.map((p) => <option key={p} value={p}>{INSPIRATION_PRODUCT_LABELS[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">状态</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                {Object.entries(INSPIRATION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label">迁移难度</label>
              <select value={form.transfer_difficulty} onChange={(e) => setForm({ ...form, transfer_difficulty: e.target.value })} className="input-field">
                {Object.entries(TRANSFER_DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v.text}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">标题/备注</label>
              <input value={form.title_or_note} onChange={(e) => setForm({ ...form, title_or_note: e.target.value })} className="input-field" placeholder="简要描述这个视频" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">为什么值得学习</label>
              <input value={form.why_good} onChange={(e) => setForm({ ...form, why_good: e.target.value })} className="input-field" placeholder="这个视频哪里做得好" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">可学习/可迁移的点</label>
              <input value={form.transferable_points} onChange={(e) => setForm({ ...form, transferable_points: e.target.value })} className="input-field" placeholder="哪些结构、镜头、表达方式可以迁移" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">如何改编成软包装内容</label>
              <input value={form.adaptation_method} onChange={(e) => setForm({ ...form, adaptation_method: e.target.value })} className="input-field" placeholder="如何用我们的产品和工厂改编" />
            </div>
          </div>

          {/* Scores */}
          <div className="mt-4 grid grid-cols-6 gap-3">
            {([
              ['hook_score', '第一秒吸引力'],
              ['visual_score', '画面清晰度'],
              ['b2b_fit_score', 'B2B 适配度'],
              ['packaging_fit_score', '软包装适配度'],
              ['adaptation_score', '改编价值'],
              ['transfer_score', '跨行业迁移'],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="label">{label} (1-5)</label>
                <select
                  value={String(form[key as keyof typeof form] || 3)}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-primary">{editingId ? '保存修改' : '添加视频'}</button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); setForm(emptyForm); }} className="btn-secondary">取消</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select value={fPlatform} onChange={(e) => setFPlatform(e.target.value)} className="input-field w-auto">
            <option value="">全部平台</option>
            {INSPIRATION_PLATFORMS.map((p) => <option key={p} value={p}>{INSPIRATION_PLATFORM_LABELS[p]}</option>)}
          </select>
          <select value={fIndustry} onChange={(e) => setFIndustry(e.target.value)} className="input-field w-auto">
            <option value="">全部行业</option>
            {REFERENCE_INDUSTRIES.map((i) => <option key={i} value={i}>{REFERENCE_INDUSTRY_LABELS[i]}</option>)}
          </select>
          <select value={fVideoType} onChange={(e) => setFVideoType(e.target.value)} className="input-field w-auto">
            <option value="">全部类型</option>
            {INSPIRATION_VIDEO_TYPES.map((t) => <option key={t} value={t}>{INSPIRATION_VIDEO_TYPE_LABELS[t]}</option>)}
          </select>
          <select value={fProductType} onChange={(e) => setFProductType(e.target.value)} className="input-field w-auto">
            <option value="">全部产品</option>
            {INSPIRATION_PRODUCT_TYPES.map((p) => <option key={p} value={p}>{INSPIRATION_PRODUCT_LABELS[p]}</option>)}
          </select>
          <select value={fValueLevel} onChange={(e) => setFValueLevel(e.target.value)} className="input-field w-auto">
            <option value="">全部价值</option>
            <option value="high">高价值参考</option>
            <option value="medium">可参考</option>
            <option value="low">暂不优先</option>
          </select>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="input-field w-auto">
            <option value="">全部状态</option>
            {Object.entries(INSPIRATION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input value={fSearch} onChange={(e) => setFSearch(e.target.value)} className="input-field w-48" placeholder="搜索账号、备注..." />
          <div className="ml-auto flex gap-2">
            <button onClick={handleExportCSV} className="btn-secondary text-xs">导出 CSV</button>
            <button onClick={handleExportMD} className="btn-secondary text-xs">导出 Markdown</button>
          </div>
        </div>
      </div>

      {/* Video list */}
      <div>
        <h2 className="text-lg font-semibold mb-3">视频列表 ({videos.length})</h2>
        {loading ? (
          <div className="card p-8 text-center text-gray-400">加载中...</div>
        ) : videos.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400 mb-2">暂无视频记录</p>
            <p className="text-xs text-gray-400">点击上方「添加视频」按钮开始记录值得学习的视频</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((v) => (
              <div key={v.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="badge badge-blue">{INSPIRATION_PLATFORM_LABELS[v.platform] || v.platform}</span>
                      <span className="badge badge-gray">{REFERENCE_INDUSTRY_LABELS[v.reference_industry] || v.reference_industry}</span>
                      <span className="badge badge-gray">{INSPIRATION_VIDEO_TYPE_LABELS[v.video_type] || v.video_type}</span>
                      {v.product_type && <span className="badge badge-gray">{INSPIRATION_PRODUCT_LABELS[v.product_type] || v.product_type}</span>}
                      {getStatusBadge(v.status)}
                      {getValueBadge(v.value_level)}
                      {v.transfer_difficulty && <span className={`badge ${TRANSFER_DIFFICULTY_LABELS[v.transfer_difficulty]?.cls || 'badge-gray'}`}>迁移{TRANSFER_DIFFICULTY_LABELS[v.transfer_difficulty]?.text || v.transfer_difficulty}</span>}
                      <span className="text-xs text-gray-500">总分: {v.total_score}/30</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{v.title_or_note || v.account_name || 'Untitled'}</h3>
                    {v.account_name && <p className="text-xs text-gray-500">{v.account_name}{v.country ? ` (${v.country})` : ''}</p>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {v.video_url && (
                      <a href={v.video_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">打开视频</a>
                    )}
                    {v.video_url && (
                      <button onClick={() => copyText(v.video_url, `url-${v.id}`)} className="btn-secondary text-xs">
                        {copiedField === `url-${v.id}` ? '已复制' : '复制链接'}
                      </button>
                    )}
                    <button onClick={() => handleEdit(v)} className="btn-secondary text-xs">编辑</button>
                    <button onClick={() => handleDelete(v.id)} className="btn-danger text-xs">删除</button>
                  </div>
                </div>

                {/* Score bar */}
                <div className="flex gap-4 text-xs text-gray-500 mb-3">
                  <span>吸引力 {v.hook_score}/5</span>
                  <span>画面 {v.visual_score}/5</span>
                  <span>B2B {v.b2b_fit_score}/5</span>
                  <span>包装适配 {v.packaging_fit_score}/5</span>
                  <span>改编 {v.adaptation_score}/5</span>
                  <span>迁移 {v.transfer_score || 0}/5</span>
                </div>

                {/* Analysis content */}
                {(v.why_good || v.transferable_points || v.how_to_adapt_for_factory) && (
                  <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                    {v.why_good && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">为什么值得学习</p>
                        <p className="text-gray-700">{v.why_good}</p>
                      </div>
                    )}
                    {v.transferable_points && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">可迁移的点</p>
                        <p className="text-gray-700">{v.transferable_points}</p>
                      </div>
                    )}
                    {v.how_to_adapt_for_factory && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">如何改编</p>
                        <p className="text-gray-700">{v.how_to_adapt_for_factory}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => openAnalysis(v)} className="btn-primary text-xs">
                    {v.first_second_hook ? '查看/编辑拆解' : '拆解视频'}
                  </button>
                  <button onClick={() => handleGenerateAdaptation(v.id)} disabled={adaptLoading} className="btn-secondary text-xs">
                    {adaptLoading ? '生成中...' : '生成软包装改编方案'}
                  </button>
                  <button onClick={() => handleAddToRecommendations(v.id)} className="btn-secondary text-xs">
                    加入今日选题
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis modal */}
      {showAnalysis && analysisVideo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">视频拆解</h2>
              <button onClick={() => { setShowAnalysis(null); setAnalysisVideo(null); }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Section 1: Hook analysis */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">开头分析</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">第一秒出现了什么？</label>
                    <input value={analysisVideo.first_second_hook} onChange={(e) => setAnalysisVideo({ ...analysisVideo, first_second_hook: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">为什么会让人停下来？</label>
                    <input value={analysisVideo.main_visual} onChange={(e) => setAnalysisVideo({ ...analysisVideo, main_visual: e.target.value })} className="input-field" />
                  </div>
                </div>
              </div>

              {/* Section 2: Visual analysis */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">画面与节奏</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="label">视频核心动作</label>
                    <input value={analysisVideo.hook_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, hook_style: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">主体画面</label>
                    <input value={analysisVideo.shot_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, shot_style: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">有没有手部动作？</label>
                    <input value={analysisVideo.subtitle_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, subtitle_style: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">有没有近景细节？</label>
                    <input value={analysisVideo.editing_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, editing_style: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">有没有机器/产品/测试/对比？</label>
                    <input value={analysisVideo.cta_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, cta_style: e.target.value })} className="input-field" />
                  </div>
                </div>
              </div>

              {/* Section 3: Style dropdowns */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">风格标签</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="label">Hook 风格</label>
                    <select value={analysisVideo.hook_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, hook_style: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {HOOK_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">镜头风格</label>
                    <select value={analysisVideo.shot_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, shot_style: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {SHOT_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">字幕风格</label>
                    <select value={analysisVideo.subtitle_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, subtitle_style: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {SUBTITLE_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">节奏风格</label>
                    <select value={analysisVideo.editing_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, editing_style: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {EDITING_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">CTA 风格</label>
                    <select value={analysisVideo.cta_style} onChange={(e) => setAnalysisVideo({ ...analysisVideo, cta_style: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {CTA_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Cross-industry migration */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">跨行业迁移分析</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">这个视频属于哪个 B2B 行业？</label>
                    <select value={analysisVideo.reference_industry || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, reference_industry: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {REFERENCE_INDUSTRIES.map((i) => <option key={i} value={i}>{REFERENCE_INDUSTRY_LABELS[i]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">最值得学习的是 Hook、镜头、流程、测试还是 CTA？</label>
                    <input value={analysisVideo.transferable_points || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, transferable_points: e.target.value })} className="input-field" placeholder="例如：镜头语言和流程结构" />
                  </div>
                  <div>
                    <label className="label">这个视频结构能不能迁移到软包装行业？</label>
                    <input value={analysisVideo.adaptation_method || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, adaptation_method: e.target.value })} className="input-field" placeholder="可以/不可以，原因" />
                  </div>
                  <div>
                    <label className="label">如果迁移到软包装，应该用哪个产品拍？</label>
                    <select value={analysisVideo.product_type || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, product_type: e.target.value })} className="input-field">
                      <option value="">请选择</option>
                      {INSPIRATION_PRODUCT_TYPES.map((p) => <option key={p} value={p}>{INSPIRATION_PRODUCT_LABELS[p]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">哪些元素可以学习？</label>
                    <input value={analysisVideo.adaptation_risk || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, adaptation_risk: e.target.value })} className="input-field" placeholder="例如：流程结构、镜头切换节奏" />
                  </div>
                  <div>
                    <label className="label">哪些元素不能照搬？</label>
                    <input value={analysisVideo.what_not_to_copy} onChange={(e) => setAnalysisVideo({ ...analysisVideo, what_not_to_copy: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">如果用我们工厂重新拍，第一秒应该拍什么？</label>
                    <input value={analysisVideo.soft_packaging_version || ''} onChange={(e) => setAnalysisVideo({ ...analysisVideo, soft_packaging_version: e.target.value })} className="input-field" placeholder="例如：空袋特写" />
                  </div>
                  <div>
                    <label className="label">如果用我们产品重新拍，核心动作是什么？</label>
                    <input value={analysisVideo.how_to_adapt_for_factory} onChange={(e) => setAnalysisVideo({ ...analysisVideo, how_to_adapt_for_factory: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">适合做成哪种内容类型？</label>
                    <select value={analysisVideo.video_type} onChange={(e) => setAnalysisVideo({ ...analysisVideo, video_type: e.target.value })} className="input-field">
                      {INSPIRATION_VIDEO_TYPES.map((t) => <option key={t} value={t}>{INSPIRATION_VIDEO_TYPE_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">是否适合欧洲 B2B 客户？</label>
                    <select value={analysisVideo.b2b_fit_score} onChange={(e) => setAnalysisVideo({ ...analysisVideo, b2b_fit_score: Number(e.target.value) })} className="input-field">
                      {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} 分</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Learning notes */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">学习笔记</h3>
                <div className="space-y-3">
                  <div>
                    <label className="label">这个视频为什么值得学习？</label>
                    <textarea value={analysisVideo.why_good} onChange={(e) => setAnalysisVideo({ ...analysisVideo, why_good: e.target.value })} className="input-field" rows={2} />
                  </div>
                  <div>
                    <label className="label">拍摄时需要准备哪些物料？</label>
                    <textarea value={analysisVideo.what_to_learn} onChange={(e) => setAnalysisVideo({ ...analysisVideo, what_to_learn: e.target.value })} className="input-field" rows={2} />
                  </div>
                </div>
              </div>

              {/* Section 6: Scores */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">评分 (1-5 分)</h3>
                <div className="grid grid-cols-6 gap-3">
                  {([
                    ['hook_score', '第一秒吸引力'],
                    ['visual_score', '画面清晰度'],
                    ['b2b_fit_score', 'B2B 适配度'],
                    ['packaging_fit_score', '软包装适配度'],
                    ['adaptation_score', '改编价值'],
                    ['transfer_score', '跨行业迁移'],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <select
                        value={String(analysisVideo[key as keyof Video] || 3)}
                        onChange={(e) => setAnalysisVideo({ ...analysisVideo, [key]: Number(e.target.value) } as Video)}
                        className="input-field"
                      >
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  总分: {calcTotal(analysisVideo)}/30
                  {calcTotal(analysisVideo) >= 28 ? ' (高价值参考)' : calcTotal(analysisVideo) >= 21 ? ' (可参考)' : ' (暂不优先)'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={saveAnalysis} className="btn-primary">保存拆解</button>
              <button onClick={() => { setShowAnalysis(null); setAnalysisVideo(null); }} className="btn-secondary">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Adaptation display */}
      {adaptation && (
        <div className="card p-5 border-green-200 bg-green-50">
          <h2 className="text-lg font-semibold mb-3">生成的软包装改编方案</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">原视频结构总结</p>
              <p className="text-gray-800">{adaptation.transferable_points}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">可迁移点</p>
              <p className="text-gray-800">{adaptation.transferable_points}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">不可照搬点</p>
              <p className="text-gray-800">{adaptation.adaptation_risk}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">软包装改编方向</p>
              <p className="text-gray-800">{adaptation.adaptation_method}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">英文标题</p>
              <p className="text-gray-800">{adaptation.title_en}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">中文解释</p>
              <p className="text-gray-800">{adaptation.title_cn}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">适合产品</p>
              <p className="text-gray-800">{adaptation.product_type}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">目标市场</p>
              <p className="text-gray-800">{adaptation.target_market}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">目标客户</p>
              <p className="text-gray-800">{adaptation.target_customer}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">视频 Hook</p>
              <p className="text-gray-800">{adaptation.hook}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">15-30 秒英文脚本</p>
              <p className="text-gray-800 bg-white p-2 rounded whitespace-pre-wrap">{adaptation.script_en}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">中文拍摄镜头清单</p>
              <ol className="list-decimal list-inside text-gray-700 text-xs space-y-0.5">
                {adaptation.shot_list_cn.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">TikTok Caption</p>
                <p className="text-gray-800 text-xs">{adaptation.caption}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Hashtags</p>
                <p className="text-blue-600 text-xs">{adaptation.hashtags}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">CTA</p>
                <p className="text-gray-800 text-xs">{adaptation.cta}</p>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>难度: {adaptation.difficulty}</span>
                <span>优先级: {adaptation.priority === 1 ? '高' : adaptation.priority === 2 ? '中' : '低'}</span>
                <span>迁移难度: {TRANSFER_DIFFICULTY_LABELS[adaptation.transfer_difficulty]?.text || adaptation.transfer_difficulty}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => copyText(JSON.stringify(adaptation, null, 2), 'adapt-json')} className="btn-secondary text-xs">
              {copiedField === 'adapt-json' ? '已复制' : '复制方案'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
