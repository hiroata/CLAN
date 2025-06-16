const fs = require('fs').promises;
const path = require('path');

async function verifyBlogConsistency() {
    const blogDir = '/mnt/c/Users/atara/Desktop/CLAN/blog';
    const files = await fs.readdir(blogDir);
    const articleFiles = files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    
    const report = {
        total: articleFiles.length,
        hasProfile: 0,
        hasRelatedArticles: 0,
        hasNavigation: 0,
        hasNavigationStyles: 0,
        hasNavigationScript: 0,
        issues: []
    };
    
    for (const file of articleFiles) {
        const filePath = path.join(blogDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for profile
        if (content.includes('class="myblog-author"')) {
            report.hasProfile++;
        } else {
            report.issues.push(`${file}: プロフィールが見つかりません`);
        }
        
        // Check for related articles
        if (content.includes('class="myblog-related-articles"')) {
            report.hasRelatedArticles++;
        }
        
        // Check for navigation HTML
        if (content.includes('class="myblog-article-navigation"') && 
            content.includes('myblog-nav-container')) {
            report.hasNavigation++;
        } else {
            report.issues.push(`${file}: ナビゲーションHTMLが不完全です`);
        }
        
        // Check for navigation styles
        if (content.includes('.myblog-article-navigation')) {
            report.hasNavigationStyles++;
        } else {
            report.issues.push(`${file}: ナビゲーションスタイルが見つかりません`);
        }
        
        // Check for navigation script
        if (content.includes('initializeNavigation')) {
            report.hasNavigationScript++;
        } else {
            report.issues.push(`${file}: ナビゲーションスクリプトが見つかりません`);
        }
    }
    
    console.log('=== ブログ記事統一性チェックレポート ===\n');
    console.log(`総記事数: ${report.total}`);
    console.log(`プロフィール実装: ${report.hasProfile}/${report.total}`);
    console.log(`関連記事実装: ${report.hasRelatedArticles}/${report.total}`);
    console.log(`ナビゲーションHTML実装: ${report.hasNavigation}/${report.total}`);
    console.log(`ナビゲーションスタイル実装: ${report.hasNavigationStyles}/${report.total}`);
    console.log(`ナビゲーションスクリプト実装: ${report.hasNavigationScript}/${report.total}`);
    
    if (report.issues.length > 0) {
        console.log('\n=== 問題点 ===');
        report.issues.forEach(issue => console.log(`- ${issue}`));
    } else {
        console.log('\n✅ すべての記事が統一されています！');
    }
}

// スクリプトを実行
verifyBlogConsistency().catch(console.error);