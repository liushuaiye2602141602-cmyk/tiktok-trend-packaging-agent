import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: '欧洲 TikTok B2B视频学习与软包装改编助手',
  description: '跨行业B2B制造业短视频学习库，智能分析优秀视频并生成软包装改编方案，每日生成适合欧洲市场的TikTok视频选题和英文脚本',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
