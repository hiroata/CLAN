const fs = require('fs').promises;
const path = require('path');

async function fixNavigationWidth() {
    const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
    const files = await fs.readdir(blogDir);
    const articleFiles = files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    
    let fixedCount = 0;
    
    for (const file of articleFiles) {
        const filePath = path.join(blogDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        let modified = false;
        
        // Fix the navigation container width
        content = content.replace(
            /\.myblog-nav-container\s*{\s*display:\s*grid;\s*grid-template-columns:\s*1fr\s*1fr;\s*gap:\s*24px;\s*max-width:\s*100%;/g,
            `.myblog-nav-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;`
        );
        
        if (content.includes('max-width: 1200px;')) {
            modified = true;
        }
        
        // Also update mobile styles
        if (modified) {
            // Check if mobile styles exist and update them
            const mobileStylePattern = /@media[^{]*\(max-width:\s*768px\)[^{]*{[^}]*\.myblog-nav-container[^}]*}/;
            if (!content.match(mobileStylePattern)) {
                // Add mobile styles after the desktop styles
                const insertPoint = content.indexOf('.myblog-nav-container {');
                if (insertPoint !== -1) {
                    const endOfNavContainer = content.indexOf('}', insertPoint);
                    if (endOfNavContainer !== -1) {
                        const mobileStyles = `
        
        @media (max-width: 768px) {
            .myblog-nav-container {
                grid-template-columns: 1fr;
                padding: 0 16px;
            }
        }`;
                        content = content.slice(0, endOfNavContainer + 1) + mobileStyles + content.slice(endOfNavContainer + 1);
                    }
                }
            }
            
            await fs.writeFile(filePath, content, 'utf8');
            console.log(`✓ ${file} - ナビゲーション幅を修正しました`);
            fixedCount++;
        }
    }
    
    console.log(`\n処理完了: ${fixedCount}件の記事を修正しました`);
}

// スクリプトを実行
fixNavigationWidth().catch(console.error);