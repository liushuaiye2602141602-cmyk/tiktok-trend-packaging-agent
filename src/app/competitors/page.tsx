'use client';

import { useState, useEffect, useCallback } from 'react';
import { MARKETS, MARKET_LABELS } from '@/lib/types';

interface Competitor {
  id: number;
  platform: string;
  account_name: string;
  profile_url: string;
  country: string;
  product_focus: string;
  content_style: string;
  notes: string;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    platform: 'TikTok', account_name: '', profile_url: '', country: '',
    product_focus: '', content_style: '', notes: '',
  });

  const fetchCompetitors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/competitors');
      setCompetitors(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCompetitors(); }, [fetchCompetitors]);

  const handleSubmit = async () => {
    if (!form.account_name.trim()) return;
    await fetch('/api/competitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ platform: 'TikTok', account_name: '', profile_url: '', country: '', product_focus: '', content_style: '', notes: '' });
    setShowForm(false);
    fetchCompetitors();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这个竞争对手？')) return;
    await fetch(`/api/competitors?id=${id}`, { method: 'DELETE' });
    fetchCompetitors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">竞争对手</h1>
          <p className="text-sm text-gray-500">追踪 TikTok 上的同行和竞争对手账号</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 添加竞争对手'}
        </button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold mb-3">添加竞争对手账号</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="label">账号名称 *</label>
              <input value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} className="input-field" placeholder="@account_name" />
            </div>
            <div>
              <label className="label">平台</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="label">主页链接</label>
              <input value={form.profile_url} onChange={(e) => setForm({ ...form, profile_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="label">国家/地区</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field">
                <option value="">请选择</option>
                {MARKETS.map((m) => <option key={m} value={m}>{MARKET_LABELS[m] || m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">产品专注领域</label>
              <input value={form.product_focus} onChange={(e) => setForm({ ...form, product_focus: e.target.value })} className="input-field" placeholder="例如 宠物食品包装" />
            </div>
            <div>
              <label className="label">内容风格</label>
              <input value={form.content_style} onChange={(e) => setForm({ ...form, content_style: e.target.value })} className="input-field" placeholder="例如 工厂参观" />
            </div>
            <div className="lg:col-span-3">
              <label className="label">备注</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" placeholder="其他备注信息" />
            </div>
            <div>
              <button onClick={handleSubmit} className="btn-primary">保存竞争对手</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : competitors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无竞争对手数据，请点击上方「添加竞争对手」按钮录入。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">账号</th>
                  <th className="px-4 py-3 font-medium">平台</th>
                  <th className="px-4 py-3 font-medium">国家/地区</th>
                  <th className="px-4 py-3 font-medium">产品专注</th>
                  <th className="px-4 py-3 font-medium">内容风格</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {competitors.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {c.profile_url ? (
                        <a href={c.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                          {c.account_name}
                        </a>
                      ) : (
                        <span className="font-medium">{c.account_name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2"><span className="badge badge-blue">{c.platform}</span></td>
                    <td className="px-4 py-2">{MARKET_LABELS[c.country] || c.country}</td>
                    <td className="px-4 py-2">{c.product_focus}</td>
                    <td className="px-4 py-2">{c.content_style}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{c.notes}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-xs">删除</button>
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
