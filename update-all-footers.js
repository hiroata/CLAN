const fs = require('fs');
const path = require('path');

// 標準フッターテンプレート
const standardFooterTemplate = `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-brand">
      <h2>CLAN</h2>
    </div>
    <nav class="footer-links" aria-label="フッターナビゲーション">
      <ul>
        
        <li><a href="/achievement/index.html" 
               title="UTAGE導入企業の成功事例">お客様の声</a></li>
        <li><a href="/blog/index.html" 
               title="UTAGE活用方法に関するブログ記事">ブログ</a></li>
        <li><a href="/tools/index.html" 
               title="無料で使えるビジネスツール集">まえゆきツール</a></li>
        <li><a href="/seminar-request.html" 
               title="自治体・商工会・業界団体向けセミナー要望受付">セミナー要望受付</a></li>
        <li><a href="/owner.html" 
               title="CLANの運営会社情報">運営者情報</a></li>
        <li><a href="/terms.html" 
               title="サービス利用規約">利用規約</a></li>
        <li><a href="/privacy.html" 
               title="個人情報の取り扱いについて">プライバシーポリシー</a></li>
        <li><a href="/tokutei.html" 
               title="特定商取引法に基づく表記">特定商取引法に基づく表記</a></li>
      </ul>
    </nav>
  </div>
</footer>`;

// HTMLファイルを更新する関数
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // フッターの正規表現パターン（より柔軟に）
        const footerRegex = /<footer[^>]*class="site-footer"[^>]*>[\s\S]*?<\/footer>/i;
        
        // フッターを置換
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, standardFooterTemplate);
            console.log(`Updated footer: ${filePath}`);
        } else {
            console.log(`Warning: No footer found in ${filePath}`);
            return false;
        }
        
        // ファイルを書き込み
        fs.writeFileSync(filePath, content, 'utf8');
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
    
    const htmlFiles = findHTMLFiles(rootDir);
    console.log(`Found ${htmlFiles.length} HTML files`);
    
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