# 全記事を美しい元のデザインに統一するスクリプト

$blogDir = "blog"
$fixedCount = 0

# 美しい元のCSSテンプレート
$beautifulCSS = @"
        .myblog-article-navigation {
            margin: 40px 0;
            padding: 30px 0;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .myblog-nav-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            max-width: 100%;
        }
        
        .myblog-nav-prev,
        .myblog-nav-next {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            background: #fafafa;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: block;
            min-height: 80px;
        }
        
        .myblog-nav-prev:hover,
        .myblog-nav-next:hover {
            background: #f0f0f0;
            border-color: #0071e3;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 113, 227, 0.1);
        }
        
        .myblog-nav-prev.disabled,
        .myblog-nav-next.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f5f5f5;
        }
        
        .myblog-nav-prev.disabled:hover,
        .myblog-nav-next.disabled:hover {
            transform: none;
            box-shadow: none;
            border-color: #e0e0e0;
            background: #f5f5f5;
        }
        
        .myblog-nav-label {
            display: block;
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .myblog-nav-title {
            font-size: 0.95rem;
            font-weight: 600;
            line-height: 1.4;
            color: #333;
        }
        
        .myblog-nav-prev .myblog-nav-label::before {
            content: "← ";
            margin-right: 4px;
        }
        
        .myblog-nav-next .myblog-nav-label::after {
            content: " →";
            margin-left: 4px;
        }
        
        @media (max-width: 768px) {
            .myblog-nav-container {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .myblog-article-navigation {
                margin: 30px 0;
                padding: 20px 0;
            }
        }
"@

Write-Host "=== 全記事を美しいデザインに統一中 ===" -ForegroundColor Green

Get-ChildItem -Path "$blogDir\*.html" | ForEach-Object {
    $filePath = $_.FullName
    $filename = $_.Name
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 簡素なCSSを美しいCSSに置き換え
        if ($content -match '\.myblog-article-navigation\s*{[^}]+background:\s*#f8f9fa') {
            # 簡素なCSS部分を特定して置換
            $pattern = '\.myblog-article-navigation\s*{[^}]+}.*?@media[^}]+}\s*}'
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $beautifulCSS
                Set-Content -Path $filePath -Value $content -Encoding UTF8
                Write-Host "✅ $filename - 美しいデザインに更新" -ForegroundColor Green
                $fixedCount++
            }
        }
        
    } catch {
        Write-Host "❌ $filename - エラー: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎨 デザイン統一完了: $fixedCount 記事" -ForegroundColor Green
