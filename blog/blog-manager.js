/**
 * ブログ記事管理システム
 * 自動で記事一覧を生成・更新する
 */
class BlogManager {
    constructor() {
        this.articles = [];
        this.articlesPerPage = 12;
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilter = '';
        this.currentSort = 'newest';
        
        // 記事データの初期化
        this.initializeArticles();
        
        console.log('BlogManager initialized');
    }

    /**
     * 記事データの初期化
     */
    initializeArticles() {
        // 既存のHTMLから記事データを自動取得
        this.scanExistingArticles();
    }

    /**
     * 既存の記事データをHTMLから自動スキャン
     */
    scanExistingArticles() {
        const existingCards = document.querySelectorAll('.myblog-article-card');
        
        existingCards.forEach(card => {
            const linkElement = card.querySelector('.myblog-article-card-link');
            const titleElement = card.querySelector('.myblog-article-card-title');
            const excerptElement = card.querySelector('.myblog-article-card-excerpt');
            const dateElement = card.querySelector('.myblog-article-card-date');
            const tagsElements = card.querySelectorAll('.myblog-tag');
            const imageElement = card.querySelector('.myblog-auto-image');
            
            if (linkElement && titleElement) {
                const article = {
                    title: titleElement.textContent.trim(),
                    url: linkElement.getAttribute('href'),
                    excerpt: excerptElement ? excerptElement.textContent.trim() : '',
                    date: dateElement ? dateElement.getAttribute('datetime') : new Date().toISOString().split('T')[0],
                    tags: Array.from(tagsElements).map(tag => tag.textContent.trim()),
                    category: card.getAttribute('data-category') || 'marketing',
                    imageTitle: imageElement ? imageElement.getAttribute('data-title') : titleElement.textContent.trim()
                };
                
                this.articles.push(article);
            }
        });

        // 追加の記事データ（新しく作成された記事など）
        this.addNewArticles();
        
        // 日付順でソート
        this.sortArticles();
        this.calculatePagination();
    }

