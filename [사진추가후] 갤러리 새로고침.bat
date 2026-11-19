@echo off
chcp 65001 > nul
cd /d "C:\홈페이지"
echo ========================================================
echo   [Shalom Free School] Updating Photo Gallery...
echo ========================================================
node update_gallery.js
echo.
echo ========================================================
echo   Gallery photos updated successfully!
echo   Please refresh (F5) the website in your browser.
echo ========================================================
ping 127.0.0.1 -n 3 > nul
