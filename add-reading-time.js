/**
 * ブログ記事に読了時間表示機能を追加
 * ユーザーエンゲージメントとSEO向上のための実装
 */

// 読了時間計算・表示用のJavaScriptコード
const readingTimeScript = `
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
        const japaneseChars = plainText.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g) || [];
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
        readingTimeElement.innerHTML = \`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="reading-time-text">約\${readingTime}分で読めます</span>
        \`;
        
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
`;

// 読了時間表示用のCSSスタイル
const readingTimeCSS = `
/* 読了時間表示のスタイル */
.reading-time {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
    margin-left: 16px;
}

.reading-time svg {
    color: #0071e3;
}

.reading-time-text {
    letter-spacing: 0.02em;
}

/* 読了プログレスバー */
.reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    z-index: 9999;
    transition: opacity 0.3s ease;
}

.reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0071e3, #00c4cc);
    width: 0%;
    transition: width 0.2s ease-out;
    box-shadow: 0 0 10px rgba(0, 113, 227, 0.5);
}

.reading-progress-bar.completed {
    animation: pulse 0.6s ease;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 10px rgba(0, 113, 227, 0.5);
    }
    50% {
        box-shadow: 0 0 20px rgba(0, 113, 227, 0.8);
    }
    100% {
        box-shadow: 0 0 10px rgba(0, 113, 227, 0.5);
    }
}

/* 記事メタ情報の調整 */
.myblog-article-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
}

/* モバイル対応 */
@media (max-width: 768px) {
    .reading-time {
        margin-left: 0;
        margin-top: 8px;
        width: 100%;
    }
    
    .myblog-article-meta {
        flex-direction: column;
        align-items: flex-start;
    }
}

/* ダークモード対応（オプション） */
@media (prefers-color-scheme: dark) {
    .reading-time {
        color: #ccc;
    }
    
    .reading-progress-container {
        background: rgba(255, 255, 255, 0.1);
    }
}
`;

// 実装ガイドの出力
console.log('=== 読了時間表示機能実装ガイド ===\n');

console.log('【読了時間表示のメリット】');
console.log('1. ユーザーエンゲージメントの向上');
console.log('2. 直帰率の低下（期待値の設定）');
console.log('3. ユーザビリティの向上');
console.log('4. 読了率データの収集可能\n');

console.log('【実装機能】');
console.log('1. 自動読了時間計算（日本語・英語対応）');
console.log('2. 読了プログレスバー表示');
console.log('3. 読了統計の収集（GA連携可能）');
console.log('4. レスポンシブ対応\n');

console.log('【実装手順】\n');

const fs = require('fs');

// JavaScriptファイルの保存
fs.writeFileSync('js/reading-time.js', readingTimeScript);
console.log('✓ js/reading-time.js を作成しました');

// CSSファイルの保存
fs.writeFileSync('css/reading-time.css', readingTimeCSS);
console.log('✓ css/reading-time.css を作成しました\n');

console.log('【HTMLへの組み込み方法】');
console.log('```html');
console.log('<!-- ブログ記事のHTMLに追加 -->');
console.log('<link rel="stylesheet" href="css/reading-time.css">');
console.log('<script src="js/reading-time.js" defer></script>');
console.log('```\n');

console.log('【カスタマイズオプション】');
console.log('1. 読了速度の調整');
console.log('   - 日本語: 400文字/分（デフォルト）');
console.log('   - 英語: 200単語/分（デフォルト）');
console.log('2. プログレスバーの表示/非表示');
console.log('3. 統計情報の収集設定');
console.log('4. デザインのカスタマイズ\n');

console.log('【SEO効果】');
console.log('- 滞在時間の向上 → 検索順位にプラス影響');
console.log('- 直帰率の改善 → ユーザーシグナルの向上');
console.log('- エンゲージメントメトリクスの改善\n');

console.log('【統合時の注意点】');
console.log('- 既存のmyblog-article-metaクラスとの整合性確認');
console.log('- プログレスバーのz-indexが他要素と干渉しないか確認');
console.log('- Google Analytics等の分析ツールとの連携設定\n');

console.log('完了！');