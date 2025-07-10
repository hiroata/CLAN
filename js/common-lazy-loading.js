/**
 * 統合画像遅延読み込みシステム
 * 作成日: 2025年6月8日
 * 目的: サイト全体で統一された遅延読み込み機能の提供
 */

(function() {
  'use strict';

  /**
   * 統合遅延読み込みクラス
   */
  class CommonLazyLoader {
    constructor(options = {}) {
      this.options = {
        // IntersectionObserver の設定
        rootMargin: options.rootMargin || '50px 0px',
        threshold: options.threshold || 0.1,
        
        // セレクタ設定
        lazySelector: options.lazySelector || 'img[loading="lazy"], img[data-src]',
        
        // WebP サポート
        useWebP: options.useWebP !== false,
        
        // CLS 対策
        preventCLS: options.preventCLS !== false,
        
        // デバッグモード
        debug: options.debug || false,
        
        // アニメーション設定
        fadeIn: options.fadeIn !== false,
        animationDuration: options.animationDuration || 300
      };

      this.webpSupported = null;
      this.observer = null;
      this.processedImages = new Set();
      
      this.init();
    }

    /**
     * ログ出力（デバッグモード時のみ）
     */
    log(message, type = 'info') {
      if (!this.options.debug) return;
      
      const emoji = {
        info: '🔧',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        lazy: '🖼️'
      }[type] || '📝';
      
      console.log(`${emoji} [LazyLoader] ${message}`);
    }

    /**
     * WebP サポートチェック
     */
    checkWebPSupport() {
      if (this.webpSupported !== null) {
        return Promise.resolve(this.webpSupported);
      }

      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        try {
          const dataURL = canvas.toDataURL('image/webp');
          this.webpSupported = dataURL.indexOf('data:image/webp') === 0;
        } catch (error) {
          this.webpSupported = false;
        }
        
        this.log(`WebP サポート: ${this.webpSupported ? 'あり' : 'なし'}`, 'info');
        resolve(this.webpSupported);
      });
    }

    /**
     * CLS 対策の適用
     */
    applyCLSPrevention(img) {
      if (!this.options.preventCLS) return;

      // 既にサイズが設定されている場合はスキップ
      if (img.hasAttribute('width') && img.hasAttribute('height')) {
        return;
      }

      // data-width, data-height がある場合は使用
      const dataWidth = img.dataset.width;
      const dataHeight = img.dataset.height;
      
      if (dataWidth && dataHeight) {
        img.width = parseInt(dataWidth);
        img.height = parseInt(dataHeight);
        return;
      }

      // アスペクト比の設定
      const aspectRatio = img.dataset.aspectRatio || '16/9';
      img.style.aspectRatio = aspectRatio;
      img.style.objectFit = img.style.objectFit || 'cover';
      
      // 最小サイズの確保
      if (!img.style.minHeight) {
        img.style.minHeight = '200px';
      }
    }

    /**
     * フェードインアニメーションの適用
     */
    applyFadeIn(img) {
      if (!this.options.fadeIn) return;

      // 初期状態を設定
      img.style.opacity = '0';
      img.style.transition = `opacity ${this.options.animationDuration}ms ease`;

      // 画像読み込み完了後にフェードイン
      const showImage = () => {
        img.style.opacity = '1';
        img.classList.add('lazy-loaded');
      };

      if (img.complete && img.naturalHeight !== 0) {
        showImage();
      } else {
        img.addEventListener('load', showImage, { once: true });
        img.addEventListener('error', () => {
          img.style.opacity = '1';
          img.classList.add('lazy-error');
        }, { once: true });
      }
    }

    /**
     * 画像の読み込み処理
     */
    async loadImage(img) {
      // 重複処理防止
      if (this.processedImages.has(img)) {
        return;
      }
      this.processedImages.add(img);

      this.log(`画像読み込み開始: ${img.dataset.src || img.src}`, 'lazy');

      try {
        // CLS 対策を適用
        this.applyCLSPrevention(img);

        // WebP サポートチェック
        if (this.options.useWebP && !this.webpSupported) {
          await this.checkWebPSupport();
        }

        // 画像 URL の決定
        let imageSrc = img.dataset.src || img.src;
        
        // WebP 対応
        if (this.options.useWebP && this.webpSupported && img.dataset.webp) {
          imageSrc = img.dataset.webp;
        }

        // srcset の処理
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        // フェードインアニメーションの準備
        this.applyFadeIn(img);

        // 画像を読み込み
        if (imageSrc && imageSrc !== img.src) {
          img.src = imageSrc;
        }

        // data-src を削除
        if (img.hasAttribute('data-src')) {
          img.removeAttribute('data-src');
        }

        // loading 属性を削除（ネイティブ遅延読み込みとの重複を避ける）
        if (img.hasAttribute('loading')) {
          img.removeAttribute('loading');
        }

        this.log('画像読み込み完了', 'success');

      } catch (error) {
        this.log(`画像読み込みエラー: ${error.message}`, 'error');
        img.classList.add('lazy-error');
      }
    }

    /**
     * IntersectionObserver コールバック
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.observer.unobserve(img);
        }
      });
    }

    /**
     * IntersectionObserver の初期化
     */
    initObserver() {
      if (!('IntersectionObserver' in window)) {
        this.log('IntersectionObserver はサポートされていません', 'warning');
        return false;
      }

      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );

      return true;
    }

    /**
     * 対象画像の監視開始
     */
    observeImages(container = document) {
      const images = container.querySelectorAll(this.options.lazySelector);
      
      this.log(`${images.length} 個の画像を監視対象に追加`, 'lazy');

      if (!this.observer) {
        // フォールバック: 即座に全画像を読み込み
        this.log('フォールバックモード: 全画像を即座に読み込み', 'warning');
        images.forEach(img => this.loadImage(img));
        return;
      }

      images.forEach(img => {
        // 既に処理済みの場合はスキップ
        if (this.processedImages.has(img)) {
          return;
        }

        // 画像が既にビューポート内にある場合は即座に読み込み
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          this.loadImage(img);
        } else {
          this.observer.observe(img);
        }
      });
    }

    /**
     * 新しい画像の追加（動的コンテンツ用）
     */
    addImages(images) {
      if (typeof images === 'string') {
        images = document.querySelectorAll(images);
      } else if (images instanceof Element) {
        images = [images];
      }

      Array.from(images).forEach(img => {
        if (img.tagName === 'IMG' && !this.processedImages.has(img)) {
          if (this.observer) {
            this.observer.observe(img);
          } else {
            this.loadImage(img);
          }
        }
      });
    }

    /**
     * 監視解除
     */
    disconnect() {
      if (this.observer) {
        this.observer.disconnect();
        this.log('画像監視を停止しました', 'info');
      }
    }

    /**
     * 初期化
     */
    init() {
      this.log('遅延読み込みシステムを初期化中...', 'lazy');

      // WebP サポートチェック
      this.checkWebPSupport();

      // Observer 初期化
      const observerReady = this.initObserver();

      // DOM 読み込み完了後に画像を監視
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.observeImages();
        });
      } else {
        this.observeImages();
      }

      this.log('遅延読み込みシステム初期化完了', 'success');
    }

    /**
     * 手動での全画像読み込み（デバッグ用）
     */
    loadAllImages() {
      this.log('全画像を強制読み込み', 'lazy');
      const images = document.querySelectorAll(this.options.lazySelector);
      images.forEach(img => this.loadImage(img));
    }
  }

  // グローバルに公開
  window.CommonLazyLoader = CommonLazyLoader;

  // デフォルトインスタンス（自動初期化）
  window.lazyLoader = new CommonLazyLoader({
    debug: false,
    fadeIn: true,
    preventCLS: true,
    useWebP: true
  });

  // 後方互換性のための関数
  window.initLazyLoading = function(options = {}) {
    return new CommonLazyLoader(options);
  };

  // 動的コンテンツ用のヘルパー関数
  window.refreshLazyImages = function(container) {
    window.lazyLoader.observeImages(container);
  };

  // 既存のコードとの互換性（MyBlog名前空間）
  if (typeof window.MyBlog === 'object') {
    window.MyBlog.refreshImages = function() {
      window.lazyLoader.observeImages();
    };
  }

})();