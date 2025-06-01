/**
 * 遅延読み込み機能
 * まえゆきツール - 画像の遅延読み込みとパフォーマンス最適化
 */

(function() {
    'use strict';
    
    // Intersection Observer がサポートされているかチェック
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver is not supported in this browser');
        return;
    }
    
    // 遅延読み込み設定
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                lazyImageObserver.unobserve(img);
            }
        });
    });
    
    // ページ読み込み完了後に実行
    document.addEventListener('DOMContentLoaded', function() {
        // data-src属性を持つ画像を遅延読み込み対象に設定
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            img.classList.add('lazy');
            lazyImageObserver.observe(img);
        });
        
        console.log(`遅延読み込み対象画像: ${lazyImages.length}枚`);
    });
    
    // CSS for lazy loading
    const style = document.createElement('style');
    style.textContent = `
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        img.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
})();
