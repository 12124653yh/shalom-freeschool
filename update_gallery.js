const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '갤러리 샬롬 사진');
const outputFile = path.join(__dirname, 'gallery_data.js');

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
    return true;
  } catch (err) {
    console.error('갤러리 동기화 오류:', err.message);
    return false;
  }
}

// Watch mode or single run
if (process.argv.includes('--watch')) {
  console.log('[자동 감시 활성화] 갤러리 샬롬 사진 폴더를 실시간 감시 중입니다...');
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
