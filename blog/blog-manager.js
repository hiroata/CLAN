/**
 * ブログ記事管理システム
 * 自動で記事一覧を生成・更新する
 */
class BlogManager {
    constructor() {
        this.articles = [];
        this.articlesPerPage = 10;
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilter = '';
        this.currentSort = 'newest';
        
        // 記事データの初期化
        this.initializeArticles();
    }

    /**
     * 記事データの初期化
     */
    initializeArticles() {
        // 既存のHTMLから記事データを自動取得
        this.scanExistingArticles();
    }

    /**
     * 既存の記事データをHTMLから自動スキャン
     */
    scanExistingArticles() {
        const existingCards = document.querySelectorAll('.myblog-article-card');
        
        existingCards.forEach(card => {
            const linkElement = card.querySelector('.myblog-article-card-link');
            const titleElement = card.querySelector('.myblog-article-card-title');
            const excerptElement = card.querySelector('.myblog-article-card-excerpt');
            const dateElement = card.querySelector('.myblog-article-card-date');
            const tagsElements = card.querySelectorAll('.myblog-tag');
            const imageElement = card.querySelector('.myblog-auto-image');
            
            if (linkElement && titleElement) {
                const article = {
                    title: titleElement.textContent.trim(),
                    url: linkElement.getAttribute('href'),
                    excerpt: excerptElement ? excerptElement.textContent.trim() : '',
                    date: dateElement ? dateElement.getAttribute('datetime') : new Date().toISOString().split('T')[0],
                    tags: Array.from(tagsElements).map(tag => tag.textContent.trim()),
                    category: card.getAttribute('data-category') || 'marketing',
                    imageTitle: imageElement ? imageElement.getAttribute('data-title') : titleElement.textContent.trim()
                };
                
                this.articles.push(article);
            }
        });

        // 追加の記事データ（新しく作成された記事など）
        this.addNewArticles();
        
        // 日付順でソート
        this.sortArticles();
        this.calculatePagination();
    }

    /**
     * 新しい記事データを追加
     */
    addNewArticles() {
        const newArticles = [
            // ここに新しい記事を追加する際の定義を記述
            // 実際のファイルが存在する場合のみ追加
        ];

        // 既存記事と重複チェック
        newArticles.forEach(newArticle => {
            const exists = this.articles.some(existing => existing.url === newArticle.url);
            if (!exists) {
                this.articles.push(newArticle);
            }
        });
    }

