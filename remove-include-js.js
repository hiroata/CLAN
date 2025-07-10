const fs = require('fs');

// 対象ファイル
const files = [
    '/mnt/c/Users/atara/Desktop/CLAN/tools/letters-counter.html',
    '/mnt/c/Users/atara/Desktop/CLAN/tools/meme-generator.html',
    '/mnt/c/Users/atara/Desktop/CLAN/tools/png-to-jpeg.html',
    '/mnt/c/Users/atara/Desktop/CLAN/tools/wareki-seireki.html'
];

// include.js関連のコードブロックを削除
const includeJsPattern = /\s*\/\/ include\.jsの読み込み[\s\S]*?}\s*<\/script>/g;
const altPattern = /\s*if \(!window\.isScriptLoaded[\s\S]*?}\s*(?=<\/script>)/g;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // include.js関連のコードを削除
        content = content.replace(includeJsPattern, '</script>');
        content = content.replace(altPattern, '');
        
        // 連続する空白行を1行に
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ Updated: ${file}`);
    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log('\ninclude.jsの参照を削除しました。');