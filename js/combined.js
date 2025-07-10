
/* === js/common-init.js === */
/**
 * 統合システム初期化スクリプト
 * 作成日: 2025年6月8日
 * 目的: 統合されたシステムの正しい初期化順序を管理
 */

(function() {
  'use strict';

  /**
   * 統合システム初期化管理クラス
   */
  class CommonSystemInit {
    constructor() {
      this.systems = {
        cache: false,
        lazyLoader: false,
        hamburger: false,
        variables: false
      };
      
      this.debug = false;
      this.initPromise = this.init();
    }

    log(message, type = 'info') {
      if (!this.debug) return;
      
      const emoji = {
        info: '🔧',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        init: '🚀'
      }[type] || '📝';
      
      console.log(`${emoji} [SystemInit] ${message}`);
    }

    /**
     * システムの準備完了チェック
     */
    checkSystemReady(systemName) {
      const checks = {
        cache: () => typeof window.CommonCacheManager === 'function' && window.cacheManager,
        lazyLoader: () => typeof window.CommonLazyLoader === 'function' && window.lazyLoader,
        hamburger: () => document.querySelector('.common-hamburger') !== null || 
                        document.querySelector('.common-mobile-menu') !== null,
        variables: () => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() !== ''
      };

      const isReady = checks[systemName] ? checks[systemName]() : false;
      
      if (isReady && !this.systems[systemName]) {
        this.systems[systemName] = true;
        this.log(`${systemName} システム準備完了`, 'success');
      }
      
      return isReady;
    }

    /**
     * 全システムの準備完了を待機
     */
    async waitForSystems(timeout = 10000) {
      const startTime = Date.now();
      
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          // 必要なシステムをチェック
          this.checkSystemReady('cache');
          this.checkSystemReady('lazyLoader');
          this.checkSystemReady('variables');
          
          // 全システムが準備完了かチェック
          const requiredSystems = ['cache', 'lazyLoader', 'variables'];
          const allReady = requiredSystems.every(system => this.systems[system]);
          
          // タイムアウトチェック
          const elapsed = Date.now() - startTime;
          if (elapsed > timeout) {
            this.log('システム初期化タイムアウト（一部システムが未準備）', 'warning');
            clearInterval(checkInterval);
            resolve(false);
            return;
          }
          
          if (allReady) {
            this.log('全統合システム準備完了', 'success');
            clearInterval(checkInterval);
            resolve(true);
            return;
          }
        }, 100);
      });
    }

    /**
     * ページ固有の初期化
     */
    initPageSpecific() {
      const path = window.location.pathname;
      
      // ブログページの特別な処理
      if (path.includes('/blog/')) {
        this.log('ブログページを検出', 'init');
        
        // ブログ専用の初期化
        if (path.includes('/blog/article-')) {
          // 記事ページ: 強制的にトップにスクロール
          if (window.cacheManager) {
            window.cacheManager.resetBrowserState();
          }
        }
      }
      
      // ツールページの処理
      if (path.includes('/tools/')) {
        this.log('ツールページを検出', 'init');
        // ツール固有の初期化があればここに
      }
    }

    /**
     * レガシーシステムとの互換性確保
     */
    ensureLegacyCompatibility() {
      // グローバル関数の確保
      if (!window.clearAllCache && window.cacheManager) {
        window.clearAllCache = () => window.cacheManager.clearBlogCache();
      }
      
      if (!window.initLazyLoading && window.lazyLoader) {
        window.initLazyLoading = (options) => new window.CommonLazyLoader(options);
      }
      
      if (!window.refreshLazyImages && window.lazyLoader) {
        window.refreshLazyImages = (container) => window.lazyLoader.observeImages(container);
      }
      
      // MyBlog名前空間の拡張
      if (typeof window.MyBlog === 'object') {
        if (!window.MyBlog.clearCache && window.cacheManager) {
          window.MyBlog.clearCache = () => window.cacheManager.hardReload('blog');
        }
        
        if (!window.MyBlog.refreshImages && window.lazyLoader) {
          window.MyBlog.refreshImages = () => window.lazyLoader.observeImages();
        }
      }

      this.log('レガシー互換性を確保しました', 'success');
    }

    /**
     * パフォーマンス監視の設定
     */
    setupPerformanceMonitoring() {
      if (!this.debug) return;
      
      // ページ読み込み時間の計測
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.log(`ページ読み込み完了: ${loadTime.toFixed(2)}ms`, 'info');
      });
      
      // 統合システムの状態を定期的にレポート
      setInterval(() => {
        const status = Object.entries(this.systems)
          .map(([name, ready]) => `${name}: ${ready ? '✅' : '❌'}`)
          .join(', ');
        console.log(`[SystemStatus] ${status}`);
      }, 30000); // 30秒ごと
    }

    /**
     * エラーハンドリングの設定
     */
    setupErrorHandling() {
      window.addEventListener('error', (event) => {
        if (event.filename && (
          event.filename.includes('common-cache.js') ||
          event.filename.includes('common-lazy-loading.js') ||
          event.filename.includes('common-hamburger.css')
        )) {
          this.log(`統合システムエラー: ${event.message}`, 'error');
        }
      });
    }

    /**
     * メイン初期化処理
     */
    async init() {
      this.log('統合システム初期化開始', 'init');
      
      // エラーハンドリング設定
      this.setupErrorHandling();
      
      // システム準備完了を待機
      const systemsReady = await this.waitForSystems();
      
      if (systemsReady) {
        // ページ固有の初期化
        this.initPageSpecific();
        
        // レガシー互換性確保
        this.ensureLegacyCompatibility();
        
        // パフォーマンス監視（デバッグモード時）
        this.setupPerformanceMonitoring();
        
        this.log('統合システム初期化完了', 'success');
        
        // カスタムイベントを発火
        const event = new CustomEvent('commonSystemReady', {
          detail: {
            systems: this.systems,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(event);
        
        return true;
      } else {
        this.log('統合システム初期化に失敗', 'error');
        return false;
      }
    }

    /**
     * 初期化完了の待機
     */
    ready() {
      return this.initPromise;
    }
  }

  // グローバルに公開
  window.CommonSystemInit = CommonSystemInit;
  
  // 自動初期化
  window.commonSystemInit = new CommonSystemInit();
  
  // DOM読み込み完了後の追加初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.commonSystemInit.ready().then(() => {
        // DOM準備完了後の追加処理があればここに
      });
    });
  }

})();

