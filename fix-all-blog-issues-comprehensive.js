const fs = require('fs');
const path = require('path');

// ブログディレクトリ
const blogDir = path.join(__dirname, 'blog');

// 修正対象のHTMLファイルを取得
const articleFiles = fs.readdirSync(blogDir)
    .filter(file => file.startsWith('article-') && file.endsWith('.html'));

console.log(`Found ${articleFiles.length} article files to fix comprehensively`);

let fixedCount = 0;
let errorCount = 0;

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // 1. 重複したスタイル定義を削除（3回以上繰り返されている場合）
        const stylePattern = /<style>\s*\.myblog-article-navigation[\s\S]*?<\/style>/g;
        const styleMatches = content.match(stylePattern) || [];
        
        if (styleMatches.length > 1) {
            // 最初のスタイル定義だけを残して重複を削除
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
        // myblog-article-footerの閉じタグが欠けている場合の修正
        const authorPattern = /<div class="myblog-author">[\s\S]*?<\/div>\s*<\/div>/;
        const authorMatch = content.match(authorPattern);
        
        if (authorMatch) {
            // 著者セクションの後に</footer>タグがあるか確認
            const afterAuthor = content.substring(content.indexOf(authorMatch[0]) + authorMatch[0].length);
            const footerClosePattern = /^\s*<\/footer>/;
            
            if (!afterAuthor.match(footerClosePattern)) {
                // </footer>タグを追加
                content = content.replace(
                    authorMatch[0],
                    authorMatch[0] + '\n                </footer>'
                );
            }
        }
        
        // 3. 関連記事セクションの構造修正
        // 関連記事セクションのdivタグが適切に閉じられているか確認
        const relatedPattern = /<section class="myblog-related">[\s\S]*?<\/section>/g;
        const relatedMatches = content.match(relatedPattern) || [];
        
        relatedMatches.forEach(relatedSection => {
            const openDivCount = (relatedSection.match(/<div[^>]*>/g) || []).length;
            const closeDivCount = (relatedSection.match(/<\/div>/g) || []).length;
            
            if (openDivCount > closeDivCount) {
                const missingDivs = '</div>'.repeat(openDivCount - closeDivCount);
                const fixedSection = relatedSection.replace(
                    '</section>',
                    `${missingDivs}\n                </section>`
                );
                content = content.replace(relatedSection, fixedSection);
            }
        });
        
        // 4. 記事ナビゲーションの配置修正
        const navPattern = /<!-- 記事ナビゲーション -->[\s\S]*?<div class="myblog-article-navigation">[\s\S]*?<\/div>\s*<\/div>/g;
        const navMatch = content.match(navPattern);
        
        if (navMatch) {
            const articleCloseIndex = content.indexOf('</article>');
            const navIndex = content.indexOf(navMatch[0]);
            
            // ナビゲーションが</article>タグの外にある場合
            if (navIndex > articleCloseIndex) {
                // ナビゲーションを削除
                content = content.replace(navMatch[0], '');
                
                // 関連記事セクションの前に挿入
                const relatedSectionPattern = /(\s*)(<section class="myblog-related">)/;
                if (content.match(relatedSectionPattern)) {
                    content = content.replace(
                        relatedSectionPattern,
                        `\n${navMatch[0]}\n\n$1$2`
                    );
                } else {
                    // 関連記事セクションがない場合は</article>の前に挿入
                    content = content.replace(
                        '</article>',
                        `\n${navMatch[0]}\n            </article>`
                    );
                }
            }
        }
        
        // 5. 重複した</article>タグの削除
        const articleClosePattern = /<\/article>/g;
        const articleCloseMatches = content.match(articleClosePattern) || [];
        
        if (articleCloseMatches.length > 1) {
            // 最初の</article>タグだけを残す
            let firstArticleClose = true;
            content = content.replace(articleClosePattern, (match) => {
                if (firstArticleClose) {
                    firstArticleClose = false;
                    return match;
                }
                return '';
            });
        }
        
        // 6. 誤った位置の閉じタグを修正
        // </footer>が記事内に複数ある場合の修正
        const footerCloseAll = content.match(/<\/footer>/g) || [];
        if (footerCloseAll.length > 2) {
            // 記事フッターとサイトフッターの2つだけにする
            let footerCount = 0;
            content = content.replace(/<\/footer>/g, (match) => {
                footerCount++;
                if (footerCount <= 2) {
                    return match;
                }
                return '';
            });
        }
        
        // 7. インデントの調整（美観のため）
        // 記事ナビゲーションのインデントを修正
        content = content.replace(
            /(\n\s*)(<div class="myblog-article-navigation">)/,
            '\n                $2'
        );
        
        // 8. 不要な空行の削除
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // 9. タグバランスの最終確認とログ出力
        const finalChecks = {
            'section': { open: (content.match(/<section[^>]*>/g) || []).length, close: (content.match(/<\/section>/g) || []).length },
            'article': { open: (content.match(/<article[^>]*>/g) || []).length, close: (content.match(/<\/article>/g) || []).length },
            'main': { open: (content.match(/<main[^>]*>/g) || []).length, close: (content.match(/<\/main>/g) || []).length },
            'footer': { open: (content.match(/<footer[^>]*>/g) || []).length, close: (content.match(/<\/footer>/g) || []).length },
            'header': { open: (content.match(/<header[^>]*>/g) || []).length, close: (content.match(/<\/header>/g) || []).length }
        };
        
        let hasImbalance = false;
        Object.entries(finalChecks).forEach(([tag, counts]) => {
            if (counts.open !== counts.close) {
                console.log(`  Warning in ${file}: ${tag} tags imbalance (open: ${counts.open}, close: ${counts.close})`);
                hasImbalance = true;
            }
        });
        
        // 変更があった場合のみ保存
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed ${file}${hasImbalance ? ' (with warnings)' : ''}`);
            fixedCount++;
        } else if (hasImbalance) {
            console.log(`⚠ ${file} has tag imbalances but no auto-fix applied`);
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

// 修正後の検証
console.log('\nPost-fix validation...');
let validationErrors = 0;

articleFiles.slice(0, 10).forEach(file => {
    const filePath = path.join(blogDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 基本的な検証
        if (!content.includes('</article>')) {
            console.log(`  ✗ ${file}: Missing </article> tag`);
            validationErrors++;
        }
        
        if (!content.includes('myblog-article-footer')) {
            console.log(`  ✗ ${file}: Missing article footer`);
            validationErrors++;
        }
        
        if (!content.includes('site-footer')) {
            console.log(`  ✗ ${file}: Missing site footer`);
            validationErrors++;
        }
        
    } catch (error) {
        console.error(`  ✗ Validation error for ${file}:`, error.message);
        validationErrors++;
    }
});

console.log(`\nValidation complete. Errors found: ${validationErrors}`);