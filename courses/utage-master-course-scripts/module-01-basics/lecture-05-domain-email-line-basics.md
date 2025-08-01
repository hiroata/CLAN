# UTAGE機能、ドメイン・メールステップ配信・LINEの連携について基礎
**所要時間**: 15分00秒
**スライド数**: 22枚
**学習目標**: 独自ドメイン設定、メールステップ配信、LINE連携の基礎を理解し、クライアントに基本的な設定サポートができる

## オープニング（45秒）

みなさん、こんにちは。前田由紀子です。
今回は、UTAGEを使いこなす上で欠かせない3つの基礎機能について学びます。

独自ドメインの設定、メールステップ配信、そしてLINE公式アカウントとの連携。
これらは、クライアントのマーケティング自動化を実現する上で、最も重要な基盤となる機能です。

このレクチャーを終える頃には、これら3つの機能の基本設定ができるようになり、
クライアントへの導入サポートも自信を持って行えるようになります。

## 本編

### パート1: 独自ドメイン設定の基礎（5分）

**スライド1: タイトル**
「独自ドメイン設定 - ブランド力とSEO効果を最大化」

**スライド2: 独自ドメインの重要性**
なぜ独自ドメインが必要なのでしょうか？

1. **ブランド認知の強化**
   - 企業の信頼性向上
   - プロフェッショナルな印象

2. **SEO効果の最大化**
   - 検索エンジンでの評価向上
   - 長期的な資産価値

3. **顧客の安心感**
   - 怪しいURLではないという安心感
   - メール到達率の向上

**スライド3: 必要な準備**
独自ドメイン設定には以下が必要です：

- ドメイン契約（お名前.com、エックスドメイン等）
- レンタルサーバー契約（エックスサーバー、さくらサーバー等）
- UTAGEアカウント

**重要な注意点**：
UTAGEではルートドメイン（example.com）は使用できません。
必ずサブドメイン（utage.example.com等）で設定する必要があります。

**スライド4: 設定手順の概要**
**画面共有開始**

1. UTAGE管理画面にログイン
2. 右上の契約者名をクリック
3. 「独自ドメイン管理」を選択
4. 「+追加」ボタンをクリック
5. サブドメインを入力

**スライド5: DNS設定**
各レンタルサーバーでDNS設定を行います：

- エックスサーバーの場合
- さくらサーバーの場合
- お名前.comの場合

DNS設定には最大72時間かかる場合があります。
設定後、ステータスが「利用可能」になるまで待ちましょう。

**スライド6: DKIM/DMARC設定**
メールの到達率を上げるために必須の設定です：

- DKIM認証：なりすましメール対策
- DMARC設定：迷惑メール判定を防ぐ

これらの設定により、メール到達率が大幅に向上します。

**スライド7: 設定完了後の確認**
独自ドメインが正しく設定されたか確認する方法：

1. ステータスが「利用可能」になっているか
2. ログインページにアクセスできるか
3. テストページが表示されるか

ここまでで、独自ドメイン設定の基本について理解できましたか？
設定は複雑に見えますが、手順通りに進めれば必ず設定できます。

### パート2: メールステップ配信の基礎（5分）

**スライド8: メールステップ配信とは**
メールステップ配信は、あらかじめ設定したシナリオに沿って、
自動的にメールを送信する機能です。

活用例：
- 新規登録者への7日間の教育メール
- 商品購入者へのフォローメール
- セミナー参加者への事前・事後メール

**スライド9: 配信アカウントの作成**
まず、配信アカウントを作成します：

1. 「メール/LINE配信」メニューを開く
2. 「配信アカウント」タブを選択
3. 「+追加」ボタンをクリック
4. アカウント名と送信者情報を入力

配信アカウントの種類：
- メール配信のみ
- LINE配信のみ
- メール・LINE併用

**スライド10: シナリオグループの作成**
シナリオをグループ化して管理します：

1. 「シナリオグループ」タブを選択
2. 「+追加」ボタンをクリック
3. グループ名を入力（例：「新規登録者向け」）

**スライド11: シナリオの作成**
具体的なシナリオを作成します：

1. シナリオグループ内で「シナリオ追加」
2. シナリオ名を入力
3. 配信条件を設定

**スライド12: ステップメールの設定**
実際のメールを設定します：

