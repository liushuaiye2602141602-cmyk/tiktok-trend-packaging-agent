@echo off
chcp 65001 >nul
title 欧洲TikTok软包装选题助手

echo ==========================================
echo 欧洲TikTok软包装选题助手 - 启动程序
echo ==========================================
echo.

set "PROJECT_DIR=F:\1.Vscode文件存放\tiktok-trend-packaging-agent"
set "PORT=3002"
set "URL=http://localhost:3002"

echo 项目路径：
echo %PROJECT_DIR%
echo.

cd /d "%PROJECT_DIR%"

if errorlevel 1 (
    echo [错误] 无法进入项目目录，请检查路径是否正确。
    echo 当前设置路径：
    echo %PROJECT_DIR%
    pause
    exit /b
)

if not exist package.json (
    echo [错误] 当前目录没有 package.json，说明不是项目根目录。
    echo 当前目录：
    cd
    pause
    exit /b
)

echo 正在检查 3002 端口是否已被占用...
netstat -ano | findstr ":3002" | findstr "LISTENING" >nul

if %errorlevel%==0 (
    echo.
    echo [提示] 3002 端口已经被占用。
    echo 可能项目已经启动。
    echo 正在打开页面：
    echo %URL%
    start "" "%URL%"
    pause
    exit /b
)

echo.
echo 正在启动项目...
echo 启动后请不要关闭这个窗口。
echo.
echo 浏览器将在 8 秒后自动打开。
echo.

start "" cmd /c "timeout /t 8 /nobreak >nul && start "" "%URL%""

npm run dev

echo.
echo 项目已停止或启动失败。
echo 请查看上面的错误信息。
pause