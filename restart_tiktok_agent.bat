@echo off
chcp 65001 >nul
title 重启 TikTok 选题助手

echo ==========================================
echo 重启 TikTok 选题助手
echo ==========================================
echo.

set "PORT=3002"

echo [1/2] 停止现有服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo       已停止。
echo.

echo [2/2] 启动新实例...
call "%~dp0start_tiktok_agent.bat"
