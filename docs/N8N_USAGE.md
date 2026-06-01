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

## 最小可用工作流：每日 9 点推送简报

这是第二阶段最核心的工作流。配置步骤：

### 第一步：添加 Cron 触发器

- 节点类型：**Schedule Trigger**
- 触发规则：每天上午 9:00
- Cron 表达式：`0 9 * * *`

### 第二步：添加 HTTP Request 节点

- 节点类型：**HTTP Request**
- Method：`GET`
- URL：`http://localhost:3002/api/external/daily-brief`
- Headers（如设置了 API_AUTH_TOKEN）：
  ```
  Authorization: Bearer your-token
  ```

### 第三步：格式化返回数据

返回的 JSON 包含：
```json
{
  "date": "2026-06-01",
  "hot_videos_count": 37,
  "unverified_count": 33,
  "recommendations_count": 3,
  "today_recommendations": [...],
  "suggested_observations": [...]
}
```

用 Code 节点或 Set 节点整理为 Markdown：

```
## 今日热点简报 ({{date}})

- 待采集入口: {{hot_videos_count}} 条
- 待验证: {{unverified_count}} 条
- 今日推荐选题: {{recommendations_count}} 条

### 推荐选题
{{#each today_recommendations}}
- {{title_cn}} ({{target_market}})
{{/each}}

### 建议观察方向
{{#each suggested_observations}}
- {{this}}
{{/each}}
```

### 第四步：推送到目标平台

选择一种推送方式：

**企业微信 Webhook：**
- 节点类型：HTTP Request
- Method：POST
- URL：你的企业微信 Webhook 地址
- Body：
  ```json
  {
    "msgtype": "markdown",
    "markdown": {
      "content": "整理后的 Markdown 内容"
    }
  }
  ```

**邮箱：**
- 节点类型：Send Email
- 填写收件人、主题、正文

**飞书 Webhook：**
- 节点类型：HTTP Request
- Method：POST
- URL：飞书机器人 Webhook 地址

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

## 注意事项

1. 本项目运行在本地，n8n 需要能访问 `localhost:3002`
2. 如果 n8n 运行在 Docker 中，需要使用 `host.docker.internal:3002`
3. API 返回的数据基于本地数据库，不包含未验证的外部数据
4. 所有 AI 推测内容都标记为"未验证"，需要人工确认
5. 项目关闭后 API 不可用，推送会失败 — 确保 `start_tiktok_agent.bat` 保持运行
