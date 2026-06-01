'use client';

import { useState, useEffect, useCallback } from 'react';
import { PLATFORM_LABELS } from '@/lib/types';

interface Perf {
  id: number;
  recommendation_id: number | null;
  recommendation_title: string | null;
  product_type: string | null;
  platform: string;
  publish_date: string;
  video_url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  inquiries: number;
  notes: string;
}

interface Rec { id: number; title_en: string; title_cn: string; product_type: string; }

export default function PerformancePage() {
  const [performances, setPerformances] = useState<Perf[]>([]);
  const [recommendations, setRecommendations] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    recommendation_id: '', platform: 'TikTok', video_url: '', views: 0,
    likes: 0, comments: 0, shares: 0, inquiries: 0, notes: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [perfRes, recRes] = await Promise.all([
        fetch('/api/performance'),
        fetch(`/api/recommendations/today?date=${new Date().toISOString().split('T')[0]}`),
      ]);
      setPerformances(await perfRes.json());
      setRecommendations(await recRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async () => {
    await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        recommendation_id: form.recommendation_id ? Number(form.recommendation_id) : null,
        publish_date: new Date().toISOString().split('T')[0],
      }),
    });
    setForm({ recommendation_id: '', platform: 'TikTok', video_url: '', views: 0, likes: 0, comments: 0, shares: 0, inquiries: 0, notes: '' });
    setShowForm(false);
    fetchData();
  };

  const totalViews = performances.reduce((s, p) => s + p.views, 0);
  const totalLikes = performances.reduce((s, p) => s + p.likes, 0);
  const totalInquiries = performances.reduce((s, p) => s + p.inquiries, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">发布数据</h1>
          <p className="text-sm text-gray-500">追踪已发布视频的效果数据和互动情况</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 录入数据'}
        </button>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-gray-500">总播放量</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalLikes.toLocaleString()}</div>
          <div className="text-xs text-gray-500">总点赞数</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalInquiries}</div>
          <div className="text-xs text-gray-500">总询盘数</div>
        </div>
      </div>

      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold mb-3">录入视频数据</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">关联选题</label>
              <select value={form.recommendation_id} onChange={(e) => setForm({ ...form, recommendation_id: e.target.value })} className="input-field">
                <option value="">无关联</option>
                {recommendations.map((r) => <option key={r.id} value={r.id}>{r.title_cn || r.title_en}</option>)}
              </select>
            </div>
            <div>
              <label className="label">发布平台</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                <option value="TikTok">TikTok</option>
                <option value="Reels">Instagram Reels</option>
                <option value="Shorts">YouTube Shorts</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">视频链接</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="label">播放量</label>
              <input type="number" min={0} value={form.views} onChange={(e) => setForm({ ...form, views: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="label">点赞数</label>
              <input type="number" min={0} value={form.likes} onChange={(e) => setForm({ ...form, likes: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="label">评论数</label>
              <input type="number" min={0} value={form.comments} onChange={(e) => setForm({ ...form, comments: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="label">询盘数</label>
              <input type="number" min={0} value={form.inquiries} onChange={(e) => setForm({ ...form, inquiries: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="lg:col-span-3">
              <label className="label">备注</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
            </div>
            <div className="flex items-end">
              <button onClick={handleSubmit} className="btn-primary w-full">保存</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : performances.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无发布数据，请点击上方「录入数据」按钮记录。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">选题标题</th>
                  <th className="px-4 py-3 font-medium">平台</th>
                  <th className="px-4 py-3 font-medium">发布日期</th>
                  <th className="px-4 py-3 font-medium text-right">播放量</th>
                  <th className="px-4 py-3 font-medium text-right">点赞数</th>
                  <th className="px-4 py-3 font-medium text-right">评论数</th>
                  <th className="px-4 py-3 font-medium text-right">询盘数</th>
                  <th className="px-4 py-3 font-medium">链接</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {performances.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 max-w-xs truncate">{p.recommendation_title || '-'}</td>
                    <td className="px-4 py-2"><span className="badge badge-blue">{PLATFORM_LABELS[p.platform] || p.platform}</span></td>
                    <td className="px-4 py-2 text-gray-500">{p.publish_date}</td>
                    <td className="px-4 py-2 text-right">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{p.likes.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{p.comments.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium text-purple-600">{p.inquiries}</td>
                    <td className="px-4 py-2">
                      {p.video_url ? (
                        <a href={p.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">查看</a>
                      ) : '-'}
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
