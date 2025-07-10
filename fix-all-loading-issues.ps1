# 全記事の「読み込み中...」問題を一括修正するスクリプト
# HTMLに直接記事タイトルを記載して確実に表示

$blogDir = "blog"
$fixedCount = 0
$errorCount = 0

# 記事リストと日本語タイトル対応表を取得（参考記事から）
$referenceFile = "blog\article-utage-beauty-health-digital-marketing.html"
$refContent = Get-Content $referenceFile -Raw -Encoding UTF8

# 記事リストを抽出
$articleListMatch = $refContent -match "const articleList = \[(.*?)\];"
if ($articleListMatch) {
    $articleListText = $matches[1]
    $articleList = @()
    $articleListText -split "," | ForEach-Object {
        $item = $_.Trim() -replace "'", "" -replace '"', ""
        if ($item -and $item.EndsWith(".html")) {
            $articleList += $item
        }
    }
}

# 日本語タイトル対応表を抽出
$titleMapPattern = "const articleTitles = \{(.*?)\};"
$titleMapMatch = $refContent -match $titleMapPattern
$titleMap = @{}
if ($titleMapMatch) {
    $titleMapText = $matches[1]
    $titleMapText -split "," | ForEach-Object {
        if ($_ -match "'([^']+)':\s*'([^']+)'") {
            $filename = $matches[1].Trim()
            $title = $matches[2].Trim()
            $titleMap[$filename] = $title
        }
    }
}

Write-Host "=== 全記事「読み込み中...」問題一括修正開始 ===" -ForegroundColor Red
Write-Host "記事リスト数: $($articleList.Count)" -ForegroundColor Cyan
Write-Host "タイトルマップ数: $($titleMap.Count)" -ForegroundColor Cyan

foreach ($filename in $articleList) {
    $filePath = Join-Path $blogDir $filename
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  ファイルが見つかりません: $filename" -ForegroundColor Yellow
        continue
    }
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 「読み込み中...」がある場合のみ修正
        if ($content -match '読み込み中\.\.\.') {
            # 現在の記事のインデックスを取得
            $currentIndex = $articleList.IndexOf($filename)
            
            if ($currentIndex -eq -1) {
                Write-Host "⚠️  $filename - 記事リストに見つかりません" -ForegroundColor Yellow
                continue
            }
            
            # 前の記事と次の記事を決定
            $prevLink = ""
            $nextLink = ""
            
            if ($currentIndex -gt 0) {
                $prevFilename = $articleList[$currentIndex - 1]
                $prevTitle = if ($titleMap[$prevFilename]) { $titleMap[$prevFilename] } else { $prevFilename -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
                $prevLink = @"
                    <a href="$prevFilename" class="myblog-nav-prev">
                        <span class="myblog-nav-label">前の記事</span>
                        <div class="myblog-nav-title">$prevTitle</div>
                    </a>
"@
            } else {
                $prevLink = @"
                    <div class="myblog-nav-prev disabled">
                        <span class="myblog-nav-label">前の記事</span>
                        <div class="myblog-nav-title">最初の記事です</div>
                    </div>
"@
            }
            
            if ($currentIndex -lt ($articleList.Count - 1)) {
                $nextFilename = $articleList[$currentIndex + 1]
                $nextTitle = if ($titleMap[$nextFilename]) { $titleMap[$nextFilename] } else { $nextFilename -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
                $nextLink = @"
                    <a href="$nextFilename" class="myblog-nav-next">
                        <span class="myblog-nav-label">次の記事</span>
                        <div class="myblog-nav-title">$nextTitle</div>
                    </a>
"@
            } else {
                $nextLink = @"
                    <div class="myblog-nav-next disabled">
                        <span class="myblog-nav-label">次の記事</span>
                        <div class="myblog-nav-title">最後の記事です</div>
                    </div>
"@
            }
            
            # 新しいナビゲーションHTML
            $newNavigation = @"
                <!-- 記事ナビゲーション -->
                <div class="myblog-article-navigation">
                    <div class="myblog-nav-container">
$prevLink
$nextLink
                    </div>
                </div>
"@
            
            # 既存のナビゲーション部分を置換
            $oldPattern = '<!-- 記事ナビゲーション -->.*?</div>\s*</div>'
            $content = $content -replace $oldPattern, $newNavigation
            
            # ファイルを保存
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "✅ $filename - 修正完了" -ForegroundColor Green
            $fixedCount++
        }
        
    } catch {
        Write-Host "❌ $filename - エラー: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n=== 修正完了 ===" -ForegroundColor Yellow
Write-Host "修正完了: $fixedCount 記事" -ForegroundColor Green
Write-Host "エラー: $errorCount 記事" -ForegroundColor Red

# 最終確認
$remainingIssues = 0
Get-ChildItem -Path "$blogDir\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($content -match '読み込み中\.\.\.') {
        $remainingIssues++
    }
}

if ($remainingIssues -eq 0) {
    Write-Host "`n🎉 全記事の「読み込み中...」問題が解決されました！" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  まだ $remainingIssues 記事に問題が残っています" -ForegroundColor Yellow
}
