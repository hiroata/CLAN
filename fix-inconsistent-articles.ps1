# 記事間の実装不整合を修正するスクリプト
# CSS・JS実装が欠けている記事を統一テンプレートで修正

$blogDir = "blog"
$fixedCount = 0
$errorCount = 0

# CSS未実装の記事リスト
$cssMissingFiles = @(
    "article-utage-email-setup.html",
    "article-utage-free-trial-guide.html",
    "article-utage-funnel-vs-clickfunnels.html",
    "article-utage-landing-page-guide.html",
    "article-utage-merits-demerits-2.html",
    "article-utage-mobile-optimization.html",
    "article-utage-optin-page-design.html",
    "article-utage-pricing.html",
    "article-utage-sales-page-psychology.html",
    "article-utage-step-mail-course.html",
    "article-utage-support-guide.html",
    "article-utage-template-guide.html",
    "article-utage-thanks-page-upsell.html",
    "article-utage-vs-comparison.html"
)

# 統一CSSテンプレート
$cssTemplate = @"
    <style>
        .myblog-article-navigation {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            max-width: 100%;
            box-sizing: border-box;
        }

        .myblog-nav-container {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            max-width: 100%;
            flex-wrap: wrap;
        }

        .myblog-nav-prev,
        .myblog-nav-next {
            flex: 1;
            min-width: 0;
            max-width: calc(50% - 10px);
            padding: 15px;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            transition: all 0.3s ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .myblog-nav-prev:hover,
        .myblog-nav-next:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .myblog-nav-label {
            display: block;
            font-size: 0.85rem;
            color: #6c757d;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .myblog-nav-title {
            font-size: 0.95rem;
            color: #495057;
            line-height: 1.4;
            font-weight: 500;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .myblog-nav-prev.disabled,
        .myblog-nav-next.disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        @media (max-width: 768px) {
            .myblog-nav-container {
                flex-direction: column;
            }
            
            .myblog-nav-prev,
            .myblog-nav-next {
                max-width: 100%;
            }
        }
    </style>
"@

Write-Host "=== 記事実装不整合修正開始 ===" -ForegroundColor Red
Write-Host "対象記事数: $($cssMissingFiles.Count)" -ForegroundColor Yellow

foreach ($filename in $cssMissingFiles) {
    $filePath = Join-Path $blogDir $filename
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  ファイルが見つかりません: $filename" -ForegroundColor Yellow
        continue
    }
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $modified = $false
        
        # CSSが未実装の場合は追加
        if ($content -notmatch '\.myblog-article-navigation\s*{') {
            # rel="stylesheet"の後にCSSを挿入
            if ($content -match '(rel="stylesheet"[^>]*>)') {
                $content = $content -replace '(rel="stylesheet"[^>]*>)', "`$1`n$cssTemplate"
                $modified = $true
                Write-Host "✅ $filename - CSS追加完了" -ForegroundColor Green
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
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
