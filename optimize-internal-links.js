/**
 * 内部リンクのアンカーテキスト最適化スクリプト
 * SEOに効果的な説明的なアンカーテキストに改善
 */

const fs = require('fs');
const path = require('path');

// 最適化すべきアンカーテキストのパターン
const weakAnchorPatterns = [
    { pattern: /こちら/, replacement: '詳細情報' },
    { pattern: /ここ/, replacement: '該当ページ' },
    { pattern: /詳細はこちら/, replacement: '詳細を確認' },
    { pattern: /クリック/, replacement: '確認する' },
    { pattern: /詳しくはこちら/, replacement: '詳細情報を見る' },
    { pattern: /こちらをクリック/, replacement: '詳細を確認する' }
];

// 改善例：より説明的なアンカーテキスト
const improvedAnchorExamples = {
    // 悪い例 → 良い例
    'before': [
        '<a href="/blog/article-utage-funnel-guide.html">こちら</a>',
        '<a href="/blog/article-utage-landing-page-guide.html">詳細はこちら</a>',
        '<a href="/achievement/">ここをクリック</a>',
        '<a href="/seminar-request.html">クリック</a>'
    ],
    'after': [
        '<a href="/blog/article-utage-funnel-guide.html">UTAGEファネル機能の完全ガイド</a>',
        '<a href="/blog/article-utage-landing-page-guide.html">成約率10%超えのLP作成方法を詳しく見る</a>',
        '<a href="/achievement/">導入実績70社以上の成功事例を確認</a>',
        '<a href="/seminar-request.html">無料セミナーの開催をリクエスト</a>'
    ]
};

// 関連記事リンクの最適化テンプレート
const relatedArticleTemplates = {
    'funnel': {
        keyword: 'ファネル',
        links: [
            { url: '/blog/article-utage-funnel-guide.html', text: 'UTAGEファネル機能で売上3倍を実現する方法' },
            { url: '/blog/article-utage-multistep-funnel.html', text: 'マルチステップファネルで成約率を最大化' },
            { url: '/blog/article-utage-funnel-seo-strategy.html', text: 'ファネルページのSEO戦略完全ガイド' }
        ]
    },
    'email': {
        keyword: 'メール',
        links: [
            { url: '/blog/article-utage-email-setup.html', text: 'UTAGEメール配信で開封率40%を達成する設定方法' },
            { url: '/blog/article-utage-step-mail-course.html', text: '自動で月額44万円売上増のステップメール構築法' },
            { url: '/blog/article-utage-email-spam-prevention.html', text: 'メール到達率99%を実現するスパム対策' }
        ]
    },
    'landing': {
        keyword: 'LP|ランディング',
        links: [
            { url: '/blog/article-utage-landing-page-guide.html', text: '成約率30%のランディングページ作成術' },
            { url: '/blog/article-utage-optin-page-design.html', text: '登録率50%超えのオプトインページデザイン' },
            { url: '/blog/article-utage-sales-page-psychology.html', text: '心理学を活用したセールスページの作り方' }
        ]
    }
};

// 内部リンク最適化の実装コード
const optimizeInternalLinks = `
// 内部リンクの自動最適化関数
function optimizeInternalLinks(content) {
    // 弱いアンカーテキストを検出して改善
    let optimized = content;
    
    // パターンマッチングで改善
    const linkPattern = /<a([^>]*href="([^"]*)"[^>]*)>([^<]+)<\\/a>/g;
    
    optimized = optimized.replace(linkPattern, (match, attrs, href, text) => {
        // 弱いアンカーテキストの場合
        if (/^(こちら|ここ|クリック|詳細はこちら)$/.test(text.trim())) {
            // URLから適切なテキストを生成
            const improvedText = generateDescriptiveText(href);
            return \`<a\${attrs}>\${improvedText}</a>\`;
        }
        return match;
    });
    
    return optimized;
}

// URLから説明的なテキストを生成
function generateDescriptiveText(url) {
    const urlTextMap = {
        '/blog/article-utage-funnel-guide.html': 'UTAGEファネル機能完全ガイド',
        '/blog/article-utage-landing-page-guide.html': '成約率を高めるLP作成方法',
        '/blog/article-utage-email-setup.html': 'UTAGEメール配信設定ガイド',
        '/achievement/': 'お客様の成功事例',
        '/seminar-request.html': 'セミナー開催リクエスト',
        '/partner.html': 'パートナー募集の詳細'
    };
    
    return urlTextMap[url] || 'さらに詳しい情報';
}
`;

// 関連記事セクションの生成
function generateRelatedArticlesSection(currentArticleUrl, category) {
    const relatedLinks = relatedArticleTemplates[category]?.links || [];
    const filteredLinks = relatedLinks.filter(link => link.url !== currentArticleUrl);
    
    return `
<section class="related-articles-section">
    <h3>📚 関連記事</h3>
    <ul class="related-articles-list">
        ${filteredLinks.map(link => 
            `<li><a href="${link.url}">${link.text}</a></li>`
        ).join('\n        ')}
    </ul>
</section>`;
}

// レポート出力
console.log('=== 内部リンク最適化ガイド ===\n');

console.log('【SEO効果的なアンカーテキストの原則】');
console.log('1. 説明的で具体的な文言を使用');
console.log('2. リンク先の内容が分かるテキスト');
console.log('3. キーワードを自然に含める');
console.log('4. 「こちら」「クリック」などの汎用的な文言を避ける\n');

console.log('【改善例】');
console.log('❌ 悪い例:');
improvedAnchorExamples.before.forEach(example => {
    console.log(`  ${example}`);
});

console.log('\n✅ 良い例:');
improvedAnchorExamples.after.forEach(example => {
    console.log(`  ${example}`);
});

console.log('\n【関連記事リンクの最適化】');
Object.entries(relatedArticleTemplates).forEach(([category, data]) => {
    console.log(`\n■ ${category}カテゴリの記事:`);
    data.links.forEach(link => {
        console.log(`  - ${link.text}`);
        console.log(`    URL: ${link.url}`);
    });
});

console.log('\n【実装コード例】');
console.log(optimizeInternalLinks);

console.log('\n【推奨される内部リンク戦略】');
console.log('1. トピッククラスターの構築');
console.log('   - メインページ（ピラーコンテンツ）を中心に');
console.log('   - 関連するサブトピックページへリンク');
console.log('2. 文脈に即したリンク配置');
console.log('   - 読者が自然に興味を持つタイミング');
console.log('   - 価値を提供する関連コンテンツへ誘導');
console.log('3. リンクの配置密度');
console.log('   - 100-150語に1つの内部リンク');
console.log('   - 過度なリンクは避ける');

// サンプル関連記事セクションの生成
console.log('\n【関連記事セクションのHTMLサンプル】');
console.log(generateRelatedArticlesSection('/blog/article-utage-funnel-guide.html', 'funnel'));

console.log('\n完了！');