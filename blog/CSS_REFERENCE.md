# ブログデザインシステム CSSクラス リファレンス

## 重要な実装ガイド

### ヘッダー・フッター統合
**必須**: 記事ページは`site-header`と`site-footer`を使用してメインサイトと統合
```html
<!-- ヘッダー -->
<header class="site-header">
    <div class="header-container">
        <div class="site-logo-text">
            <a href="../index.html">CLAN</a>
        </div>
        <nav class="global-nav pc-nav">
            <ul>
                <li><a href="../index.html">ホーム</a></li>
                <li><a href="../achievement/index.html">お客様の声</a></li>
                <li><a href="../tools/index.html">まえゆきツール</a></li>
            </ul>
        </nav>
        <div class="header-cta">
            <a href="https://utage-system.com/p/EcESO02xLLoK" class="btn-contact">無料相談</a>
        </div>
    </div>
</header>
```

### サムネイル画像システム
**重要**: `myblog-auto-image`システムを使用してタイトルベースの自動サムネイル生成
```html
<div class="myblog-featured-image">
    <div class="myblog-auto-image" data-title="記事のタイトル全文"></div>
</div>
```
- JavaScriptが自動的に3行表示でタイトルを配置
- ランダムカラーのグラデーション背景を生成
- `myblog-script.js`の読み込みが必須

### プロフィール情報
**著者情報**: 前田由紀子プロフィールを使用
```html
<div class="myblog-author">
    <div class="myblog-author-avatar">
        <img src="../assets/images/profile-owner.webp" alt="前田由紀子 プロフィール写真">
    </div>
    <div class="myblog-author-info">
        <h4 class="myblog-author-name">前田 由紀子</h4>
        <p class="myblog-author-bio">
            Web集客コンサルタント・株式会社CLAN代表取締役。中小企業のマーケティング自動化とオンライン集客の支援を専門とし、自動化マーケティングによる売上改善事例300件以上の実績を持つ。
        </p>
    </div>
</div>
```

### 必須ファイル読み込み
```html
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="myblog-style.css">
<script src="../js/main.js" defer></script>
<script src="myblog-script.js" defer></script>
```

## 基本構造クラス

### レイアウト
- `myblog-body` - bodyタグに必須
- `myblog-main` - メインコンテンツラッパー
- `myblog-container` - コンテンツ幅制限コンテナ

### ヘッダー
- `myblog-header` - ヘッダー全体
- `myblog-header-container` - ヘッダー内コンテナ
- `myblog-header-left` - ロゴ・ハンバーガーメニュー部分
- `myblog-header-right` - 検索・SNS部分
- `myblog-logo` - ロゴ部分
- `myblog-logo-link` - ロゴリンク

### ナビゲーション
- `myblog-nav` - メインナビゲーション
- `myblog-nav-list` - ナビゲーションリスト
- `myblog-nav-item` - ナビゲーション項目
- `myblog-nav-link` - ナビゲーションリンク

### ハンバーガーメニュー
- `myblog-hamburger` - ハンバーガーボタン
- `myblog-search-btn` - 検索ボタン
- `myblog-social-links` - SNSリンクコンテナ
- `myblog-social-link` - 個別SNSリンク

## 記事構造クラス

### 記事全体
- `myblog-article` - 記事コンテナ

### 記事ヘッダー
- `myblog-article-header` - 記事ヘッダー部分
- `myblog-featured-image` - アイキャッチ画像
- `myblog-auto-image` - 自動生成画像（data-title属性必須）
- `myblog-article-meta` - メタ情報（日付・タグ）
- `myblog-date` - 日付表示
- `myblog-tags` - タグコンテナ
- `myblog-tag` - 個別タグ
- `myblog-article-title` - 記事タイトル
- `myblog-article-summary` - 記事概要

### 戻るリンク
- `myblog-back-link` - 戻るリンクコンテナ
- `myblog-back-btn` - 戻るボタン

### 目次
- `myblog-toc-wrapper` - 目次ラッパー
- `myblog-toc` - 目次本体
- `myblog-toc-header` - 目次ヘッダー
- `myblog-toc-title` - 目次タイトル
- `myblog-toc-toggle` - 目次開閉ボタン
- `myblog-toc-list` - 目次リスト
- `myblog-toc-link` - 目次リンク

## コンテンツ要素クラス

### 本文
- `myblog-content` - 記事本文コンテナ

### 特殊要素

#### ハイライトボックス
```css
.myblog-highlight-box {
    background: linear-gradient(135deg, #fff8f0 0%, #fff0e6 100%);
    border: 2px solid #ffa726;
    border-radius: 16px;
    padding: 2.5rem;
    margin: 3rem 0;
}
```

使用例：
```html
<div class="myblog-highlight-box">
    <h3>重要なポイント</h3>
    <ul>
        <li><strong>ポイント1</strong>：説明</li>
    </ul>
</div>
```

#### ランキング要素
```css
.myblog-ranking-item {
    background: white;
    border-radius: 12px;
    padding: 30px;
    margin: 30px 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    position: relative;
}
```

ランキングバッジ：
- `myblog-rank-badge` - バッジベース
- `myblog-rank-1` - 1位（ゴールド）
- `myblog-rank-2` - 2位（シルバー）
- `myblog-rank-3` - 3位（ブロンズ）