/* === js/common-lazy-loading.js === */
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

/* === js/common-cache.js === */
/**
 * 統合キャッシュ管理システム
 * 作成日: 2025年6月8日
 * 目的: サイト全体で統一されたキャッシュクリア機能の提供
 */

(function() {
  'use strict';

  /**
   * 統合キャッシュ管理クラス
   */
  class CommonCacheManager {
    constructor() {
      this.debug = true; // デバッグモード
    }

    /**
     * ログ出力（デバッグモード時のみ）
     */
    log(message, type = 'info') {
      if (!this.debug) return;
      
      const emoji = {
        info: '🔧',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        cache: '🧹'
      }[type] || '📝';
      
      console.log(`${emoji} [CacheManager] ${message}`);
    }

    /**
     * sessionStorage の完全クリア
     */
    clearSessionStorage() {
      try {
        sessionStorage.clear();
        this.log('sessionStorage をクリアしました', 'success');
        return true;
      } catch (error) {
        this.log(`sessionStorage クリアに失敗: ${error.message}`, 'error');
        return false;
      }
    }

    /**
     * localStorage の選択的クリア
     */
    clearLocalStorage(patterns = []) {
      try {
        // デフォルトのクリア対象パターン
        const defaultPatterns = [
          'scroll', 'menu', 'animation', 'clan', 'site', 'utage', 
          'myblog', 'blog', 'cache', 'state', 'ui'
        ];
        
        const targetPatterns = patterns.length > 0 ? patterns : defaultPatterns;
        const keysToRemove = [];
        
        // マッチするキーを収集
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && targetPatterns.some(pattern => 
            key.toLowerCase().includes(pattern.toLowerCase())
          )) {
            keysToRemove.push(key);
          }
        }
        
        // キーを削除
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        this.log(`localStorage から ${keysToRemove.length} 項目をクリアしました`, 'success');
        if (keysToRemove.length > 0) {
          this.log(`削除されたキー: ${keysToRemove.join(', ')}`, 'info');
        }
        
        return true;
      } catch (error) {
        this.log(`localStorage クリアに失敗: ${error.message}`, 'error');
        return false;
      }
    }

    /**
     * Service Worker キャッシュのクリア
     */
    async clearServiceWorkerCache() {
      if (!('caches' in window)) {
        this.log('Cache API はサポートされていません', 'warning');
        return false;
      }

      try {
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames.map(name => caches.delete(name));
        await Promise.all(deletePromises);
        
        this.log(`${cacheNames.length} 個のキャッシュをクリアしました`, 'success');
        return true;
      } catch (error) {
        this.log(`Service Worker キャッシュクリアに失敗: ${error.message}`, 'error');
        return false;
      }
    }

    /**
     * Service Worker にキャッシュクリアメッセージを送信
     */
    async sendCacheClearMessage() {
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        this.log('Service Worker は利用できません', 'warning');
        return false;
      }

      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            this.log('Service Worker キャッシュクリア完了', 'success');
            resolve(true);
          } else {
            this.log('Service Worker キャッシュクリアに失敗', 'error');
            resolve(false);
          }
        };
        
        // タイムアウト処理
        setTimeout(() => {
          this.log('Service Worker の応答がタイムアウトしました', 'warning');
          resolve(false);
        }, 5000);
        
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' }, 
          [messageChannel.port2]
        );
      });
    }

    /**
     * ブラウザの履歴状態をリセット
     */
    resetBrowserState() {
      try {
        // スクロール復元を自動に設定
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'auto';
        }
        
        // ページの先頭にスクロール
        window.scrollTo(0, 0);
        
        this.log('ブラウザ状態をリセットしました', 'success');
        return true;
      } catch (error) {
        this.log(`ブラウザ状態リセットに失敗: ${error.message}`, 'error');
        return false;
      }
    }

    /**
     * ブログ専用キャッシュクリア
     */
    async clearBlogCache() {
      this.log('ブログキャッシュクリアを開始...', 'cache');
      
      const results = {
        sessionStorage: this.clearSessionStorage(),
        localStorage: this.clearLocalStorage(['myblog', 'scroll', 'blog']),
        browserState: this.resetBrowserState()
      };
      
      // Service Worker キャッシュクリア（オプション）
      if ('caches' in window) {
        results.serviceWorker = await this.clearServiceWorkerCache();
      }
      
      const success = Object.values(results).every(result => result === true);
      this.log(success ? 'ブログキャッシュクリア完了' : 'ブログキャッシュクリアで一部エラー', 
               success ? 'success' : 'warning');
      
      return results;
    }

    /**
     * サイト全体のキャッシュクリア
     */
    async clearSiteCache() {
      this.log('サイト全体のキャッシュクリアを開始...', 'cache');
      
      const results = {
        sessionStorage: this.clearSessionStorage(),
        localStorage: this.clearLocalStorage(),
        browserState: this.resetBrowserState()
      };
      
      // Service Worker キャッシュクリア
      if ('caches' in window) {
        // メッセージ送信を試行、失敗した場合は直接削除
        const messageResult = await this.sendCacheClearMessage();
        if (!messageResult) {
          results.serviceWorker = await this.clearServiceWorkerCache();
        } else {
          results.serviceWorker = true;
        }
      }
      
      const success = Object.values(results).every(result => result === true);
      this.log(success ? 'サイト全体のキャッシュクリア完了' : 'キャッシュクリアで一部エラー', 
               success ? 'success' : 'warning');
      
      return results;
    }

    /**
     * ハードリロード（キャッシュクリア後）
     */
    async hardReload(clearType = 'site') {
      let clearResult;
      
      if (clearType === 'blog') {
        clearResult = await this.clearBlogCache();
      } else {
        clearResult = await this.clearSiteCache();
      }
      
      // リロード実行
      try {
        this.log('ページをリロードします...', 'info');
        window.location.reload(true);
      } catch (error) {
        // 通常のリロードにフォールバック
        window.location.reload();
      }
      
      return clearResult;
    }
  }

  // グローバルに公開
  window.CommonCacheManager = CommonCacheManager;

  // シングルトンインスタンス
  window.cacheManager = new CommonCacheManager();

  // 後方互換性のためのグローバル関数
  window.clearAllCache = function() {
    return window.cacheManager.clearBlogCache();
  };

  window.clearSiteCache = function() {
    return window.cacheManager.hardReload('site');
  };

  // MyBlog名前空間に追加（既存のブログコードとの互換性）
  if (typeof window.MyBlog === 'object') {
    window.MyBlog.clearCache = function() {
      return window.cacheManager.hardReload('blog');
    };
  }

  // ページ読み込み時の自動キャッシュクリア（記事ページのみ）
  document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // ブログ記事ページの場合のみ自動クリア
    if (path.includes('/blog/article-')) {
      window.cacheManager.log('記事ページ検出：自動キャッシュクリア実行', 'cache');
      window.cacheManager.clearBlogCache();
    }
  });

})();

