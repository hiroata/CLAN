const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 処理対象の記事ファイル
const articleFiles = fs.readdirSync(blogDir)
    .filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));

console.log(`\n🎯 ブログ記事のプロフィール・関連記事統一化スクリプト`);
console.log(`対象ファイル数: ${articleFiles.length}\n`);

let processedCount = 0;
let errorCount = 0;

// 統一スタイルの定義（インラインスタイルを削除し、外部CSSを活用）
const unifiedStyles = `
    <!-- 記事ナビゲーション用スタイル -->
    <style>
        .myblog-article-navigation {
            margin: 60px 0 40px;
            padding: 40px 0;
            border-top: 2px solid #e0e0e0;
            border-bottom: 2px solid #e0e0e0;
            background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
        }
        
        .myblog-nav-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            max-width: 100%;
        }
        
        .myblog-nav-prev,
        .myblog-nav-next {
            padding: 24px;
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: block;
            min-height: 100px;
            position: relative;
            overflow: hidden;
        }
        
        .myblog-nav-prev::before,
        .myblog-nav-next::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 113, 227, 0.05), transparent);
            transition: left 0.6s ease;
        }
        
        .myblog-nav-prev:hover::before,
        .myblog-nav-next:hover::before {
            left: 100%;
        }
        
        .myblog-nav-prev:hover,
        .myblog-nav-next:hover {
            background: #f8f9fa;
            border-color: #0071e3;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 113, 227, 0.15);
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
            font-size: 0.875rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .myblog-nav-title {
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.5;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .myblog-nav-prev .myblog-nav-label::before {
            content: "← ";
            margin-right: 4px;
            font-weight: 700;
        }
        
        .myblog-nav-next {
            text-align: right;
        }
        
        .myblog-nav-next .myblog-nav-label::after {
            content: " →";
            margin-left: 4px;
            font-weight: 700;
        }
        
        /* 関連記事セクション統一スタイル */
        .myblog-related {
            margin: 60px 0;
            padding: 40px 0;
            background: #f8f9fa;
            border-radius: 16px;
        }
        
        .myblog-related-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 32px;
            text-align: center;
            position: relative;
        }
        
        .myblog-related-title::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: #0071e3;
            border-radius: 2px;
        }
        
        .myblog-related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            padding: 0 20px;
        }
        
        .myblog-related-card {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .myblog-related-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
            border-color: #0071e3;
        }
        
        .myblog-related-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .myblog-related-image {
            width: 100%;
            height: 200px;
            background: #f0f0f0;
            position: relative;
            overflow: hidden;
        }
        
        .myblog-related-content {
            padding: 20px;
        }
        
        .myblog-related-card-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 12px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .myblog-related-date {
            font-size: 0.875rem;
            color: #666;
            font-weight: 500;
        }
        
        @media (max-width: 768px) {
            .myblog-nav-container {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .myblog-nav-prev,
            .myblog-nav-next {
                padding: 20px;
                min-height: 80px;
                text-align: left;
            }
            
            .myblog-nav-title {
                font-size: 0.938rem;
            }
            
            .myblog-related {
                padding: 24px 0;
                margin: 40px 0;
            }
            
            .myblog-related-grid {
                grid-template-columns: 1fr;
                padding: 0 16px;
            }
            
            .myblog-related-title {
                font-size: 1.5rem;
            }
        }
    </style>`;

// プロフィールHTMLテンプレート
const profileTemplate = `
                <!-- 著者プロフィール -->
                <div class="myblog-author">
                    <div class="myblog-author-avatar">
                        <img src="../assets/images/profile-owner.webp" alt="前田由紀子" loading="lazy">
                    </div>
                    <div class="myblog-author-info">
                        <h3 class="myblog-author-name">前田由紀子</h3>
                        <p class="myblog-author-bio">
                            UTAGEコンサルタント。オンラインビジネスの集客・販売戦略の専門家として、中小企業から個人事業主まで幅広くサポート。特にコーチングビジネスの自動化・効率化で、クライアントの売上向上と業務最適化の実現を得意とする。
                        </p>
                    </div>
                </div>`;

// 各記事ファイルを処理
articleFiles.forEach(file => {
    try {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`処理中: ${file}`);
        
        // 既存のインラインスタイルを削除（記事ナビゲーションと関連記事のスタイルのみ）
        content = content.replace(/<style>\s*\.myblog-article-navigation[\s\S]*?<\/style>/g, unifiedStyles);
        
        // スタイルが存在しない場合は追加
        if (!content.includes('.myblog-article-navigation')) {
            // </head>の前に統一スタイルを追加
            content = content.replace('</head>', unifiedStyles + '\n</head>');
        }
        
        // プロフィールセクションの確認と修正
        if (!content.includes('class="myblog-author"')) {
            // プロフィールがない場合、</article>の前に追加
            content = content.replace('</article>', profileTemplate + '\n\n            </article>');
            console.log(`  ✅ プロフィールセクションを追加`);
        } else {
            // 既存のプロフィールを統一テンプレートで置換
            content = content.replace(
                /<div class="myblog-author">[\s\S]*?<\/div>\s*<\/div>/g,
                profileTemplate.trim()
            );
            console.log(`  ✅ プロフィールセクションを統一化`);
        }
        
        // 関連記事セクションのクラス名を確認
        if (content.includes('class="myblog-related"')) {
            console.log(`  ✅ 関連記事セクションは正しく実装されています`);
        } else {
            console.log(`  ⚠️  関連記事セクションが見つかりません`);
        }
        
        // ファイルを保存
        fs.writeFileSync(filePath, content, 'utf-8');
        processedCount++;
        
    } catch (error) {
        console.error(`❌ エラー: ${file} - ${error.message}`);
        errorCount++;
    }
});

console.log(`\n✨ 処理完了！`);
console.log(`成功: ${processedCount}件`);
console.log(`エラー: ${errorCount}件`);

// 処理結果の検証
console.log(`\n🔍 処理結果の検証中...`);

let profileMissingCount = 0;
let relatedMissingCount = 0;

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!content.includes('class="myblog-author"')) {
        console.log(`⚠️  プロフィールなし: ${file}`);
        profileMissingCount++;
    }
    
    if (!content.includes('class="myblog-related"')) {
        console.log(`⚠️  関連記事なし: ${file}`);
        relatedMissingCount++;
    }
});

console.log(`\n📊 検証結果:`);
console.log(`プロフィールなし: ${profileMissingCount}件`);
console.log(`関連記事なし: ${relatedMissingCount}件`);

if (profileMissingCount === 0 && relatedMissingCount === 0) {
    console.log(`\n✅ すべての記事にプロフィールと関連記事が正しく実装されています！`);
} else {
    console.log(`\n⚠️  一部の記事で実装が不足しています。手動での確認が必要です。`);
}