#### プロス・コンス
- `myblog-pros-cons` - プロス・コンスコンテナ
- `myblog-pros` - メリット部分
- `myblog-cons` - デメリット部分

使用例：
```html
<div class="myblog-pros-cons">
    <div class="myblog-pros">
        <h4>👍 おすすめポイント</h4>
        <ul>
            <li>メリット1</li>
        </ul>
    </div>
    <div class="myblog-cons">
        <h4>👎 注意点</h4>
        <ul>
            <li>デメリット1</li>
        </ul>
    </div>
</div>
```

#### 引用
- `myblog-quote` - 引用ブロック

#### クイズセクション
- `myblog-quiz-section` - クイズ全体
- `myblog-quiz-question` - 質問部分
- `myblog-quiz-options` - 選択肢リスト
- `myblog-quiz-answer` - 答え部分

## 記事フッタークラス

### 著者プロフィール
- `myblog-article-footer` - フッター全体
- `myblog-author-profile` - 著者プロフィール
- `myblog-author-avatar` - アバター画像
- `myblog-author-placeholder` - アバタープレースホルダー
- `myblog-author-info` - 著者情報
- `myblog-author-name` - 著者名
- `myblog-author-bio` - 著者紹介

### 関連記事
- `myblog-related-articles` - 関連記事セクション
- `myblog-related-title` - 関連記事タイトル
- `myblog-related-grid` - 関連記事グリッド
- `myblog-related-card` - 関連記事カード
- `myblog-related-image` - 関連記事画像
- `myblog-related-card-title` - 関連記事タイトル

## 記事一覧ページクラス

### ページヘッダー
- `myblog-page-header` - ページヘッダー
- `myblog-page-title` - ページタイトル
- `myblog-page-description` - ページ説明

### フィルター・検索
- `myblog-filter-bar` - フィルターバー
- `myblog-filter-section` - フィルターセクション
- `myblog-filter-label` - フィルターラベル
- `myblog-filter-select` - フィルターセレクト

### 記事グリッド
- `myblog-articles-grid` - 記事グリッド
- `myblog-article-card` - 記事カード
- `myblog-article-card-link` - 記事カードリンク
- `myblog-article-card-image` - 記事カード画像
- `myblog-article-card-content` - 記事カードコンテンツ
- `myblog-article-card-meta` - 記事カードメタ情報
- `myblog-article-card-date` - 記事カード日付
- `myblog-article-card-tags` - 記事カードタグ
- `myblog-article-card-title` - 記事カードタイトル
- `myblog-article-card-excerpt` - 記事カード抜粋

## 自動画像生成システム

### 基本クラス
- `myblog-auto-image` - 自動画像生成ベース

### 必須属性
- `data-title="記事タイトル"` - 画像生成用テキスト

### 使用例
```html
<!-- アイキャッチ画像 -->
<div class="myblog-featured-image myblog-auto-image" data-title="記事タイトル">
</div>

<!-- 記事カード画像 -->
<div class="myblog-article-card-image myblog-auto-image" data-title="記事タイトル">
</div>

<!-- 関連記事画像 -->
<div class="myblog-related-image myblog-auto-image" data-title="関連記事タイトル">
</div>
```

## CSS変数（カスタムプロパティ）

### カラーパレット
```css
:root {
  --myblog-bg-color: #f8f9fa;
  --myblog-content-bg: #ffffff;
  --myblog-text-color: #212529;
  --myblog-text-light: #6c757d;
  --myblog-accent-color: #3f51b5;
  --myblog-accent-light: #7986cb;
  --myblog-border-color: #dee2e6;
}
```

### スペーシング
```css
:root {
  --myblog-spacing-xs: 0.25rem;
  --myblog-spacing-sm: 0.5rem;
  --myblog-spacing-md: 1rem;
  --myblog-spacing-lg: 1.5rem;
  --myblog-spacing-xl: 2rem;
  --myblog-spacing-xxl: 3rem;
}
```

### その他
```css
:root {
  --myblog-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --myblog-shadow-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
  --myblog-border-radius: 8px;
  --myblog-transition: all 0.3s ease;
}
```

## レスポンシブブレークポイント

```css
:root {
  --myblog-breakpoint-sm: 576px;
  --myblog-breakpoint-md: 768px;
  --myblog-breakpoint-lg: 992px;
  --myblog-breakpoint-xl: 1200px;
}
```

## 使用上の注意点

### 必須要素
1. `myblog-body` クラスをbodyタグに必ず付与
2. 自動画像要素には`data-title`属性を必ず設定
3. 日付要素には`datetime`属性とテキストの両方を設定

### 推奨事項
1. ハイライトボックスは記事あたり2-3個程度
2. ランキング要素は比較記事で使用
3. クイズは長い記事の中間で読者の関心を引くために使用
4. 目次は3個以上のH2見出しがある場合に設置

### パフォーマンス
- 画像の自動生成はCSS Generatedコンテンツで実装
- トランジションは統一された変数を使用
- レスポンシブ対応は自動的に適用

このリファレンスを参照することで、ブログデザインシステムのすべての要素を正しく活用できます。
