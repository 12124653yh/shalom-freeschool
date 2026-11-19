@echo off
chcp 65001 > nul
cd /d "C:\홈페이지"
echo ========================================================
echo   [샬롬자유학교] 갤러리 사진 업데이트 및 Vercel 배포 진행 중...
echo ========================================================
node update_gallery.js
echo.
echo [1/2] 로컬 갤러리 목록 갱신 완료!
echo.
echo [2/2] GitHub 및 Vercel 배포 서버로 업로드 중...
git add "갤러리 샬롬 사진" gallery_data.js
git commit -m "feat: 갤러리 사진 추가 및 자동 갱신"
git push origin main
echo.
echo ========================================================
echo   업로드가 성공적으로 완료되었습니다!
echo   약 20초 후 Vercel 인터넷 웹사이트에 사진이 반영됩니다.
echo ========================================================
timeout /t 5 > nul
