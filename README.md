# オートウェビナー大学 公式サイト

このプロジェクトは、オートウェビナー大学の公式サイトのソースコードです。

## 🚀 デプロイ設定

このプロジェクトは GitHub Actions を使用してロリポップサーバーに自動デプロイされます。

### 必要な GitHub Secrets

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のSecretsを設定してください：

| Secret名 | 必須 | 説明 | 例 |
|---------|------|------|-----|
| `FTP_SERVER` | ✅ | ロリポップのFTPサーバー名 | `ftpXXX.lolipop.jp` |
| `FTP_USERNAME` | ✅ | FTPアカウント名 | `lolipop.jp-XXXXXX` |
| `FTP_PASSWORD` | ✅ | FTPパスワード | `your_password` |
| `REMOTE_DIR` | ✅ | アップロード先ディレクトリ | `public_html/` |
| `FTP_PORT` | ❌ | SFTPポート（デフォルト: 22） | `22` |

**重要**: パスワードは絶対にコードやドキュメントに直接記載せず、GitHub Secretsで管理してください。

### GitHub Secrets設定手順

1. **ロリポップの情報を確認**
   - [ロリポップ！ユーザー専用ページ](https://user.lolipop.jp/)にログイン
   - 「サーバーの管理・設定」→「FTP・WebDAV設定」で情報を確認

2. **GitHubでSecretsを設定**
   - リポジトリページで「Settings」→「Secrets and variables」→「Actions」
   - 「New repository secret」で各Secretを追加

### デプロイフロー

1. `master` ブランチにプッシュ
2. GitHub Actions が自動実行
3. ロリポップサーバーにFTP経由でファイルアップロード
4. サイト更新完了

### トラブルシューティング

- **「Input required and not supplied: server」エラー**: GitHub Secretsが未設定
- **FTP接続エラー**: サーバー情報・認証情報を再確認

## 📁 プロジェクト構造

```
newsite/
├── index.html              # トップページ
├── achievement/            # 実績・事例ページ
│   ├── index.html         # 実績一覧
│   ├── customer1.html     # 顧客事例1
│   ├── customer2.html     # 顧客事例2
│   ├── customer3.html     # 顧客事例3
│   ├── customer4.html     # 顧客事例4
│   ├── customer5.html     # 顧客事例5
│   └── achievement.js     # 実績ページのJS
├── assets/                # 静的アセット
│   └── images/           # 画像ファイル
├── css/                   # スタイルシート
│   └── style.css
├── js/                    # JavaScript
│   └── main.js
├── owner.html             # 運営者情報
├── privacy.html           # プライバシーポリシー
├── terms.html            # 利用規約
├── tokutei.html          # 特定商取引法
├── robots.txt            # SEO設定
├── service-worker.js     # PWA設定
└── .htaccess            # Apache設定
```

## 🛠 開発環境セットアップ

### 必要な環境
- Git
- VSCode（推奨）
- 現代的なブラウザ

### ローカル開発
1. リポジトリをクローン
2. `index.html` をブラウザで開く
3. ファイルを編集
4. 変更をコミット・プッシュ

## 📊 自動デプロイの確認方法

1. **GitHub Actions確認**: リポジトリの「Actions」タブでワークフロー実行状況を確認
2. **サーバー確認**: FTPクライアントでファイルがアップロードされているか確認
3. **サイト確認**: 実際のURLにアクセスして表示を確認

## 🔧 トラブルシューティング

### デプロイエラーの場合
1. GitHub Secretsの設定値を確認
2. ロリポップのFTP情報が正しいか確認
3. ディスク容量やアクセス権限を確認

### サイト表示エラーの場合
1. ファイルパスの確認（相対パス推奨）
2. .htaccessの設定確認
3. ブラウザの開発者ツールでエラー確認

## 📝 更新手順

```bash
# ファイルを編集
git add .
git commit -m "feat: サイト内容を更新"
git push origin master
```

プッシュ後、自動的にデプロイが開始されます。

## 📝 ブログシステム

### 概要

既存のウェブサイトに組み込むことができる、汎用性の高いブログテンプレートです。
HTML、CSS、JavaScriptのみを使用し、外部ライブラリには依存しません。

### 特徴

- **シンプルで洗練されたデザイン**: コンテンツが主役となるクリーンなライトテーマ
- **完全レスポンシブ**: PC、タブレット、スマートフォンに対応
- **1カラムレイアウト**: どのデバイスでも一貫した表示
- **アクセシビリティ対応**: セマンティックHTMLとキーボードナビゲーション
- **既存サイトとの親和性**: CSSクラス名に`myblog-`プレフィックス付きで干渉を防止

### ブログファイル構成

```text
blog/
├── article.html          # 記事詳細ページ
├── index.html           # 記事一覧ページ
├── myblog-style.css     # CSSスタイルシート
├── myblog-script.js     # JavaScript
├── article-*.html       # 個別記事ファイル
└── AI_*.md             # AI用ドキュメント（削除予定）
```

### AI記事作成用プロンプト（推奨）

```text
既存のブログデザインシステムに準拠した記事を作成してください。

**記事タイトル**: 「[ここにタイトル]」

**必須要件**:
- 完全なHTMLファイルとして出力
- myblog-style.cssを使用
- 以下の構造を必ず含める：
  * ヘッダーナビゲーション（CLANBIZ Blog）
  * アイキャッチ画像（自動生成）
  * メタ情報（日付、タグ）
  * 目次
  * 記事本文
  * 著者プロフィール
  * 関連記事セクション

**コンテンツ要件**:
- 文字数：2500-3500文字
- 見出し構造：H2を3-5個使用
- 目次：全H2見出しを含める
- タグ：内容に応じて2-3個
- ハイライトボックス：重要ポイントで使用
- 画像：data-title属性で自動生成
- 日付：今日の日付（2025-06-04）
```

### 主要CSSクラス（myblog-プレフィックス）

- レイアウト: `myblog-body`, `myblog-main`, `myblog-container`
- ヘッダー: `myblog-header`, `myblog-logo`, `myblog-nav`
- 記事: `myblog-article`, `myblog-article-header`, `myblog-article-content`
- UI要素: `myblog-btn`, `myblog-card`, `myblog-highlight-box`

## 🛠️ 開発・運用ガイド
