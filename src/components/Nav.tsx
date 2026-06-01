'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '今日选题' },
  { href: '/daily-hot-videos', label: '每日采集' },
  { href: '/inspiration', label: '视频观察库' },
  { href: '/trends', label: '热点管理' },
  { href: '/competitors', label: '竞争对手' },
  { href: '/performance', label: '发布数据' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-lg text-gray-900">
              欧洲 TikTok 软包装选题助手
            </Link>
            <div className="hidden sm:flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            软包装工厂 TikTok 内容工作台
          </div>
        </div>
      </div>
    </nav>
  );
}
