@echo off
chcp 65001 >nul
title 测试每日简报 API

echo ==========================================
echo 测试每日简报 API
echo ==========================================
echo.

set "PORT=3002"
set "BASE=http://localhost:%PORT%"

:: 检查服务是否运行
echo [1/5] 检查服务是否运行...
curl -s "%BASE%/api/health" >nul 2>&1
if errorlevel 1 (
    echo [错误] 服务未运行。请先运行 start_tiktok_agent.bat 启动项目。
    echo.
    pause
    exit /b 1
)
echo       服务正常运行。
echo.

:: 测试 health
echo [2/5] 测试 /api/health...
curl -s "%BASE%/api/health"
echo.
echo.

:: 测试 daily-brief (JSON)
echo [3/5] 测试 /api/external/daily-brief (JSON 格式)...
curl -s "%BASE%/api/external/daily-brief"
echo.
echo.

:: 测试 daily-brief-markdown
echo [4/5] 测试 /api/external/daily-brief-markdown (Markdown 格式)...
echo.
curl -s "%BASE%/api/external/daily-brief-markdown" > "%TEMP%\daily_brief_result.json" 2>nul
if errorlevel 1 (
    echo [错误] 请求失败。
) else (
    echo [成功] 返回结果（Markdown 内容预览）:
    echo ----------------------------------------
    :: 用 python 提取 markdown 字段的前 500 字符
    python -c "import sys,json; d=json.load(open(sys.argv[1],'r',encoding='utf-8')); print(d['data']['markdown'][:500]); print('...')" "%TEMP%\daily_brief_result.json" 2>nul || echo [提示] 需要安装 Python 来预览 Markdown 内容。请直接在浏览器打开: %BASE%/api/external/daily-brief-markdown
    echo ----------------------------------------
)
echo.

:: 测试 test-push (无 webhook 时不报错)
echo [5/5] 测试 /api/external/test-push-daily-brief...
curl -s -X POST "%BASE%/api/external/test-push-daily-brief" -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo ==========================================
echo 测试完成！
echo ==========================================
echo.
echo 在浏览器中打开完整 Markdown 简报:
echo %BASE%/api/external/daily-brief-markdown
echo.
pause
