const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 処理対象の記事ファイル
const articleFiles = fs.readdirSync(blogDir)
    .filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));

console.log(`\n🎯 関連記事セクションの配置修正スクリプト`);
console.log(`対象ファイル数: ${articleFiles.length}\n`);

let processedCount = 0;
let errorCount = 0;
let fixedCount = 0;

// 修正対象のスタイル
const oldStyle = `        .myblog-related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            padding: 0 20px;
        }`;

const newStyle = `        .myblog-related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0;
        }`;

// モバイル用の古いスタイル
const oldMobileStyle = `            .myblog-related-grid {
                grid-template-columns: 1fr;
                padding: 0 16px;
            }`;

const newMobileStyle = `            .myblog-related-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }`;

// 各記事ファイルを処理
articleFiles.forEach(file => {
    try {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`処理中: ${file}`);
        
        let modified = false;
        
        // 関連記事セクションが存在するかチェック
        if (content.includes('class="myblog-related"')) {
            // 通常のスタイルを修正
            if (content.includes(oldStyle)) {
                content = content.replace(oldStyle, newStyle);
                modified = true;
                console.log(`  ✅ 関連記事グリッドのパディングを修正`);
            }
            
            // モバイル用スタイルを修正
            if (content.includes(oldMobileStyle)) {
                content = content.replace(oldMobileStyle, newMobileStyle);
                modified = true;
                console.log(`  ✅ モバイル用スタイルも修正`);
            }
            
            // 追加の修正：関連記事セクション全体のスタイルも確認
            if (!content.includes('max-width: 1200px') && content.includes('.myblog-related {')) {
                // .myblog-related のスタイルに max-width を追加
                const relatedSectionStyle = `        .myblog-related {
            margin: 60px 0;
            padding: 40px 0;
            background: #f8f9fa;
            border-radius: 16px;
        }`;
                
                const newRelatedSectionStyle = `        .myblog-related {
            margin: 60px auto;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: 16px;
            max-width: 1200px;
        }`;
                
                if (content.includes(relatedSectionStyle)) {
                    content = content.replace(relatedSectionStyle, newRelatedSectionStyle);
                    modified = true;
                    console.log(`  ✅ 関連記事セクション全体のスタイルも修正`);
                }
            }
            
            if (modified) {
                // ファイルを保存
                fs.writeFileSync(filePath, content, 'utf-8');
                fixedCount++;
            } else {
                console.log(`  ℹ️  既に修正済みまたは修正不要`);
            }
        } else {
            console.log(`  ⚠️  関連記事セクションなし`);
        }
        
        processedCount++;
        
    } catch (error) {
        console.error(`❌ エラー: ${file} - ${error.message}`);
        errorCount++;
    }
});

console.log(`\n✨ 処理完了！`);
console.log(`処理成功: ${processedCount}件`);
console.log(`修正実施: ${fixedCount}件`);
console.log(`エラー: ${errorCount}件`);

// 処理結果の検証
console.log(`\n🔍 処理結果の検証中...`);

let stillHasPaddingCount = 0;

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes('class="myblog-related"') && content.includes('padding: 0 20px;')) {
        console.log(`⚠️  まだ古いパディングが残っています: ${file}`);
        stillHasPaddingCount++;
    }
});

console.log(`\n📊 検証結果:`);
console.log(`古いパディングが残っている記事: ${stillHasPaddingCount}件`);

if (stillHasPaddingCount === 0) {
    console.log(`\n✅ すべての関連記事セクションが正しく中央配置されました！`);
} else {
    console.log(`\n⚠️  一部の記事でまだ修正が必要です。`);
}