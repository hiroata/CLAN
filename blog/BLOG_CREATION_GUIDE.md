# ブログ記事作成ガイド

## 新規記事の自動登録システム

### 1. 記事ファイルの作成
1. `/blog/`フォルダに`article-記事名.html`の形式でファイルを作成
2. 既存記事（例：`article-utage-pricing.html`）をコピーしてベースとして使用

### 2. blog-manager.jsの更新
1. `/blog/blog-manager.js`を開く
2. `BLOG_ARTICLES`配列に新しい記事の情報を追加：
```javascript
{
  filename: 'article-新記事名.html',
  title: '記事のタイトル',
  excerpt: '記事の要約（150文字程度）',
  date: 'YYYY-MM-DD',
  category: 'marketing',
  tags: ['タグ1', 'タグ2', 'タグ3'],
  relatedArticles: ['関連記事1.html', '関連記事2.html', '関連記事3.html']
}
```

### 3. index.htmlの自動更新
1. `/blog/index.html`を開く
2. 記事一覧グリッド部分に新しい記事カードを日付順（新しい順）で追加
3. 記事カードのHTMLフォーマット：
```html
<article class="myblog-article-card" data-category="marketing" data-date="YYYY-MM-DD">
    <a href="article-新記事名.html" class="myblog-article-card-link">
        <div class="myblog-article-card-image myblog-auto-image" data-title="記事タイトル">
        </div>
        <div class="myblog-article-card-content">
            <div class="myblog-article-card-meta">
                <time class="myblog-article-card-date" datetime="YYYY-MM-DD">YYYY年M月D日</time>
                <div class="myblog-article-card-tags">
                    <span class="myblog-tag">タグ1</span>
                    <span class="myblog-tag">タグ2</span>
                </div>
            </div>
            <h2 class="myblog-article-card-title">記事タイトル</h2>
            <p class="myblog-article-card-excerpt">
                記事の要約文
            </p>
        </div>
    </a>
</article>
```

### 4. 関連記事の自動更新
新しい記事を追加したら、関連する既存記事の関連記事セクションも更新してください。
現在の関連記事設定：
- article-utage-pricing.html ↔ overview, free-trial, support
- article-utage-free-trial-guide.html ↔ overview, pricing, support  
- article-utage-support-guide.html ↔ overview, pricing, free-trial
- article-utage-vs-comparison.html ↔ overview, pricing, merits-demerits
- article-utage-merits-demerits.html ↔ overview, vs-comparison, reviews

## 重要な実装指針

### 1. ヘッダー・フッター統合（必須）

記事ページは`site-header`と`site-footer`を使用してメインサイトと統合する

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

<!-- フッター -->
<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-brand">
            <h2>CLAN</h2>
        </div>
        <div class="footer-links">
            <ul>
                <li><a href="https://utage-system.com/p/EcESO02xLLoK">無料相談</a></li>
                <li><a href="../achievement/index.html">お客様の声</a></li>
                <li><a href="../tools/index.html">まえゆきツール</a></li>
                <li><a href="../owner.html">運営者情報</a></li>
            </ul>
        </div>
    </div>
</footer>
```

### 2. サムネイル画像システム（重要）

`myblog-auto-image`システムを使用してタイトルベースの自動サムネイル生成

```html
<!-- メインアイキャッチ -->
<div class="myblog-featured-image">
    <div class="myblog-auto-image" data-title="記事のタイトル全文"></div>
</div>

<!-- 関連記事サムネイル -->
<div class="myblog-related-image myblog-auto-image" data-title="関連記事タイトル"></div>
```

**特徴:**
- JavaScriptが自動的に3行表示でタイトルを配置
- ランダムカラーのグラデーション背景を生成
- 自然な分割点（句読点、助詞）で改行
- `myblog-script.js`の読み込みが必須

### 3. プロフィール情報（必須）

著者情報は前田由紀子プロフィールを使用

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

### 4. 必須ファイル読み込み

```html
<head>
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="myblog-style.css">
    
    <!-- JavaScript -->
    <script src="../js/main.js" defer></script>
    <script src="myblog-script.js" defer></script>
</head>
```

### 5. 記事構造テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>記事タイトル | CLAN</title>
    <meta name="description" content="記事の説明文">
    <!-- 必須ファイル読み込み -->
</head>
<body class="myblog-body">
    <!-- site-header -->
    
    <main class="myblog-main">
        <div class="myblog-container">
            <!-- 戻るリンク -->
            <div class="myblog-back-link">
                <a href="../index.html" class="myblog-back-btn">ホームへ戻る</a>
            </div>

            <article class="myblog-article">
                <header class="myblog-article-header">
                    <!-- アイキャッチ画像 -->
                    <div class="myblog-featured-image">
                        <div class="myblog-auto-image" data-title="記事タイトル全文"></div>
                    </div>

                    <!-- メタ情報 -->
                    <div class="myblog-article-meta">
                        <time class="myblog-date" datetime="2025-06-05">2025年6月5日</time>
                        <div class="myblog-tags">
                            <span class="myblog-tag">タグ1</span>
                            <span class="myblog-tag">タグ2</span>
                        </div>
                    </div>

                    <h1 class="myblog-title">記事タイトル</h1>
                </header>

                <div class="myblog-content">
                    <!-- 記事本文 -->
                </div>

                <footer class="myblog-article-footer">
                    <!-- 著者プロフィール -->
                    <!-- 関連記事 -->
                </footer>
            </article>
        </div>
    </main>

    <!-- site-footer -->
</body>
</html>
```

### 6. 重要なCSSクラス

#### ハイライトボックス
```html
<div class="myblog-highlight-box">
    <h4>重要ポイント</h4>
    <p>強調したい内容</p>
</div>
```

#### 関連記事
```html
<div class="myblog-related">
    <h3 class="myblog-related-title">関連記事</h3>
    <div class="myblog-related-articles">
        <article class="myblog-related-card">
            <a href="../index.html" class="myblog-related-link">
                <div class="myblog-related-image myblog-auto-image" data-title="関連記事タイトル"></div>
                <div class="myblog-related-content">
                    <h4 class="myblog-related-card-title">関連記事タイトル</h4>
                    <time class="myblog-related-date">カテゴリ</time>
                </div>
            </a>
        </article>
    </div>
</div>
```

## 注意事項

1. **JavaScript重複読み込み禁止**: ヘッダーで`defer`読み込み後、フッターで再読み込みしない
2. **サムネイル重複防止**: `myblog-auto-image-processed`クラスで重複処理を防止
3. **パス指定**: 相対パス`../`を正しく使用
4. **メインサイト統合**: ナビゲーションリンクはメインサイトのページを指定

このガイドに従うことで、メインサイトと完全に統合された美しいブログ記事を作成できます。
