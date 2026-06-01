@echo off
chcp 65001 >nul 2>&1
title 设置开机自动启动

echo ============================================
echo   设置开机自动启动
echo ============================================
echo.

:: 获取启动文件夹路径
set "startup=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "target=%~dp0start_tiktok_agent.bat"
set "shortcut=%startup%\欧洲TikTok软包装选题助手.lnk"

:: 检查目标文件
if not exist "%target%" (
    echo [错误] 未找到 start_tiktok_agent.bat
    pause
    exit /b 1
)

:: 检查是否已存在
if exist "%shortcut%" (
    echo 开机启动快捷方式已存在。
    choice /c YN /m "是否重新创建？(Y/N)"
    if errorlevel 2 (
        echo 已取消。
        pause
        exit /b 0
    )
)

:: 创建快捷方式
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%shortcut%'); $s.TargetPath = '%target%'; $s.WorkingDirectory = '%~dp0'; $s.Description = '欧洲 TikTok B2B视频学习与软包装改编助手 - 开机自启'; $s.Save()"

if exist "%shortcut%" (
    echo [成功] 开机自动启动已设置!
    echo.
    echo 快捷方式位置:
    echo   %shortcut%
    echo.
    echo 下次登录 Windows 时将自动启动项目。
    echo 如需取消，请运行 remove_startup_shortcut.bat
) else (
    echo [错误] 创建启动快捷方式失败。
)

echo.
pause
