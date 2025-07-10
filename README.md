# CLAN - Web集客コンサルティング 公式サイト

株式会社CLANの公式ウェブサイトプロジェクトです。UTAGE構築代行サービスを中心に、Web集客コンサルティングサービスを提供しています。

## 📋 目次

- [プロジェクト概要](#-プロジェクト概要)
- [プロジェクト構造](#-プロジェクト構造)
- [主要機能](#-主要機能)
- [技術スタック](#-技術スタック)
- [開発環境セットアップ](#-開発環境セットアップ)
- [デプロイ設定](#-デプロイ設定)
- [ブログシステム](#-ブログシステム)
- [ツールセクション](#-ツールセクション)
- [コースセクション](#-コースセクション)
- [メンテナンス](#-メンテナンス)
- [SEO対策](#-seo対策)
- [トラブルシューティング](#-トラブルシューティング)

## 🎯 プロジェクト概要

CLANは、UTAGE構築代行を中心としたWeb集客コンサルティングサービスを提供する企業のコーポレートサイトです。

### 主な特徴

- **UTAGE構築代行サービス**: 月額30%のストック収入を実現する構築代行サービス
- **100記事以上のブログコンテンツ**: UTAGE活用に関する専門的な情報発信
- **便利なWebツール集**: 画像変換、計算機、色パレットなど実用的なツール提供
- **オンライン講座**: UTAGE構築代行養成講座の提供
- **レスポンシブデザイン**: PC、タブレット、スマートフォン完全対応
- **高速パフォーマンス**: Critical CSS、遅延読み込み、Service Worker実装

## 📁 プロジェクト構造

```
CLAN/
├── 📄 index.html                    # トップページ
├── 📄 owner.html                    # 運営者情報
├── 📄 partner.html                  # パートナーページ
├── 📄 seminar-request.html          # セミナー申込
├── 📄 privacy.html                  # プライバシーポリシー
├── 📄 terms.html                    # 利用規約
├── 📄 tokutei.html                  # 特定商取引法
│
├── 📁 blog/                         # ブログシステム
│   ├── 📄 index.html               # ブログ一覧
│   ├── 📄 article-utage-*.html     # 個別記事（100記事以上）
│   ├── 📄 myblog-style.css         # ブログ専用CSS
│   ├── 📄 myblog-script.js         # ブログ専用JS
│   ├── 📄 blog-manager.js          # ブログ管理機能
│   └── 📄 README.md                # ブログシステムドキュメント
│
├── 📁 courses/                      # オンライン講座
│   ├── 📄 utage-master-course.html # UTAGE構築代行養成講座
│   └── 📄 utage-master-course-old.html # バックアップ
│
├── 📁 tools/                        # Webツール集
│   ├── 📄 index.html               # ツール一覧
│   ├── 📄 calc.html                # 電卓
│   ├── 📄 color-palette.html      # カラーパレット
│   ├── 📄 image-resize.html       # 画像リサイズ
│   ├── 📄 letters-counter.html    # 文字数カウンター
│   ├── 📄 meme-generator.html     # ミーム生成
│   ├── 📄 png-jpeg-to-webp.html   # WebP変換
│   ├── 📄 png-to-jpeg.html        # PNG→JPEG変換
│   ├── 📄 wareki-seireki.html     # 和暦西暦変換
│   └── 📄 image-worker.js          # 画像処理ワーカー
│
├── 📁 achievement/                  # 実績・事例
│   ├── 📄 index.html               # 実績一覧
│   ├── 📄 customer1-5.html        # 顧客事例1-5
│   └── 📄 achievement.js           # 実績ページJS
│
├── 📁 assets/                       # 静的アセット
│   └── 📁 images/                  # 画像ファイル（WebP形式）
│
├── 📁 css/                          # スタイルシート
│   ├── 📄 style.css                # メインCSS
│   ├── 📄 combined.css             # 統合CSS
│   ├── 📄 combined.min.css         # 統合CSS（圧縮版）
│   ├── 📄 critical.css             # クリティカルCSS
│   ├── 📄 common-variables.css     # CSS変数定義
│   ├── 📄 common-hamburger.css     # ハンバーガーメニュー
│   └── 📄 footer-hover.css         # フッターホバー効果
│
├── 📁 js/                           # JavaScript
│   ├── 📄 main.js                  # メインJS
│   ├── 📄 combined.js              # 統合JS
│   ├── 📄 combined.min.js          # 統合JS（圧縮版）
│   ├── 📄 blog-navigation.js       # ブログナビゲーション
│   ├── 📄 common-cache.js          # キャッシュ管理
│   ├── 📄 common-init.js           # 共通初期化
│   └── 📄 common-lazy-loading.js   # 遅延読み込み
│
├── 📁 .github/                      # GitHub設定
│   └── 📁 workflows/
│       └── 📄 deploy.yml           # 自動デプロイ設定
│
├── 📄 .htaccess                     # Apache設定
├── 📄 robots.txt                    # SEO: クローラー設定
├── 📄 sitemap.xml                   # SEO: サイトマップ
├── 📄 service-worker.js             # PWA: Service Worker
├── 📄 related-articles-mapping.json # ブログ記事関連付け
└── 📄 analysis-report.json          # プロジェクト分析データ
```

## 🚀 主要機能

### 1. ブログシステム
- 100記事以上のUTAGE関連コンテンツ
- 記事間の自動ナビゲーション
- 読了時間表示
- 目次自動生成
- 関連記事表示
- レスポンシブデザイン

### 2. Webツール集
- **画像処理**: リサイズ、形式変換（PNG/JPEG/WebP）
- **計算機**: 高機能電卓
- **デザイン**: カラーパレット生成
- **テキスト**: 文字数カウンター
- **変換**: 和暦西暦変換
- **エンタメ**: ミーム生成

### 3. オンライン講座
- UTAGE構築代行養成講座
- 14時間56分の動画コンテンツ
- 124本のレクチャー
- 修了証明書発行

### 4. 実績・事例
- 5つの詳細な顧客成功事例
- ビフォーアフター比較
- 具体的な数値での成果表示

## 🛠 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: モダンレイアウト（Grid, Flexbox）
- **JavaScript**: ES6+、Web Workers API
- **Web APIs**: Service Worker, Cache API, Intersection Observer

### パフォーマンス最適化
- **Critical CSS**: ファーストビューの高速化
- **遅延読み込み**: 画像・コンテンツの段階的読み込み
- **圧縮**: CSS/JSのミニファイ
- **キャッシュ戦略**: Service Workerによるオフライン対応

### SEO対策
- **構造化データ**: Schema.org対応
- **メタタグ最適化**: OGP、Twitter Card対応
- **XMLサイトマップ**: 自動生成
- **robots.txt**: クローラー制御

## 💻 開発環境セットアップ

### 必要な環境
- Git
- 現代的なブラウザ（Chrome, Firefox, Safari, Edge）
- テキストエディタ（VSCode推奨）
- ローカルWebサーバー（Live Server等）

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-username/CLAN.git

# 2. プロジェクトディレクトリに移動
cd CLAN

# 3. VSCodeで開く（VSCodeの場合）
code .

# 4. Live Serverで起動（VSCode拡張機能）
# index.htmlを右クリック → "Open with Live Server"
```

## 🚀 デプロイ設定

### GitHub Actions自動デプロイ

このプロジェクトはGitHub Actionsを使用してロリポップサーバーに自動デプロイされます。

### 必要なGitHub Secrets

| Secret名 | 必須 | 説明 | 例 |
|---------|------|------|-----|
| `FTP_SERVER` | ✅ | FTPサーバー名 | `ftpXXX.lolipop.jp` |
| `FTP_USERNAME` | ✅ | FTPアカウント名 | `lolipop.jp-XXXXXX` |
| `FTP_PASSWORD` | ✅ | FTPパスワード | `your_password` |
| `REMOTE_DIR` | ✅ | アップロード先 | `public_html/` |
| `FTP_PORT` | ❌ | SFTPポート | `22` |

### デプロイフロー

1. `master`ブランチにプッシュ
2. GitHub Actionsが自動実行
3. ロリポップサーバーにFTPアップロード
4. サイト更新完了

## 📝 ブログシステム

### 新規記事作成

1. `/blog/`ディレクトリに新規HTMLファイルを作成
2. ファイル名規則: `article-utage-[記事トピック].html`
3. 既存記事をテンプレートとして使用

### 記事作成ガイドライン

```html
<!-- 必須構造 -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <title>記事タイトル | CLAN</title>
    <meta name="description" content="記事の説明">
    <link rel="stylesheet" href="myblog-style.css">
    <script src="myblog-script.js" defer></script>
</head>
<body>
    <!-- ヘッダー、記事本文、関連記事、フッター -->
</body>
</html>
```

詳細は `/blog/BLOG_CREATION_GUIDE.md` を参照してください。

## 🔧 ツールセクション

### 新規ツール追加

1. `/tools/`ディレクトリに新規HTMLファイルを作成
2. 共通のデザインシステムに従う
3. `/tools/index.html`にリンクを追加

### ツール開発ガイドライン

- クライアントサイドで完結する実装
- プログレッシブエンハンスメント対応
- エラーハンドリングの実装
- レスポンシブデザイン必須

## 🎓 コースセクション

### コースページ管理

- `/courses/`ディレクトリで管理
- Udemy風のデザインシステム採用
- 動画コンテンツの埋め込み対応
- 進捗管理機能

## 🛠 メンテナンス

### 定期メンテナンススクリプト

```bash
# リンクチェック
node check-all-links.js

# 画像最適化
node optimize-assets.js

# サイトマップ生成
node generate-sitemap.js

# メタ情報最適化
node optimize-meta-descriptions.js
```

### コード品質管理

- ESLint設定（今後追加予定）
- Prettier設定（今後追加予定）
- コミット規約: Conventional Commits

## 📊 SEO対策

### 実装済みのSEO施策

1. **技術的SEO**
   - XMLサイトマップ自動生成
   - robots.txt最適化
   - 構造化データマークアップ
   - canonical URL設定

2. **コンテンツSEO**
   - 100記事以上の専門コンテンツ
   - 内部リンク最適化
   - メタディスクリプション最適化
   - 見出し構造の適正化

3. **パフォーマンスSEO**
   - Core Web Vitals対応
   - 画像の遅延読み込み
   - Critical CSS実装
   - CDN活用（今後予定）

詳細は `SEO_IMPLEMENTATION_GUIDE.md` を参照してください。

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### デプロイエラー
- GitHub Secretsの設定値を確認
- FTP接続情報の正確性を確認
- サーバーのディスク容量を確認

#### 表示崩れ
- ブラウザキャッシュをクリア
- CSS/JSファイルの読み込み順序確認
- コンソールエラーを確認

#### パフォーマンス問題
- 画像サイズの最適化
- 不要なJavaScriptの削除
- Critical CSSの再生成

## 📞 サポート

- **技術的な質問**: GitHubのIssuesで報告
- **ビジネスに関する問い合わせ**: サイト内のお問い合わせフォームから

## 📄 ライセンス

このプロジェクトは株式会社CLANの所有物です。無断での複製・転載を禁じます。

---

最終更新日: 2025年1月