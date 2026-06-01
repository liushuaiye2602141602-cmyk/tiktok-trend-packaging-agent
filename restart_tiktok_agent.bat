@echo off
chcp 65001 >nul
title 重启 TikTok 选题助手

echo ==========================================
echo 重启 TikTok 选题助手
echo ==========================================
echo.

set "PROJECT_DIR=F:\1.Vscode文件存放\tiktok-trend-packaging-agent"
set "PORT=3002"

:: 停止旧进程
echo [1/2] 停止现有服务...
set "PID_FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    set "PID_FOUND=%%a"
)

if defined PID_FOUND (
    taskkill /F /PID %PID_FOUND% >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo       旧进程已停止。
) else (
    echo       未检测到运行中的服务。
)
echo.

:: 启动新实例
echo [2/2] 启动新实例...
echo.
call "%PROJECT_DIR%\start_tiktok_agent.bat"
