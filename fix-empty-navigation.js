const fs = require('fs').promises;
const path = require('path');

async function fixEmptyNavigation() {
    const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
    const files = await fs.readdir(blogDir);
    const articleFiles = files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    const navigationHTML = `<nav class="myblog-article-navigation">
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
        
        // Check for empty navigation section
        const emptyNavPattern = /<section\s+class="myblog-article-navigation">\s*<\/section>/;
        const simpleEmptyNavPattern = /<section\s+class="myblog-article-navigation">/;
        
        if (emptyNavPattern.test(content)) {
            // Replace empty navigation section
            content = content.replace(emptyNavPattern, navigationHTML);
            await fs.writeFile(filePath, content, 'utf8');
            console.log(`✓ ${file} - 空のナビゲーションを修正しました`);
            fixedCount++;
        } else if (simpleEmptyNavPattern.test(content) && !content.includes('myblog-nav-container')) {
            // Find the navigation section and check if it's truly empty
            const navStartIndex = content.search(simpleEmptyNavPattern);
            if (navStartIndex !== -1) {
                // Find the matching closing tag
                let depth = 1;
                let i = navStartIndex + content.match(simpleEmptyNavPattern)[0].length;
                let endIndex = -1;
                
                while (i < content.length && depth > 0) {
                    if (content.substring(i).startsWith('<section')) {
                        depth++;
                    } else if (content.substring(i).startsWith('</section>')) {
                        depth--;
                        if (depth === 0) {
                            endIndex = i + '</section>'.length;
                            break;
                        }
                    }
                    i++;
                }
                
                if (endIndex !== -1) {
                    const navSection = content.substring(navStartIndex, endIndex);
                    // Check if it's empty or doesn't contain navigation content
                    if (!navSection.includes('myblog-nav-container')) {
                        // Replace the entire section
                        content = content.substring(0, navStartIndex) + navigationHTML + content.substring(endIndex);
                        await fs.writeFile(filePath, content, 'utf8');
                        console.log(`✓ ${file} - 不完全なナビゲーションを修正しました`);
                        fixedCount++;
                        continue;
                    }
                }
            }
            skippedCount++;
        } else {
            console.log(`✓ ${file} - ナビゲーションは正常です`);
            skippedCount++;
        }
    }
    
    console.log(`\n処理完了:`);
    console.log(`- 修正済み: ${fixedCount}件`);
    console.log(`- スキップ: ${skippedCount}件`);
    console.log(`- 総記事数: ${articleFiles.length}件`);
}

// スクリプトを実行
fixEmptyNavigation().catch(console.error);