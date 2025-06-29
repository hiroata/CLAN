const fs = require('fs');
const path = require('path');

// 標準ヘッダーテンプレート
const standardHeaderTemplate = `<!-- ヘッダー -->
<header class="site-header">
    <div class="header-container">
        <div class="site-logo-text">
            <a href="/index.html">CLAN</a>
        </div>
        <nav class="global-nav pc-nav" aria-label="グローバルナビゲーション">
            <ul>
                <li><a href="/achievement/index.html"{{ACHIEVEMENT_CURRENT}}>お客様の声</a></li>
                <li><a href="/blog/index.html"{{BLOG_CURRENT}}>ブログ</a></li>
                <li><a href="/tools/index.html"{{TOOLS_CURRENT}}>まえゆきツール</a></li>
                <li><a href="/partner.html"{{PARTNER_CURRENT}}>パートナー募集</a></li>
                <li><a href="/seminar-request.html"{{SEMINAR_CURRENT}}>セミナー要望受付</a></li>
            </ul>
        </nav>

        <button class="hamburger-button sp-nav" 
                aria-label="メニューを開く" 
                aria-expanded="false" 
                aria-controls="mobile-menu" 
                type="button">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>`;

// 標準モバイルメニューテンプレート
const standardMobileMenuTemplate = `<!-- モバイルメニュー -->
<div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="モバイルメニュー">
    <nav aria-label="モバイルナビゲーション">
        <ul>
            <li><a href="/achievement/index.html"{{ACHIEVEMENT_CURRENT}}>お客様の声</a></li>
            <li><a href="/blog/index.html"{{BLOG_CURRENT}}>ブログ</a></li>
            <li><a href="/tools/index.html"{{TOOLS_CURRENT}}>まえゆきツール</a></li>
            <li><a href="/partner.html"{{PARTNER_CURRENT}}>パートナー募集</a></li>
            <li><a href="/seminar-request.html"{{SEMINAR_CURRENT}}>セミナー要望受付</a></li>
        </ul>
    </nav>
</div>`;

// aria-current属性を設定する関数
function setAriaCurrent(template, filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    
    let result = template;
    
    // ファイルパスに基づいてaria-currentを設定
    if (dirName.includes('achievement')) {
        result = result.replace(/{{ACHIEVEMENT_CURRENT}}/g, ' aria-current="page"');
    } else if (dirName.includes('blog')) {
        result = result.replace(/{{BLOG_CURRENT}}/g, ' aria-current="page"');
    } else if (dirName.includes('tools')) {
        result = result.replace(/{{TOOLS_CURRENT}}/g, ' aria-current="page"');
    } else if (fileName === 'partner.html') {
        result = result.replace(/{{PARTNER_CURRENT}}/g, ' aria-current="page"');
    } else if (fileName === 'seminar-request.html') {
        result = result.replace(/{{SEMINAR_CURRENT}}/g, ' aria-current="page"');
    }
    
    // 残りのプレースホルダーを空文字に置換
    result = result.replace(/{{ACHIEVEMENT_CURRENT}}/g, '');
    result = result.replace(/{{BLOG_CURRENT}}/g, '');
    result = result.replace(/{{TOOLS_CURRENT}}/g, '');
    result = result.replace(/{{PARTNER_CURRENT}}/g, '');
    result = result.replace(/{{SEMINAR_CURRENT}}/g, '');
    
    return result;
}

// HTMLファイルを更新する関数
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 現在のヘッダーとモバイルメニューを検索
        const headerRegex = /<header[^>]*class="site-header"[^>]*>[\s\S]*?<\/header>/i;
        const mobileMenuRegex = /<div[^>]*class="mobile-menu"[^>]*>[\s\S]*?<\/div>\s*(?=<|$)/i;
        
        // aria-currentを設定したテンプレートを生成
        const newHeader = setAriaCurrent(standardHeaderTemplate, filePath);
        const newMobileMenu = setAriaCurrent(standardMobileMenuTemplate, filePath);
        
        // ヘッダーを置換
        if (headerRegex.test(content)) {
            content = content.replace(headerRegex, newHeader);
        } else {
            console.log(`Warning: No header found in ${filePath}`);
            return false;
        }
        
        // モバイルメニューを置換
        if (mobileMenuRegex.test(content)) {
            content = content.replace(mobileMenuRegex, newMobileMenu);
        } else {
            // モバイルメニューがない場合は、ヘッダーの後に追加
            const headerEndIndex = content.indexOf('</header>');
            if (headerEndIndex !== -1) {
                const afterHeader = headerEndIndex + '</header>'.length;
                content = content.slice(0, afterHeader) + '\n\n' + newMobileMenu + content.slice(afterHeader);
            }
        }
        
        // ファイルを書き込み
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        return true;
        
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
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
    
    let htmlFiles = findHTMLFiles(rootDir);
    
    // index.htmlとtest-navigation.htmlを除外
    htmlFiles = htmlFiles.filter(file => {
        const fileName = path.basename(file);
        const isRootIndex = fileName === 'index.html' && path.dirname(file) === rootDir;
        const isTestFile = fileName === 'test-navigation.html';
        return !isRootIndex && !isTestFile;
    });
    
    console.log(`Found ${htmlFiles.length} HTML files to update (excluding root index.html and test files)`);
    
    let successCount = 0;
    let failCount = 0;
    
    htmlFiles.forEach(file => {
        if (updateHTMLFile(file)) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`\nUpdate complete:`);
    console.log(`Successfully updated: ${successCount} files`);
    console.log(`Failed to update: ${failCount} files`);
}

// 実行
main();