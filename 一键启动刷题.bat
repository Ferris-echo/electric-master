@echo off
title 高级电工理论考试刷题系统
cd /d "%~dp0"

echo =================================================================
echo           高级电工理论考试 · 智能刷题系统
echo =================================================================
echo 正在启动本地与局域网服务...
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [提示] 检测到当前电脑未安装或未配置 Python 环境。
    echo 正在为您直接打开免安装单文件离线版...
    echo.
    start "" "dist\高级电工刷题系统_单文件离线版.html"
    pause
    exit /b 0
)

python -u start_server.py
if %errorlevel% neq 0 (
    echo.
    echo 正在为您直接打开免安装单文件离线版...
    start "" "dist\高级电工刷题系统_单文件离线版.html"
)
pause
