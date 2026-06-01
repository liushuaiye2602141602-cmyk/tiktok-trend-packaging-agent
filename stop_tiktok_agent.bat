@echo off
chcp 65001 >nul
title 停止 TikTok 选题助手

echo ==========================================
echo 停止 TikTok 选题助手服务
echo ==========================================
echo.

set "PORT=3002"

:: 查找占用端口的进程
set "PID_FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    set "PID_FOUND=%%a"
)

if not defined PID_FOUND (
    echo %PORT% 端口未被占用，项目可能未在运行。
    echo.
    pause
    exit /b 0
)

echo 找到占用 %PORT% 端口的进程 (PID: %PID_FOUND%)
for /f "tokens=*" %%b in ('tasklist /FI "PID eq %PID_FOUND%" /FO CSV /NH 2^>nul') do echo 进程信息: %%b
echo.

choice /c YN /m "确认结束该进程？(Y/N)"
if errorlevel 2 (
    echo 已取消。
    pause
    exit /b 0
)

taskkill /F /PID %PID_FOUND% >nul 2>&1
if errorlevel 1 (
    echo [错误] 无法结束进程，可能需要管理员权限。
) else (
    echo 服务已停止。
)
echo.
pause
