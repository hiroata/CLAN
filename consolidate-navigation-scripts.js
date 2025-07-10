const fs = require('fs');
const path = require('path');

class NavigationConsolidator {
    constructor() {
        this.processedFiles = [];
        this.errors = [];
        this.totalSaved = 0;
    }

    // ブログ記事のすべてのHTMLファイルを取得
    getBlogArticles() {
        const blogDir = path.join(process.cwd(), 'blog');
        const files = fs.readdirSync(blogDir);
        return files.filter(file => file.startsWith('article-utage-') && file.endsWith('.html'));
    }

    // インラインナビゲーションスクリプトを削除し、外部スクリプトに置換
    processArticle(filename) {
        const filePath = path.join(process.cwd(), 'blog', filename);
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalLength = content.length;
            
            // ナビゲーション関連のインラインスクリプトを検出して削除
            const scriptPatterns = [
                // getCurrentArticleFilename関数を含むスクリプトブロック
                /<script[^>]*>[\s\S]*?function getCurrentArticleFilename\(\)[\s\S]*?<\/script>/gi,
                // getArticleTitle関数を含むスクリプトブロック
                /<script[^>]*>[\s\S]*?function getArticleTitle\([\s\S]*?<\/script>/gi,
                // articleTitlesオブジェクトを含むスクリプトブロック
                /<script[^>]*>[\s\S]*?const articleTitles = \{[\s\S]*?<\/script>/gi,
                // 長いarticleTitlesオブジェクトのみのスクリプトブロック
                /<script[^>]*>\s*const articleTitles[\s\S]*?;<\/script>/gi
            ];

            let hasRemovedScript = false;
            scriptPatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        // ナビゲーション関連の関数が含まれているかチェック
                        if (match.includes('getCurrentArticleFilename') || 
                            match.includes('getArticleTitle') || 
                            match.includes('articleTitles')) {
                            content = content.replace(match, '');
                            hasRemovedScript = true;
                        }
                    });
                }
            });

            // 外部ナビゲーションスクリプトの参照を追加（まだ存在しない場合）
            if (hasRemovedScript && !content.includes('blog-navigation.js')) {
                // </body>タグの前に外部スクリプトを挿入
                const scriptTag = '  <script src="../js/blog-navigation.js?v=1750032505143"></script>\n</body>';
                content = content.replace('</body>', scriptTag);
            }

            // 空白行を整理
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

            // ファイルを更新
            if (content.length !== originalLength) {
                fs.writeFileSync(filePath, content, 'utf8');
                const saved = originalLength - content.length;
                this.totalSaved += saved;
                this.processedFiles.push({
                    filename,
                    savedBytes: saved,
                    hasScript: hasRemovedScript
                });
            }

        } catch (error) {
            this.errors.push({
                filename,
                error: error.message
            });
        }
    }

    // すべてのブログ記事を処理
    consolidateAll() {
        console.log('🔧 ブログナビゲーションスクリプトの統廃合を開始...');
        
        const blogArticles = this.getBlogArticles();
        console.log(`📝 ${blogArticles.length}個のブログ記事を処理中...`);

        blogArticles.forEach(filename => {
            this.processArticle(filename);
        });

        // 結果レポート
        console.log('\n📊 統廃合結果:');
        console.log(`├─ 処理ファイル数: ${this.processedFiles.length}`);
        console.log(`├─ 削減サイズ: ${(this.totalSaved / 1024).toFixed(1)}KB`);
        console.log(`├─ エラー: ${this.errors.length}個`);
        console.log(`└─ 平均削減サイズ: ${this.processedFiles.length > 0 ? (this.totalSaved / this.processedFiles.length / 1024).toFixed(1) : 0}KB/ファイル`);

        if (this.processedFiles.length > 0) {
            console.log('\n✅ 処理済みファイル（上位10件）:');
            this.processedFiles
                .sort((a, b) => b.savedBytes - a.savedBytes)
                .slice(0, 10)
                .forEach(file => {
                    const savedKB = (file.savedBytes / 1024).toFixed(1);
                    console.log(`  ${file.filename}: -${savedKB}KB`);
                });
        }

        if (this.errors.length > 0) {
            console.log('\n❌ エラー:');
            this.errors.forEach(error => {
                console.log(`  ${error.filename}: ${error.error}`);
            });
        }

        console.log('\n🎉 ナビゲーションスクリプト統廃合が完了しました！');
        console.log('💡 今後は /js/blog-navigation.js を修正することで全記事のナビゲーションを一括管理できます。');
    }
}

// 実行
const consolidator = new NavigationConsolidator();
consolidator.consolidateAll();