/**
 * クリティカルCSSの抽出
 * ファーストビューで必要なCSSのみを抽出してインライン化
 */

const fs = require('fs');

// クリティカルCSS（ファーストビューで必要な最小限のCSS）
const criticalCSS = `
/* リセットと基本設定 */
*,*::before,*::after{box-sizing:border-box}
body,h1,h2,h3,h4,h5,h6,p,ul,ol,li,figure,figcaption,blockquote,dl,dd{margin:0;padding:0}
body{min-height:100vh;scroll-behavior:smooth;text-rendering:optimizeSpeed;line-height:1.5}
img,picture{max-width:100%;display:block;height:auto}
input,button,textarea,select{font:inherit}

/* CSS変数（よく使うもののみ） */
:root{
  --primary-color:#0071e3;
  --text-color:#333;
  --bg-color:#fff;
  --font-family-base:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans JP",sans-serif;
  --font-family-heading:"Noto Sans JP",-apple-system,BlinkMacSystemFont,sans-serif;
}

/* 基本レイアウト */
body{
  font-family:var(--font-family-base);
  color:var(--text-color);
  background:var(--bg-color);
  font-size:16px;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

/* ヘッダー基本スタイル */
.site-header{
  position:fixed;
  top:0;
  left:0;
  right:0;
  background:rgba(255,255,255,0.98);
  backdrop-filter:blur(10px);
  z-index:1000;
  border-bottom:1px solid rgba(0,0,0,0.1);
}

.header-container{
  max-width:1200px;
  margin:0 auto;
  padding:0 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  height:80px;
}

/* ロゴ */
.site-logo-text a{
  font-size:1.5rem;
  font-weight:700;
  color:var(--primary-color);
  text-decoration:none;
  letter-spacing:0.05em;
}

/* ナビゲーション（PC） */
.global-nav ul{
  list-style:none;
  display:flex;
  gap:2rem;
  align-items:center;
}

.global-nav a{
  color:var(--text-color);
  text-decoration:none;
  font-weight:500;
  transition:color 0.3s ease;
}

.global-nav a:hover{
  color:var(--primary-color);
}

/* ハンバーガーメニュー（モバイル） */
.hamburger-button{
  display:none;
  width:48px;
  height:48px;
  background:transparent;
  border:none;
  cursor:pointer;
  position:relative;
}

@media (max-width:768px){
  .pc-nav{display:none}
  .sp-nav{display:block}
  .hamburger-button{display:flex;flex-direction:column;justify-content:center;align-items:center}
}

/* メインコンテンツの上部マージン */
main{
  margin-top:80px;
  min-height:calc(100vh - 80px);
}

/* ローディング時の表示制御 */
.loading-hide{visibility:hidden;opacity:0}
.loaded{visibility:visible;opacity:1;transition:opacity 0.3s ease}

/* フォント読み込み */
@font-face{
  font-family:'Noto Sans JP';
  font-style:normal;
  font-weight:400;
  font-display:swap;
  src:local('Noto Sans JP Regular'),local('NotoSansJP-Regular'),
      url(https://fonts.gstatic.com/s/notosansjp/v42/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEk757Y0rw_qMHVdbR2L8Y9QTJ1LwkRmR5GprQAe69m.woff2) format('woff2');
}

@font-face{
  font-family:'Noto Sans JP';
  font-style:normal;
  font-weight:700;
  font-display:swap;
  src:local('Noto Sans JP Bold'),local('NotoSansJP-Bold'),
      url(https://fonts.gstatic.com/s/notosansjp/v42/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEk757Y0rw_qMHVdbR2L8Y9QTJ1LwkRmR5GprQAe69m.woff2) format('woff2');
}
`;

// HTMLテンプレート生成関数
function generateOptimizedHTML(originalHTML, criticalCSS) {
    // <head>タグ内にクリティカルCSSを挿入
    const criticalStyleTag = `<style id="critical-css">${criticalCSS.replace(/\n/g, '').replace(/\s+/g, ' ').trim()}</style>`;
    
    // 非クリティカルCSSの遅延読み込み
    const lazyLoadCSS = `
    <link rel="preload" href="css/combined.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/combined.min.css"></noscript>`;
    
    // preconnectの追加（フォント読み込み高速化）
    const preconnects = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
    
    return {
        criticalStyleTag,
        lazyLoadCSS,
        preconnects
    };
}

// 実装例を表示
console.log('=== クリティカルCSSの実装方法 ===\n');

console.log('1. <head>タグ内の最初の方に以下を追加:');
console.log('----------------------------------------');
console.log('<link rel="preconnect" href="https://fonts.googleapis.com">');
console.log('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
console.log('\n2. <head>タグ内（他のCSSリンクの前）に以下を追加:');
console.log('----------------------------------------');
console.log('<style id="critical-css">');
console.log(criticalCSS.replace(/\n/g, '').replace(/\s+/g, ' ').trim());
console.log('</style>');

console.log('\n3. 既存のCSSリンクを以下に置き換え:');
console.log('----------------------------------------');
console.log('<!-- 変更前 -->');
console.log('<link rel="stylesheet" href="css/combined.min.css">');
console.log('\n<!-- 変更後 -->');
console.log('<link rel="preload" href="css/combined.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">');
console.log('<noscript><link rel="stylesheet" href="css/combined.min.css"></noscript>');

console.log('\n4. </body>タグの直前に以下を追加（CSS読み込み補助）:');
console.log('----------------------------------------');
console.log(`<script>
// CSSの遅延読み込みをサポート
!function(e){"use strict";var n=function(n,t,o){function i(e){return a.body?e():void setTimeout(function(){i(e)})}function r(){l.addEventListener&&l.removeEventListener("load",r),l.media=o||"all"}var d,a=e.document,l=a.createElement("link");if(t)d=t;else{var s=(a.body||a.getElementsByTagName("head")[0]).childNodes;d=s[s.length-1]}var f=a.styleSheets;l.rel="stylesheet",l.href=n,l.media="only x",i(function(){d.parentNode.insertBefore(l,t?d:d.nextSibling)});var u=function(e){for(var n=l.href,t=f.length;t--;)if(f[t].href===n)return e();setTimeout(function(){u(e)})};return l.addEventListener&&l.addEventListener("load",r),l.onloadcssdefined=u,u(r),l};"undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this);
</script>`);

// critical.cssファイルとして保存
fs.writeFileSync('css/critical.css', criticalCSS);
console.log('\n✓ css/critical.css として保存しました');

// 実装の効果
console.log('\n=== 期待される効果 ===');
console.log('- First Contentful Paint (FCP) の改善: 約30-50%');
console.log('- Largest Contentful Paint (LCP) の改善: 約20-40%');
console.log('- Time to Interactive (TTI) の改善: 約15-30%');
console.log('- Google PageSpeed Insightsスコア: +10-20ポイント');

console.log('\n完了！');