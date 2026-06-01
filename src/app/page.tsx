'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PRODUCT_TYPES, PRODUCT_LABELS, MARKETS, MARKET_LABELS,
  STATUS_LABELS, DIFFICULTY_LABELS, PRIORITY_LABELS,
} from '@/lib/types';

interface Rec {
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
}

interface Trend {
  id: number;
  date: string;
  country: string;
  trend_type: string;
  keyword: string;
  heat_score: number;
  b2b_fit_score: number;
  packaging_fit_score: number;
}

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [recommendations, setRecommendations] = useState<Rec[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [showAddTrend, setShowAddTrend] = useState(false);
  const [newTrend, setNewTrend] = useState({ keyword: '', country: 'EU', trend_type: 'keyword', description: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date });
      if (productFilter) params.set('product', productFilter);
      if (marketFilter) params.set('market', marketFilter);

      const [recRes, trendRes] = await Promise.all([
        fetch(`/api/recommendations/today?${params}`),
        fetch(`/api/trends?date=${date}`),
      ]);
      setRecommendations(await recRes.json());
      setTrends(await trendRes.json());
    } catch (e) {
      console.error('获取数据失败:', e);
    }
    setLoading(false);
  }, [date, productFilter, marketFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, count: 8, force: true }),
      });
      const data = await res.json();
      alert(data.message || '生成完成');
      fetchData();
    } catch (e) {
      alert('生成失败，请检查 API Key、模型配置或网络连接。');
    }
    setGenerating(false);
  };

  const handleAddTrend = async () => {
    if (!newTrend.keyword.trim()) return;
    try {
      await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTrend, date }),
      });
      setNewTrend({ keyword: '', country: 'EU', trend_type: 'keyword', description: '' });
      setShowAddTrend(false);
      fetchData();
    } catch (e) {
      alert('添加热点失败');
    }
  };

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyRecAsMarkdown = (r: Rec) => {
    const shotList = (() => { try { return JSON.parse(r.shot_list_cn || r.shot_list); } catch { return []; } })();
    const md = `## ${r.title_en}\n\n${r.title_cn}\n\n**Product**: ${r.product_type} | **Market**: ${r.target_market}\n\n**Hook**: ${r.hook}\n\n**Script**:\n${r.script_en}\n\n**Shot List**:\n${shotList.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\n**Caption**: ${r.caption}\n\n**Hashtags**: ${r.hashtags}\n\n**CTA**: ${r.cta}`;
    copyText(md, `md-${r.id}`);
  };

  const handleExport = (format: string) => {
    const params = new URLSearchParams({ format, date });
    window.open(`/api/export?${params}`, '_blank');
  };

  const getShotList = (r: Rec): string[] => {
    try {
      const cn = r.shot_list_cn ? JSON.parse(r.shot_list_cn) : null;
      if (cn && cn.length > 0) return cn;
    } catch {}
    try { return JSON.parse(r.shot_list); } catch { return []; }
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">今日选题工作台</h1>
          <p className="text-sm text-gray-500 mt-1">
            为软包装袋工厂每日生成适合欧洲市场的 TikTok 视频选题、英文脚本、拍摄建议和发布文案。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-auto"
          />
          <button onClick={handleGenerate} disabled={generating} className="btn-primary">
            {generating ? '生成中...' : '生成今日选题'}
          </button>
        </div>
      </div>

      {/* 筛选条件 + 导出 */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="label">产品类型</label>
            <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="input-field w-52">
              <option value="">全部产品</option>
              {PRODUCT_TYPES.map((p) => <option key={p} value={p}>{PRODUCT_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="label">目标市场</label>
            <select value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)} className="input-field w-40">
              <option value="">全部市场</option>
              {MARKETS.map((m) => <option key={m} value={m}>{MARKET_LABELS[m]}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2 ml-auto">
            <button onClick={() => handleExport('csv')} className="btn-secondary">导出 CSV</button>
            <button onClick={() => handleExport('markdown')} className="btn-secondary">导出 Markdown</button>
          </div>
        </div>
      </div>

      {/* 今日热点概览 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">今日热点概览 ({trends.length})</h2>
          <button onClick={() => setShowAddTrend(!showAddTrend)} className="btn-secondary text-xs">
            {showAddTrend ? '取消' : '+ 添加热点'}
          </button>
        </div>

        {showAddTrend && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              placeholder="热点关键词"
              value={newTrend.keyword}
              onChange={(e) => setNewTrend({ ...newTrend, keyword: e.target.value })}
              className="input-field"
            />
            <select
              value={newTrend.country}
              onChange={(e) => setNewTrend({ ...newTrend, country: e.target.value })}
              className="input-field"
            >
              <option value="EU">欧洲综合</option>
              {MARKETS.map((m) => <option key={m} value={m}>{MARKET_LABELS[m]}</option>)}
            </select>
            <select
              value={newTrend.trend_type}
              onChange={(e) => setNewTrend({ ...newTrend, trend_type: e.target.value })}
              className="input-field"
            >
              <option value="keyword">关键词</option>
              <option value="hashtag">话题标签</option>
              <option value="sound">热门声音</option>
              <option value="video format">视频形式</option>
              <option value="industry topic">行业话题</option>
            </select>
            <button onClick={handleAddTrend} className="btn-primary">添加热点</button>
          </div>
        )}

        {trends.length === 0 ? (
          <p className="text-sm text-gray-400">暂无热点数据，请先添加今天看到的 TikTok 热点关键词。</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trends.map((t) => (
              <span key={t.id} className="badge badge-blue">
                {t.keyword} ({t.country}) 热度 {t.heat_score}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 今日推荐选题 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          今日推荐选题 ({recommendations.length})
        </h2>

        {loading ? (
          <div className="card p-8 text-center text-gray-400">加载中...</div>
        ) : recommendations.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400 mb-2">暂无数据，请先添加热点或生成今日选题。</p>
            <p className="text-xs text-gray-400 mb-4">点击上方「生成今日选题」按钮开始</p>
            <button onClick={handleGenerate} className="btn-primary">
              生成今日选题
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((r) => {
              const pri = PRIORITY_LABELS[r.priority] || PRIORITY_LABELS[3];
              const diff = DIFFICULTY_LABELS[r.difficulty] || { text: r.difficulty, cls: 'badge-gray' };
              const statusLabel = STATUS_LABELS[r.status] || r.status;
              const shotList = getShotList(r);

              return (
                <div key={r.id} className="card p-5">
                  {/* 头部标签和标题 */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`badge ${pri.cls}`}>优先级 {pri.text}</span>
                        <span className={`badge ${diff.cls}`}>难度 {diff.text}</span>
                        <span className="badge badge-blue">{PRODUCT_LABELS[r.product_type] || r.product_type}</span>
                        <span className="badge badge-gray">{MARKET_LABELS[r.target_market] || r.target_market}</span>
                        <span className="badge badge-gray">{statusLabel}</span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{r.title_en}</h3>
                      <p className="text-sm text-gray-600 mt-1">{r.title_cn}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyRecAsMarkdown(r)}
                        className="btn-secondary text-xs whitespace-nowrap"
                      >
                        {copiedField === `md-${r.id}` ? '已复制!' : '复制全部'}
                      </button>
                    </div>
                  </div>

                  {/* 详细内容 */}
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {/* 目标客户 */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">目标客户</p>
                      <p className="text-gray-800">{r.target_customer}</p>
                    </div>

                    {/* Hook */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 mb-1">视频开头 Hook</p>
                        <button onClick={() => copyText(r.hook, `hook-${r.id}`)} className="text-xs text-blue-600 hover:underline">
                          {copiedField === `hook-${r.id}` ? '已复制' : '复制'}
                        </button>
                      </div>
                      <p className="text-gray-800">{r.hook}</p>
                    </div>

                    {/* 英文脚本 */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 mb-1">15-30 秒英文脚本</p>
                        <button onClick={() => copyText(r.script_en, `script-${r.id}`)} className="text-xs text-blue-600 hover:underline">
                          {copiedField === `script-${r.id}` ? '已复制' : '复制脚本'}
                        </button>
                      </div>
                      <p className="text-gray-800 bg-gray-50 p-2 rounded whitespace-pre-wrap">{r.script_en}</p>
                    </div>

                    {/* 拍摄镜头清单 */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">拍摄镜头清单</p>
                      <ol className="list-decimal list-inside text-gray-700 text-xs space-y-0.5">
                        {shotList.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ol>
                    </div>

                    {/* Caption / Hashtags / CTA */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-500 mb-1">TikTok Caption</p>
                          <button onClick={() => copyText(r.caption, `caption-${r.id}`)} className="text-xs text-blue-600 hover:underline">
                            {copiedField === `caption-${r.id}` ? '已复制' : '复制文案'}
                          </button>
                        </div>
                        <p className="text-gray-800 text-xs">{r.caption}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-500 mb-1">Hashtags</p>
                          <button onClick={() => copyText(r.hashtags, `hash-${r.id}`)} className="text-xs text-blue-600 hover:underline">
                            {copiedField === `hash-${r.id}` ? '已复制' : '复制'}
                          </button>
                        </div>
                        <p className="text-blue-600 text-xs">{r.hashtags}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-500 mb-1">CTA</p>
                          <button onClick={() => copyText(r.cta, `cta-${r.id}`)} className="text-xs text-blue-600 hover:underline">
                            {copiedField === `cta-${r.id}` ? '已复制' : '复制'}
                          </button>
                        </div>
                        <p className="text-gray-800 text-xs">{r.cta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 使用流程说明 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-3">如何使用这个工具？</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
          <li>先添加今天看到的 TikTok 热点关键词、视频形式或同行内容</li>
          <li>点击「生成今日选题」</li>
          <li>从推荐选题中选择 1-3 条适合工厂拍摄的内容</li>
          <li>按照镜头清单拍摄视频</li>
          <li>复制英文标题、Caption、Hashtags 和 CTA</li>
          <li>发布后记录播放量、互动和询盘数量</li>
          <li>每周复盘哪些内容带来更多有效客户</li>
        </ol>
      </div>
    </div>
  );
}
