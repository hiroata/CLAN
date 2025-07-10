/**
 * ブログ記事に目次（Table of Contents）機能を追加
 * SEOとユーザビリティの向上を目的とした実装
 */

// 目次生成用のJavaScriptコード
const tableOfContentsScript = `
/**
 * 自動目次生成機能
 * H2, H3タグから目次を自動生成し、スムーズスクロールを実装
 */
(function() {
    'use strict';
    
    // 目次を生成する関数
    function generateTableOfContents() {
        const article = document.querySelector('.myblog-content');
        if (!article) return;
        
        const headings = article.querySelectorAll('h2, h3');
        if (headings.length < 3) return; // 見出しが少ない場合は目次不要
        
        // 目次コンテナの作成
        const toc = document.createElement('nav');
        toc.className = 'article-toc';
        toc.setAttribute('aria-label', '目次');
        
        // 目次タイトル
        const tocTitle = document.createElement('h2');
        tocTitle.className = 'toc-title';
        tocTitle.textContent = '📑 目次';
        toc.appendChild(tocTitle);
        
        // 目次リスト
        const tocList = document.createElement('ol');
        tocList.className = 'toc-list';
        
        let currentH2Item = null;
        let currentH3List = null;
        
        headings.forEach((heading, index) => {
            // IDを設定（既存のIDがない場合）
            if (!heading.id) {
                heading.id = 'section-' + (index + 1);
            }
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;
            link.className = 'toc-link';
            
            if (heading.tagName === 'H2') {
                listItem.className = 'toc-item-h2';
                listItem.appendChild(link);
                tocList.appendChild(listItem);
                currentH2Item = listItem;
                currentH3List = null;
            } else if (heading.tagName === 'H3' && currentH2Item) {
                if (!currentH3List) {
                    currentH3List = document.createElement('ol');
                    currentH3List.className = 'toc-sublist';
                    currentH2Item.appendChild(currentH3List);
                }
                listItem.className = 'toc-item-h3';
                listItem.appendChild(link);
                currentH3List.appendChild(listItem);
            }
            
            // スムーズスクロールの実装
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 100; // ヘッダーの高さ分オフセット
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // URLハッシュを更新
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
        
        toc.appendChild(tocList);
        
        // 記事の最初に目次を挿入
        const firstHeading = article.querySelector('h2');
        if (firstHeading) {
            firstHeading.parentNode.insertBefore(toc, firstHeading);
        }
        
        // スクロール位置に応じて目次をハイライト
        highlightCurrentSection();
    }
    
    // 現在表示中のセクションをハイライト
    function highlightCurrentSection() {
        const headings = document.querySelectorAll('.myblog-content h2, .myblog-content h3');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 120) {
                    current = heading.id;
                }
            });
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // DOMContentLoadedで実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateTableOfContents);
    } else {
        generateTableOfContents();
    }
})();
`;

// 目次用のCSSスタイル
const tableOfContentsCSS = `
/* 目次のスタイル */
.article-toc {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 24px;
    margin: 32px 0;
    position: relative;
}

.article-toc::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0071e3, #00c4cc);
    border-radius: 12px 12px 0 0;
}

.toc-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px 0;
    padding-left: 8px;
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: toc-counter;
}

.toc-item-h2 {
    counter-increment: toc-counter;
    margin-bottom: 8px;
}

.toc-item-h2 > .toc-link::before {
    content: counter(toc-counter) ". ";
    font-weight: 700;
    color: #0071e3;
}

.toc-sublist {
    list-style: none;
    padding-left: 24px;
    margin: 8px 0;
    counter-reset: toc-sub-counter;
}

.toc-item-h3 {
    counter-increment: toc-sub-counter;
    margin-bottom: 4px;
}

.toc-item-h3 > .toc-link::before {
    content: counter(toc-counter) "." counter(toc-sub-counter) " ";
    font-weight: 500;
    color: #666;
}

.toc-link {
    text-decoration: none;
    color: #333;
    display: block;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.3s ease;
    line-height: 1.6;
}

.toc-link:hover {
    background: #e9ecef;
    color: #0071e3;
    transform: translateX(4px);
}

.toc-link.active {
    background: #0071e3;
    color: white;
    font-weight: 600;
}

/* モバイル対応 */
@media (max-width: 768px) {
    .article-toc {
        padding: 20px;
        margin: 24px -16px;
        border-radius: 0;
    }
    
    .toc-title {
        font-size: 1.125rem;
    }
    
    .toc-link {
        font-size: 0.875rem;
    }
}

/* スティッキー目次（デスクトップのみ） */
@media (min-width: 1200px) {
    .article-toc {
        position: sticky;
        top: 100px;
        float: right;
        width: 280px;
        margin-left: 32px;
        margin-right: -320px;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
    }
    
    .article-toc::-webkit-scrollbar {
        width: 4px;
    }
    
    .article-toc::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .article-toc::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 2px;
    }
}
`;

// 実装ガイドの出力
console.log('=== ブログ記事目次機能実装ガイド ===\n');

console.log('【目次機能のSEO効果】');
console.log('1. ユーザーエクスペリエンスの向上 → 滞在時間増加');
console.log('2. Google検索結果での目次リンク表示');
console.log('3. ページ内リンクによる内部構造の強化');
console.log('4. アクセシビリティの向上\n');

console.log('【実装手順】\n');

console.log('1. JavaScriptファイルの作成または既存ファイルへの追加');
console.log('   ファイル: js/table-of-contents.js');
console.log('   または既存のblog-navigation.jsに追加\n');

console.log('2. CSSスタイルの追加');
console.log('   ファイル: css/table-of-contents.css');
console.log('   または既存のmyblog-style.cssに追加\n');

console.log('3. HTMLファイルでの読み込み');
console.log('   <script src="js/table-of-contents.js" defer></script>');
console.log('   <link rel="stylesheet" href="css/table-of-contents.css">\n');

console.log('【コード実装】\n');

// ファイルの作成
const fs = require('fs');

// JavaScriptファイルの保存
fs.writeFileSync('js/table-of-contents.js', tableOfContentsScript);
console.log('✓ js/table-of-contents.js を作成しました');

// CSSファイルの保存
fs.writeFileSync('css/table-of-contents.css', tableOfContentsCSS);
console.log('✓ css/table-of-contents.css を作成しました\n');

console.log('【使用方法】');
console.log('1. 自動生成: H2, H3タグから自動的に目次を生成');
console.log('2. スムーズスクロール: クリックで該当セクションへ移動');
console.log('3. 現在位置ハイライト: スクロールに応じて目次が更新');
console.log('4. レスポンシブ対応: モバイルとデスクトップで最適表示\n');

console.log('【カスタマイズオプション】');
console.log('- 最小見出し数の調整（デフォルト: 3つ以上）');
console.log('- 目次の位置（記事冒頭 or サイドバー）');
console.log('- スタイルのカスタマイズ（色、サイズ、アニメーション）');
console.log('- H4タグの追加（必要に応じて）\n');

console.log('【SEO最適化のポイント】');
console.log('1. 見出しタグに適切なキーワードを含める');
console.log('2. 階層構造を正しく保つ（H2 → H3の順序）');
console.log('3. 見出しテキストは簡潔で分かりやすく');
console.log('4. アンカーリンクのIDは意味のある名前に\n');

console.log('完了！');