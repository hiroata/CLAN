
/**
 * 読了時間計算・表示機能
 * 日本語と英語の混在テキストに対応
 */
(function() {
    'use strict';
    
    // 読了時間を計算する関数
    function calculateReadingTime(text) {
        // HTMLタグを除去
        const plainText = text.replace(/<[^>]*>/g, '');
        
        // 日本語文字数をカウント（漢字・ひらがな・カタカナ）
        const japaneseChars = plainText.match(/[　-〿぀-ゟ゠-ヿ一-龯㐀-䶿]/g) || [];
        const japaneseCount = japaneseChars.length;
        
        // 英数字の単語数をカウント
        const words = plainText.match(/[a-zA-Z0-9]+/g) || [];
        const wordCount = words.length;
        
        // 読了速度（日本語: 400文字/分、英語: 200単語/分）
        const japaneseReadingSpeed = 400;
        const englishReadingSpeed = 200;
        
        // 読了時間を計算
        const japaneseMinutes = japaneseCount / japaneseReadingSpeed;
        const englishMinutes = wordCount / englishReadingSpeed;
        const totalMinutes = Math.ceil(japaneseMinutes + englishMinutes);
        
        // 最小1分
        return Math.max(1, totalMinutes);
    }
    
    // 読了時間を表示する関数
    function displayReadingTime() {
        const articleContent = document.querySelector('.myblog-content');
        const articleMeta = document.querySelector('.myblog-article-meta');
        
        if (!articleContent || !articleMeta) return;
        
        // 読了時間を計算
        const readingTime = calculateReadingTime(articleContent.innerHTML);
        
        // 読了時間要素を作成
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="reading-time-text">約${readingTime}分で読めます</span>
        `;
        
        // メタ情報エリアに追加
        articleMeta.appendChild(readingTimeElement);
        
        // プログレスバーの追加（オプション）
        addReadingProgress(articleContent);
    }
    
    // 読了プログレスバーを追加
    function addReadingProgress(articleContent) {
        // プログレスバーコンテナ
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        progressContainer.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);
        
        const progressBar = progressContainer.querySelector('.reading-progress-bar');
        
        // スクロールイベントで更新
        window.addEventListener('scroll', () => {
            const articleRect = articleContent.getBoundingClientRect();
            const articleHeight = articleRect.height;
            const articleTop = articleRect.top + window.pageYOffset;
            const articleBottom = articleTop + articleHeight;
            
            const windowHeight = window.innerHeight;
            const scrollPosition = window.pageYOffset + windowHeight;
            
            // 記事の読了率を計算
            let progress = 0;
            if (scrollPosition > articleTop) {
                if (scrollPosition >= articleBottom) {
                    progress = 100;
                } else {
                    const readHeight = scrollPosition - articleTop;
                    progress = (readHeight / articleHeight) * 100;
                }
            }
            
            progressBar.style.width = progress + '%';
            
            // 読了時にアニメーション
            if (progress >= 100) {
                progressBar.classList.add('completed');
            } else {
                progressBar.classList.remove('completed');
            }
        });
    }
    
    // 統計情報の収集（オプション）
    function trackReadingStats() {
        const startTime = Date.now();
        let isReading = true;
        let totalReadingTime = 0;
        
        // ページ離脱時に読了時間を記録
        window.addEventListener('beforeunload', () => {
            if (isReading) {
                totalReadingTime += Date.now() - startTime;
            }
            
            // Google Analyticsなどに送信（実装例）
            if (typeof gtag !== 'undefined') {
                gtag('event', 'reading_time', {
                    'event_category': 'engagement',
                    'event_label': document.title,
                    'value': Math.round(totalReadingTime / 1000) // 秒単位
                });
            }
        });
        
        // 非アクティブ時の検出
        let inactiveTimer;
        const resetInactiveTimer = () => {
            clearTimeout(inactiveTimer);
            if (!isReading) {
                isReading = true;
            }
            inactiveTimer = setTimeout(() => {
                isReading = false;
            }, 30000); // 30秒間操作がなければ非アクティブ
        };
        
        ['mousemove', 'keypress', 'scroll', 'click'].forEach(event => {
            window.addEventListener(event, resetInactiveTimer);
        });
    }
    
    // DOMContentLoadedで実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            displayReadingTime();
            trackReadingStats();
        });
    } else {
        displayReadingTime();
        trackReadingStats();
    }
})();