/* === js/blog-navigation.js === */
// Blog Navigation - Shared navigation functions for all blog articles
// Generated to consolidate duplicate inline scripts across 103 blog articles

// Article titles mapping for navigation
const articleTitles = {
    'article-utage-accounting-cloud-bookkeeping.html': 'UTAGEでクラウド会計連携システム構築ガイド',
    'article-utage-administrative-scrivener-license-permit.html': 'UTAGE行政書士事務所の許認可申請オンライン受付システム構築法',
    'article-utage-beauty-clinic-strategy.html': 'UTAGEで美容クリニックの集客戦略を自動化する方法',
    'article-utage-beauty-health-digital-marketing.html': 'UTAGEで美容・健康業界のデジタルマーケティングを完全自動化',
    'article-utage-calligraphy-school-strategy.html': 'UTAGEで書道教室の生徒募集とオンライン指導システム構築法',
    'article-utage-chamber-commerce-seminar-member.html': 'UTAGE商工会議所セミナー会員募集システム構築ガイド',
    'article-utage-checkout-optimization.html': 'UTAGEチェックアウト最適化で売上を劇的に向上させる方法',
    'article-utage-coaching-business-automation.html': 'UTAGEでコーチングビジネスを完全自動化する究極のガイド',
    'article-utage-consultant-success-patterns.html': 'UTAGEコンサルタント成功事例から学ぶ効果的な活用パターン',
    'article-utage-consulting-diagnosis-funnel.html': 'UTAGEコンサルティング診断ファネル構築完全マニュアル',
    'article-utage-content-management.html': 'UTAGEコンテンツ管理を効率化する実践的テクニック集',
    'article-utage-cooking-school-recipe-videos.html': 'UTAGEで料理教室のレシピ動画配信システム構築法',
    'article-utage-corporate-training-elearning.html': 'UTAGE企業研修eラーニングシステム構築完全ガイド',
    'article-utage-dance-school-automation.html': 'UTAGEでダンススクールの生徒管理と指導システム自動化',
    'article-utage-dental-clinic-patient-follow-up.html': 'UTAGE歯科クリニック患者フォローアップシステム構築法',
    'article-utage-domain-dkim-spf-setup.html': 'UTAGEドメイン設定：DKIM・SPF完全設定ガイド',
    'article-utage-education-committee-parent-notification.html': 'UTAGE教育委員会保護者通知システム構築ガイド',
    'article-utage-email-setup.html': 'UTAGEメール設定完全ガイド：到達率向上の秘訣',
    'article-utage-email-spam-prevention.html': 'UTAGEメール配信でスパム判定を回避する実践的対策法',
    'article-utage-english-school-level-check.html': 'UTAGE英会話スクールレベルチェック自動システム構築法',
    'article-utage-event-management-automation.html': 'UTAGEでイベント管理を完全自動化する実践ガイド',
    'article-utage-fire-department-disaster-prevention.html': 'UTAGE消防署防災講習申込管理システム構築ガイド',
    'article-utage-fitness-gym-trial-membership-automation.html': 'UTAGEフィットネスジム体験会員システム自動化ガイド',
    'article-utage-fitness-sports-online-expansion.html': 'UTAGEでフィットネス・スポーツ業界のオンライン展開戦略',
    'article-utage-fp-lifeplan-consultation.html': 'UTAGEファイナンシャルプランナーライフプラン相談システム構築法',
    'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全活用ガイド2025年版',
    'article-utage-funnel-guide.html': 'UTAGEファネル構築完全ガイド：売上を最大化する設計法',
    'article-utage-funnel-seo-strategy.html': 'UTAGEファネルSEO戦略で検索流入を売上に直結させる方法',
    'article-utage-funnel-vs-clickfunnels.html': 'UTAGE vs ClickFunnels 徹底比較：日本企業に最適な選択は？',
    'article-utage-golf-school-trial-lesson-video-sales.html': 'UTAGEゴルフスクール体験レッスン動画セールス構築法',
    'article-utage-health-center-consultation-screening.html': 'UTAGE保健センター相談・検診予約システム構築ガイド',
    'article-utage-hellowork-employment-seminar-consultation.html': 'UTAGEハローワーク就職セミナー相談システム構築ガイド',
    'article-utage-hospital-nurse-recruitment.html': 'UTAGE病院看護師募集システム構築完全マニュアル',
    'article-utage-hotel-ryokan-direct-booking.html': 'UTAGEホテル・旅館直接予約システム構築ガイド',
    'article-utage-internship-recruitment-system.html': 'UTAGEインターンシップ募集システム構築完全ガイド',
    'article-utage-it-engineer-recruitment.html': 'UTAGEでIT エンジニア採用システムを構築する実践ガイド',
    'article-utage-japanese-language-school.html': 'UTAGE日本語学校入学案内・体験授業システム構築法',
    'article-utage-judicial-scrivener-inheritance-diagnosis.html': 'UTAGE司法書士事務所相続診断システム構築完全ガイド',
    'article-utage-kindergarten-trial-newsletter.html': 'UTAGE幼稚園体験入園・お便り配信システム構築法',
    'article-utage-label-automation.html': 'UTAGEラベル自動化で顧客管理を効率化する実践テクニック',
    'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成完全ガイド2025年版',
    'article-utage-lawyer-consultation-estimate-automation.html': 'UTAGE弁護士事務所相談・見積もり自動化システム構築法',
    'article-utage-learning-academy-trial-lessons.html': 'UTAGEで学習塾体験授業申込システム構築完全ガイド',
    'article-utage-legal-professionals-online-system.html': 'UTAGE士業オンラインシステム構築で業務効率を劇的改善',
    'article-utage-line-delivery-guide.html': 'UTAGEのLINE配信完全ガイド：効果的な活用法とは',
    'article-utage-line-step-delivery.html': 'UTAGEのLINEステップ配信で顧客育成を自動化する方法',
    'article-utage-local-business-digital-transformation.html': 'UTAGEで地域ビジネスのデジタルトランスフォーメーション',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': 'UTAGE結婚相談所相談・お見合い知識システム構築法',
    'article-utage-membership-site-manual.html': 'UTAGEメンバーシップサイト構築完全マニュアル2025',
    'article-utage-merits-demerits-2.html': 'UTAGEのメリット・デメリットを徹底解説【2025年最新版】',
    'article-utage-mid-career-recruitment-strategy.html': 'UTAGEで中途採用戦略を成功させる実践的アプローチ',
    'article-utage-mobile-optimization.html': 'UTAGEモバイル最適化で売上を向上させる実践テクニック',
    'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネルで顧客単価を最大化する方法',
    'article-utage-municipality-resident-notification.html': 'UTAGE自治体住民通知システム構築完全ガイド',
    'article-utage-municipality-staff-recruitment.html': 'UTAGE自治体職員募集システム構築実践マニュアル',
    'article-utage-music-school-trial-lessons.html': 'UTAGE音楽教室体験レッスン申込システム構築完全ガイド',
    'article-utage-new-graduate-recruitment.html': 'UTAGE新卒採用システム構築で優秀な人材を獲得する方法',
    'article-utage-nursing-home-tour-booking-automation.html': 'UTAGE介護施設見学予約自動化システム構築ガイド',
    'article-utage-obstetrics-maternity-class-automation.html': 'UTAGE産婦人科マタニティクラス自動化システム構築法',
    'article-utage-online-course-creation.html': 'UTAGEオンラインコース作成で収益化を実現する方法',
    'article-utage-online-education-complete-guide.html': 'UTAGEオンライン教育プラットフォーム構築完全ガイド',
    'article-utage-optin-page-design.html': 'UTAGEオプトインページデザインで登録率を最大化する方法',
    'article-utage-part-time-recruitment-automation.html': 'UTAGEアルバイト募集自動化で採用効率を劇的に向上',
    'article-utage-payment-integration-guide.html': 'UTAGE決済連携完全ガイド：売上管理を自動化する方法',
    'article-utage-pet-hotel-booking-care-video-sales.html': 'UTAGEペットホテル予約・ケア動画セールス構築法',
    'article-utage-pharmacy-health-consultation.html': 'UTAGE薬局健康相談システム構築で地域医療に貢献',
    'article-utage-photo-studio-booking-photographer-training.html': 'UTAGEフォトスタジオ予約・カメラマン研修システム構築法',
    'article-utage-pricing.html': 'UTAGE料金プラン完全解説：最適なプランの選び方',
    'article-utage-programming-school-free-courses.html': 'UTAGEプログラミングスクール無料講座システム構築法',
    'article-utage-psychiatry-initial-consultation-questionnaire.html': 'UTAGE精神科初診問診票システム構築で診療効率向上',
    'article-utage-qualification-prep-school.html': 'UTAGE資格予備校体験授業・模試システム構築完全ガイド',
    'article-utage-real-estate-digital-transformation.html': 'UTAGEで不動産業界のデジタルトランスフォーメーション',
    'article-utage-real-estate-property-training.html': 'UTAGE不動産物件紹介・研修システム構築実践ガイド',
    'article-utage-rehabilitation-center-training-videos.html': 'UTAGEリハビリセンター研修動画配信システム構築法',
    'article-utage-reminder-system.html': 'UTAGEリマインダーシステムで顧客フォローを完全自動化',
    'article-utage-restaurant-reservation-member-menu.html': 'UTAGEレストラン予約・会員メニューシステム構築ガイド',
    'article-utage-sales-page-psychology.html': 'UTAGEセールスページ心理学：購買意欲を高める設計法',
    'article-utage-seitai-clinic-management.html': 'UTAGE整体院経営システムで集客と顧客管理を自動化',
    'article-utage-sme-consultant-subsidy-guide.html': 'UTAGE中小企業診断士補助金ガイド作成システム構築法',
    'article-utage-sr-firm-labor-diagnosis.html': 'UTAGE社労士事務所労務診断システム構築完全ガイド',
    'article-utage-sr-subsidy-diagnosis-consultation.html': 'UTAGE社労士助成金診断・相談システム構築実践法',
    'article-utage-staffing-company-management.html': 'UTAGE人材派遣会社管理システムで業務効率を劇的改善',
    'article-utage-step-mail-course.html': 'UTAGEステップメール講座で見込み客を顧客に育成する方法',
    'article-utage-student-management.html': 'UTAGE生徒管理システムで教育機関の運営を効率化',
    'article-utage-subscription-business.html': 'UTAGEサブスクリプションビジネス構築で安定収益を実現',
    'article-utage-support-guide.html': 'UTAGEサポート完全ガイド：困ったときの解決法',
    'article-utage-tax-office-consultation-conversion.html': 'UTAGE税理士事務所相談・転換システム構築実践ガイド',
    'article-utage-teacher-recruitment-strategy.html': 'UTAGEで教員採用戦略を成功に導く実践的手法',
    'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド：効率的なページ作成法',
    'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページアップセルで売上を倍増させる方法',
    'article-utage-tourism-association-tour-booking.html': 'UTAGE観光協会ツアー予約システム構築完全ガイド',
    'article-utage-veterinary-clinic-vaccination-reminder.html': 'UTAGE動物病院ワクチン接種リマインダーシステム構築法',
    'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理で効果的な配信を実現する方法',
    'article-utage-visiting-nurse-schedule-management.html': 'UTAGE訪問看護スケジュール管理システム構築ガイド',
    'article-utage-vs-comparison-new.html': 'UTAGE競合比較最新版：他ツールとの違いを徹底解説',
    'article-utage-vs-comparison.html': 'UTAGE vs 他ツール徹底比較：選ぶべき理由を解説',
    'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASP メール配信機能徹底比較ガイド',
    'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable オンライン教育プラットフォーム比較',
    'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページで参加率を最大化する方法',
    'article-utage-welfare-facility-recruitment.html': 'UTAGE福祉施設職員募集システムで人材確保を効率化',
    'article-utage-yoga-studio-class-booking-online-lessons.html': 'UTAGEヨガスタジオクラス予約・オンラインレッスン構築法'
};

