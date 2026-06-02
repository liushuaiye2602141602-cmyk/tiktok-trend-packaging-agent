# n8n 调用说明

本文档说明如何在 n8n 中调用本项目的 API。

## 前提条件

1. 项目已启动（`npm run dev` 或 `start_tiktok_agent.bat`）
2. API 运行在 `http://localhost:3002`
3. 如果设置了 `API_AUTH_TOKEN`，需要在请求中携带 token

## 最小可用工作流：每天 9 点推送简报

这是最核心的工作流，4 步即可完成。

### 第一步：添加 Cron 触发器

- 节点类型：**Schedule Trigger**
- 触发规则：每天上午 9:00
- Cron 表达式：`0 9 * * *`

### 第二步：添加 HTTP Request 节点

- 节点类型：**HTTP Request**
- Method：`GET`
- URL：`http://localhost:3002/api/external/daily-brief-markdown`
- Headers（如设置了 API_AUTH_TOKEN）：
  ```
  Authorization: Bearer your-token
  ```

返回的 JSON：
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

### 第三步：提取 Markdown

在 HTTP Request 节点之后，添加 **Code** 节点或 **Set** 节点：

```javascript
// Code 节点示例
const data = $input.first().json;
return [{ json: { markdown: data.data.markdown, date: data.data.date } }];
```

或用 **Set** 节点：
- 设置变量 `markdown` = `{{ $json.data.markdown }}`
- 设置变量 `date` = `{{ $json.data.date }}`

### 第四步：推送到目标平台

选择一种推送方式：

#### 企业微信 Webhook

- 节点类型：HTTP Request
- Method：POST
- URL：你的企业微信机器人 Webhook 地址
- Body (JSON)：
  ```json
  {
    "msgtype": "markdown",
    "markdown": {
      "content": "{{ $json.markdown }}"
    }
  }
  ```

#### 飞书 Webhook

- 节点类型：HTTP Request
- Method：POST
- URL：飞书机器人 Webhook 地址
- Body (JSON)：
  ```json
  {
    "msg_type": "text",
    "content": {
      "text": "{{ $json.markdown }}"
    }
  }
  ```

#### 邮箱

- 节点类型：Send Email
- 收件人：你的邮箱
- 主题：`TikTok B2B 热点简报 - {{ $json.date }}`
- 正文：`{{ $json.markdown }}`

#### OpenClaw Webhook

- 节点类型：HTTP Request
- Method：POST
- URL：OpenClaw 接收地址
- Body (JSON)：
  ```json
  {
    "date": "{{ $json.date }}",
    "markdown": "{{ $json.markdown }}",
    "source": "tiktok-trend-packaging-agent"
  }
  ```

## 完整工作流示意

```
Schedule Trigger (每天 09:00)
  → HTTP Request (GET /api/external/daily-brief-markdown)
  → Code (提取 data.markdown)
  → 企业微信 / 飞书 / 邮箱 / OpenClaw
```

## 测试推送

如果不想等定时任务，可以用测试接口立即推送：

```
POST http://localhost:3002/api/external/test-push-daily-brief
Body: { "target": "n8n" }
```

这个接口会：
1. 生成今日 Markdown 简报
2. 如果 `N8N_WEBHOOK_URL` 已配置，推送到该地址
3. 如果未配置，只返回 Markdown 内容（不报错）

## 所有可用接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/external/daily-brief` | 今日简报（JSON 格式） |
| GET | `/api/external/daily-brief-markdown` | 今日简报（Markdown 格式） |
| GET | `/api/external/today-recommendations` | 今日推荐选题 |
| GET | `/api/external/account-checklist` | 待检查账号 |
| GET | `/api/external/high-value-inspirations` | 高价值参考视频 |
| POST | `/api/external/test-push-daily-brief` | 测试推送到 webhook |
| POST | `/api/external/webhook/push-daily-brief` | 推送简报到指定 webhook |
| POST | `/api/daily-hot-videos/generate-checklist` | 生成今日热点采集清单 |

## 基本配置

### HTTP Request 节点配置

- **Method**: `GET` 或 `POST`
- **URL**: `http://localhost:3002/api/...`
- **Headers**（如需鉴权）:
  - `Authorization`: `Bearer your-token`
  - 或 `x-api-key`: `your-token`

## 注意事项

1. 本项目运行在本地，n8n 需要能访问 `localhost:3002`
2. 如果 n8n 运行在 Docker 中，需要使用 `host.docker.internal:3002`
3. API 返回的数据基于本地数据库，不包含未验证的外部数据
4. 所有 AI 推测内容都标记为"未验证"，需要人工确认
5. 项目关闭后 API 不可用，推送会失败 — 确保 `start_tiktok_agent.bat` 保持运行
6. 如果 `N8N_WEBHOOK_URL` 未设置，测试推送接口不会报错，只返回 Markdown
