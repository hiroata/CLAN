# UTAGE機能、会員サイト機能、決済システムについて
**所要時間**: 15分00秒
**スライド数**: 24枚
**学習目標**: 会員サイトの構築方法と決済システムの設定を理解し、オンラインスクールの立ち上げ支援ができる

## オープニング（45秒）

みなさん、こんにちは。前田由紀子です。
今回は、UTAGEの中でも特に収益化に直結する2つの重要機能、
会員サイト機能と決済システムについて詳しく解説していきます。

これらの機能を使いこなせるようになると、
クライアントのオンラインスクールや会員制ビジネスの構築を、
ワンストップでサポートできるようになります。

それでは、早速始めていきましょう。

## 本編

### パート1: 会員サイト機能の概要と構造（4分）

**スライド1: タイトル**
「会員サイト機能 - オンラインスクールを簡単構築」

**スライド2: 会員サイトの活用例**
UTAGEの会員サイト機能で実現できること：

1. **オンラインスクール**
   - 動画講座の配信
   - PDFテキストの提供
   - 進捗管理機能

2. **会員制コミュニティ**
   - 限定コンテンツの配信
   - 段階的なコンテンツ公開
   - メンバー管理

3. **サブスクリプションサービス**
   - 月額課金型のコンテンツ配信
   - 自動更新と自動停止

**スライド3: 3階層構造の理解**
UTAGEの会員サイトは3階層構造になっています：

1. **サイト（最上位）**
   - 会員サイト全体の箱
   - 複数のサイトを作成可能

2. **コース（中間層）**
   - サイト内の個別講座
   - 例：「初級編」「中級編」「上級編」

3. **レッスン（最下層）**
   - コース内の個別授業
   - 動画、PDF、テキストを配置

**スライド4: 会員サイトの作成手順**
**画面共有開始**

1. UTAGE管理画面にログイン
2. 上部メニュー「会員サイト」をクリック
3. サイドメニュー「サイト一覧」を選択
4. 「+追加」ボタンをクリック

**スライド5: サイトの基本設定**
サイト作成時の設定項目：

- サイト名（受講者に表示される名前）
- 管理名称（管理用の名前）
- サイトURL（自動生成される）
- ヘッダー画像
- ログインページのカスタマイズ

**スライド6: コースの追加方法**
1. 作成したサイトをクリック
2. 「コース管理」タブを選択
3. 「+コース追加」をクリック
4. コース情報を入力

コース設定のポイント：
- コース画像は魅力的なものを使用
- 進捗率表示をONにすると学習意欲向上
- 動画の自動再生設定も可能

**スライド7: レッスンの追加と設定**
1. コース内で「+追加」をクリック
2. レッスンタイプを選択
   - 動画レッスン
   - PDFダウンロード
   - テキストレッスン

3. 公開タイミングの設定
   - 即時公開
   - 登録後○日後に公開
   - 指定日時に公開

### パート2: 会員サイトの高度な活用（3分）

**スライド8: 自動化機能の活用**
ドリップフィードラーニングの実装：

- Day1: オリエンテーション動画
- Day3: 基礎講座レッスン1-3
- Day7: 実践課題の公開
- Day14: 応用講座の開放

この自動化により、受講者の学習ペースをコントロールできます。

**スライド9: 受講生管理機能**
管理画面から確認できる情報：

- 受講生一覧と登録日
- 各レッスンの視聴状況
- 進捗率の確認
- 最終ログイン日時

これらのデータを活用して、フォローメールを送ることも可能です。

**スライド10: 会員サイトの注意点**
実際に使ってみて分かった注意点：

1. レッスンのデフォルト設定が「下書き」
   - 必ず「公開」に変更する必要がある
   - 一括公開機能がないため個別設定

2. エディターの操作性
   - 慣れが必要な部分もある
   - 事前にコンテンツを準備しておくと効率的

ここまでで、会員サイトの基本的な構築方法について理解できましたか？
次は、この会員サイトと連動する決済システムについて解説します。

### パート3: 決済システムの概要と選び方（4分）

**スライド11: 利用可能な決済代行会社**
UTAGEでは5つの決済代行会社と連携可能：

1. **UnivaPay**（推奨）
2. **Stripe**
3. **テレコムクレジット**
4. **AQUAGATES**
5. **FirstPayment**

**スライド12: 2025年の重要変更**
**3Dセキュア義務化について**

経済産業省のガイドラインにより、
2025年3月末からクレジットカード決済時の
3Dセキュア導入が義務付けられます。

対応状況：
- UnivaPay: 2025年4月8日適用完了済み
- 他社も順次対応予定

**スライド13: 各決済代行会社の特徴**

**UnivaPay（推奨）**
- 国内企業で日本語サポート充実
- 事前審査ありでアカウント停止リスク低
- UTAGE特別プラン：初期費用・月額費用無料

