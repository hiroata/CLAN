
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
