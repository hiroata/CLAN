/**
 * ブログ記事のSEO改善スクリプト
 * HowTo構造化データの追加と画像alt属性の最適化
 */

const fs = require('fs');
const path = require('path');

// HowTo構造化データが有効な記事
const howToArticles = {
    'article-utage-funnel-guide.html': {
        name: 'UTAGEで売れるセールスファネルを構築する方法',
        description: 'UTAGEのファネル機能を使って、効果的なセールスファネルを構築する完全ガイド',
        steps: [
            {
                name: 'ファネルの設計',
                text: 'ターゲットオーディエンスを明確にし、TOFU・MOFU・BOFUの各段階を設計します',
                url: 'https://clanbiz.jp/blog/article-utage-funnel-guide.html#step1'
            },
            {
                name: 'ランディングページの作成',
                text: 'UTAGEのテンプレートを使用して、コンバージョン率の高いランディングページを作成します',
                url: 'https://clanbiz.jp/blog/article-utage-funnel-guide.html#step2'
            },
            {
                name: 'ステップメールの設定',
                text: '見込み客を育成するためのステップメールシーケンスを設定します',
                url: 'https://clanbiz.jp/blog/article-utage-funnel-guide.html#step3'
            },
            {
                name: 'コンバージョン測定',
                text: 'ファネルの各段階でのコンバージョン率を測定し、改善を行います',
                url: 'https://clanbiz.jp/blog/article-utage-funnel-guide.html#step4'
            }
        ]
    },
    'article-utage-landing-page-guide.html': {
        name: 'UTAGEで成約率10%超えのランディングページを作成する方法',
        description: 'UTAGEを使って高成約率のランディングページを制作する手順',
        steps: [
            {
                name: 'ターゲット設定',
                text: '理想の顧客像を明確にし、ペルソナを設定します',
                url: 'https://clanbiz.jp/blog/article-utage-landing-page-guide.html#step1'
            },
            {
                name: 'ヘッドラインの作成',
                text: '注目を集める強力なヘッドラインを作成します',
                url: 'https://clanbiz.jp/blog/article-utage-landing-page-guide.html#step2'
            },
            {
                name: 'ベネフィットの訴求',
                text: '商品・サービスのベネフィットを明確に伝えます',
                url: 'https://clanbiz.jp/blog/article-utage-landing-page-guide.html#step3'
            },
            {
                name: 'CTAの最適化',
                text: 'コンバージョンを促進する効果的なCTAボタンを配置します',
                url: 'https://clanbiz.jp/blog/article-utage-landing-page-guide.html#step4'
            }
        ]
    },
    'article-utage-email-setup.html': {
        name: 'UTAGEでメール配信システムを設定する方法',
        description: 'UTAGEのメール配信機能を使って、到達率の高いメール配信システムを構築する手順',
        steps: [
            {
                name: 'ドメイン認証の設定',
                text: 'SPF、DKIM、DMARCを設定してメール到達率を向上させます',
                url: 'https://clanbiz.jp/blog/article-utage-email-setup.html#step1'
            },
            {
                name: 'メールテンプレートの作成',
                text: 'レスポンシブ対応のメールテンプレートを作成します',
                url: 'https://clanbiz.jp/blog/article-utage-email-setup.html#step2'
            },
            {
                name: '配信リストの管理',
                text: 'セグメント分けした配信リストを作成・管理します',
                url: 'https://clanbiz.jp/blog/article-utage-email-setup.html#step3'
            },
            {
                name: '配信スケジュールの設定',
                text: '最適な配信タイミングでメールを自動送信する設定を行います',
                url: 'https://clanbiz.jp/blog/article-utage-email-setup.html#step4'
            }
        ]
    }
};

function addHowToStructuredData(filePath, howToData) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // HowTo構造化データを作成
        const howToSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": howToData.name,
            "description": howToData.description,
            "step": howToData.steps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "name": step.name,
                "text": step.text,
                "url": step.url
            }))
        };
        
        const howToScript = `
    <!-- HowTo構造化データ -->
    <script type="application/ld+json">
    ${JSON.stringify(howToSchema, null, 4)}
    </script>`;
        
        // </head>タグの前に挿入
        content = content.replace('</head>', `${howToScript}\n</head>`);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ HowTo構造化データを追加: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ エラー (${path.basename(filePath)}):`, error.message);
    }
}

// 画像のalt属性を改善するための詳細な説明
const improvedAltTexts = {
    'hero-pc.webp': 'CLANトップページのメインビジュアル。UTAGEシステムによるマーケティング自動化とウェビナー構築サービスを紹介',
    'hero-sp.webp': 'CLANモバイル版メインビジュアル。スマートフォンでも最適化されたUTAGE導入支援サービスの紹介画像',
    'achieve-1.webp': 'UTAGEシステム導入成功事例：月額22万円の高額サブスクリプション契約を2件獲得し、月間売上44万円増加を実現した事例紹介',
    'achieve-2.webp': 'UTAGEによるオンラインスクール基盤構築事例：顧客満足度100%を達成し、問い合わせ対応時間を67%削減した成功事例',
    'achieve-3.webp': 'UTAGE24時間無人販売システム構築事例：営業時間外（22時〜7時）の売上が38%増加した完全自動化の成功事例',
    'achieve-4.webp': 'UTAGEシステム移行成功事例：初月で月商1000万円超（8桁）を達成し、営業活動時間を72%削減した事例',
    'achieve-5.webp': 'UTAGE商談プロセス自動化事例：初期対応の手作業率0%を実現し、営業時間外の商談成立率を62%向上させた事例',
    'achieve-6.webp': 'UTAGE導入企業70社以上の成功事例集：コンサル、士業、美容、教育など多業種でのオートウェビナー活用実績',
    'logo.webp': 'CLAN（クラン）のロゴ。マーケティング自動化とウェビナー構築でビジネスを加速させるオンラインスクール'
};

// HowTo構造化データの追加を実行
Object.entries(howToArticles).forEach(([filename, howToData]) => {
    const filePath = path.join(__dirname, 'blog', filename);
    if (fs.existsSync(filePath)) {
        addHowToStructuredData(filePath, howToData);
    }
});

console.log('\n📝 改善されたalt属性の例:');
Object.entries(improvedAltTexts).forEach(([image, altText]) => {
    console.log(`\n画像: ${image}`);
    console.log(`推奨alt属性: ${altText}`);
});

console.log('\n✅ SEO改善作業が完了しました');
console.log('\n次のステップ:');
console.log('1. 生成されたsitemap.xmlをGoogle Search Consoleに送信');
console.log('2. 各ページの画像alt属性を上記の推奨テキストに更新');
console.log('3. Core Web Vitalsの測定と改善');
console.log('4. 内部リンクのアンカーテキストの多様化');