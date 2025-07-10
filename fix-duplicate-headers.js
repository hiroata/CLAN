const fs = require('fs');
const path = require('path');

// 重複したヘッダーコメントとタグを修正
function fixDuplicateHeaders(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 重複した <!-- ヘッダー --> コメントを削除
        content = content.replace(/<!-- ヘッダー -->\s*<!-- ヘッダー -->\s*<!-- ヘッダー -->/g, '<!-- ヘッダー -->');
        content = content.replace(/<!-- ヘッダー -->\s*<!-- ヘッダー -->/g, '<!-- ヘッダー -->');
        
        // 重複した <!-- モバイルメニュー --> コメントを削除
        content = content.replace(/<!-- モバイルメニュー -->\s*<!-- モバイルメニュー -->\s*<!-- モバイルメニュー -->/g, '<!-- モバイルメニュー -->');
        content = content.replace(/<!-- モバイルメニュー -->\s*<!-- モバイルメニュー -->/g, '<!-- モバイルメニュー -->');
        
        // ファイルを書き込み
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
        return true;
        
    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
        return false;
    }
}

// ディレクトリを再帰的に検索してHTMLファイルを見つける
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // node_modulesやhiddenディレクトリはスキップ
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
    console.log('Finding all HTML files...');
    
    const htmlFiles = findHTMLFiles(rootDir);
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    let successCount = 0;
    let failCount = 0;
    
    htmlFiles.forEach(file => {
        if (fixDuplicateHeaders(file)) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`\nFix complete:`);
    console.log(`Successfully fixed: ${successCount} files`);
    console.log(`Failed to fix: ${failCount} files`);
}

// 実行
main();