const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const filename = path.basename(filePath);
        let modified = false;

        // 重複した return と closing brace を削除
        const duplicateReturnPattern = /return titleMapping\[filename\]\s*\|\|\s*filename\.replace\('article-utage-',\s*''\)\.replace\('\.html',\s*''\)\.replace\(\/\-\/g,\s*' '\);\s*}\s*\/\/\s*フォールバック:[\s\S]*?return filename\.replace\('article-utage-',\s*''\)\.replace\('\.html',\s*''\)\.replace\(\/\-\/g,\s*' '\);\s*}/;
        
        if (duplicateReturnPattern.test(content)) {
            content = content.replace(duplicateReturnPattern, "return titleMapping[filename] || filename.replace('article-utage-', '').replace('.html', '').replace(/-/g, ' ');\n        }");
            modified = true;
            console.log(`✅ 重複した返却文を修正: ${filename}`);
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ エラー処理中: ${path.basename(filePath)}`, error.message);
        return false;
    }
}

function main() {
    const blogDir = path.join(__dirname, 'blog');
    
    console.log('🚀 最終修正を実行中...');
    
    let totalFiles = 0;
    let successCount = 0;
    
    const files = fs.readdirSync(blogDir);
    
    for (const file of files) {
        if (file.startsWith('article-utage-') && file.endsWith('.html')) {
            totalFiles++;
            const filePath = path.join(blogDir, file);
            if (fixFile(filePath)) {
                successCount++;
            }
        }
    }
    
    console.log(`\n📊 修正結果:`);
    console.log(`   対象ファイル数: ${totalFiles}`);
    console.log(`   修正: ${successCount}`);
    console.log(`   修正不要: ${totalFiles - successCount}`);
    
    console.log('🎉 最終修正完了！');
}

if (require.main === module) {
    main();
}