// Get current article filename
function getCurrentArticleFilename() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename || 'index.html';
}

// Get article title by filename
function getArticleTitle(filename) {
    return articleTitles[filename] || filename.replace('.html', '').replace(/-/g, ' ');
}

// Get all article filenames
function getAllArticleFilenames() {
    return Object.keys(articleTitles);
}

// Get navigation links (previous/next)
function getNavigationLinks(currentFilename) {
    const allFiles = getAllArticleFilenames();
    const currentIndex = allFiles.indexOf(currentFilename);
    
    const result = {
        previous: null,
        next: null
    };
    
    if (currentIndex > 0) {
        result.previous = {
            filename: allFiles[currentIndex - 1],
            title: getArticleTitle(allFiles[currentIndex - 1])
        };
    }
    
    if (currentIndex < allFiles.length - 1) {
        result.next = {
            filename: allFiles[currentIndex + 1],
            title: getArticleTitle(allFiles[currentIndex + 1])
        };
    }
    
    return result;
}

// Initialize navigation for blog articles
function initBlogNavigation() {
    const currentFilename = getCurrentArticleFilename();
    const navigation = getNavigationLinks(currentFilename);
    
    // Update navigation elements if they exist
    const prevLink = document.querySelector('.myblog-nav-prev a');
    const nextLink = document.querySelector('.myblog-nav-next a');
    const prevTitle = document.querySelector('.myblog-nav-prev .myblog-nav-title');
    const nextTitle = document.querySelector('.myblog-nav-next .myblog-nav-title');
    
    if (prevLink && navigation.previous) {
        prevLink.href = navigation.previous.filename;
        if (prevTitle) prevTitle.textContent = navigation.previous.title;
    }
    
    if (nextLink && navigation.next) {
        nextLink.href = navigation.next.filename;
        if (nextTitle) nextTitle.textContent = navigation.next.title;
    }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogNavigation);
} else {
    initBlogNavigation();
}