    /**
     * 新しい記事データを追加
     */
    addNewArticles() {
        const newArticles = [
            {
                title: "UTAGE活用法｜士業（税理士・行政書士）のオンライン集客システム",
                url: "article-utage-legal-professionals-online-system.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["士業", "税理士", "行政書士"],
                excerpt: "UTAGEを活用すれば、士業（税理士・行政書士）のオンライン集客を完全自動化できます。専門性を活かした信頼構築から顧客管理、継続サポートまで、売上3倍を実現する包括的なオンライン集客システムの構築方法を詳しく解説します。",
                imageTitle: "UTAGE活用法｜士業（税理士・行政書士）のオンライン集客システム"
            },
            {
                title: "UTAGEでイベント運営｜セミナー・ワークショップの集客から決済まで",
                url: "article-utage-event-management-automation.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["イベント運営", "セミナー", "ワークショップ"],
                excerpt: "UTAGEのイベント機能を活用すれば、セミナー・ワークショップの運営を完全自動化できます。集客から予約管理、決済処理、フォローアップまでをワンストップで管理し、参加者満足度98%・成約率75%を実現するイベント運営システムの構築方法を詳しく解説します。",
                imageTitle: "UTAGEでイベント運営｜セミナー・ワークショップの集客から決済まで"
            },
            {
                title: "UTAGE活用事例｜美容・健康業界でのデジタルマーケティング成功法",
                url: "article-utage-beauty-health-digital-marketing.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["美容業界", "健康業界", "デジタルマーケティング"],
                excerpt: "UTAGEを活用した美容・健康業界のデジタルマーケティング成功法を詳細解説。顧客管理から予約システム、オンライン集客まで、リピート率95%・売上3倍を実現する実践的戦略をご紹介します。",
                imageTitle: "UTAGE活用事例｜美容・健康業界でのデジタルマーケティング成功法"
            },
            {
                title: "UTAGEで不動産業界｜顧客育成から成約までのデジタル化手法",
                url: "article-utage-real-estate-digital-transformation.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["不動産業界", "デジタル化", "顧客育成"],
                excerpt: "UTAGEを活用すれば、不動産業界の従来手法を完全デジタル化できます。顧客育成から成約まで、マーケティングオートメーションで売上3倍・成約率80%を実現する実践的なデジタル化手法を詳しく解説します。",
                imageTitle: "UTAGEで不動産業界｜顧客育成から成約までのデジタル化手法"
            },
            {
                title: "UTAGE活用事例｜フィットネス・スポーツ業界でのオンライン展開",
                url: "article-utage-fitness-sports-online-expansion.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["フィットネス", "スポーツ業界", "オンライン展開"],
                excerpt: "UTAGEを活用したフィットネス・スポーツ業界のオンライン展開戦略を詳細解説。会員管理からオンラインレッスン、コミュニティ運営まで、会員満足度97%・売上4倍を実現する包括的システム構築方法をご紹介します。",
                imageTitle: "UTAGE活用事例｜フィットネス・スポーツ業界でのオンライン展開"
            },
            {
                title: "UTAGEで地方ビジネス｜地域密着型企業のデジタル変革成功事例",
                url: "article-utage-local-business-digital-transformation.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["地方ビジネス", "地域密着", "デジタル変革"],
                excerpt: "UTAGEを活用した地方ビジネスのデジタル変革成功事例を詳細解説。地域特性を活かしたオンライン集客から顧客管理まで、地域No.1企業を目指す実践的戦略をご紹介します。",
                imageTitle: "UTAGEで地方ビジネス｜地域密着型企業のデジタル変革成功事例"
            },
            {
                title: "UTAGE活用事例｜コンサルタント業界での売上アップ成功パターン",
                url: "article-utage-consultant-success-patterns.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["UTAGE活用事例", "コンサルタント", "売上アップ"],
                excerpt: "UTAGE活用でコンサルタント業界の売上を劇的に向上させた成功事例を詳細解説。自動化による業務効率化から高額商品販売システム構築まで、実績に基づく売上アップの成功パターンと具体的な導入効果をご紹介します。",
                imageTitle: "UTAGE活用事例｜コンサルタント業界での売上アップ成功パターン"
            },
            {
                title: "UTAGEのモバイル最適化完全ガイド｜スマホCV率を3倍にする方法",
                url: "article-utage-mobile-optimization.html",
                date: "2025-05-26",
                category: "marketing",
                tags: ["モバイル最適化", "レスポンシブデザイン", "スマホ対応"],
                excerpt: "スマートフォンユーザーのCV率を3倍にするUTAGEのモバイル最適化テクニックを詳しく解説。レスポンシブデザインから読み込み速度最適化まで、実践的な手法をお伝えします。",
                imageTitle: "UTAGEのモバイル最適化完全ガイド｜スマホCV率を3倍にする方法"
            },
            {
                title: "UTAGE vs MyASPメール配信機能比較｜どちらが優秀？",
                url: "article-utage-vs-myasp-email-comparison.html",
                date: "2025-05-25",
                category: "marketing",
                tags: ["メール配信", "ツール比較", "MyASP"],
                excerpt: "日本のメルマガ配信で人気のMyASPとUTAGEのメール配信機能を徹底比較。到達率、操作性、機能面など、あらゆる角度から分析し、どちらを選ぶべきかを明確にします。",
                imageTitle: "UTAGE vs MyASPメール配信機能比較｜どちらが優秀？"
            },
            {
                title: "UTAGE vs 他社サービス新比較｜2025年最新版マーケティングツール比較",
                url: "article-utage-vs-comparison-new.html",
                date: "2025-05-24",
                category: "marketing",
                tags: ["ツール比較", "マーケティング", "2025年版"],
                excerpt: "2025年最新のマーケティングツール事情を踏まえ、UTAGEと主要競合サービスを徹底比較。最新機能や料金体系の変更を反映した、最も信頼できる比較レポートをお届けします。",
                imageTitle: "UTAGE vs 他社サービス新比較｜2025年最新版マーケティングツール比較"
            },
            {
                title: "UTAGEメール配信機能の使い方｜初心者でも5分で設定完了する方法",
                url: "article-utage-email-setup.html",
                date: "2025-06-08",
                category: "marketing",
                tags: ["メール配信", "UTAGE", "初心者向け"],
                excerpt: "UTAGE（ウタゲ）のメール配信機能を初心者でも簡単に設定できる手順を詳しく解説。ステップメール、自動配信、セグメント配信の設定方法を5分で完了する方法をご紹介します。",
                imageTitle: "UTAGEメール配信機能の使い方｜初心者でも5分で設定完了する方法"
            },
            {
                title: "UTAGEファネル機能完全ガイド｜売れるセールスファネルの作り方",
                url: "article-utage-funnel-guide.html",
                date: "2025-06-06",
                category: "marketing",
                tags: ["セールスファネル", "ファネル最適化", "コンバージョン向上"],
                excerpt: "UTAGEのファネル機能を活用して売れるセールスファネルを構築する完全ガイド。TOFU・MOFU・BOFUの各段階での最適化から、コンバージョン向上のテクニックまで詳しく解説します。",
                imageTitle: "UTAGEファネル機能完全ガイド｜売れるセールスファネルの作り方"
            },
            {
                title: "UTAGEでLINEステップ配信を作る方法｜CVR20%超えのシナリオ構築術",
                url: "article-utage-line-step-delivery.html",
                date: "2025-06-06",
                category: "marketing",
                tags: ["LINEステップ配信", "CVR向上", "シナリオ設計"],
                excerpt: "LINEステップ配信は、適切なシナリオ設計によりCVR20%超えも実現可能な強力なマーケティング手法です。UTAGEを活用した効果的なステップ配信の作成方法から、心理学に基づくシナリオ構築まで詳しく解説。",
                imageTitle: "UTAGEでLINEステップ配信を作る方法｜CVR20%超えのシナリオ構築術"
            },
            {
                title: "UTAGE LINE配信完全ガイド｜公式アカウント連携から配信まで",
                url: "article-utage-line-delivery-guide.html",
                date: "2025-06-06",
                category: "marketing",
                tags: ["LINE配信", "公式アカウント連携", "マーケティング自動化"],
                excerpt: "UTAGEとLINE公式アカウントを連携させることで、メール配信に加えてLINE配信も自動化できます。本記事では、連携設定から配信設定まで、初心者でも迷わず設定できるよう詳しく解説します。",
                imageTitle: "UTAGE LINE配信完全ガイド｜公式アカウント連携から配信まで"
            },
            // 残りの記事を追加
            {
                title: "UTAGEラベル自動化完全ガイド｜顧客セグメント管理の効率化",
                url: "article-utage-label-automation.html",
                date: "2025-06-05",
                category: "marketing",
                tags: ["ラベル自動化", "顧客セグメント", "効率化"],
                excerpt: "UTAGEのラベル自動化機能を活用した顧客セグメント管理の完全ガイド。行動履歴に基づく自動ラベル付けから、効率的な顧客管理まで詳しく解説します。",
                imageTitle: "UTAGEラベル自動化完全ガイド｜顧客セグメント管理の効率化"
            },
            {
                title: "UTAGE オプトインページデザイン｜CVR30%超えの登録ページ作成術",
                url: "article-utage-optin-page-design.html",
                date: "2025-06-04",
                category: "marketing",
                tags: ["オプトインページ", "CVR向上", "デザイン"],
                excerpt: "CVR30%超えを実現するUTAGEオプトインページの作成方法を詳解。デザイン原則から心理学的アプローチまで、効果的な登録ページ構築術をご紹介します。",
                imageTitle: "UTAGE オプトインページデザイン｜CVR30%超えの登録ページ作成術"
            },
            {
                title: "UTAGEセールスページ心理学｜成約率40%を実現する販売ページ構築法",
                url: "article-utage-sales-page-psychology.html",
                date: "2025-06-03",
                category: "marketing",
                tags: ["セールスページ", "心理学", "成約率向上"],
                excerpt: "心理学を活用したUTAGEセールスページの構築方法。成約率40%を実現する販売ページの設計原則から実装まで詳しく解説します。",
                imageTitle: "UTAGEセールスページ心理学｜成約率40%を実現する販売ページ構築法"
            },
            {
                title: "UTAGEサンクスページアップセル｜購入後売上を2倍にする戦略",
                url: "article-utage-thanks-page-upsell.html",
                date: "2025-06-02",
                category: "marketing",
                tags: ["サンクスページ", "アップセル", "売上向上"],
                excerpt: "UTAGEサンクスページでのアップセル戦略により購入後売上を2倍にする方法。効果的なオファー設計から実装まで詳しく解説します。",
                imageTitle: "UTAGEサンクスページアップセル｜購入後売上を2倍にする戦略"
            },
            {
                title: "UTAGEファネル vs ClickFunnels｜日本市場での比較検証",
                url: "article-utage-funnel-vs-clickfunnels.html",
                date: "2025-06-01",
                category: "marketing",
                tags: ["ファネル比較", "ClickFunnels", "日本市場"],
                excerpt: "UTAGEとClickFunnelsの日本市場での比較検証。機能、価格、使いやすさなど多角的に分析し、どちらを選ぶべきかを明確にします。",
                imageTitle: "UTAGEファネル vs ClickFunnels｜日本市場での比較検証"
            },
            {
                title: "UTAGEテンプレート活用ガイド｜プロ級ページを10分で作成",
                url: "article-utage-template-guide.html",
                date: "2025-05-31",
                category: "marketing",
                tags: ["テンプレート", "ページ作成", "効率化"],
                excerpt: "UTAGEテンプレートを活用してプロ級のページを10分で作成する方法。テンプレートカスタマイズから独自デザインまで詳しく解説します。",
                imageTitle: "UTAGEテンプレート活用ガイド｜プロ級ページを10分で作成"
            },
            {
                title: "UTAGEリマインダーシステム｜自動フォローで成約率向上",
                url: "article-utage-reminder-system.html",
                date: "2025-05-30",
                category: "marketing",
                tags: ["リマインダー", "自動フォロー", "成約率向上"],
                excerpt: "UTAGEリマインダーシステムを活用した自動フォローにより成約率を向上させる方法。効果的なリマインダー設計から運用まで詳しく解説します。",
                imageTitle: "UTAGEリマインダーシステム｜自動フォローで成約率向上"
            },
            {
                title: "UTAGEランディングページガイド｜高CVRページの作り方",
                url: "article-utage-landing-page-guide.html",
                date: "2025-05-29",
                category: "marketing",
                tags: ["ランディングページ", "CVR向上", "ページ作成"],
                excerpt: "UTAGEで高CVRランディングページを作成する完全ガイド。デザイン原則から最適化テクニックまで詳しく解説します。",
                imageTitle: "UTAGEランディングページガイド｜高CVRページの作り方"
            },
            {
                title: "UTAGEメール迷惑メール対策｜到達率95%を実現する設定方法",
                url: "article-utage-email-spam-prevention.html",
                date: "2025-05-28",
                category: "marketing",
                tags: ["迷惑メール対策", "到達率向上", "メール配信"],
                excerpt: "UTAGEメール配信で到達率95%を実現する迷惑メール対策の設定方法。SPF・DKIM設定から送信者レピュテーション管理まで詳しく解説します。",
                imageTitle: "UTAGEメール迷惑メール対策｜到達率95%を実現する設定方法"
            },
            {
                title: "UTAGEドメイン・DKIM・SPF設定完全ガイド｜メール認証の全て",
                url: "article-utage-domain-dkim-spf-setup.html",
                date: "2025-05-27",
                category: "marketing",
                tags: ["ドメイン設定", "DKIM", "SPF"],
                excerpt: "UTAGEでのドメイン・DKIM・SPF設定の完全ガイド。メール認証設定から到達率向上まで、技術的な設定を分かりやすく解説します。",
                imageTitle: "UTAGEドメイン・DKIM・SPF設定完全ガイド｜メール認証の全て"
            },
            {
                title: "UTAGE無料トライアル活用ガイド｜14日間で習得すべき機能",
                url: "article-utage-free-trial-guide.html",
                date: "2025-05-26",
                category: "marketing",
                tags: ["無料トライアル", "機能習得", "初心者向け"],
                excerpt: "UTAGE無料トライアル期間を最大活用する方法。14日間で習得すべき機能から実際の運用開始まで詳しく解説します。",
                imageTitle: "UTAGE無料トライアル活用ガイド｜14日間で習得すべき機能"
            },
            {
                title: "UTAGEサポート活用ガイド｜困った時の解決方法",
                url: "article-utage-support-guide.html",
                date: "2025-05-25",
                category: "marketing",
                tags: ["サポート", "問題解決", "ヘルプ"],
                excerpt: "UTAGEサポートを効果的に活用する方法。よくある問題の解決法からサポートへの効果的な問い合わせ方法まで詳しく解説します。",
                imageTitle: "UTAGEサポート活用ガイド｜困った時の解決方法"
            },
            {
                title: "UTAGEステップメール講座｜自動化で売上3倍を実現",
                url: "article-utage-step-mail-course.html",
                date: "2025-05-24",
                category: "marketing",
                tags: ["ステップメール", "自動化", "売上向上"],
                excerpt: "UTAGEステップメール機能を活用して売上3倍を実現する方法。効果的なシナリオ設計から配信最適化まで詳しく解説します。",
                imageTitle: "UTAGEステップメール講座｜自動化で売上3倍を実現"
            },
            {
                title: "UTAGEメリット・デメリット最新版｜2025年利用者の本音",
                url: "article-utage-merits-demerits-2.html",
                date: "2025-05-23",
                category: "marketing",
                tags: ["メリット", "デメリット", "利用者の声"],
                excerpt: "UTAGE利用者の本音から見える2025年最新のメリット・デメリット。実際の使用感から選択すべきかを判断する材料をご提供します。",
                imageTitle: "UTAGEメリット・デメリット最新版｜2025年利用者の本音"
            },
            {
                title: "UTAGE vs 他社サービス比較｜マーケティングツール選択ガイド",
                url: "article-utage-vs-comparison.html",
                date: "2025-05-22",
                category: "marketing",
                tags: ["ツール比較", "選択ガイド", "マーケティング"],
                excerpt: "UTAGEと主要マーケティングツールの比較分析。機能、価格、使いやすさを詳細比較し、最適なツール選択をサポートします。",
                imageTitle: "UTAGE vs 他社サービス比較｜マーケティングツール選択ガイド"
            },
            {
                title: "UTAGE料金プラン完全ガイド｜コスパ最強の選び方",
                url: "article-utage-pricing.html",
                date: "2025-05-21",
                category: "marketing",
                tags: ["料金プラン", "コスパ", "選び方"],
                excerpt: "UTAGE料金プランの詳細分析とコスパ最強の選び方。各プランの特徴から最適なプラン選択まで詳しく解説します。",
                imageTitle: "UTAGE料金プラン完全ガイド｜コスパ最強の選び方"
            },
            // さらに残りの記事を追加
            {
                title: "UTAGEウェビナー登録ページ最適化｜参加率80%を実現する方法",
                url: "article-utage-webinar-registration-page.html",
                date: "2025-05-20",
                category: "marketing",
                tags: ["ウェビナー", "登録ページ", "参加率向上"],
                excerpt: "UTAGEウェビナー登録ページの最適化により参加率80%を実現する方法。効果的なページ設計から運用まで詳しく解説します。",
                imageTitle: "UTAGEウェビナー登録ページ最適化｜参加率80%を実現する方法"
            },
            {
                title: "UTAGEファネルSEO戦略｜検索流入で売上3倍を実現",
                url: "article-utage-funnel-seo-strategy.html",
                date: "2025-05-19",
                category: "marketing",
                tags: ["ファネルSEO", "検索流入", "売上向上"],
                excerpt: "UTAGEファネルページのSEO戦略により検索流入で売上3倍を実現する方法。技術的な最適化から実践まで詳しく解説します。",
                imageTitle: "UTAGEファネルSEO戦略｜検索流入で売上3倍を実現"
            },
            {
                title: "UTAGEチェックアウト最適化｜カート離脱率を50%削減する方法",
                url: "article-utage-checkout-optimization.html",
                date: "2025-05-18",
                category: "marketing",
                tags: ["チェックアウト最適化", "カート離脱", "成約率向上"],
                excerpt: "UTAGEチェックアウトページの最適化によりカート離脱率を50%削減する方法。UXデザインから決済設定まで詳しく解説します。",
                imageTitle: "UTAGEチェックアウト最適化｜カート離脱率を50%削減する方法"
            },
            {
                title: "UTAGEマルチステップファネル｜成約率を2倍にする段階設計",
                url: "article-utage-multistep-funnel.html",
                date: "2025-05-17",
                category: "marketing",
                tags: ["マルチステップ", "ファネル設計", "成約率向上"],
                excerpt: "UTAGEマルチステップファネルにより成約率を2倍にする段階設計の方法。心理学に基づく設計から実装まで詳しく解説します。",
                imageTitle: "UTAGEマルチステップファネル｜成約率を2倍にする段階設計"
            },
            {
                title: "UTAGEメンバーシップサイト構築マニュアル｜会員制ビジネス完全ガイド",
                url: "article-utage-membership-site-manual.html",
                date: "2025-05-16",
                category: "marketing",
                tags: ["メンバーシップ", "会員制", "サイト構築"],
                excerpt: "UTAGEでメンバーシップサイトを構築する完全マニュアル。会員制ビジネスの設計から運営まで詳しく解説します。",
                imageTitle: "UTAGEメンバーシップサイト構築マニュアル｜会員制ビジネス完全ガイド"
            },
            {
                title: "UTAGEでオンライン講座を作る方法｜受講生満足度90%の秘訣",
                url: "article-utage-online-course-creation.html",
                date: "2025-05-15",
                category: "marketing",
                tags: ["オンライン講座", "受講生満足度", "コース作成"],
                excerpt: "UTAGEでオンライン講座を作成し受講生満足度90%を実現する方法。コンテンツ設計から運営まで詳しく解説します。",
                imageTitle: "UTAGEでオンライン講座を作る方法｜受講生満足度90%の秘訣"
            },
            {
                title: "UTAGE vs Teachable比較｜オンライン講座プラットフォーム選択ガイド",
                url: "article-utage-vs-teachable-comparison.html",
                date: "2025-05-14",
                category: "marketing",
                tags: ["Teachable比較", "講座プラットフォーム", "選択ガイド"],
                excerpt: "UTAGEとTeachableのオンライン講座プラットフォーム比較。機能、価格、使いやすさを詳細分析し最適な選択をサポートします。",
                imageTitle: "UTAGE vs Teachable比較｜オンライン講座プラットフォーム選択ガイド"
            },
            {
                title: "UTAGEビデオコンテンツ管理｜動画配信システム完全活用法",
                url: "article-utage-video-content-management.html",
                date: "2025-05-13",
                category: "marketing",
                tags: ["ビデオ管理", "動画配信", "コンテンツ管理"],
                excerpt: "UTAGEビデオコンテンツ管理システムの完全活用法。動画アップロードから配信設定まで詳しく解説します。",
                imageTitle: "UTAGEビデオコンテンツ管理｜動画配信システム完全活用法"
            },
            {
                title: "UTAGE受講生管理システム｜オンライン教育の効率化",
                url: "article-utage-student-management.html",
                date: "2025-05-12",
                category: "marketing",
                tags: ["受講生管理", "オンライン教育", "効率化"],
                excerpt: "UTAGE受講生管理システムでオンライン教育を効率化する方法。進捗管理から修了証発行まで詳しく解説します。",
                imageTitle: "UTAGE受講生管理システム｜オンライン教育の効率化"
            },
            {
                title: "UTAGEコンテンツ管理システム｜デジタル教材の効率的運用",
                url: "article-utage-content-management.html",
                date: "2025-05-11",
                category: "marketing",
                tags: ["コンテンツ管理", "デジタル教材", "効率運用"],
                excerpt: "UTAGEコンテンツ管理システムでデジタル教材を効率的に運用する方法。アップロードから配信まで詳しく解説します。",
                imageTitle: "UTAGEコンテンツ管理システム｜デジタル教材の効率的運用"
            },
            {
                title: "UTAGE決済システム連携ガイド｜Stripe・UnivaPayなど主要決済の設定方法",
                url: "article-utage-payment-integration-guide.html",
                date: "2025-05-10",
                category: "marketing",
                tags: ["決済連携", "Stripe", "UnivaPayA"],
                excerpt: "UTAGEと主要決済システムの連携設定ガイド。Stripe・UnivaPayなど各種決済サービスの設定方法を詳しく解説します。",
                imageTitle: "UTAGE決済システム連携ガイド｜Stripe・UnivaPayなど主要決済の設定方法"
            },
            {
                title: "UTAGEで定期課金システム｜サブスクリプションビジネスの始め方",
                url: "article-utage-subscription-business.html",
                date: "2025-05-09",
                category: "marketing",
                tags: ["定期課金", "サブスクリプション", "ビジネスモデル"],
                excerpt: "UTAGEで定期課金システムを構築しサブスクリプションビジネスを始める方法。設定から運用まで詳しく解説します。",
                imageTitle: "UTAGEで定期課金システム｜サブスクリプションビジネスの始め方"
            },
            {
                title: "UTAGEでコーチングビジネス｜個人指導の予約・決済・フォロー自動化",
                url: "article-utage-coaching-business-automation.html",
                date: "2025-05-08",
                category: "marketing",
                tags: ["コーチング", "個人指導", "自動化"],
                excerpt: "UTAGEでコーチングビジネスを自動化する方法。予約管理から決済、フォローアップまで包括的にサポートします。",
                imageTitle: "UTAGEでコーチングビジネス｜個人指導の予約・決済・フォロー自動化"
            },
            {
                title: "UTAGEオンライン教育完全ガイド｜eラーニングプラットフォーム構築法",
                url: "article-utage-online-education-complete-guide.html",
                date: "2025-05-07",
                category: "marketing",
                tags: ["オンライン教育", "eラーニング", "プラットフォーム構築"],
                excerpt: "UTAGEでオンライン教育プラットフォームを構築する完全ガイド。eラーニングシステムの設計から運営まで詳しく解説します。",
                imageTitle: "UTAGEオンライン教育完全ガイド｜eラーニングプラットフォーム構築法"
            }
        ];

        // 既存記事と重複チェック
        newArticles.forEach(newArticle => {
            const exists = this.articles.some(existing => existing.url === newArticle.url);
            if (!exists) {
                this.articles.push(newArticle);
            }
        });
    }

