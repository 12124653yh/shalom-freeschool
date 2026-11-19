const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const galleryDir = path.join(__dirname, '갤러리 샬롬 사진');
const outputFile = path.join(__dirname, 'gallery_data.js');

let gitDebounceTimer = null;
let isPushing = false;

// GitHub & Vercel 실시간 자동 푸시 함수
function scheduleGitPush() {
  clearTimeout(gitDebounceTimer);
  gitDebounceTimer = setTimeout(() => {
    if (isPushing) return;
    isPushing = true;
    console.log(`[${new Date().toLocaleTimeString()}] [자동 배포] 변경된 갤러리 사진을 GitHub 및 Vercel로 업로드 중...`);

    const cmd = 'git add "갤러리 샬롬 사진" gallery_data.js && git commit -m "feat: 갤러리 사진 자동 갱신" && git push origin main';
    exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
      isPushing = false;
      if (err) {
        // 이미 최신 상태이거나 변경사항이 없는 경우는 에러가 아님
        if (err.message && err.message.includes('nothing to commit')) {
          console.log(`[${new Date().toLocaleTimeString()}] [자동 배포] 이미 최신 상태입니다.`);
        } else {
          console.error(`[${new Date().toLocaleTimeString()}] [자동 배포 안내] 깃허브 업로드 실패 (네트워크 확인 필요):`, err.message);
        }
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] [자동 배포 완료] 깃허브 푸시 성공! 약 20초 후 Vercel 사이트에 자동 반영됩니다.`);
      }
    });
  }, 4000); // 4초 대기 (여러 장의 사진을 한 번에 복사할 때 묶어서 한 번만 커밋/푸시)
}

function updateGallery() {
  try {
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true });
    }

    const files = fs.readdirSync(galleryDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.jfif', '.heic'];
    
    // Filter out hidden, temporary, or non-image files
    const images = files
      .filter(f => {
        if (f.startsWith('.') || f.startsWith('~$') || f.toLowerCase() === 'thumbs.db') return false;
        return imageExtensions.includes(path.extname(f).toLowerCase());
      })
      .map(f => `갤러리 샬롬 사진/${f}`);

    const content = `// 갤러리 샬롬 사진 폴더 자동 목록 (실시간 생성 파일)\nwindow.GALLERY_PHOTOS = ${JSON.stringify(images, null, 2)};\n`;
    
    // Only write when content actually changed
    if (fs.existsSync(outputFile)) {
      const existing = fs.readFileSync(outputFile, 'utf8');
      if (existing === content) {
        return false;
      }
    }

    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`[${new Date().toLocaleTimeString()}] 갤러리 사진 목록 동기화 완료: 총 ${images.length}장`);
    
    // 내용이 바뀌었을 경우 GitHub 및 Vercel 자동 배포 트리거
    scheduleGitPush();
    return true;
  } catch (err) {
    console.error('갤러리 동기화 오류:', err.message);
    return false;
  }
}

// Watch mode or single run
if (process.argv.includes('--watch')) {
  console.log('[자동 감시 활성화] 갤러리 샬롬 사진 폴더를 실시간 감시 중입니다...');
  console.log('[자동 연동] 사진 추가 시 GitHub 및 Vercel 배포 사이트로 자동 전송됩니다.');
  updateGallery();

  let debounceTimer = null;
  const triggerUpdate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateGallery();
    }, 400);
  };

  try {
    fs.watch(galleryDir, triggerUpdate);
  } catch (e) {
    console.error('Watch error:', e.message);
  }

  // Backup polling every 2 seconds to reliably catch Windows file paste/drag-drop
  setInterval(updateGallery, 2000);
} else {
  updateGallery();
}
