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