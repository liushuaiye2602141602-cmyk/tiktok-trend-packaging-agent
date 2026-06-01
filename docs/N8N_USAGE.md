# n8n 调用说明

本文档说明如何在 n8n 中调用本项目的 API。

## 前提条件

1. 项目已启动（`npm run dev` 或 `start_tiktok_agent.bat`）
2. API 运行在 `http://localhost:3002`
3. 如果设置了 `API_AUTH_TOKEN`，需要在请求中携带 token

## 基本配置

### HTTP Request 节点配置

- **Method**: `GET` 或 `POST`
- **URL**: `http://localhost:3002/api/...`
- **Headers**（如需鉴权）:
  - `Authorization`: `Bearer your-token`
  - 或 `x-api-key`: `your-token`

## 常用接口示例

### 1. 获取今日简报

```
Method: GET
URL: http://localhost:3002/api/external/daily-brief
Headers:
  Authorization: Bearer your-token
```

返回内容包括：
- 今日热点采集入口数量
- 今日推荐选题
- 高价值参考视频数量
- 建议观察方向

### 2. 获取今日推荐选题

```
Method: GET
URL: http://localhost:3002/api/external/today-recommendations
```

### 3. 获取待检查账号清单

```
Method: GET
URL: http://localhost:3002/api/external/account-checklist
```

### 4. 获取高价值参考视频

```
Method: GET
URL: http://localhost:3002/api/external/high-value-inspirations
```

### 5. 主动推送每日简报到 Webhook

```
Method: POST
URL: http://localhost:3002/api/external/webhook/push-daily-brief
Body:
{
  "webhook_url": "https://your-n8n-webhook-url"
}
```

### 6. 生成今日热点采集清单

```
Method: POST
URL: http://localhost:3002/api/daily-hot-videos/generate-checklist
Body:
{
  "date": "2026-06-01"
}
```

## 定时任务配置

在 n8n 中设置 Cron 触发器：

- 每天上午 9:00 调用 `/api/external/daily-brief`
- 将结果发送到企业微信、飞书、邮箱或 Slack

示例流程：

```
Cron Trigger (每天 09:00)
    → HTTP Request (GET /api/external/daily-brief)
    → 格式化数据
    → 发送到企业微信/邮箱
```

## 注意事项

1. 本项目运行在本地，n8n 需要能访问 `localhost:3002`
2. 如果 n8n 运行在 Docker 中，需要使用 `host.docker.internal:3002`
3. API 返回的数据基于本地数据库，不包含未验证的外部数据
4. 所有 AI 推测内容都标记为"未验证"，需要人工确认