**Stripe**
- 手数料3.6%の一律料金
- 審査なしで即日利用可能
- 海外決済に強い

**テレコムクレジット**
- 無形商材に強い
- 他社で審査落ちでも通る可能性
- 入金サイクルが早い（月末締め翌月10日）

**スライド14: 決済連携の設定手順**
**画面共有**

1. 「ファネル」メニューを開く
2. 左メニュー「決済連携設定」をクリック
3. 使用する決済代行会社を選択
4. 必要な情報を入力

**スライド15: UnivaPay設定の詳細**
UnivaPay新システムの場合：

1. UnivaPay管理画面で店舗IDを取得
2. アプリトークンとシークレットを取得
3. UTAGE側に情報を入力
4. テストモードで動作確認
5. 本番モードに切り替え

### パート4: 販売戦略と自動化（3分）

**スライド16: 商品の作成と設定**
決済と連動した商品設定：

1. 「販売」メニューから商品追加
2. 商品タイプを選択
   - 単発商品
   - サブスクリプション（月額・年額）
3. 価格設定と決済代行会社の選択

**スライド17: アップセル・ダウンセル戦略**
UTAGEの強力な販売機能：

**アップセル**
- 購入完了後に追加商品を提案
- 例：基礎コース購入者に応用コースを提案

**ダウンセル**
- 購入をキャンセルした人に別商品を提案
- 例：高額商品→お試し版の提案

**オーダーバンプ**
- 購入ボタンの近くに追加オプション表示
- 例：テキスト付きオプション

**スライド18: 会員サイトと決済の連携**
購入から会員サイトアクセスまでの自動化：

1. 顧客が商品を購入
2. 決済完了と同時に会員登録
3. ログイン情報を自動メール送信
4. 会員サイトへ即アクセス可能

この一連の流れが完全自動化されます。

**スライド19: 売上管理とレポート**
UTAGEダッシュボードで確認できる情報：

- 日別・月別売上
- 商品別売上
- 決済手段別の内訳
- 解約率（サブスクリプション）

これらのデータを元に、改善施策を立てられます。

### パート5: 実践的なTipsと注意点（1分30秒）

**スライド20: 成功する会員サイトの特徴**
クライアントに提案する際のポイント：

1. **コンテンツの質と量のバランス**
   - 詰め込みすぎない
   - 定期的な更新で継続率UP

2. **サポート体制の構築**
   - Q&Aコーナーの設置
   - コミュニティ機能の活用

3. **価格設定の工夫**
   - 初月割引
   - 年払い割引
   - 期間限定オファー

**スライド21: よくあるトラブルと対処法**
1. **決済エラー**
   - カード情報の再入力を促す
   - 別の決済手段を提案

2. **ログインできない**
   - パスワード再設定機能
   - 複数デバイスでの同時ログイン制限

3. **動画が再生されない**
   - ブラウザの確認
   - キャッシュクリア

## まとめ（45秒）

**スライド22: 本日のまとめ**
今回は、UTAGEの会員サイト機能と決済システムについて学びました：

1. **会員サイト機能**
   - サイト > コース > レッスンの3階層構造
   - 自動化機能で効率的な運営
   - 受講生管理で学習状況を把握

2. **決済システム**
   - 5つの決済代行会社から選択
   - 2025年3月末から3Dセキュア義務化
   - アップセル・ダウンセルで売上最大化

**スライド23: 実装のステップ**
クライアントへの導入手順：
1. コンテンツ企画と構成
2. 決済代行会社の選定と審査
3. 会員サイトの構築
4. テスト運用と改善
5. 本格運用開始

**スライド24: 次回予告**
次回は「提案書の作り方と価格設定」について解説します。
構築代行サービスをどのように提案し、
適正な価格設定をするかをお伝えします。

会員サイトと決済システムは、
クライアントの収益化の要となる機能です。
しっかりとマスターして、価値ある提案をしていきましょう。

それでは、今回はここまでです。
最後までご視聴いただき、ありがとうございました。

## 講師メモ
- 会員サイトのデモは実際の画面を見せながら説明すると効果的
- 決済代行会社の選定は、扱う商材によって最適解が異なることを強調
- 3Dセキュア義務化は2025年の重要トピックなので必ず説明
- よくある質問：
  - 「どの決済代行会社がおすすめ？」→ 商材と規模による。一般的にはUnivaPay
  - 「会員サイトの容量制限は？」→ メディア管理1000GBまで（スタンダードプラン）
  - 「同時アクセス数の制限は？」→ 特に制限なし、サーバーは自動スケール
  - 「退会処理は自動？」→ サブスクリプションは決済失敗で自動停止可能
  - 「複数の会員サイトを作れる？」→ スタンダードプランなら無制限