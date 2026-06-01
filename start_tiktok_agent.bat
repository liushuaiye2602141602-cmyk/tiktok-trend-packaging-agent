@echo off
chcp 65001 >nul
title 欧洲TikTok软包装选题助手

echo ==========================================
echo 欧洲TikTok软包装选题助手 - 启动程序
echo ==========================================
echo.

set "PROJECT_DIR=F:\1.Vscode文件存放\tiktok-trend-packaging-agent"
set "PORT=3002"
set "URL=http://localhost:%PORT%"

:: 检查项目目录
if not exist "%PROJECT_DIR%\package.json" (
    echo [错误] 未找到项目目录或 package.json
    echo 路径: %PROJECT_DIR%
    echo 请确认项目路径是否正确。
    echo.
    pause
    exit /b 1
)

:: 进入项目目录
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
    echo [错误] 无法进入项目目录。
    echo 路径: %PROJECT_DIR%
    echo.
    pause
    exit /b 1
)

:: 检查 node_modules
if not exist "node_modules" (
    echo [提示] 未检测到 node_modules，正在执行 npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo [错误] npm install 失败，请检查网络或 Node.js 环境。
        echo.
        pause
        exit /b 1
    )
    echo.
)

:: 检查端口占用
echo 正在检查 %PORT% 端口...
set "PID_FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    set "PID_FOUND=%%a"
)

if defined PID_FOUND (
    echo.
    echo [警告] %PORT% 端口已被占用 (PID: %PID_FOUND%)
    echo 可能是之前的项目实例还在运行。
    echo.
    choice /c YN /m "是否结束旧进程并重新启动？(Y/N)"
    if errorlevel 2 (
        echo.
        echo 正在打开现有服务: %URL%
        start "" "%URL%"
        pause
        exit /b 0
    )
    echo.
    echo 正在结束旧进程...
    taskkill /F /PID %PID_FOUND% >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo 旧进程已结束。
)

:: 启动项目
echo.
echo ==========================================
echo 正在启动项目...
echo 启动后请不要关闭此窗口。
echo 浏览器将在 8 秒后自动打开: %URL%
echo 按 Ctrl+C 可停止项目。
echo ==========================================
echo.

:: 后台延迟打开浏览器
start "" cmd /c "timeout /t 8 /nobreak >nul && start "" "%URL%""

:: 启动开发服务器
call npm run dev

:: 退出提示
echo.
echo 项目已停止。
echo 如需重新启动，请再次双击此脚本。
echo.
pause
