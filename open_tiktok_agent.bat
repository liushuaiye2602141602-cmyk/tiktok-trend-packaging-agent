@echo off
chcp 65001 >nul
title 打开 TikTok 选题助手

set "URL=http://localhost:3002"

:: 检查端口
set "PID_FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    set "PID_FOUND=%%a"
)

if not defined PID_FOUND (
    echo [提示] 3002 端口未检测到服务运行。
    echo 请先运行 start_tiktok_agent.bat 启动项目。
    echo.
    pause
    exit /b 0
)

start "" "%URL%"
echo 已打开浏览器: %URL%
