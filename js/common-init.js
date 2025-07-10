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