1. 「メールステップ追加」をクリック
2. 配信タイミングを設定
   - 登録直後
   - 1日後の19:00
   - 3日後の19:00
3. メール内容を作成

**スライド13: 置き換え文字の活用**
パーソナライズされたメールを送るために：

- [[name]]：読者の名前
- [[email]]：読者のメールアドレス
- [[date]]：現在の日付

これらを使うことで、より親近感のあるメールが送れます。

### パート3: LINE公式アカウント連携の基礎（4分）

**スライド14: LINE連携のメリット**
なぜLINE連携が重要なのか：

1. **到達率99%**
   - メールよりも圧倒的に高い到達率
   - ブロックされない限り確実に届く

2. **開封率の高さ**
   - プッシュ通知で気づいてもらいやすい
   - 日常的に使うアプリ内でのメッセージ

3. **親近感のあるコミュニケーション**
   - 1対1トークも可能
   - リッチメニューでの視覚的訴求

**スライド15: 事前準備**
LINE連携に必要なもの：

- LINE公式アカウント（無料で作成可能）
- UTAGEアカウント
- Messaging APIの有効化

**スライド16: LINE公式アカウント側の設定**
LINE Official Account Managerでの設定：

1. 設定（歯車マーク）をクリック
2. 「Messaging API」を選択
3. 「Messaging APIを利用する」をクリック
4. プロバイダー名を入力

**スライド17: 重要な応答設定**
以下の設定を必ず行ってください：

- 応答メッセージ：オフ
- 自動応答メッセージ：オフ
- Webhook：**オン**（最重要）
- 応答モード：オフ

WebhookがONになっていないと連携できません！

**スライド18: UTAGE側の連携設定**
1. 「メール/LINE配信」メニューを開く
2. 配信アカウントで「LINE配信のみ」または「メール・LINE併用」を選択
3. Channel IDとChannel Secretを入力
4. Webhook URLをLINE側に設定

**スライド19: LINEステップ配信の作成**
メールと同様にステップ配信が可能：

1. 「ステップ配信」タブを選択
2. 「LINEメッセージ追加」をクリック
3. 配信タイミングと内容を設定

配信タイミングの選択肢：
- 友だち追加直後
- 指定日時
- 登録から◯日後

### パート4: 統合的な活用方法（30秒）

**スライド20: 3つの機能の連携**
これら3つの機能を組み合わせることで：

1. 独自ドメインで信頼性の高いサイト運営
2. メールとLINEの併用で到達率を最大化
3. 自動化により業務効率を大幅改善

クライアントのビジネスに合わせて、最適な組み合わせを提案できます。

## まとめ（45秒）

**スライド21: 本日のまとめ**
今回は、UTAGEの3つの基礎機能について学びました：

1. **独自ドメイン設定**
   - サブドメインでの設定が必須
   - DNS設定には時間がかかる
   - DKIM/DMARC設定で到達率向上

2. **メールステップ配信**
   - 配信アカウント → シナリオグループ → シナリオの階層
   - 置き換え文字でパーソナライズ

3. **LINE連携**
   - Webhook必須設定
   - 到達率99%の威力
   - メールとの併用が効果的

**スライド22: 次回予告**
次回は「成功する構築代行者の特徴」について解説します。
月収100万円を超える構築代行者に共通する5つの特徴をお伝えします。

これらの基礎機能をマスターすることが、
成功への第一歩です。

それでは、今回はここまでです。
実際に設定を試してみて、分からないことがあれば遠慮なく質問してください。
最後までご視聴いただき、ありがとうございました。

## 講師メモ
- 独自ドメイン設定は初心者がつまずきやすいポイント。DNS設定の待ち時間について必ず説明
- メールステップ配信は実例を見せながら説明すると理解しやすい
- LINE連携はWebhookの設定を特に強調。ここでの設定ミスが最も多い
- よくある質問：
  - 「独自ドメインは必須？」→ 必須ではないが、ビジネスでは強く推奨
  - 「メールとLINEどちらがいい？」→ 併用が最も効果的
  - 「LINE無料プランで大丈夫？」→ 月200通まで。ビジネス規模により有料プラン検討
  - 「DNS設定がうまくいかない」→ 最大72時間待つ。それでもダメならサポート
  - 「ステップ配信の最適な間隔は？」→ 業種による。一般的には1日後、3日後、7日後