/* === js/main.js === */
/*!
 * オートウェビナー大学 - メインスクリプト
 * 作成日: 2025年5月31日
 */

(function() {
  'use strict';
  
  /**
   * 共通コンポーネント管理クラス
   */
  class ComponentLoader {
    constructor() {
      this.loadSvgDefs();
    }
    
    /**
     * 全ての共通コンポーネントを読み込み
     */
    loadAll() {
      this.loadHeader();
      this.loadFooter();
    }
    
    /**
     * テンプレートファイルを読み込み、指定セレクタの要素に挿入
     */
    async loadComponent(templatePath, targetSelector, callback) {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;
      
      try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        targetElement.innerHTML = html;
        
        if (callback) callback();
      } catch (error) {
        console.error(`コンポーネントの読み込みに失敗しました: ${templatePath}`, error);
      }
    }
    
    /**
     * SVG定義を読み込み
     */
    loadSvgDefs() {
      const svgContainer = document.getElementById('svg-defs');
      if (svgContainer) return;
      
      const svgDiv = document.createElement('div');
      svgDiv.id = 'svg-defs';
      svgDiv.style.display = 'none';
      document.body.appendChild(svgDiv);
      
      this.loadComponent('/common/svg-defs.html', '#svg-defs');
    }
    
    /**
     * ヘッダーを読み込み
     */
    loadHeader() {
      // ヘッダーが既に存在する場合はスキップ
      if (document.querySelector('.site-header')) {
        this.initializeHamburgerMenu();
        this.setActiveNavItem();
        return;
      }
      
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (!headerPlaceholder) return;
      
      const path = this.isSubpage() ? '../common/header.html' : 'common/header.html';
      this.loadComponent(path, '#header-placeholder', () => {
        this.setActiveNavItem();
        this.initializeHamburgerMenu();
      });
    }
    
    /**
     * フッターを読み込み
     */
    loadFooter() {
      // フッターが既に存在する場合はスキップ
      if (document.querySelector('.site-footer')) return;
      
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (!footerPlaceholder) return;
      
      const path = this.isSubpage() ? '../common/footer.html' : 'common/footer.html';
      this.loadComponent(path, '#footer-placeholder');
    }
    
    /**
     * 現在のページがサブページかどうかを判定
     */
    isSubpage() {
      const path = window.location.pathname;
      return this.isSubpagePath(path);
    }
    
    /**
     * サブページかどうかを判定
     */
    isSubpagePath(path) {
      return path.includes('/blog/') || 
             path.includes('/tools/') ||
             path.includes('/achievement/') ||
             path.includes('/course/') ||
             path.includes('blog/') ||
             path.includes('tools/') ||
             path.includes('achievement/') ||
             path.includes('course/');
    }
    
    /**
     * アクティブなナビゲーションアイテムを設定
     */
    setActiveNavItem() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.global-nav a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('index.html', '').replace('.html', ''))) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
    
    /**
     * ヘッダー読み込み後のハンバーガーメニュー初期化
     */
    initializeHamburgerMenu() {
      if (window.siteManager) {
        window.siteManager.initHamburgerMenu();
      }
    }
  }
  
  /**
   * サイト全体の管理クラス
   */
  class SiteManager {
    constructor() {
      this.init();
    }
    
    /**
     * サイト初期化
     */
    init() {
      // 統合キャッシュシステムでキャッシュクリア
      if (window.cacheManager) {
        window.cacheManager.clearSiteCache();
      }
      
      this.componentLoader = new ComponentLoader();
      this.componentLoader.loadAll();
      
      this.initMainSite();
      
      console.log('🚀 サイト初期化完了');
    }
    
    /**
     * メインサイト機能の初期化
     */
    initMainSite() {
      this.initHamburgerMenu();
      this.initSmoothScroll();
      this.initFaq();
      this.initAnimations();
      this.initFooterEffects();
    }
    
    
    /**
     * ハンバーガーメニューの初期化
     */
    initHamburgerMenu() {
      const hamburgerBtn = document.querySelector('.hamburger-button');
      if (!hamburgerBtn) {
        console.warn('ハンバーガーボタンが見つかりません');
        return;
      }
      
      const body = document.body;
      let mobileMenu = document.querySelector('.mobile-menu');
      
      if (!mobileMenu) {
        try {
          mobileMenu = this.createMobileMenu();
        } catch (error) {
          console.error('モバイルメニューの作成に失敗しました:', error);
          return;
        }
      }
      
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        this.toggleMenu(!isOpen, mobileMenu, body, hamburgerBtn);
      });
      
      // メニュー外クリックで閉じる
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
      
      // ESCキーでメニューを閉じる
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
    }
    
    /**
     * メニューの開閉
     */
    toggleMenu(isOpen, mobileMenu, body, hamburgerBtn) {
      if (isOpen) {
        mobileMenu.classList.add('active');
        body.classList.add('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
      } else {
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
      }
    }
    
    /**
     * モバイルメニューの動的作成
     */
    createMobileMenu() {
      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      
      const nav = document.querySelector('.global-nav');
      if (nav) {
        const navClone = nav.cloneNode(true);
        mobileMenu.appendChild(navClone);
      }
      
      // CTAボタンは削除されたため、この部分をコメントアウト
      // const contactBtn = document.querySelector('.btn-contact');
      // if (contactBtn) {
      //   const ctaDiv = document.createElement('div');
      //   ctaDiv.className = 'mobile-cta';
      //   const btnClone = contactBtn.cloneNode(true);
      //   ctaDiv.appendChild(btnClone);
      //   mobileMenu.appendChild(ctaDiv);
      // }
      
      document.body.appendChild(mobileMenu);
      return mobileMenu;
    }
    
    /**
     * スムーススクロール初期化
     */
    initSmoothScroll() {
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href').substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
    
    /**
     * FAQ機能の初期化
     */
    initFaq() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          // 他のFAQを閉じる
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // 現在のFAQをトグル
          item.classList.toggle('active');
          
          // ARIA属性を更新
          question.setAttribute('aria-expanded', !isOpen);
        });
      });
    }
    
    /**
     * アニメーション初期化
     */
    initAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);
      
      // アニメーション対象要素を監視
      document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
        animationObserver.observe(el);
      });
    }
    
    /**
     * フッターエフェクト初期化
     */
    initFooterEffects() {
      const footer = document.querySelector('.site-footer');
      if (!footer) return;
      
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footer.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      footerObserver.observe(footer);
    }
  }
  
  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', () => {
    window.siteManager = new SiteManager();
  });
  
  // グローバルに公開
  window.SiteManager = SiteManager;
  window.ComponentLoader = ComponentLoader;
  
})();
