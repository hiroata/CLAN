const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const filename = path.basename(filePath);
        let modified = false;

        // 「読み込み中...」テキストを削除
        const oldLoadingPattern = /<div class="myblog-nav-title" id="prevTitle">読み込み中\.\.\.<\/div>/g;
        const oldLoadingPattern2 = /<div class="myblog-nav-title" id="nextTitle">読み込み中\.\.\.<\/div>/g;

        if (oldLoadingPattern.test(content) || oldLoadingPattern2.test(content)) {
            // 読み込み中を空のテキストに置換
            content = content.replace(oldLoadingPattern, '<div class="myblog-nav-title" id="prevTitle"></div>');
            content = content.replace(oldLoadingPattern2, '<div class="myblog-nav-title" id="nextTitle"></div>');
            modified = true;
        }

        // initializeNavigation関数内の初期化ロジックを修正
        // prevTitle.textContent と nextTitle.textContent の設定をより確実にする
        const initFunctionPattern = /(function initializeNavigation\(\)\s*{[\s\S]*?)(\/\/ 前の記事[\s\S]*?)(\/\/ 次の記事[\s\S]*?)(}\s*\/\/ DOMが読み込まれたら初期化)/;
        
        if (initFunctionPattern.test(content)) {
            const newInitFunction = `function initializeNavigation() {
            const currentFilename = getCurrentArticleFilename();
            const currentIndex = articleList.indexOf(currentFilename);
            
            const prevArticle = document.getElementById('prevArticle');
            const nextArticle = document.getElementById('nextArticle');
            const prevTitle = document.getElementById('prevTitle');
            const nextTitle = document.getElementById('nextTitle');

            // 要素が存在しない場合は何もしない
            if (!prevArticle || !nextArticle || !prevTitle || !nextTitle) {
                return;
            }

            // 前の記事
            if (currentIndex > 0) {
                const prevFilename = articleList[currentIndex - 1];
                const prevTitleText = getArticleTitle(prevFilename);
                prevTitle.textContent = prevTitleText.length > 50 ? 
                    prevTitleText.substring(0, 50) + '...' : prevTitleText;
                prevArticle.onclick = () => window.location.href = prevFilename;
                prevArticle.style.cursor = 'pointer';
            } else {
                prevTitle.textContent = '最初の記事です';
                prevArticle.classList.add('disabled');
                prevArticle.onclick = null;
            }

            // 次の記事
            if (currentIndex < articleList.length - 1 && currentIndex !== -1) {
                const nextFilename = articleList[currentIndex + 1];
                const nextTitleText = getArticleTitle(nextFilename);
                nextTitle.textContent = nextTitleText.length > 50 ? 
                    nextTitleText.substring(0, 50) + '...' : nextTitleText;
                nextArticle.onclick = () => window.location.href = nextFilename;
                nextArticle.style.cursor = 'pointer';
            } else {
                nextTitle.textContent = '最後の記事です';
                nextArticle.classList.add('disabled');
                nextArticle.onclick = null;
            }
        }`;

            content = content.replace(initFunctionPattern, newInitFunction + '\n\n        // DOMが読み込まれたら初期化');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 読み込み中テキストを削除: ${filename}`);
            return true;
        } else {
            console.log(`⚠️  変更不要: ${filename}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ エラー処理中: ${path.basename(filePath)}`, error.message);
        return false;
    }
}

function main() {
    const blogDir = path.join(__dirname, 'blog');
    
    if (!fs.existsSync(blogDir)) {
        console.error('❌ blogディレクトリが見つかりません');
        return;
    }

    console.log('🚀 全記事の「読み込み中...」テキストを削除開始...');
    
    let totalFiles = 0;
    let successCount = 0;
    
    const files = fs.readdirSync(blogDir);
    
    for (const file of files) {
        if (file.startsWith('article-utage-') && file.endsWith('.html')) {
            totalFiles++;
            const filePath = path.join(blogDir, file);
            if (processFile(filePath)) {
                successCount++;
            }
        }
    }
    
    console.log(`\n📊 処理結果:`);
    console.log(`   対象ファイル数: ${totalFiles}`);
    console.log(`   成功: ${successCount}`);
    console.log(`   変更不要: ${totalFiles - successCount}`);
    
    console.log('🎉 「読み込み中...」テキストの削除が完了しました！');
}

if (require.main === module) {
    main();
}