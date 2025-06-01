/**
 * 重複インクルード防止スクリプト
 * まえゆきツール - 共通コンポーネントの重複読み込み防止
 */

(function() {
    'use strict';
    
    // 既にインクルードされたコンポーネントを記録
    if (!window.includedComponents) {
        window.includedComponents = new Set();
    }
    
    // インクルード防止機能
    window.preventDuplicateInclude = function(componentName) {
        if (window.includedComponents.has(componentName)) {
            return true; // 既にインクルード済み
        }
        window.includedComponents.add(componentName);
        return false; // 初回インクルード
    };
    
    // グローバル変数の重複定義防止
    window.safeDefine = function(name, value) {
        if (typeof window[name] === 'undefined') {
            window[name] = value;
        }
        return window[name];
    };
    
    console.log('重複インクルード防止機能が初期化されました');
})();
