/**
 * 完全キャッシュクリアスクリプト
 * 統合キャッシュシステムを使用してすべてのキャッシュをクリア
 */

// Node.js環境での実行用
if (typeof window === 'undefined') {
  console.log('🧹 サーバーサイドでのキャッシュクリア実行');
  
  // 開発者向けの指示を出力
  console.log(`
  📋 完全キャッシュクリア手順:
  
  1. ブラウザでサイトを開く
  2. 開発者ツール（F12）を開く
  3. コンソールタブに移動
  4. 以下のコマンドを実行:
  
     // 統合キャッシュシステムでの完全クリア
     if (window.cacheManager) {
       window.cacheManager.hardReload('site');
     } else {
       // 手動でのキャッシュクリア
       sessionStorage.clear();
       localStorage.clear();
       if ('caches' in window) {
         caches.keys().then(names => 
           Promise.all(names.map(name => caches.delete(name)))
         ).then(() => window.location.reload(true));
       } else {
         window.location.reload(true);
       }
     }
  
  5. または、以下の簡単なコマンド:
     window.clearSiteCache();
  
  🎯 対象キャッシュ:
  - sessionStorage (全て)
  - localStorage (全て)
  - Service Worker キャッシュ
  - ブラウザキャッシュ
  - インメモリキャッシュ
  `);
  
  process.exit(0);
}

// ブラウザ環境での実行
(function() {
  'use strict';
  
  console.log('🧹 完全キャッシュクリア開始...');
  
  // 統合キャッシュシステムが利用可能な場合
  if (typeof window.cacheManager !== 'undefined') {
    console.log('✅ 統合キャッシュシステムを使用');
    window.cacheManager.hardReload('site');
    return;
  }
  
  // フォールバック: 手動でのキャッシュクリア
  console.log('⚠️ 統合システム未検出 - 手動クリアを実行');
  
  // 1. sessionStorage クリア
  try {
    sessionStorage.clear();
    console.log('✅ sessionStorage クリア完了');
  } catch (error) {
    console.error('❌ sessionStorage クリア失敗:', error);
  }
  
  // 2. localStorage クリア
  try {
    localStorage.clear();
    console.log('✅ localStorage クリア完了');
  } catch (error) {
    console.error('❌ localStorage クリア失敗:', error);
  }
  
  // 3. Service Worker キャッシュクリア
  if ('caches' in window) {
    caches.keys().then(function(names) {
      return Promise.all(names.map(name => caches.delete(name)));
    }).then(function() {
      console.log('✅ Service Worker キャッシュクリア完了');
      
      // 4. ハードリロード
      console.log('🔄 ページリロード実行...');
      try {
        window.location.reload(true);
      } catch (error) {
        window.location.reload();
      }
    }).catch(function(error) {
      console.error('❌ Service Worker キャッシュクリア失敗:', error);
      window.location.reload();
    });
  } else {
    console.log('⚠️ Cache API はサポートされていません');
    window.location.reload();
  }
})();