    /**
     * 記事をソート
     */
    sortArticles(sortType = 'newest') {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'newest':
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.articles.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                // 人気順のロジック（現在は日付順と同じ）
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    /**
     * 記事をフィルタリング
     */
    filterArticles(category = '') {
        this.currentFilter = category;
        
        if (!category) {
            return this.articles;
        }
        
        const categoryMap = {
            'web-design': ['ウェブデザイン', 'css', 'レスポンシブ'],
            'programming': ['javascript', 'プログラミング'],
            'marketing': ['マーケティング', 'seo', 'UTAGE', 'ウタゲ'],
            'business': ['ビジネス', '効率化']
        };
        
        const targetCategories = categoryMap[category] || [category];
        
        return this.articles.filter(article => {
            return targetCategories.some(targetCategory => 
                article.tags.some(tag => 
                    tag.toLowerCase().includes(targetCategory.toLowerCase())
                ) || 
                article.title.toLowerCase().includes(targetCategory.toLowerCase()) ||
                article.category === category
            );
        });
    }

    /**
     * ページネーション計算
     */
    calculatePagination() {
        const filteredArticles = this.filterArticles(this.currentFilter);
        this.totalPages = Math.ceil(filteredArticles.length / this.articlesPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages);
    }

    /**
     * 現在のページの記事を取得
     */
    getCurrentPageArticles() {
        const filteredArticles = this.filterArticles(this.currentFilter);
        this.sortArticles(this.currentSort);
        
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        
        return filteredArticles.slice(startIndex, endIndex);
    }

    /**
     * 記事カードHTMLを生成
     */
    generateArticleCardHTML(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagsHTML = article.tags.map(tag => 
            `<span class="myblog-tag">${tag}</span>`
        ).join('');

        return `
            <article class="myblog-article-card" data-category="${article.category}" data-date="${article.date}">
                <a href="${article.url}" class="myblog-article-card-link">
                    <div class="myblog-article-card-image myblog-auto-image" data-title="${article.imageTitle}">
                    </div>
                    <div class="myblog-article-card-content">
                        <div class="myblog-article-card-meta">
                            <time class="myblog-article-card-date" datetime="${article.date}">${formattedDate}</time>
                            <div class="myblog-article-card-tags">
                                ${tagsHTML}
                            </div>
                        </div>
                        <h2 class="myblog-article-card-title">${article.title}</h2>
                        <p class="myblog-article-card-excerpt">
                            ${article.excerpt}
                        </p>
                    </div>
                </a>
            </article>
        `;
    }

    /**
     * ページネーションHTMLを生成
     */
    generatePaginationHTML() {
        if (this.totalPages <= 1) {
            return '';
        }

        let paginationHTML = `
            <nav class="myblog-pagination" aria-label="ページナビゲーション">
                <div class="myblog-pagination-container">
        `;

        // 前のページボタン
        const prevDisabled = this.currentPage <= 1 ? 'myblog-pagination-btn--disabled' : '';
        paginationHTML += `
            <a href="#" class="myblog-pagination-btn myblog-pagination-btn--prev ${prevDisabled}" 
               data-page="${this.currentPage - 1}" aria-label="前のページ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2"/>
                </svg>
                前のページ
            </a>
        `;

        // ページ番号
        paginationHTML += '<div class="myblog-pagination-numbers">';
        
        for (let i = 1; i <= this.totalPages; i++) {
            const activeClass = i === this.currentPage ? 'myblog-pagination-number--active' : '';
            const ariaCurrent = i === this.currentPage ? 'aria-current="page"' : '';
            
            paginationHTML += `
                <a href="#" class="myblog-pagination-number ${activeClass}" 
                   data-page="${i}" ${ariaCurrent}>${i}</a>
            `;
        }
        
        paginationHTML += '</div>';

        // 次のページボタン
        const nextDisabled = this.currentPage >= this.totalPages ? 'myblog-pagination-btn--disabled' : '';
        paginationHTML += `
            <a href="#" class="myblog-pagination-btn myblog-pagination-btn--next ${nextDisabled}" 
               data-page="${this.currentPage + 1}" aria-label="次のページ">
                次のページ
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2"/>
                </svg>
            </a>
        `;

        paginationHTML += `
                </div>
            </nav>
        `;

        return paginationHTML;
    }

    /**
     * 記事一覧を更新
     */
    updateArticleList() {
        const gridContainer = document.querySelector('.myblog-articles-grid');
        const paginationContainer = document.querySelector('.myblog-pagination');
        
        if (!gridContainer) {
            console.error('記事グリッドコンテナが見つかりません');
            return;
        }

        // 現在のページの記事を取得
        const currentArticles = this.getCurrentPageArticles();
        
        // 記事一覧を更新
        gridContainer.innerHTML = currentArticles.map(article => 
            this.generateArticleCardHTML(article)
        ).join('');

        // 自動画像生成を実行
        setTimeout(() => {
            const autoImages = document.querySelectorAll('.myblog-auto-image:not(.myblog-auto-image-processed)');
            if (autoImages.length > 0) {
                // myblog-script.jsの自動画像生成機能を呼び出し
                const event = new CustomEvent('myblog:refresh-images');
                window.dispatchEvent(event);
                
                // 直接実行する場合のフォールバック
                if (typeof window.initAutoFeaturedImages === 'function') {
                    window.initAutoFeaturedImages();
                }
            }
        }, 100);

        // ページネーションを更新
        const paginationHTML = this.generatePaginationHTML();
        if (paginationContainer) {
            paginationContainer.outerHTML = paginationHTML;
        }

        // イベントリスナーを再設定
        this.attachEventListeners();
    }

    /**
     * イベントリスナーを設定
     */
    attachEventListeners() {
        // フィルタリング
        const categoryFilter = document.getElementById('myblog-category-filter');
        const sortFilter = document.getElementById('myblog-sort-filter');

        if (categoryFilter) {
            categoryFilter.removeEventListener('change', this.handleFilterChange.bind(this));
            categoryFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }

        if (sortFilter) {
            sortFilter.removeEventListener('change', this.handleSortChange.bind(this));
            sortFilter.addEventListener('change', this.handleSortChange.bind(this));
        }

        // ページネーション
        const paginationButtons = document.querySelectorAll('.myblog-pagination-number, .myblog-pagination-btn');
        paginationButtons.forEach(button => {
            button.removeEventListener('click', this.handlePaginationClick.bind(this));
            button.addEventListener('click', this.handlePaginationClick.bind(this));
        });
    }

    /**
     * フィルター変更ハンドラ
     */
    handleFilterChange(event) {
        this.currentFilter = event.target.value;
        this.currentPage = 1;
        this.calculatePagination();
        this.updateArticleList();
    }

    /**
     * ソート変更ハンドラ
     */
    handleSortChange(event) {
        this.currentSort = event.target.value;
        this.sortArticles(this.currentSort);
        this.updateArticleList();
    }

    /**
     * ページネーションクリックハンドラ
     */
    handlePaginationClick(event) {
        event.preventDefault();
        
        const targetPage = parseInt(event.target.getAttribute('data-page'));
        
        if (targetPage && targetPage !== this.currentPage && 
            targetPage >= 1 && targetPage <= this.totalPages) {
            this.currentPage = targetPage;
            this.updateArticleList();
            
            // ページトップにスクロール
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 新しい記事を追加
     */
    addNewArticle(articleData) {
        // 重複チェック
        const exists = this.articles.some(existing => existing.url === articleData.url);
        if (!exists) {
            this.articles.unshift(articleData); // 新しい記事を先頭に追加
            this.calculatePagination();
            this.updateArticleList();
            return true;
        }
        return false;
    }

    /**
     * 記事を削除
     */
    removeArticle(articleUrl) {
        const index = this.articles.findIndex(article => article.url === articleUrl);
        if (index > -1) {
            this.articles.splice(index, 1);
            this.calculatePagination();
            this.updateArticleList();
            return true;
        }
        return false;
    }

    /**
     * 記事データを外部から設定
     */
    setArticles(articlesData) {
        this.articles = articlesData;
        this.sortArticles();
        this.calculatePagination();
        this.updateArticleList();
    }

    /**
     * 現在の記事データを取得
     */
    getArticles() {
        return this.articles;
    }

    /**
     * 初期化メソッド
     */
    init() {
        // イベントリスナーを設定
        this.attachEventListeners();
        
        // 初回記事一覧更新は行わない（既存のHTMLを保持）
        console.log('Blog Manager initialized with', this.articles.length, 'articles');
    }
}

// グローバルスコープで利用可能にする
window.BlogManager = BlogManager;

// DOMContentLoaded時に自動初期化
document.addEventListener('DOMContentLoaded', function() {
    // ブログ一覧ページの場合のみ初期化
    if (document.querySelector('.myblog-articles-grid')) {
        window.blogManager = new BlogManager();
        window.blogManager.init();
    }
});

// 外部から記事を追加するためのヘルパー関数
window.addBlogArticle = function(articleData) {
    if (window.blogManager) {
        return window.blogManager.addNewArticle(articleData);
    }
    return false;
};

// 外部から記事を削除するためのヘルパー関数
window.removeBlogArticle = function(articleUrl) {
    if (window.blogManager) {
        return window.blogManager.removeArticle(articleUrl);
    }
    return false;
};