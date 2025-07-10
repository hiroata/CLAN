#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Blog Navigation English Titles Fix Script');
console.log('=' .repeat(50));

// ブログディレクトリのパス
const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
const blogNavigationJsPath = '/mnt/c/Users/atara/Desktop/CLAN/js/blog-navigation.js';

// 記事ファイルパターン
const articlePattern = /^article-utage-.*\.html$/;

// 統計
let stats = {
    totalFiles: 0,
    fixedFiles: 0,
    alreadyFixed: 0,
    errors: 0
};

// ファイルを修正する関数
function fixArticleFile(filePath) {
    try {
        console.log(`📄 Processing: ${path.basename(filePath)}`);
        
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        
        // 1. blog-navigation.js スクリプトタグが存在するかチェック
        if (!content.includes('blog-navigation.js')) {
            console.log('  ➤ Adding blog-navigation.js script tag');
            
            // </body> タグの直前に blog-navigation.js を追加
            content = content.replace(
                '</body>',
                `    <script src="../js/blog-navigation.js?v=${Date.now()}"></script>\n</body>`
            );
            modified = true;
        }
        
        // 2. インラインのナビゲーションスクリプトを削除
        // 大きなインラインスクリプトブロックを特定して削除
        const inlineScriptPattern = /<script[^>]*>[\s\S]*?const articleList = \[[\s\S]*?<\/script>/;
        if (content.match(inlineScriptPattern)) {
            console.log('  ➤ Removing inline navigation script');
            content = content.replace(inlineScriptPattern, '');
            modified = true;
        }
        
        // 3. ナビゲーションタイトルを空にする（「読み込み中...」に統一）
        const titlePatterns = [
            // 英語タイトルや日本語タイトルがハードコーディングされている可能性のあるパターン
            /(<div class="myblog-nav-title" id="prevTitle">)[^<]*(<\/div>)/g,
            /(<div class="myblog-nav-title" id="nextTitle">)[^<]*(<\/div>)/g
        ];
        
        titlePatterns.forEach(pattern => {
            if (content.match(pattern)) {
                console.log('  ➤ Fixing hardcoded navigation titles');
                content = content.replace(pattern, '$1読み込み中...$2');
                modified = true;
            }
        });
        
        // 4. 変更があった場合のみファイルを書き込み
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('  ✅ File updated successfully');
            stats.fixedFiles++;
            return true;
        } else {
            console.log('  ⚪ No changes needed');
            stats.alreadyFixed++;
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
        
        // blog-navigation.js の存在確認
        if (!fs.existsSync(blogNavigationJsPath)) {
            throw new Error(`blog-navigation.js not found: ${blogNavigationJsPath}`);
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
            console.log('\n🎉 Blog navigation English titles fix completed!');
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