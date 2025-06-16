#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Blog Navigation Restore Script');
console.log('=' .repeat(50));

// ブログディレクトリのパス
const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';

// 記事ファイルパターン
const articlePattern = /^article-utage-.*\.html$/;

// 統計
let stats = {
    totalFiles: 0,
    fixedFiles: 0,
    alreadyFixed: 0,
    errors: 0
};

// ナビゲーションHTMLテンプレート
const navigationTemplate = `
                <!-- 記事ナビゲーション -->
                <div class="myblog-article-navigation">
                    <div class="myblog-nav-container">
                        <div class="myblog-nav-prev" id="prevArticle">
                            <span class="myblog-nav-label">前の記事</span>
                            <div class="myblog-nav-title" id="prevTitle">読み込み中...</div>
                        </div>
                        <div class="myblog-nav-next" id="nextArticle">
                            <span class="myblog-nav-label">次の記事</span>
                            <div class="myblog-nav-title" id="nextTitle">読み込み中...</div>
                        </div>
                    </div>
                </div>
`;

// ファイルを修正する関数
function fixArticleFile(filePath) {
    try {
        console.log(`📄 Processing: ${path.basename(filePath)}`);
        
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        
        // ナビゲーションHTMLが存在するかチェック
        if (!content.includes('myblog-article-navigation')) {
            console.log('  ➤ Adding missing navigation HTML');
            
            // </article> の直後または記事コンテンツの終了部分に挿入
            if (content.includes('</article>')) {
                // </article> の直前に挿入
                content = content.replace('</article>', navigationTemplate + '\n            </article>');
                modified = true;
            } else if (content.includes('</div>\n\n            <!-- 関連記事 -->')) {
                // 関連記事の前に挿入
                content = content.replace('</div>\n\n            <!-- 関連記事 -->', `</div>${navigationTemplate}\n\n            <!-- 関連記事 -->`);
                modified = true;
            } else if (content.includes('<!-- 関連記事 -->')) {
                // 関連記事の前に挿入（別パターン）
                content = content.replace('<!-- 関連記事 -->', navigationTemplate + '\n                <!-- 関連記事 -->');
                modified = true;
            } else if (content.includes('</footer>')) {
                // フッターの後に挿入
                content = content.replace('</footer>', `</footer>${navigationTemplate}`);
                modified = true;
            } else {
                // プロフィール部分の後に挿入（最後の手段）
                const profileEndPattern = /<\/div>\s*<\/div>\s*<\/footer>/;
                if (content.match(profileEndPattern)) {
                    content = content.replace(profileEndPattern, `</div>
                </div>
                </footer>${navigationTemplate}`);
                    modified = true;
                }
            }
        } else {
            console.log('  ⚪ Navigation HTML already exists');
            stats.alreadyFixed++;
            return false;
        }
        
        // blog-navigation.js が読み込まれているかチェック
        if (!content.includes('blog-navigation.js')) {
            console.log('  ➤ Adding blog-navigation.js script tag');
            
            // </body> タグの直前に blog-navigation.js を追加
            content = content.replace(
                '</body>',
                `    <script src="../js/blog-navigation.js?v=${Date.now()}"></script>\n</body>`
            );
            modified = true;
        }
        
        // 変更があった場合のみファイルを書き込み
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('  ✅ File updated successfully');
            stats.fixedFiles++;
            return true;
        } else {
            return false;
        }
        
    } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
        stats.errors++;
        return false;
    }
}

// メイン処理
function main() {
    try {
        // ブログディレクトリの存在確認
        if (!fs.existsSync(blogDir)) {
            throw new Error(`Blog directory not found: ${blogDir}`);
        }
        
        console.log(`📁 Scanning directory: ${blogDir}`);
        
        // ディレクトリ内のファイルを取得
        const files = fs.readdirSync(blogDir);
        const articleFiles = files.filter(file => articlePattern.test(file));
        
        console.log(`📊 Found ${articleFiles.length} article files`);
        console.log('-'.repeat(50));
        
        // 各記事ファイルを処理
        articleFiles.forEach(fileName => {
            const filePath = path.join(blogDir, fileName);
            stats.totalFiles++;
            fixArticleFile(filePath);
        });
        
        // 結果をレポート
        console.log('\n' + '='.repeat(50));
        console.log('📊 FINAL REPORT');
        console.log('='.repeat(50));
        console.log(`Total files processed: ${stats.totalFiles}`);
        console.log(`Files fixed: ${stats.fixedFiles}`);
        console.log(`Files already correct: ${stats.alreadyFixed}`);
        console.log(`Errors: ${stats.errors}`);
        
        if (stats.errors === 0) {
            console.log('\n✅ All files processed successfully!');
            console.log('\n🎉 Blog navigation restore completed!');
            console.log('\nNext steps:');
            console.log('1. Test the navigation on a few articles');
            console.log('2. Verify that Japanese titles are displayed correctly');
            console.log('3. Clear browser cache if needed');
        } else {
            console.log('\n⚠️  Some files had errors. Please check the output above.');
        }
        
    } catch (error) {
        console.error('❌ Script failed:', error.message);
        process.exit(1);
    }
}

// スクリプト実行
main();