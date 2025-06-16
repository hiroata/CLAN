const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 記事ファイルの検索パターン
const articlePattern = /^article-utage-.*\.html$/;

// 結果を格納する配列
const results = {
    hasNavigation: [],
    noNavigation: [],
    hasNavigationStyle: [],
    noNavigationStyle: []
};

// ディレクトリ内のファイルを読み取る
const files = fs.readdirSync(blogDir);

// 記事ファイルのみフィルタリング
const articleFiles = files.filter(file => articlePattern.test(file));

console.log(`総記事数: ${articleFiles.length}`);

// 各記事ファイルをチェック
articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // ナビゲーションスタイルの存在チェック
    const hasNavStyle = content.includes('.myblog-article-navigation') || 
                        content.includes('myblog-nav-container');
    
    // ナビゲーションHTMLの存在チェック
    const hasNavHTML = content.includes('<nav class="myblog-article-navigation"') ||
                       content.includes('<div class="myblog-article-navigation"');
    
    if (hasNavStyle) {
        results.hasNavigationStyle.push(file);
    } else {
        results.noNavigationStyle.push(file);
    }
    
    if (hasNavHTML) {
        results.hasNavigation.push(file);
    } else {
        results.noNavigation.push(file);
    }
});

// 結果を表示
console.log('\n=== ナビゲーションスタイルの実装状況 ===');
console.log(`スタイルあり: ${results.hasNavigationStyle.length}記事`);
console.log(`スタイルなし: ${results.noNavigationStyle.length}記事`);

console.log('\n=== ナビゲーションHTMLの実装状況 ===');
console.log(`HTMLあり: ${results.hasNavigation.length}記事`);
console.log(`HTMLなし: ${results.noNavigation.length}記事`);

// スタイルはあるがHTMLがない記事をリスト
const styleButNoHTML = results.hasNavigationStyle.filter(file => 
    !results.hasNavigation.includes(file)
);

if (styleButNoHTML.length > 0) {
    console.log('\n=== スタイルはあるがHTMLがない記事 ===');
    console.log(`${styleButNoHTML.length}記事`);
    styleButNoHTML.forEach(file => console.log(`- ${file}`));
}

// スタイルもHTMLもない記事をリスト
if (results.noNavigationStyle.length > 0) {
    console.log('\n=== ナビゲーションが完全に欠落している記事 ===');
    console.log(`${results.noNavigationStyle.length}記事`);
    results.noNavigationStyle.forEach(file => console.log(`- ${file}`));
}

// サンプルとして1つの記事からナビゲーション部分を抽出
if (results.hasNavigation.length > 0) {
    console.log('\n=== ナビゲーションHTMLのサンプル ===');
    const sampleFile = results.hasNavigation[0];
    const samplePath = path.join(blogDir, sampleFile);
    const sampleContent = fs.readFileSync(samplePath, 'utf-8');
    
    // ナビゲーション部分を抽出
    const navMatch = sampleContent.match(/<(?:nav|div) class="myblog-article-navigation"[^>]*>[\s\S]*?<\/(?:nav|div)>/);
    if (navMatch) {
        console.log(`${sampleFile} のナビゲーション構造:`);
        console.log(navMatch[0].substring(0, 500) + '...');
    }
}