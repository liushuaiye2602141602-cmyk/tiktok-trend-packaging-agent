'use client';

import { useEffect, useState, useCallback } from 'react';

interface HotVideo {
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

const SOURCE_TYPE_LABELS: Record<string, string> = {
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

const CONFIDENCE_LABELS: Record<string, { text: string; cls: string }> = {
  'high': { text: '高 - 有官方趋势来源或真实视频链接', cls: 'badge-green' },
  'medium': { text: '中 - 有搜索入口或人工录入链接', cls: 'badge-yellow' },
  'low': { text: '低 - 仅为AI推测或缺少热度数据', cls: 'badge-red' },
};

const VERIFICATION_LABELS: Record<string, { text: string; cls: string }> = {
  'unverified': { text: '未验证', cls: 'badge-gray' },
  'opened': { text: '已打开查看', cls: 'badge-yellow' },
  'verified': { text: '已确认真实', cls: 'badge-green' },
  'useful': { text: '值得参考', cls: 'badge-green' },
  'not_useful': { text: '不值得参考', cls: 'badge-gray' },
  'invalid': { text: '链接失效', cls: 'badge-red' },
};

const HEAT_EVIDENCE_OPTIONS = [
  '官方趋势入口',
  'TikTok 搜索结果入口',
  '用户手动发现',
  '竞争对手账号待观察',
  'Google Trends 辅助趋势',
  'AI 生成的观察方向，未验证',
];

const INDUSTRY_OPTIONS = [
  'flexible packaging', 'packaging machinery', 'printing', 'label paper packaging',
  'injection molding', 'metal parts', 'food factory', 'pet food factory',
  'cosmetics factory', 'electronics manufacturing', 'logistics warehouse',
  'industrial supplier', 'export factory', 'other b2b manufacturing',
];

const INDUSTRY_LABELS: Record<string, string> = {
  'flexible packaging': '软包装',
  'packaging machinery': '包装机械',
  'printing': '印刷',
  'label paper packaging': '标签/纸盒',
  'injection molding': '注塑/模具',
  'metal parts': '五金加工',
  'food factory': '食品工厂',
  'pet food factory': '宠物食品工厂',
  'cosmetics factory': '化妆品工厂',
  'electronics manufacturing': '电子元件',
  'logistics warehouse': '物流/仓储',
  'industrial supplier': '工业品供应',
  'export factory': '外贸工厂',
  'other b2b manufacturing': '其他B2B制造业',
};

const VIDEO_TYPES = [
  'factory showcase', 'production process', 'product showcase', 'test experiment',
  'packaging knowledge', 'problem comparison', 'customer pain point',
  'asmr satisfying', 'packing shipping', 'exhibition content',
  'trend overview', 'competitor content', 'other',
];

const VIDEO_TYPE_LABELS: Record<string, string> = {
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

const COUNTRIES = ['UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'EU'];

const emptyForm = {
  platform: 'TikTok',
  source_type: 'Manual Input',
  source_name: '',
  source_url: '',
  video_url: '',
  search_url: '',
  country: 'EU',
  keyword: '',
  hashtag: '',
  title_or_caption: '',
  creator_name: '',
  reference_industry: 'flexible packaging',
  video_type: 'other',
  product_relevance: '',
  trend_reason: '',
  heat_evidence: '用户手动发现',
  confidence_level: 'medium',
  why_worth_watching: '',
  what_to_observe: '',
  user_note: '',
};

export default function DailyHotVideosPage() {
  const today = new Date().toISOString().split('T')[0];
  const [items, setItems] = useState<HotVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Filters
  const [fDate, setFDate] = useState(today);
  const [fCountry, setFCountry] = useState('');
  const [fSource, setFSource] = useState('');
  const [fConfidence, setFConfidence] = useState('');
  const [fVerification, setFVerification] = useState('');
  const [fIndustry, setFIndustry] = useState('');
  const [fVideoType, setFVideoType] = useState('');
  const [fSearch, setFSearch] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fDate) params.set('date', fDate);
    if (fCountry) params.set('country', fCountry);
    if (fSource) params.set('source_type', fSource);
    if (fConfidence) params.set('confidence_level', fConfidence);
    if (fVerification) params.set('verification_status', fVerification);
    if (fIndustry) params.set('reference_industry', fIndustry);
    if (fVideoType) params.set('video_type', fVideoType);
    if (fSearch) params.set('search', fSearch);
    const res = await fetch(`/api/daily-hot-videos?${params}`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, [fDate, fCountry, fSource, fConfidence, fVerification, fIndustry, fVideoType, fSearch]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const generateChecklist = async () => {
    setGenerating(true);
    setMsg('');
    const res = await fetch('/api/daily-hot-videos/generate-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: fDate }),
    });
    const data = await res.json();
    if (data.count > 0) {
      setMsg(`已生成 ${data.count} 条采集入口`);
    } else {
      setMsg(`${fDate} 已有采集清单，不会重复生成`);
    }
    setGenerating(false);
    fetchItems();
  };

  const handleAdd = async () => {
    setSaving(true);
    setMsg('');
    await fetch('/api/daily-hot-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, collected_date: fDate }),
    });
    setSaving(false);
    setShowAdd(false);
    setForm(emptyForm);
    setMsg('已添加');
    fetchItems();
  };

  const markVerified = async (id: number, status: string) => {
    await fetch(`/api/daily-hot-videos/${id}/mark-verified`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchItems();
  };

  const markUseful = async (id: number, useful: boolean) => {
    await fetch(`/api/daily-hot-videos/${id}/mark-useful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useful }),
    });
    fetchItems();
  };

  const addToInspiration = async (id: number) => {
    const res = await fetch(`/api/daily-hot-videos/${id}/add-to-inspiration`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setMsg(`已加入优秀视频观察库 (ID: ${data.inspiration_id})`);
      fetchItems();
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await fetch(`/api/daily-hot-videos/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const getLink = (item: HotVideo) => {
    if (item.video_url) return item.video_url;
    if (item.search_url) return item.search_url;
    if (item.source_url) return item.source_url;
    return '';
  };

  const exportCSV = () => {
    const headers = ['日期', '来源类型', '链接', '关键词', '国家', '热度依据', '可信度', '验证状态', '用户备注'];
    const rows = items.map((r) => [
      r.collected_date,
      SOURCE_TYPE_LABELS[r.source_type] || r.source_type,
      getLink(r),
      r.keyword,
      r.country,
      r.heat_evidence,
      CONFIDENCE_LABELS[r.confidence_level]?.text || r.confidence_level,
      VERIFICATION_LABELS[r.verification_status]?.text || r.verification_status,
      r.user_note,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const bom = '﻿';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-hot-videos-${fDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    let md = `# 每日热点视频采集 - ${fDate}\n\n`;
    md += `| 日期 | 来源类型 | 链接 | 关键词 | 国家 | 可信度 | 验证状态 |\n`;
    md += `|------|---------|------|--------|------|--------|----------|\n`;
    for (const r of items) {
      const link = getLink(r);
      const linkStr = link ? `[打开](${link})` : '无链接';
      md += `| ${r.collected_date} | ${SOURCE_TYPE_LABELS[r.source_type] || r.source_type} | ${linkStr} | ${r.keyword} | ${r.country} | ${CONFIDENCE_LABELS[r.confidence_level]?.text || ''} | ${VERIFICATION_LABELS[r.verification_status]?.text || ''} |\n`;
    }
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-hot-videos-${fDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalItems = items.length;
  const verifiedCount = items.filter((r) => r.verification_status === 'verified' || r.verification_status === 'useful').length;
  const unverifiedCount = items.filter((r) => r.verification_status === 'unverified').length;
  const usefulCount = items.filter((r) => r.verification_status === 'useful').length;
  const linkCount = items.filter((r) => getLink(r)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">每日热点视频采集中心</h1>
          <p className="text-sm text-gray-500 mt-1">每天收集真实存在的TikTok热点视频入口和B2B制造业参考链接</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">导出CSV</button>
          <button onClick={exportMarkdown} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">导出MD</button>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p className="font-medium">本模块的目标不是自动搬运 TikTok 视频，而是每天为你整理一批真实可打开的趋势入口和视频链接。请人工打开判断真实性和参考价值。只有你确认&ldquo;值得参考&rdquo;的视频，才会进入优秀视频观察库。</p>
        <p className="mt-1 text-xs text-amber-600">所有 AI 推测方向均标记为&ldquo;未验证&rdquo;，需人工确认后才能作为参考依据。</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
          <div className="text-xs text-gray-500">今日采集总数</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{linkCount}</div>
          <div className="text-xs text-gray-500">含真实链接</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-600">{unverifiedCount}</div>
          <div className="text-xs text-gray-500">待验证</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">{verifiedCount}</div>
          <div className="text-xs text-gray-500">已确认</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{usefulCount}</div>
          <div className="text-xs text-gray-500">值得参考</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateChecklist}
          disabled={generating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {generating ? '生成中...' : '生成今日热点采集清单'}
        </button>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          {showAdd ? '关闭添加表单' : '手动添加热点视频'}
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          {msg}
          <button onClick={() => setMsg('')} className="ml-2 text-blue-400 hover:text-blue-600">x</button>
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border rounded-lg p-5 space-y-4">
          <h3 className="font-bold text-lg">手动添加热点视频</h3>
          <p className="text-xs text-gray-500">粘贴你发现的真实 TikTok 视频链接，填写相关信息</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">视频链接 *</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="https://www.tiktok.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">来源链接</label>
              <input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="来源页面链接" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">账号名称</label>
              <input value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="@account" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">国家</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">关键词</label>
              <input value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="packaging factory" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">标签</label>
              <input value={form.hashtag} onChange={(e) => setForm({ ...form, hashtag: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="#packaging" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">来源类型</label>
              <select value={form.source_type} onChange={(e) => setForm({ ...form, source_type: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {Object.entries(SOURCE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">参考行业</label>
              <select value={form.reference_industry} onChange={(e) => setForm({ ...form, reference_industry: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{INDUSTRY_LABELS[i] || i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">视频类型</label>
              <select value={form.video_type} onChange={(e) => setForm({ ...form, video_type: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {VIDEO_TYPES.map((t) => <option key={t} value={t}>{VIDEO_TYPE_LABELS[t] || t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">可信度</label>
              <select value={form.confidence_level} onChange={(e) => setForm({ ...form, confidence_level: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.text}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">热度依据</label>
              <select value={form.heat_evidence} onChange={(e) => setForm({ ...form, heat_evidence: e.target.value })} className="w-full border rounded px-3 py-2 text-sm">
                {HEAT_EVIDENCE_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">标题/描述</label>
              <input value={form.title_or_caption} onChange={(e) => setForm({ ...form, title_or_caption: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="视频标题或描述" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">为什么觉得值得看</label>
              <textarea value={form.why_worth_watching} onChange={(e) => setForm({ ...form, why_worth_watching: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">建议观察什么</label>
              <textarea value={form.what_to_observe} onChange={(e) => setForm({ ...form, what_to_observe: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" rows={2} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">备注</label>
            <input value={form.user_note} onChange={(e) => setForm({ ...form, user_note: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <button onClick={handleAdd} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm">
            {saving ? '保存中...' : '添加'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">日期</label>
            <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">国家</label>
            <select value={fCountry} onChange={(e) => setFCountry(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">来源类型</label>
            <select value={fSource} onChange={(e) => setFSource(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {Object.entries(SOURCE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">可信度</label>
            <select value={fConfidence} onChange={(e) => setFConfidence(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.text}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">验证状态</label>
            <select value={fVerification} onChange={(e) => setFVerification(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {Object.entries(VERIFICATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v.text}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">参考行业</label>
            <select value={fIndustry} onChange={(e) => setFIndustry(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{INDUSTRY_LABELS[i] || i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">视频类型</label>
            <select value={fVideoType} onChange={(e) => setFVideoType(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">全部</option>
              {VIDEO_TYPES.map((t) => <option key={t} value={t}>{VIDEO_TYPE_LABELS[t] || t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">搜索</label>
            <input value={fSearch} onChange={(e) => setFSearch(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" placeholder="关键词..." />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          暂无采集记录。点击&ldquo;生成今日热点采集清单&rdquo;开始。
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const link = getLink(item);
            const conf = CONFIDENCE_LABELS[item.confidence_level];
            const ver = VERIFICATION_LABELS[item.verification_status];
            const isAiOnly = item.source_type === 'AI Suggested Only' || item.confidence_level === 'low';
            return (
              <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {SOURCE_TYPE_LABELS[item.source_type] || item.source_type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${ver?.cls || 'badge-gray'}`}>
                        {ver?.text || item.verification_status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${conf?.cls || 'badge-gray'}`}>
                        可信度: {conf?.text || item.confidence_level}
                      </span>
                      {item.reference_industry && (
                        <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                          {INDUSTRY_LABELS[item.reference_industry] || item.reference_industry}
                        </span>
                      )}
                      {isAiOnly && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">
                          AI推测方向，未验证为真实热点
                        </span>
                      )}
                      {item.can_add_to_inspiration && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">已加入观察库</span>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {item.title_or_caption || item.keyword || item.source_name}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                      {item.keyword && <span>关键词: {item.keyword}</span>}
                      {item.hashtag && <span>标签: {item.hashtag}</span>}
                      {item.country && <span>国家: {item.country}</span>}
                      {item.creator_name && <span>账号: {item.creator_name}</span>}
                    </div>

                    {item.heat_evidence && (
                      <div className="text-xs text-gray-500 mb-1">
                        热度依据: <span className="font-medium">{item.heat_evidence}</span>
                      </div>
                    )}

                    {item.why_worth_watching && (
                      <div className="text-xs text-gray-600 mb-1">
                        值得观察: {item.why_worth_watching}
                      </div>
                    )}

                    {item.what_to_observe && (
                      <div className="text-xs text-gray-600 mb-1">
                        观察要点: {item.what_to_observe}
                      </div>
                    )}

                    {/* Link */}
                    {link && (
                      <div className="text-xs text-blue-600 truncate mt-1">
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      </div>
                    )}

                    {!link && (
                      <div className="text-xs text-orange-500 mt-1">无真实链接 - 仅为待观察入口</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-center"
                      >
                        打开链接
                      </a>
                    )}
                    {item.verification_status === 'unverified' && (
                      <>
                        <button onClick={() => markVerified(item.id, 'opened')} className="px-3 py-1 text-xs bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100">
                          已打开
                        </button>
                        <button onClick={() => markVerified(item.id, 'verified')} className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100">
                          已确认真实
                        </button>
                      </>
                    )}
                    {(item.verification_status === 'opened' || item.verification_status === 'verified') && (
                      <>
                        <button onClick={() => markUseful(item.id, true)} className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100">
                          值得参考
                        </button>
                        <button onClick={() => markUseful(item.id, false)} className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                          不值得
                        </button>
                      </>
                    )}
                    {item.verification_status === 'useful' && !item.can_add_to_inspiration && (
                      <button onClick={() => addToInspiration(item.id)} className="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                        加入观察库
                      </button>
                    )}
                    <button onClick={() => markVerified(item.id, 'invalid')} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">
                      链接失效
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="px-3 py-1 text-xs text-gray-400 hover:text-red-600">
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
