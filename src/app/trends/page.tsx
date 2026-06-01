'use client';

import { useState, useEffect, useCallback } from 'react';
import { MARKETS, MARKET_LABELS, TREND_TYPES, TREND_TYPE_LABELS } from '@/lib/types';

interface Trend {
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
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    keyword: '', country: 'EU', trend_type: 'keyword', description: '',
    heat_score: 50, b2b_fit_score: 50, packaging_fit_score: 50,
  });

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trends');
      setTrends(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTrends(); }, [fetchTrends]);

  const handleSubmit = async () => {
    if (!form.keyword.trim()) return;
    await fetch('/api/trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date: new Date().toISOString().split('T')[0] }),
    });
    setForm({ keyword: '', country: 'EU', trend_type: 'keyword', description: '', heat_score: 50, b2b_fit_score: 50, packaging_fit_score: 50 });
    setShowForm(false);
    fetchTrends();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条热点？')) return;
    await fetch(`/api/trends?id=${id}`, { method: 'DELETE' });
    fetchTrends();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">热点管理</h1>
          <p className="text-sm text-gray-500">追踪欧洲 TikTok 软包装行业热点趋势</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 添加热点'}
        </button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold mb-3">添加新热点</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">热点关键词 *</label>
              <input value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} className="input-field" placeholder="例如 pet food packaging" />
            </div>
            <div>
              <label className="label">国家/地区</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field">
                <option value="EU">欧洲综合 EU</option>
                {MARKETS.map((m) => <option key={m} value={m}>{MARKET_LABELS[m] || m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">热点类型</label>
              <select value={form.trend_type} onChange={(e) => setForm({ ...form, trend_type: e.target.value })} className="input-field">
                {TREND_TYPES.map((t) => <option key={t} value={t}>{TREND_TYPE_LABELS[t] || t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">热点说明</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="简要描述" />
            </div>
            <div>
              <label className="label">热度评分 (0-100)</label>
              <input type="number" min={0} max={100} value={form.heat_score} onChange={(e) => setForm({ ...form, heat_score: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="label">B2B 适配度 (0-100)</label>
              <input type="number" min={0} max={100} value={form.b2b_fit_score} onChange={(e) => setForm({ ...form, b2b_fit_score: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="label">软包装适配度 (0-100)</label>
              <input type="number" min={0} max={100} value={form.packaging_fit_score} onChange={(e) => setForm({ ...form, packaging_fit_score: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="flex items-end">
              <button onClick={handleSubmit} className="btn-primary w-full">保存热点</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : trends.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无热点数据，请点击上方「添加热点」按钮录入。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">日期</th>
                  <th className="px-4 py-3 font-medium">关键词</th>
                  <th className="px-4 py-3 font-medium">国家/地区</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">热度</th>
                  <th className="px-4 py-3 font-medium">B2B 适配</th>
                  <th className="px-4 py-3 font-medium">包装适配</th>
                  <th className="px-4 py-3 font-medium">来源</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trends.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-500">{t.date}</td>
                    <td className="px-4 py-2 font-medium">{t.keyword}</td>
                    <td className="px-4 py-2">{MARKET_LABELS[t.country] || t.country}</td>
                    <td className="px-4 py-2"><span className="badge badge-blue">{TREND_TYPE_LABELS[t.trend_type] || t.trend_type}</span></td>
                    <td className="px-4 py-2">{t.heat_score}</td>
                    <td className="px-4 py-2">{t.b2b_fit_score}</td>
                    <td className="px-4 py-2">{t.packaging_fit_score}</td>
                    <td className="px-4 py-2 text-gray-400">{t.source}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-xs">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
