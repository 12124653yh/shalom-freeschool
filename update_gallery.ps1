$galleryDir = Join-Path $PSScriptRoot "갤러리 샬롬 사진"
$outputFile = Join-Path $PSScriptRoot "gallery_data.js"

if (-not (Test-Path $galleryDir)) {
    New-Item -ItemType Directory -Path $galleryDir -Force | Out-Null
}

$exts = @(".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg")
$files = Get-ChildItem -Path $galleryDir | Where-Object { $exts -contains $_.Extension.ToLower() }

$jsonList = @()
foreach ($f in $files) {
    $rel = "갤러리 샬롬 사진/" + $f.Name
    $jsonList += "  `"$rel`""
}

$content = "// 갤러리 샬롬 사진 폴더 자동 목록`nwindow.GALLERY_PHOTOS = [`n" + ($jsonList -join ",`n") + "`n];`n"
[System.IO.File]::WriteAllText($outputFile, $content, [System.Text.Encoding]::UTF8)

Write-Host "갤러리 사진 $($files.Count)장이 등록되었습니다."
