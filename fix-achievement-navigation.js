const fs = require('fs');
const path = require('path');

// achievement内のナビゲーションリンクを修正
console.log('🔧 achievementページ間のナビゲーションリンクを修正中...');

const achievementDir = path.join(process.cwd(), 'achievement');
const files = fs.readdirSync(achievementDir).filter(f => f.endsWith('.html'));

let totalFixed = 0;

files.forEach(filename => {
    const filePath = path.join(achievementDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // customer間のリンクを修正
    content = content.replace(/href="\/achievement\/(customer\d+\.html)"/g, 'href="$1"');
    
    // index.htmlのcustomerリンクも修正
    if (filename === 'index.html') {
        content = content.replace(/href="\/achievement\/(customer\d+\.html)"/g, 'href="$1"');
    }
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        const matches = originalContent.match(/href="\/achievement\/customer\d+\.html"/g);
        const count = matches ? matches.length : 0;
        console.log(`✅ ${filename} - ${count}箇所を修正`);
        totalFixed += count;
    }
});

// CSSファイルのインポートパスも確認
console.log('\n🔧 CSSファイルのインポートパスを確認中...');

const cssFiles = [
    'css/style.css',
    'css/common-variables.css'
];

cssFiles.forEach(cssFile => {
    const filePath = path.join(process.cwd(), cssFile);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // @importの絶対パスを修正
        content = content.replace(/@import\s+url\(['"]?\/css\//g, "@import url('./");
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${cssFile} - インポートパスを修正`);
        }
    }
});

console.log(`\n✅ 完了！合計 ${totalFixed} 箇所のナビゲーションリンクを修正しました。`);