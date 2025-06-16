const fs = require('fs');
const path = require('path');

// ブログディレクトリ
const blogDir = path.join(__dirname, 'blog');

// 修正対象のHTMLファイルを取得
const articleFiles = fs.readdirSync(blogDir)
    .filter(file => file.startsWith('article-') && file.endsWith('.html'));

console.log(`Found ${articleFiles.length} article files to fix`);

let fixedCount = 0;
let errorCount = 0;

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // 1. 重複したスタイル定義を削除
        const stylePattern = /<style>\s*\.myblog-article-navigation[\s\S]*?<\/style>/g;
        const styleMatches = content.match(stylePattern) || [];
        
        if (styleMatches.length > 1) {
            // 最初のスタイル定義だけを残す
            let firstStyle = true;
            content = content.replace(stylePattern, (match) => {
                if (firstStyle) {
                    firstStyle = false;
                    return match;
                }
                return '';
            });
        }
        
        // 2. 記事フッターの構造を修正
        // </div>タグの不足を検出して修正
        const authorSectionPattern = /<div class="myblog-author">[\s\S]*?<\/div>\s*<\/div>/g;
        if (!content.match(authorSectionPattern)) {
            // 著者セクションの後に適切な閉じタグを追加
            content = content.replace(
                /(<\/div>\s*<\/div>\s*)(<\/div>\s*)?(\s*<!-- 記事ナビゲーション -->)/,
                '$1\n                </footer>\n\n$3'
            );
        }
        
        // 3. 記事ナビゲーションセクションの修正
        // 関連記事セクションの閉じタグを確認
        const relatedPattern = /<section class="myblog-related">[\s\S]*?<\/section>/;
        const relatedMatch = content.match(relatedPattern);
        
        if (relatedMatch) {
            // 関連記事セクションの閉じdivタグが不足している場合の修正
            const relatedContent = relatedMatch[0];
            const openDivCount = (relatedContent.match(/<div/g) || []).length;
            const closeDivCount = (relatedContent.match(/<\/div>/g) || []).length;
            
            if (openDivCount > closeDivCount) {
                const missingDivs = '</div>'.repeat(openDivCount - closeDivCount);
                content = content.replace(
                    '</section>',
                    `${missingDivs}\n                </section>`
                );
            }
        }
        
        // 4. フッタータグの確認と修正
        // </footer>タグが重複している場合の修正
        const footerPattern = /<\/footer>/g;
        const footerMatches = content.match(footerPattern) || [];
        
        if (footerMatches.length > 2) {
            // 記事フッターと全体フッターの2つだけを残す
            let footerCount = 0;
            content = content.replace(footerPattern, (match) => {
                footerCount++;
                if (footerCount <= 2) {
                    return match;
                }
                return '';
            });
        }
        
        // 5. 記事ナビゲーションのHTML構造を正しく配置
        const navPattern = /<!-- 記事ナビゲーション -->[\s\S]*?<\/div>\s*<\/div>/;
        const navMatch = content.match(navPattern);
        
        if (navMatch) {
            // ナビゲーションが</article>タグの外にある場合、中に移動
            if (content.indexOf(navMatch[0]) > content.indexOf('</article>')) {
                content = content.replace(navMatch[0], '');
                content = content.replace(
                    '</article>',
                    `${navMatch[0]}\n            </article>`
                );
            }
        }
        
        // 6. myblog-article-footerの閉じタグを確認
        if (!content.includes('</footer>') || content.match(/<footer class="myblog-article-footer">/g)?.length > content.match(/<\/footer>/g)?.filter((_, i) => i === 0).length) {
            // 著者情報の後に閉じタグを追加
            content = content.replace(
                /(<\/div>\s*<\/div>\s*)(<!-- 記事ナビゲーション -->)/,
                '$1\n                </footer>\n\n                $2'
            );
        }
        
        // 7. 全体的なタグバランスの確認
        const checkTags = ['section', 'article', 'main', 'div'];
        checkTags.forEach(tag => {
            const openTags = (content.match(new RegExp(`<${tag}[^>]*>`, 'g')) || []).length;
            const closeTags = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
            
            if (openTags !== closeTags) {
                console.log(`  Warning in ${file}: ${tag} tags imbalance (open: ${openTags}, close: ${closeTags})`);
            }
        });
        
        // 変更があった場合のみ保存
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed ${file}`);
            fixedCount++;
        }
        
    } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
        errorCount++;
    }
});

console.log(`\nSummary:`);
console.log(`- Fixed: ${fixedCount} files`);
console.log(`- Errors: ${errorCount} files`);
console.log(`- Unchanged: ${articleFiles.length - fixedCount - errorCount} files`);