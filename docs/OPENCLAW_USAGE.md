# OpenClaw 调用说明

本文档说明 OpenClaw 如何调用本项目的 API。

## 推荐调用方式

OpenClaw 推荐调用 Markdown 格式接口，获取可直接展示的简报内容：

```
GET http://localhost:3002/api/external/daily-brief-markdown
Headers:
  x-api-key: your-token
```

返回数据：
```json
{
  "success": true,
  "data": {
    "date": "2026-06-02",
    "markdown": "# 今日欧洲 TikTok B2B 热点观察简报\n..."
  },
  "message": "ok"
}
```

OpenClaw 可以直接将 `data.markdown` 推送给用户。

## 所有可调用的接口

| 接口 | 说明 |
|------|------|
| `GET /api/external/daily-brief-markdown` | **推荐** 今日简报（Markdown 格式，可直接推送） |
| `GET /api/external/daily-brief` | 今日简报（JSON 格式） |
| `GET /api/external/today-recommendations` | 今日推荐选题列表 |
| `GET /api/external/account-checklist` | 今日待检查账号清单 |
| `GET /api/external/high-value-inspirations` | 高价值参考视频列表 |
| `POST /api/external/test-push-daily-brief` | 测试推送到 webhook |
| `POST /api/external/webhook/push-daily-brief` | 推送简报到指定 webhook |
| `POST /api/daily-hot-videos/generate-checklist` | 生成今日热点采集清单 |
| `GET /api/inspiration-videos` | 优秀视频观察库 |
| `GET /api/recommendations/today` | 今日推荐选题 |

## 调用方式

### 基本请求

```
GET http://localhost:3002/api/external/daily-brief-markdown
Headers:
  x-api-key: your-token
```

### 使用 Bearer Token

```
GET http://localhost:3002/api/external/daily-brief-markdown
Headers:
  Authorization: Bearer your-token
```

## 典型使用场景

### 场景 1：获取今日简报并推送

用户问"今天有什么热点？"时，OpenClaw 调用：

```
GET /api/external/daily-brief-markdown
```

取出 `data.markdown` 直接推送给用户。

### 场景 2：获取待检查账号

用户问"今天要检查哪些账号？"时，调用：

```
GET /api/external/account-checklist
```

### 场景 3：获取高价值参考视频

用户问"有什么值得参考的视频？"时，调用：

```
GET /api/external/high-value-inspirations
```

### 场景 4：把用户确认的视频加入观察库

用户确认某条视频值得参考后，调用：

```
POST /api/daily-hot-videos/{id}/add-to-inspiration
```

## 重要原则（必须遵守）

### 1. 不编造热点

OpenClaw **只能**基于 API 返回的真实数据回复。**禁止编造以下内容：**
- 不存在的热点视频
- 不存在的播放量、点赞数、评论数
- 不存在的 TikTok 账号或视频链接
- 未经 API 返回的趋势数据

### 2. 未验证数据必须标注

如果 API 返回的数据中 `verification_status` 为 `unverified`，OpenClaw **必须**在回复中明确告知用户：

> "这条内容来自搜索入口，尚未人工验证为真实热点。请打开链接确认。"

如果 `confidence_level` 为 `low`，必须说明：

> "此方向为 AI 推测，未验证为真实热点。"

### 3. 搜索入口不等于真实热视频

API 中 `source_type` 为 `TikTok Search` 的条目只是"搜索入口"，不是已确认的热视频。OpenClaw 不能把搜索入口说成"热门视频"或"爆款视频"。

### 4. 没有 video_url 只能说"待观察"

如果条目没有 `video_url`，说明还没有真实视频链接。OpenClaw 只能说"待观察入口"，不能编造视频内容描述。

### 5. 不伪造链接

OpenClaw 不得编造 TikTok 视频链接。所有链接来自：
- 用户手动录入
- TikTok Creative Center 官方入口
- TikTok 搜索入口
- 竞争对手账号主页

### 6. 标记来源

每条回复需注明数据来源：
- `source_type`: 来源类型
- `confidence_level`: 可信度
- `verification_status`: 验证状态

### 7. 数据边界

OpenClaw **只能读取** API 返回的数据，不能：
- 直接修改数据库
- 编造未调用接口的结果
- 推断 API 未返回的字段值

## API 鉴权

如果 `API_AUTH_TOKEN` 环境变量为空，API 允许无鉴权访问（本地开发模式）。

设置 token 后，所有 `/api/external/*` 接口需要携带 token。

## 错误处理

- `401`: Token 无效或缺失
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器错误
