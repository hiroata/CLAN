const fs = require('fs');
const path = require('path');

// ブログディレクトリ
const blogDir = path.join(__dirname, 'blog');

// 修正対象のHTMLファイルを取得
const articleFiles = fs.readdirSync(blogDir)
    .filter(file => file.startsWith('article-') && file.endsWith('.html'));

console.log(`Found ${articleFiles.length} article files to fix footer issues`);

let fixedCount = 0;
let errorCount = 0;

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // 1. 記事フッターの構造を修正
        // 著者情報のセクションを探す
        const authorPattern = /<div class="myblog-author">[\s\S]*?<\/div>\s*<\/div>/g;
        const authorMatches = content.match(authorPattern) || [];
        
        if (authorMatches.length > 0) {
            // 著者情報の後に適切な終了タグがあることを確認
            authorMatches.forEach(authorSection => {
                const authorIndex = content.lastIndexOf(authorSection);
                const afterAuthor = content.substring(authorIndex + authorSection.length, authorIndex + authorSection.length + 200);
                
                // 著者情報の後に適切な閉じタグがない場合
                if (!afterAuthor.match(/^\s*<\/footer>/m)) {
                    // 著者情報の直後に</footer>を追加
                    const newContent = content.substring(0, authorIndex + authorSection.length) + 
                        '\n                </footer>' + 
                        content.substring(authorIndex + authorSection.length);
                    content = newContent;
                }
            });
        }
        
        // 2. 記事ナビゲーションの前に</footer>が必要な場合を修正
        const navCommentPattern = /<!-- 記事ナビゲーション -->/g;
        const navCommentMatches = content.match(navCommentPattern) || [];
        
        navCommentMatches.forEach(navComment => {
            const navIndex = content.indexOf(navComment);
            const beforeNav = content.substring(Math.max(0, navIndex - 500), navIndex);
            
            // ナビゲーションの前に</footer>が必要かチェック
            if (beforeNav.includes('<footer class="myblog-article-footer">') && 
                !beforeNav.match(/<\/footer>\s*$/)) {
                content = content.substring(0, navIndex) + 
                    '\n                </footer>\n\n' + 
                    content.substring(navIndex);
            }
        });
        
        // 3. 記事の終了構造を確認・修正
        // </article>タグの前に記事ナビゲーションがあることを確認
        const articleClosePattern = /<\/article>/g;
        const articleCloseMatches = [...content.matchAll(articleClosePattern)];
        
        if (articleCloseMatches.length > 0) {
            const lastArticleClose = articleCloseMatches[articleCloseMatches.length - 1];
            const beforeArticleClose = content.substring(Math.max(0, lastArticleClose.index - 2000), lastArticleClose.index);
            
            // 記事ナビゲーションが</article>の前にあるか確認
            if (!beforeArticleClose.includes('myblog-article-navigation')) {
                // ナビゲーションを探して</article>の前に移動
                const navSectionPattern = /<div class="myblog-article-navigation">[\s\S]*?<\/div>\s*<\/div>/;
                const navMatch = content.match(navSectionPattern);
                
                if (navMatch && content.indexOf(navMatch[0]) > lastArticleClose.index) {
                    // ナビゲーションを削除
                    content = content.replace(navMatch[0], '');
                    // </article>の前に挿入
                    content = content.substring(0, lastArticleClose.index) +
                        '\n\n                ' + navMatch[0] + '\n' +
                        content.substring(lastArticleClose.index);
                }
            }
        }
        
        // 4. 関連記事セクションの構造を修正
        const relatedSectionPattern = /<section class="myblog-related">[\s\S]*?<\/section>/g;
        const relatedMatches = content.match(relatedSectionPattern) || [];
        
        relatedMatches.forEach(relatedSection => {
            // article要素の数をカウント
            const articleOpenCount = (relatedSection.match(/<article/g) || []).length;
            const articleCloseCount = (relatedSection.match(/<\/article>/g) || []).length;
            
            if (articleOpenCount > articleCloseCount) {
                // 不足している</article>タグを追加
                const missingArticles = '</article>\n                    '.repeat(articleOpenCount - articleCloseCount);
                const fixedSection = relatedSection.replace(
                    '</div>\n            </section>',
                    missingArticles + '</div>\n            </section>'
                );
                content = content.replace(relatedSection, fixedSection);
            }
        });
        
        // 5. フッターの重複を削除
        const footerCloseCount = (content.match(/<\/footer>/g) || []).length;
        const footerOpenCount = (content.match(/<footer/g) || []).length;
        
        if (footerCloseCount > footerOpenCount) {
            // 余分な</footer>を削除
            let footerCount = 0;
            content = content.replace(/<\/footer>/g, (match) => {
                footerCount++;
                if (footerCount <= footerOpenCount) {
                    return match;
                }
                return '';
            });
        }
        
        // 6. article要素の重複チェック
        const articleOpenTotal = (content.match(/<article/g) || []).length;
        const articleCloseTotal = (content.match(/<\/article>/g) || []).length;
        
        if (articleCloseTotal > articleOpenTotal) {
            // 余分な</article>を削除
            let articleCount = 0;
            content = content.replace(/<\/article>/g, (match) => {
                articleCount++;
                if (articleCount <= articleOpenTotal) {
                    return match;
                }
                return '';
            });
        }
        
        // 7. インデント調整
        // 記事フッターのインデント
        content = content.replace(
            /(\n\s*)<footer class="myblog-article-footer">/g,
            '\n                <footer class="myblog-article-footer">'
        );
        
        // 記事ナビゲーションのインデント
        content = content.replace(
            /(\n\s*)<div class="myblog-article-navigation">/g,
            '\n                <div class="myblog-article-navigation">'
        );
        
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

// 検証
console.log('\nValidating fixes...');
let validationErrors = 0;

articleFiles.slice(0, 10).forEach(file => {
    const filePath = path.join(blogDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // フッタータグのバランスチェック
        const footerOpen = (content.match(/<footer/g) || []).length;
        const footerClose = (content.match(/<\/footer>/g) || []).length;
        
        if (footerOpen !== footerClose) {
            console.log(`  ⚠ ${file}: Footer imbalance (open: ${footerOpen}, close: ${footerClose})`);
            validationErrors++;
        }
        
        // article要素のバランスチェック
        const articleOpen = (content.match(/<article/g) || []).length;
        const articleClose = (content.match(/<\/article>/g) || []).length;
        
        if (articleOpen !== articleClose) {
            console.log(`  ⚠ ${file}: Article imbalance (open: ${articleOpen}, close: ${articleClose})`);
            validationErrors++;
        }
        
    } catch (error) {
        console.error(`  ✗ Validation error for ${file}:`, error.message);
        validationErrors++;
    }
});

if (validationErrors === 0) {
    console.log(`\n✓ All validated files have correct structure!`);
} else {
    console.log(`\n⚠ Found ${validationErrors} validation issues.`);
}