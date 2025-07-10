const fs = require('fs');
const path = require('path');

// リンクを抽出する正規表現
const linkPatterns = [
    /<a[^>]+href=["']([^"']+)["']/gi,
    /<link[^>]+href=["']([^"']+)["']/gi,
    /<script[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi
];

// 除外するパターン
const excludePatterns = [
    /^https?:\/\//,  // 外部リンク
    /^#/,            // アンカーリンク
    /^mailto:/,      // メールリンク
    /^tel:/,         // 電話リンク
    /^data:/,        // データURI
    /^javascript:/,  // JavaScriptリンク
    /\?v=\d+/        // バージョンパラメータは無視
];

// ファイルが存在するかチェック
function checkFileExists(basePath, linkPath) {
    // バージョンパラメータを削除
    linkPath = linkPath.split('?')[0];
    
    // 絶対パスの場合
    if (linkPath.startsWith('/')) {
        const fullPath = path.join('/mnt/c/Users/atara/Desktop/CLAN', linkPath);
        return fs.existsSync(fullPath);
    }
    
    // 相対パスの場合
    const dir = path.dirname(basePath);
    const fullPath = path.resolve(dir, linkPath);
    return fs.existsSync(fullPath);
}

// HTMLファイルからリンクを抽出
function extractLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = new Set();
    
    linkPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const link = match[1];
            
            // 除外パターンに該当しないリンクのみ追加
            if (!excludePatterns.some(exclude => exclude.test(link))) {
                links.add(link);
            }
        }
    });
    
    return Array.from(links);
}

// ディレクトリを再帰的に検索してHTMLファイルを見つける
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules') {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// メイン処理
function main() {
    const rootDir = '/mnt/c/Users/atara/Desktop/CLAN';
    console.log('全HTMLファイルのリンクチェックを開始します...\n');
    
    const htmlFiles = findHTMLFiles(rootDir);
    console.log(`${htmlFiles.length}個のHTMLファイルを検査します\n`);
    
    const brokenLinks = [];
    let totalLinks = 0;
    let checkedLinks = 0;
    
    htmlFiles.forEach(file => {
        const links = extractLinks(file);
        totalLinks += links.length;
        
        links.forEach(link => {
            checkedLinks++;
            if (!checkFileExists(file, link)) {
                brokenLinks.push({
                    file: file.replace(rootDir, ''),
                    link: link
                });
            }
        });
    });
    
    // 結果を表示
    console.log('=== リンクチェック結果 ===\n');
    console.log(`総リンク数: ${totalLinks}`);
    console.log(`チェック済み: ${checkedLinks}`);
    console.log(`リンク切れ: ${brokenLinks.length}\n`);
    
    if (brokenLinks.length > 0) {
        console.log('=== リンク切れ一覧 ===\n');
        
        // ファイルごとにグループ化
        const groupedByFile = {};
        brokenLinks.forEach(item => {
            if (!groupedByFile[item.file]) {
                groupedByFile[item.file] = [];
            }
            groupedByFile[item.file].push(item.link);
        });
        
        // ファイルごとに表示
        Object.entries(groupedByFile).forEach(([file, links]) => {
            console.log(`📄 ${file}`);
            links.forEach(link => {
                console.log(`   ❌ ${link}`);
            });
            console.log('');
        });
        
        // 統計情報
        console.log('=== 統計情報 ===\n');
        const linkTypes = {};
        brokenLinks.forEach(item => {
            const ext = path.extname(item.link).toLowerCase();
            linkTypes[ext] = (linkTypes[ext] || 0) + 1;
        });
        
        console.log('拡張子別リンク切れ数:');
        Object.entries(linkTypes).forEach(([ext, count]) => {
            console.log(`  ${ext || '(no extension)'}: ${count}`);
        });
    } else {
        console.log('✅ リンク切れは見つかりませんでした！');
    }
}

// 実行
main();