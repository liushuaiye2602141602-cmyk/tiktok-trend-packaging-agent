# Europe TikTok B2B Video Learning & Packaging Adaptation Assistant

**欧洲 TikTok B2B视频学习与软包装改编助手**

为软包装袋工厂打造的 TikTok 内容工作台：每日热点入口整理、优秀视频观察、跨行业视频学习、软包装改编方案生成、选题推荐、账号监控和发布复盘。

> 当前版本: v1.0.0 (本地 MVP)

## 核心原则

- **不下载** TikTok 视频
- **不搬运** 视频内容
- **不伪造** 热视频链接或播放量
- **不冒充** 真实品牌客户
- 只学习视频结构、镜头语言、内容节奏和表达方式
- 所有改编内容必须使用自己的产品、工厂和真实能力重新拍摄
- 没有真实链接的内容标记为"未验证"或"AI推测"

## 功能模块

| 模块 | 说明 |
|------|------|
| 每日热点视频采集中心 | 收集真实 TikTok 热点入口、搜索链接、B2B 参考入口 |
| 优秀视频观察库 | 跨行业 B2B 视频学习，6 维评分，智能改编方案 |
| 跨行业 B2B 视频拆解 | 14 个行业参考，迁移难度评估 |
| 软包装改编方案生成 | 自动匹配软包装产品，生成英文脚本和拍摄建议 |
| 今日推荐选题 | 每日生成 TikTok 视频选题、Hook、Script、Caption |
| 重点账号监控 | 竞争对手账号观察清单 |
| 发布数据记录 | 视频发布后的播放、互动、询盘数据 |
| 每周内容复盘 | 自动生成周报 |
| API 接口 | REST API，支持 n8n / OpenClaw 调用 |
| Windows 一键启动 | bat 脚本，双击即可启动 |

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- JSON 文件数据库 (`data/db.json`)
- REST API

## 本地启动

### 方式一：命令行

```bash
cd tiktok-trend-packaging-agent
npm install
npm run dev
```

访问: http://localhost:3002

### 方式二：Windows 一键启动

双击 `start_tiktok_agent.bat`

## 数据库初始化

```bash
# 加载示例数据（首次使用）
npm run db:seed

# 重置数据库（清空并重新加载示例数据）
npm run db:reset
```

## Windows 启动脚本

| 脚本 | 作用 |
|------|------|
| `start_tiktok_agent.bat` | 一键启动项目 |
| `stop_tiktok_agent.bat` | 停止 3002 端口服务 |
| `restart_tiktok_agent.bat` | 重启项目 |
| `open_tiktok_agent.bat` | 仅打开浏览器 |
| `create_desktop_shortcut.bat` | 创建桌面快捷方式 |
| `install_startup_shortcut.bat` | 设置开机自动启动 |
| `remove_startup_shortcut.bat` | 取消开机自动启动 |

## 环境变量

```bash
# 复制示例文件
cp .env.example .env.local
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `APP_PORT` | 服务端口 | 3002 |
| `API_AUTH_TOKEN` | API 鉴权 Token（空则跳过鉴权） | (空) |
| `N8N_WEBHOOK_URL` | n8n 推送地址 | (空) |
| `OPENCLAW_WEBHOOK_URL` | OpenClaw 推送地址 | (空) |

## API 接口

默认地址: http://localhost:3002/api

### 系统

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |

### 外部集成（n8n / OpenClaw）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/external/daily-brief` | 今日简报 |
| GET | `/api/external/today-recommendations` | 今日推荐选题 |
| GET | `/api/external/account-checklist` | 待检查账号 |
| GET | `/api/external/high-value-inspirations` | 高价值参考视频 |
| POST | `/api/external/webhook/push-daily-brief` | 推送简报到 webhook |

### 每日热点采集

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/daily-hot-videos` | 列表 |
| POST | `/api/daily-hot-videos` | 手动添加 |
| POST | `/api/daily-hot-videos/generate-checklist` | 生成今日清单 |
| POST | `/api/daily-hot-videos/[id]/mark-verified` | 标记验证 |
| POST | `/api/daily-hot-videos/[id]/mark-useful` | 标记值得参考 |
| POST | `/api/daily-hot-videos/[id]/add-to-inspiration` | 加入观察库 |

### 优秀视频观察库

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/inspiration-videos` | 列表 |
| POST | `/api/inspiration-videos` | 添加 |
| POST | `/api/inspiration-videos/[id]/generate-adaptation` | 生成改编方案 |
| POST | `/api/inspiration-videos/[id]/add-to-recommendations` | 加入选题 |

### 今日推荐选题

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/recommendations/today` | 今日选题 |
| POST | `/api/recommendations/generate` | 生成选题 |

### 账号监控

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/monitored-accounts` | 监控账号列表 |
| POST | `/api/monitored-accounts` | 添加账号 |
| GET | `/api/monitored-accounts/today-checklist` | 今日待检查清单 |

### 发布数据

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/performance` | 发布数据列表 |
| POST | `/api/performance` | 添加记录 |

### 每周复盘

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/reports/weekly` | 查看周报 |
| POST | `/api/reports/weekly/generate` | 生成周报 |

## API 鉴权

默认无需鉴权（本地开发模式）。如需对外暴露 API：

1. 在 `.env.local` 中设置 `API_AUTH_TOKEN=your-token`
2. 请求时携带 header: `Authorization: Bearer your-token` 或 `x-api-key: your-token`
3. 页面内部调用不受影响

详细 API 文档: `docs/openapi.json`

## n8n 集成

详见 `docs/N8N_USAGE.md`

基本流程：
```
Cron Trigger → HTTP Request (GET /api/external/daily-brief) → 发送到企业微信/邮箱
```

## OpenClaw 集成

详见 `docs/OPENCLAW_USAGE.md`

可调用接口：
- `/api/external/daily-brief` - 今日简报
- `/api/external/today-recommendations` - 今日选题
- `/api/external/account-checklist` - 待检查账号
- `/api/external/high-value-inspirations` - 高价值参考

## 局域网访问

默认仅本机访问。如需局域网访问，修改 `package.json`:

```json
"dev": "next dev -p 3002 -H 0.0.0.0"
```

其他电脑通过 `http://你的IP:3002` 访问。

## 上传 GitHub

```bash
git init
git add .
git commit -m "Initial version"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

上传前请检查 `docs/GITHUB_CHECKLIST.md`。

## 项目结构

```
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── page.tsx            # 今日选题
│   │   ├── daily-hot-videos/   # 每日热点采集
│   │   ├── inspiration/        # 优秀视频观察库
│   │   ├── trends/             # 热点管理
│   │   ├── competitors/        # 竞争对手
│   │   ├── performance/        # 发布数据
│   │   └── api/                # API 路由
│   ├── components/             # 共享组件
│   └── lib/                    # 工具库
├── data/                       # 数据库（gitignore）
├── scripts/                    # 种子脚本
├── docs/                       # 文档
├── .env.example                # 环境变量示例
└── *.bat                       # Windows 启动脚本
```

## 许可

MIT
