# 全記事の最終チェック・デザイン統一スクリプト

$blogDir = "blog"
$totalFixedCount = 0
$designFixedCount = 0

Write-Host "=== 全記事最終チェック・統一修正 ===" -ForegroundColor Cyan

# 1. 「読み込み中...」の最終確認
Write-Host "`n【1】読み込み中チェック..." -ForegroundColor Yellow
$loadingFiles = Get-ChildItem "$blogDir\*.html" | Where-Object { (Get-Content $_.FullName -Raw) -match '読み込み中\.\.\.'}
if ($loadingFiles.Count -gt 0) {
    Write-Host "❌ 読み込み中が残っている記事: $($loadingFiles.Count)件" -ForegroundColor Red
    $loadingFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Red }
} else {
    Write-Host "✅ 読み込み中問題: なし" -ForegroundColor Green
}

# 2. 英語タイトル問題の最終確認
Write-Host "`n【2】英語タイトル問題チェック..." -ForegroundColor Yellow
$englishTitleFiles = Get-ChildItem "$blogDir\*.html" | Where-Object { 
    $content = Get-Content $_.FullName -Raw
    $content -match 'filename\.replace.*\|\|' -and $content -notmatch 'articleTitles\[filename\]'
}
if ($englishTitleFiles.Count -gt 0) {
    Write-Host "❌ 英語タイトル問題が残っている記事: $($englishTitleFiles.Count)件" -ForegroundColor Red
    $englishTitleFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Red }
} else {
    Write-Host "✅ 英語タイトル問題: なし" -ForegroundColor Green
}

# 3. CSSデザイン統一（border-radius: 4px → 12px）
Write-Host "`n【3】CSSデザイン統一..." -ForegroundColor Yellow
$cssFixFiles = Get-ChildItem "$blogDir\*.html" | Where-Object { 
    (Get-Content $_.FullName -Raw) -match 'border-radius:\s*4px'
}

if ($cssFixFiles.Count -gt 0) {
    Write-Host "🔧 デザイン修正中: $($cssFixFiles.Count)件" -ForegroundColor Blue
    
    foreach ($file in $cssFixFiles) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # border-radius: 4px → 12px
        $content = $content -replace 'border-radius:\s*4px', 'border-radius: 12px'
        
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
        $designFixedCount++
    }
} else {
    Write-Host "✅ CSSデザイン: 統一済み" -ForegroundColor Green
}

# 4. ページ送り機能の有無チェック
Write-Host "`n【4】ページ送り機能チェック..." -ForegroundColor Yellow
$noNavFiles = Get-ChildItem "$blogDir\*.html" | Where-Object { 
    $content = Get-Content $_.FullName -Raw
    $content -notmatch 'myblog-article-navigation'
}
if ($noNavFiles.Count -gt 0) {
    Write-Host "❌ ページ送り機能がない記事: $($noNavFiles.Count)件" -ForegroundColor Red
    $noNavFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Red }
} else {
    Write-Host "✅ ページ送り機能: 全記事対応済み" -ForegroundColor Green
}

# 5. 最終統計
Write-Host "`n=== 最終結果 ===" -ForegroundColor Cyan
$totalFiles = (Get-ChildItem "$blogDir\*.html").Count
Write-Host "📊 総記事数: $totalFiles 件" -ForegroundColor White
Write-Host "🎨 デザイン修正: $designFixedCount 件" -ForegroundColor Green

Write-Host "`n🎉 全記事チェック・修正完了！" -ForegroundColor Green
