/**
 * JavaScriptとCSSファイルの統合・最小化スクリプト
 * SEO最適化のためのページ速度改善
 */

const fs = require('fs');
const path = require('path');

// JavaScriptファイルの統合順序（依存関係を考慮）
const jsFiles = [
    'js/common-init.js',       // 初期化
    'js/common-lazy-loading.js', // 遅延読み込み
    'js/common-cache.js',      // キャッシュ
    'js/blog-navigation.js',   // ナビゲーション
    'js/main.js'               // メイン処理
];

// CSSファイルの統合順序
const cssFiles = [
    'css/common-variables.css',  // CSS変数定義が最初
    'css/style.css',            // メインスタイル
    'css/common-hamburger.css', // コンポーネントスタイル
    'css/footer-hover.css'      // フッタースタイル
];

// JavaScript最小化（簡易版）
function minifyJS(code) {
    return code
        // コメント削除
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // 余分な空白削除
        .replace(/\s+/g, ' ')
        .replace(/\s*([=\+\-\*\/\{\}\[\]\(\);,:])\s*/g, '$1')
        // 改行削除（セミコロンの後は除く）
        .replace(/;\s*/g, ';')
        .trim();
}

// CSS最小化（簡易版）
function minifyCSS(code) {
    return code
        // コメント削除
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 余分な空白削除
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,])\s*/g, '$1')
        // 最後のセミコロン削除
        .replace(/;}/g, '}')
        // 0pxを0に
        .replace(/:\s*0px/g, ':0')
        .trim();
}

// JavaScriptファイルの統合
function combineJS() {
    console.log('JavaScriptファイルを統合中...');
    let combined = '';
    
    jsFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            combined += `\n/* === ${file} === */\n${content}\n`;
            console.log(`  ✓ ${file}`);
        } catch (err) {
            console.error(`  ✗ ${file}: ${err.message}`);
        }
    });
    
    // 統合ファイル保存
    fs.writeFileSync('js/combined.js', combined);
    console.log('→ js/combined.js に保存完了');
    
    // 最小化版も作成
    const minified = minifyJS(combined);
    fs.writeFileSync('js/combined.min.js', minified);
    console.log('→ js/combined.min.js に最小化版を保存完了');
}

// CSSファイルの統合
function combineCSS() {
    console.log('\nCSSファイルを統合中...');
    let combined = '';
    
    cssFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            combined += `\n/* === ${file} === */\n${content}\n`;
            console.log(`  ✓ ${file}`);
        } catch (err) {
            console.error(`  ✗ ${file}: ${err.message}`);
        }
    });
    
    // 統合ファイル保存
    fs.writeFileSync('css/combined.css', combined);
    console.log('→ css/combined.css に保存完了');
    
    // 最小化版も作成
    const minified = minifyCSS(combined);
    fs.writeFileSync('css/combined.min.css', minified);
    console.log('→ css/combined.min.css に最小化版を保存完了');
}

// HTMLファイルの更新関数
function updateHTMLFiles() {
    console.log('\nHTMLファイルを更新中...');
    
    // 更新対象のHTMLファイルパターン
    const htmlFiles = [
        'index.html',
        'blog/*.html',
        'achievement/*.html',
        'tools/*.html'
    ];
    
    console.log('※ HTMLファイルの更新は手動で行ってください。');
    console.log('以下のように変更してください：');
    console.log('\n【JavaScript】');
    console.log('変更前:');
    jsFiles.forEach(file => {
        console.log(`  <script src="${file}" defer></script>`);
    });
    console.log('\n変更後:');
    console.log('  <script src="js/combined.min.js" defer></script>');
    
    console.log('\n【CSS】');
    console.log('変更前:');
    cssFiles.forEach(file => {
        console.log(`  <link rel="stylesheet" href="${file}">`);
    });
    console.log('\n変更後:');
    console.log('  <link rel="stylesheet" href="css/combined.min.css">');
}

// メイン処理
console.log('=== ページ速度最適化：アセット統合・最小化 ===\n');

// JavaScriptとCSSの統合実行
combineJS();
combineCSS();

// 統計情報表示
console.log('\n=== 統計情報 ===');
const jsOriginalSize = jsFiles.reduce((total, file) => {
    try {
        return total + fs.statSync(file).size;
    } catch { return total; }
}, 0);
const cssOriginalSize = cssFiles.reduce((total, file) => {
    try {
        return total + fs.statSync(file).size;
    } catch { return total; }
}, 0);

const jsMinSize = fs.statSync('js/combined.min.js').size;
const cssMinSize = fs.statSync('css/combined.min.css').size;

console.log(`JavaScript: ${jsOriginalSize} bytes → ${jsMinSize} bytes (${Math.round((1 - jsMinSize/jsOriginalSize) * 100)}%削減)`);
console.log(`CSS: ${cssOriginalSize} bytes → ${cssMinSize} bytes (${Math.round((1 - cssMinSize/cssOriginalSize) * 100)}%削減)`);

// HTML更新の案内
updateHTMLFiles();

console.log('\n完了！');