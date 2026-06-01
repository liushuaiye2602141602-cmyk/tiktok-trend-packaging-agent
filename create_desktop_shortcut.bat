@echo off
chcp 65001 >nul
title 创建桌面快捷方式

echo ==========================================
echo 创建桌面快捷方式
echo ==========================================
echo.

set "TARGET=%~dp0start_tiktok_agent.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\欧洲TikTok软包装选题助手.lnk"

if not exist "%TARGET%" (
    echo [错误] 未找到 start_tiktok_agent.bat
    pause
    exit /b
)

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Europe TikTok B2B Video Learning Assistant'; $s.Save()"

if exist "%SHORTCUT%" (
    echo [成功] 桌面快捷方式已创建:
    echo         %SHORTCUT%
    echo.
    echo 双击桌面图标即可启动项目。
) else (
    echo [错误] 创建快捷方式失败。
)

echo.
pause
