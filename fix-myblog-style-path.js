const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 修正対象のパターン
const oldPattern = 'href="myblog-style.css"';
const newPattern = 'href="./myblog-style.css"';

// カウンター
let totalFiles = 0;
let modifiedFiles = 0;

console.log('myblog-style.css のパス修正を開始します...\n');

// blog ディレクトリ内の全HTMLファイルを取得
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(blogDir, file);
    totalFiles++;
    
    try {
        // ファイルを読み込む
        let content = fs.readFileSync(filePath, 'utf8');
        
        // パターンが含まれているかチェック
        if (content.includes(oldPattern)) {
            // パスを修正
            const updatedContent = content.replace(new RegExp(oldPattern, 'g'), newPattern);
            
            // ファイルを書き込む
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            
            modifiedFiles++;
            console.log(`✓ 修正: ${file}`);
        }
    } catch (error) {
        console.error(`✗ エラー: ${file} - ${error.message}`);
    }
});

console.log('\n===== 修正結果 =====');
console.log(`総ファイル数: ${totalFiles}`);
console.log(`修正済みファイル数: ${modifiedFiles}`);
console.log(`変更なしファイル数: ${totalFiles - modifiedFiles}`);

if (modifiedFiles > 0) {
    console.log('\n✅ myblog-style.css のパス修正が完了しました！');
} else {
    console.log('\n✅ 修正が必要なファイルはありませんでした。');
}