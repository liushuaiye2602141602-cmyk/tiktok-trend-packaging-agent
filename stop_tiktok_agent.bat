@echo off
chcp 65001 >nul
title 停止 TikTok 选题助手

echo ==========================================
echo 停止 TikTok 选题助手服务
echo ==========================================
echo.

set "PORT=3002"

echo 正在查找占用 %PORT% 端口的进程...
echo.

set found=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    set found=1
    set pid=%%a
    echo 找到进程 PID: %%a
    for /f "tokens=*" %%b in ('tasklist /FI "PID eq %%a" /FO CSV /NH 2^>nul') do echo 进程信息: %%b
)

if %found%==0 (
    echo %PORT% 端口未被占用，项目可能未在运行。
    echo.
    pause
    exit /b
)

echo.
choice /c YN /m "确认结束以上进程？(Y/N)"
if errorlevel 2 (
    echo 已取消。
    pause
    exit /b
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 服务已停止。
pause
