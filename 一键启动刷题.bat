@echo off
chcp 65001 >nul
title 高级电工理论考试刷题系统
cd /d "%~dp0"

echo 正在启动高级电工跨平台刷题服务...
python start_server.py
pause
