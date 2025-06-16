const fs = require('fs').promises;
const path = require('path');

async function addNavigationToAllArticles() {
    const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
    const files = await fs.readdir(blogDir);
    const articleFiles = files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    
    let addedCount = 0;
    let skippedCount = 0;
    
    const navigationHTML = `
    <!-- 記事ナビゲーション -->
    <nav class="myblog-article-navigation">
        <div class="myblog-nav-container">
            <div class="myblog-nav-prev" id="prevArticle">
                <span class="myblog-nav-label">前の記事</span>
                <span class="myblog-nav-title" id="prevTitle">Loading...</span>
            </div>
            <div class="myblog-nav-next" id="nextArticle">
                <span class="myblog-nav-label">次の記事</span>
                <span class="myblog-nav-title" id="nextTitle">Loading...</span>
            </div>
        </div>
    </nav>`;
    
    for (const file of articleFiles) {
        const filePath = path.join(blogDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Check if navigation already exists
        if (content.includes('class="myblog-article-navigation"')) {
            console.log(`✓ ${file} - すでにナビゲーションが存在します`);
            skippedCount++;
            continue;
        }
        
        // Find the closing body tag and insert navigation before it
        const bodyCloseIndex = content.lastIndexOf('</body>');
        
        if (bodyCloseIndex === -1) {
            console.log(`✗ ${file} - </body>タグが見つかりません`);
            continue;
        }
        
        // Insert navigation HTML before </body>
        const newContent = content.slice(0, bodyCloseIndex) + navigationHTML + '\n' + content.slice(bodyCloseIndex);
        
        await fs.writeFile(filePath, newContent, 'utf8');
        console.log(`✓ ${file} - ナビゲーションを追加しました`);
        addedCount++;
    }
    
    console.log(`\n処理完了:`);
    console.log(`- ナビゲーション追加: ${addedCount}件`);
    console.log(`- スキップ（既存）: ${skippedCount}件`);
    console.log(`- 総記事数: ${articleFiles.length}件`);
}

// スクリプトを実行
addNavigationToAllArticles().catch(console.error);