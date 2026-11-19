@echo off
chcp 65001 > nul
echo [샬롬자유학교 갤러리 사진 업데이트 중...]

where node >nul 2>nul
if %errorlevel% equ 0 (
    node "%~dp0update_gallery.js"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_gallery.ps1"
)

echo.
echo 업데이트가 완료되었습니다! 브라우저에서 홈페이지를 새로고침(F5)하세요.
timeout /t 3 > nul
