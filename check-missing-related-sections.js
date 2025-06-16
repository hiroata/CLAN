const fs = require('fs').promises;
const path = require('path');

async function checkMissingRelatedSections() {
    const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
    const files = await fs.readdir(blogDir);
    const articleFiles = files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    
    const missingRelated = [];
    const hasRelated = [];
    const brokenStructure = [];
    
    for (const file of articleFiles) {
        const filePath = path.join(blogDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for related articles section HTML
        const hasRelatedSection = content.includes('<section class="myblog-related">') || 
                                 content.includes('<div class="myblog-related">');
        
        // Check if file ends properly
        const endsProperlyWithHtml = content.trim().endsWith('</html>');
        const hasClosingBody = content.includes('</body>');
        const hasFooter = content.includes('<footer class="site-footer">');
        
        if (!endsProperlyWithHtml || !hasClosingBody) {
            brokenStructure.push({
                file,
                issues: {
                    endsWithHtml: endsProperlyWithHtml,
                    hasClosingBody: hasClosingBody,
                    hasFooter: hasFooter
                }
            });
        }
        
        if (hasRelatedSection) {
            hasRelated.push(file);
        } else {
            missingRelated.push(file);
        }
    }
    
    console.log(`\n=== 関連記事セクション調査結果 ===`);
    console.log(`総記事数: ${articleFiles.length}`);
    console.log(`関連記事あり: ${hasRelated.length}`);
    console.log(`関連記事なし: ${missingRelated.length}`);
    console.log(`構造異常: ${brokenStructure.length}`);
    
    if (brokenStructure.length > 0) {
        console.log(`\n=== 構造異常の記事 ===`);
        brokenStructure.forEach(item => {
            console.log(`\n${item.file}:`);
            console.log(`  - HTML終了タグ: ${item.issues.endsWithHtml ? '✓' : '✗'}`);
            console.log(`  - Body終了タグ: ${item.issues.hasClosingBody ? '✓' : '✗'}`);
            console.log(`  - フッター: ${item.issues.hasFooter ? '✓' : '✗'}`);
        });
    }
    
    if (missingRelated.length > 0 && missingRelated.length <= 20) {
        console.log(`\n=== 関連記事セクションがない記事 ===`);
        missingRelated.forEach(file => console.log(`- ${file}`));
    } else if (missingRelated.length > 20) {
        console.log(`\n=== 関連記事セクションがない記事（最初の20件）===`);
        missingRelated.slice(0, 20).forEach(file => console.log(`- ${file}`));
    }
}

// 実行
checkMissingRelatedSections().catch(console.error);