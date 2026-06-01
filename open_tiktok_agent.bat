@echo off
chcp 65001 >nul
title 打开 TikTok 选题助手

set "URL=http://localhost:3002"

netstat -ano | findstr ":3002" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo 3002 端口未检测到服务运行。
    echo 请先运行 start_tiktok_agent.bat 启动项目。
    echo.
    pause
    exit /b
)

start "" "%URL%"
echo 已打开浏览器: %URL%
