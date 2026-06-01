# GitHub 上传前检查清单

## 必须检查

- [ ] `.env` 文件未上传（已在 .gitignore 中）
- [ ] `.env.local` 文件未上传
- [ ] `node_modules/` 未上传（已在 .gitignore 中）
- [ ] `.next/` 未上传（已在 .gitignore 中）
- [ ] `data/db.json` 未上传（已在 .gitignore 中，包含真实数据）
- [ ] 没有真实 API Key
- [ ] 没有真实客户信息
- [ ] 没有真实品牌名作为客户案例
- [ ] 示例数据使用虚构信息

## 功能验证

- [ ] `npm install` 正常完成
- [ ] `npm run db:seed` 可以初始化示例数据
- [ ] `npm run dev` 启动在 3002 端口
- [ ] http://localhost:3002 可以打开
- [ ] `GET /api/health` 返回正常
- [ ] 各页面正常加载

## 文档检查

- [ ] README.md 包含项目说明
- [ ] README.md 包含启动说明
- [ ] README.md 包含 API 说明
- [ ] `.env.example` 存在且无真实 key
- [ ] docs/openapi.json 存在
- [ ] docs/N8N_USAGE.md 存在
- [ ] docs/OPENCLAW_USAGE.md 存在

## 数据安全

- [ ] 示例数据不包含真实客户名
- [ ] 示例数据不包含真实视频链接
- [ ] 示例数据不包含真实联系方式
- [ ] 示例数据不包含真实询盘记录
- [ ] seed 脚本只生成虚构示例数据

## 快速验证命令

```bash
# 检查是否有敏感文件被跟踪
git status

# 检查 .gitignore 是否生效
git add -n .

# 确认没有 .env
ls .env .env.local 2>/dev/null

# 确认没有 node_modules
ls node_modules > /dev/null 2>&1 && echo "WARNING: node_modules exists"

# 确认没有真实数据库
ls data/db.json 2>/dev/null && echo "WARNING: db.json exists"
```

## 上传步骤

```bash
git init
git add .
git commit -m "Initial version of TikTok B2B video learning assistant"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```