    /**
     * 記事をソート
     */
    sortArticles(sortType = 'newest') {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'newest':
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.articles.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                // 人気順のロジック（現在は日付順と同じ）
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
                this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    /**
     * 記事をフィルタリング
     */
    filterArticles(category = '') {
        this.currentFilter = category;
        
        if (!category) {
            return this.articles;
        }
        
        const categoryMap = {
            'web-design': ['ウェブデザイン', 'css', 'レスポンシブ'],
            'programming': ['javascript', 'プログラミング'],
            'marketing': ['マーケティング', 'seo', 'UTAGE', 'ウタゲ'],
            'business': ['ビジネス', '効率化']
        };
        
        const targetCategories = categoryMap[category] || [category];
        
        return this.articles.filter(article => {
            return targetCategories.some(targetCategory => 
                article.tags.some(tag => 
                    tag.toLowerCase().includes(targetCategory.toLowerCase())
                ) || 
                article.title.toLowerCase().includes(targetCategory.toLowerCase()) ||
                article.category === category
            );
        });
    }

    /**
     * ページネーション計算
     */
    calculatePagination() {
        const filteredArticles = this.filterArticles(this.currentFilter);
        this.totalPages = Math.ceil(filteredArticles.length / this.articlesPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        
        console.log('Pagination calculated: filteredArticles =', filteredArticles.length, 'articlesPerPage =', this.articlesPerPage, 'totalPages =', this.totalPages);
    }

    /**
     * 現在のページの記事を取得
     */
    getCurrentPageArticles() {
        const filteredArticles = this.filterArticles(this.currentFilter);
        this.sortArticles(this.currentSort);
        
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        
        return filteredArticles.slice(startIndex, endIndex);
    }

    /**
     * 記事カードHTMLを生成
     */
    generateArticleCardHTML(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagsHTML = article.tags.map(tag => 
            `<span class="myblog-tag">${tag}</span>`
        ).join('');

        return `
            <article class="myblog-article-card" data-category="${article.category}" data-date="${article.date}">
                <a href="${article.url}" class="myblog-article-card-link">
                    <div class="myblog-article-card-image myblog-auto-image" data-title="${article.imageTitle}">
                    </div>
                    <div class="myblog-article-card-content">
                        <div class="myblog-article-card-meta">
                            <time class="myblog-article-card-date" datetime="${article.date}">${formattedDate}</time>
                            <div class="myblog-article-card-tags">
                                ${tagsHTML}
                            </div>
                        </div>
                        <h2 class="myblog-article-card-title">${article.title}</h2>
                        <p class="myblog-article-card-excerpt">
                            ${article.excerpt}
                        </p>
                    </div>
                </a>
            </article>
        `;
    }

    /**
     * ページネーションHTMLを生成
     */
    generatePaginationHTML() {
        console.log('Generating pagination: totalPages =', this.totalPages, 'currentPage =', this.currentPage);
        
        if (this.totalPages <= 1) {
            console.log('Not generating pagination: totalPages <= 1');
            return '';
        }

        let paginationHTML = `
            <nav class="myblog-pagination" aria-label="ページナビゲーション">
                <div class="myblog-pagination-container">
        `;

        // 前のページボタン
        if (this.currentPage > 1) {
            paginationHTML += `
                <a href="#" class="myblog-pagination-btn" 
                   data-page="${this.currentPage - 1}" aria-label="前のページ">
                    <span>前のページ</span>
                </a>
            `;
        } else {
            paginationHTML += `
                <span class="myblog-pagination-btn myblog-pagination-btn--disabled">
                    <span>前のページ</span>
                </span>
            `;
        }

        // ページ番号
        paginationHTML += '<div class="myblog-pagination-numbers">';
        
        for (let i = 1; i <= this.totalPages; i++) {
            const activeClass = i === this.currentPage ? 'myblog-pagination-number--active' : '';
            
            if (i === this.currentPage) {
                paginationHTML += `
                    <span class="myblog-pagination-number ${activeClass}" aria-current="page">${i}</span>
                `;
            } else {
                paginationHTML += `
                    <a href="#" class="myblog-pagination-number" data-page="${i}">${i}</a>
                `;
            }
        }
        
        paginationHTML += '</div>';

        // 次のページボタン
        if (this.currentPage < this.totalPages) {
            paginationHTML += `
                <a href="#" class="myblog-pagination-btn" 
                   data-page="${this.currentPage + 1}" aria-label="次のページ">
                    <span>次のページ</span>
                </a>
            `;
        } else {
            paginationHTML += `
                <span class="myblog-pagination-btn myblog-pagination-btn--disabled">
                    <span>次のページ</span>
                </span>
            `;
        }

        paginationHTML += `
                </div>
            </nav>
        `;

        return paginationHTML;
    }

    /**
     * 記事一覧を更新
     */
    updateArticleList() {
        const gridContainer = document.querySelector('.myblog-articles-grid');
        const paginationContainer = document.querySelector('.myblog-pagination');
        
        if (!gridContainer) {
            console.error('記事グリッドコンテナが見つかりません');
            return;
        }

        // 現在のページの記事を取得
        const currentArticles = this.getCurrentPageArticles();
        
        // 記事一覧を更新
        gridContainer.innerHTML = currentArticles.map(article => 
            this.generateArticleCardHTML(article)
        ).join('');

        // 自動画像生成を実行
        setTimeout(() => {
            const autoImages = document.querySelectorAll('.myblog-auto-image:not(.myblog-auto-image-processed)');
            if (autoImages.length > 0) {
                // myblog-script.jsの自動画像生成機能を呼び出し
                const event = new CustomEvent('myblog:refresh-images');
                window.dispatchEvent(event);
                
                // 直接実行する場合のフォールバック
                if (typeof window.initAutoFeaturedImages === 'function') {
                    window.initAutoFeaturedImages();
                }
            }
        }, 100);

        // 記事カードのリンクにイベントリスナーを追加
        this.attachArticleCardListeners();

        // ページネーションを更新
        this.updatePaginationOnly();

        // イベントリスナーを再設定
        this.attachEventListeners();
    }

    /**
     * 記事カードのリンクにイベントリスナーを追加
     */
    attachArticleCardListeners() {
        const articleLinks = document.querySelectorAll('.myblog-article-card-link');
        
        articleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // セッションストレージをクリア
                sessionStorage.removeItem('myblog-scroll-position');
                
                // モバイルデバイスの場合は特別な処理
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const targetUrl = this.href;
                    
                    // 即座にページ遷移
                    setTimeout(function() {
                        window.location.href = targetUrl;
                    }, 0);
                }
            });
        });
    }

    /**
     * ページネーションのみを更新（静的記事表示時に使用）
     */
    updatePaginationOnly() {
        const existingPagination = document.querySelector('.myblog-pagination');
        const newPaginationHTML = this.generatePaginationHTML();
        
        if (existingPagination && newPaginationHTML) {
            // 既存のページネーションを新しいものに置き換える
            existingPagination.outerHTML = newPaginationHTML;
            
            // イベントリスナーを再設定
            this.attachEventListeners();
        } else if (!existingPagination && newPaginationHTML) {
            // ページネーションが存在しない場合は、記事グリッドの後に追加
            const articlesGrid = document.querySelector('.myblog-articles-grid');
            if (articlesGrid && articlesGrid.parentNode) {
                articlesGrid.insertAdjacentHTML('afterend', newPaginationHTML);
                this.attachEventListeners();
            }
        }
    }

    /**
     * イベントリスナーを設定
     */
    attachEventListeners() {
        // フィルタリング
        const categoryFilter = document.getElementById('myblog-category-filter');
        const sortFilter = document.getElementById('myblog-sort-filter');

        if (categoryFilter) {
            categoryFilter.removeEventListener('change', this.handleFilterChange.bind(this));
            categoryFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }

        if (sortFilter) {
            sortFilter.removeEventListener('change', this.handleSortChange.bind(this));
            sortFilter.addEventListener('change', this.handleSortChange.bind(this));
        }

        // ページネーション
        const paginationButtons = document.querySelectorAll('.myblog-pagination-number, .myblog-pagination-btn');
        paginationButtons.forEach(button => {
            button.removeEventListener('click', this.handlePaginationClick.bind(this));
            button.addEventListener('click', this.handlePaginationClick.bind(this));
        });
    }

    /**
     * フィルター変更ハンドラ
     */
    handleFilterChange(event) {
        this.currentFilter = event.target.value;
        this.currentPage = 1;
        this.calculatePagination();
        this.updateArticleList();
    }

    /**
     * ソート変更ハンドラ
     */
    handleSortChange(event) {
        this.currentSort = event.target.value;
        this.sortArticles(this.currentSort);
        this.updateArticleList();
    }

    /**
     * ページネーションクリックハンドラ
     */
    handlePaginationClick(event) {
        event.preventDefault();
        
        // クリックされた要素またはその親要素からdata-pageを取得
        let targetElement = event.target;
        let targetPage = null;
        
        // data-page属性を持つ要素を探す（親要素まで遡る）
        while (targetElement && !targetPage) {
            targetPage = targetElement.getAttribute('data-page');
            if (!targetPage) {
                targetElement = targetElement.parentElement;
            }
        }
        
        targetPage = parseInt(targetPage);
        
        if (targetPage && targetPage !== this.currentPage && 
            targetPage >= 1 && targetPage <= this.totalPages) {
            this.currentPage = targetPage;
            
            // ページ1の場合は静的HTMLが既にあることがあるので、全体を更新
            // ページ2以降はJavaScriptで動的生成
            this.updateArticleList();
            
            // ページトップにスクロール
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 新しい記事を追加
     */
    addNewArticle(articleData) {
        // 重複チェック
        const exists = this.articles.some(existing => existing.url === articleData.url);
        if (!exists) {
            this.articles.unshift(articleData); // 新しい記事を先頭に追加
            this.calculatePagination();
            this.updateArticleList();
            return true;
        }
        return false;
    }

    /**
     * 記事を削除
     */
    removeArticle(articleUrl) {
        const index = this.articles.findIndex(article => article.url === articleUrl);
        if (index > -1) {
            this.articles.splice(index, 1);
            this.calculatePagination();
            this.updateArticleList();
            return true;
        }
        return false;
    }

    /**
     * 記事データを外部から設定
     */
    setArticles(articlesData) {
        this.articles = articlesData;
        this.sortArticles();
        this.calculatePagination();
        this.updateArticleList();
    }

    /**
     * 現在の記事データを取得
     */
    getArticles() {
        return this.articles;
    }

    /**
     * 初期化メソッド
     */
    init() {
        // 記事数を基にページネーションを計算
        this.calculatePagination();
        
        // 既存の静的記事がある場合は、それらを保持してJavaScriptは拡張機能として動作
        const existingStaticArticles = document.querySelectorAll('.myblog-article-card');
        if (existingStaticArticles.length > 0) {
            // 静的記事が既に表示されている場合、JavaScriptは拡張機能として動作
            console.log('Static articles detected:', existingStaticArticles.length);
            
            // 静的記事のリンクにもイベントリスナーを追加
            this.attachArticleCardListeners();
            
            // イベントリスナーを設定（フィルタリング・ページネーション用）
            this.attachEventListeners();
            
            // ページネーションを必ず更新（記事数が多い場合）
            this.updatePaginationOnly();
            
            console.log('Blog Manager initialized in enhancement mode with', this.articles.length, 'total articles, totalPages:', this.totalPages);
            console.log('Articles per page:', this.articlesPerPage);
            console.log('Should show pagination:', this.totalPages > 1);
            
            // ページ2以降をクリックした時は、動的に記事を生成する必要がある
            // 既存のページネーションにイベントリスナーを追加
            const paginationButtons = document.querySelectorAll('.myblog-pagination-number, .myblog-pagination-btn');
            paginationButtons.forEach(button => {
                button.addEventListener('click', this.handlePaginationClick.bind(this));
            });
        } else {
            // 静的記事がない場合は従来通りの全面的なJavaScript制御
            this.attachEventListeners();
            this.updateArticleList();
            console.log('Blog Manager initialized in full control mode with', this.articles.length, 'articles');
        }
    }
}

// グローバルスコープで利用可能にする
window.BlogManager = BlogManager;

// DOMContentLoaded時に自動初期化
document.addEventListener('DOMContentLoaded', function() {
    // ブログ一覧ページの場合のみ初期化
    if (document.querySelector('.myblog-articles-grid')) {
        window.blogManager = new BlogManager();
        window.blogManager.init();
    }
});

// 外部から記事を追加するためのヘルパー関数
window.addBlogArticle = function(articleData) {
    if (window.blogManager) {
        return window.blogManager.addNewArticle(articleData);
    }
    return false;
};

// 外部から記事を削除するためのヘルパー関数
window.removeBlogArticle = function(articleUrl) {
    if (window.blogManager) {
        return window.blogManager.removeArticle(articleUrl);
    }
    return false;
};