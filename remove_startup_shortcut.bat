@echo off
chcp 65001 >nul 2>&1
title 取消开机自动启动

echo ============================================
echo   取消开机自动启动
echo ============================================
echo.

set "startup=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "shortcut=%startup%\欧洲TikTok软包装选题助手.lnk"

if not exist "%shortcut%" (
    echo 未找到开机启动快捷方式，可能已取消。
    echo.
    pause
    exit /b 0
)

choice /c YN /m "确认取消开机自动启动？(Y/N)"
if errorlevel 2 (
    echo 已取消操作。
    pause
    exit /b 0
)

del "%shortcut%" >nul 2>&1

if not exist "%shortcut%" (
    echo [成功] 已取消开机自动启动。
) else (
    echo [错误] 删除失败，请手动删除:
    echo   %shortcut%
)

echo.
pause
