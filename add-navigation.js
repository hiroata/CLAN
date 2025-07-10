const fs = require('fs');
const path = require('path');

// 全記事リスト
const articleList = [
    'article-utage-accounting-cloud-bookkeeping.html',
    'article-utage-administrative-scrivener-license-permit.html',
    'article-utage-beauty-clinic-strategy.html',
    'article-utage-beauty-health-digital-marketing.html',
    'article-utage-calligraphy-school-strategy.html',
    'article-utage-chamber-commerce-seminar-member.html',
    'article-utage-checkout-optimization.html',
    'article-utage-coaching-business-automation.html',
    'article-utage-consultant-success-patterns.html',
    'article-utage-consulting-diagnosis-funnel.html',
    'article-utage-content-management.html',
    'article-utage-cooking-school-recipe-videos.html',
    'article-utage-corporate-training-elearning.html',
    'article-utage-dance-school-automation.html',
    'article-utage-dental-clinic-patient-follow-up.html',
    'article-utage-domain-dkim-spf-setup.html',
    'article-utage-education-committee-parent-notification.html',
    'article-utage-email-setup.html',
    'article-utage-email-spam-prevention.html',
    'article-utage-english-school-level-check.html',
    'article-utage-event-management-automation.html',
    'article-utage-fire-department-disaster-prevention.html',
    'article-utage-fitness-gym-trial-membership-automation.html',
    'article-utage-fitness-sports-online-expansion.html',
    'article-utage-fp-lifeplan-consultation.html',
    'article-utage-free-trial-guide.html',
    'article-utage-funnel-guide.html',
    'article-utage-funnel-seo-strategy.html',
    'article-utage-funnel-vs-clickfunnels.html',
    'article-utage-golf-school-trial-lesson-video-sales.html',
    'article-utage-health-center-consultation-screening.html',
    'article-utage-hellowork-employment-seminar-consultation.html',
    'article-utage-hospital-nurse-recruitment.html',
    'article-utage-hotel-ryokan-direct-booking.html',
    'article-utage-internship-recruitment-system.html',
    'article-utage-it-engineer-recruitment.html',
    'article-utage-japanese-language-school.html',
    'article-utage-judicial-scrivener-inheritance-diagnosis.html',
    'article-utage-kindergarten-trial-newsletter.html',
    'article-utage-label-automation.html',
    'article-utage-landing-page-guide.html',
    'article-utage-lawyer-consultation-estimate-automation.html',
    'article-utage-learning-academy-trial-lessons.html',
    'article-utage-legal-professionals-online-system.html',
    'article-utage-line-delivery-guide.html',
    'article-utage-line-step-delivery.html',
    'article-utage-local-business-digital-transformation.html',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html',
    'article-utage-membership-site-manual.html',
    'article-utage-merits-demerits-2.html',
    'article-utage-mid-career-recruitment-strategy.html',
    'article-utage-mobile-optimization.html',
    'article-utage-multistep-funnel.html',
    'article-utage-municipality-resident-notification.html',
    'article-utage-municipality-staff-recruitment.html',
    'article-utage-music-school-trial-lessons.html',
    'article-utage-new-graduate-recruitment.html',
    'article-utage-nursing-home-tour-booking-automation.html',
    'article-utage-obstetrics-maternity-class-automation.html',
    'article-utage-online-course-creation.html',
    'article-utage-online-education-complete-guide.html',
    'article-utage-optin-page-design.html',
    'article-utage-part-time-recruitment-automation.html',
    'article-utage-payment-integration-guide.html',
    'article-utage-pet-hotel-booking-care-video-sales.html',
    'article-utage-pharmacy-health-consultation.html',
    'article-utage-photo-studio-booking-photographer-training.html',
    'article-utage-pricing.html',
    'article-utage-programming-school-free-courses.html',
    'article-utage-psychiatry-initial-consultation-questionnaire.html',
    'article-utage-qualification-prep-school.html',
    'article-utage-real-estate-digital-transformation.html',
    'article-utage-real-estate-property-training.html',
    'article-utage-rehabilitation-center-training-videos.html',
    'article-utage-reminder-system.html',
    'article-utage-restaurant-reservation-member-menu.html',
    'article-utage-sales-page-psychology.html',
    'article-utage-seitai-clinic-management.html',
    'article-utage-sme-consultant-subsidy-guide.html',
    'article-utage-sr-firm-labor-diagnosis.html',
    'article-utage-sr-subsidy-diagnosis-consultation.html',
    'article-utage-staffing-company-management.html',
    'article-utage-step-mail-course.html',
    'article-utage-student-management.html',
    'article-utage-subscription-business.html',
    'article-utage-support-guide.html',
    'article-utage-tax-office-consultation-conversion.html',
    'article-utage-teacher-recruitment-strategy.html',
    'article-utage-template-guide.html',
    'article-utage-thanks-page-upsell.html',
    'article-utage-tourism-association-tour-booking.html',
    'article-utage-veterinary-clinic-vaccination-reminder.html',
    'article-utage-video-content-management.html',
    'article-utage-visiting-nurse-schedule-management.html',
    'article-utage-vs-comparison-new.html',
    'article-utage-vs-comparison.html',
    'article-utage-vs-myasp-email-comparison.html',
    'article-utage-vs-teachable-comparison.html',
    'article-utage-webinar-registration-page.html',
    'article-utage-welfare-facility-recruitment.html',
    'article-utage-yoga-studio-class-booking-online-lessons.html'
];

// CSSスタイル
const cssStyle = `    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- 記事ナビゲーション用スタイル -->
    <style>
        .myblog-article-navigation {
            margin: 40px 0;
            padding: 30px 0;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .myblog-nav-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            max-width: 100%;
        }
        
        .myblog-nav-prev,
        .myblog-nav-next {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            background: #fafafa;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: block;
            min-height: 80px;
        }
        
        .myblog-nav-prev:hover,
        .myblog-nav-next:hover {
            background: #f0f0f0;
            border-color: #0071e3;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 113, 227, 0.1);
        }
        
        .myblog-nav-prev.disabled,
        .myblog-nav-next.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f5f5f5;
        }
        
        .myblog-nav-prev.disabled:hover,
        .myblog-nav-next.disabled:hover {
            transform: none;
            box-shadow: none;
            border-color: #e0e0e0;
            background: #f5f5f5;
        }
        
        .myblog-nav-label {
            display: block;
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .myblog-nav-title {
            font-size: 0.95rem;
            font-weight: 600;
            line-height: 1.4;
            color: #333;
        }
        
        .myblog-nav-prev .myblog-nav-label::before {
            content: "← ";
            margin-right: 4px;
        }
        
        .myblog-nav-next .myblog-nav-label::after {
            content: " →";
            margin-left: 4px;
        }
        
        @media (max-width: 768px) {
            .myblog-nav-container {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .myblog-nav-prev,
            .myblog-nav-next {
                padding: 16px;
                min-height: 70px;
            }
            
            .myblog-nav-title {
                font-size: 0.9rem;
            }
        }
    </style>
    
    <!-- SEO関連 -->`;

// HTMLナビゲーション
const navigationHtml = `                </div>

                <!-- 記事ナビゲーション -->
                <div class="myblog-article-navigation">
                    <div class="myblog-nav-container">
                        <div class="myblog-nav-prev" id="prevArticle">
                            <span class="myblog-nav-label">前の記事</span>
                            <div class="myblog-nav-title" id="prevTitle">読み込み中...</div>
                        </div>
                        <div class="myblog-nav-next" id="nextArticle">
                            <span class="myblog-nav-label">次の記事</span>
                            <div class="myblog-nav-title" id="nextTitle">読み込み中...</div>
                        </div>
                    </div>
                </div>

                <!-- 関連記事 -->`;

// JavaScript
const jsCode = `    <script src="../js/main.js" defer></script>
    <script src="myblog-script.js" defer></script>
    
    <!-- 記事ナビゲーション機能 -->
    <script>
        // 全ブログ記事の配列（アルファベット順）
        const articleList = [
            ${articleList.map(article => `'${article}'`).join(',\n            ')}
        ];

        // 現在の記事のファイル名を取得
        function getCurrentArticleFilename() {
            const path = window.location.pathname;
            return path.substring(path.lastIndexOf('/') + 1);
        }

        // 記事タイトルを取得（ファイル名から推測）
        function getArticleTitle(filename) {
            return filename.replace('article-utage-', '').replace('.html', '').replace(/-/g, ' ');
        }

        // ナビゲーションを初期化
        function initializeNavigation() {
            const currentFilename = getCurrentArticleFilename();
            const currentIndex = articleList.indexOf(currentFilename);
            
            const prevArticle = document.getElementById('prevArticle');
            const nextArticle = document.getElementById('nextArticle');
            const prevTitle = document.getElementById('prevTitle');
            const nextTitle = document.getElementById('nextTitle');

            // 前の記事
            if (currentIndex > 0) {
                const prevFilename = articleList[currentIndex - 1];
                const prevTitleText = getArticleTitle(prevFilename);
                prevTitle.textContent = prevTitleText.length > 50 ? 
                    prevTitleText.substring(0, 50) + '...' : prevTitleText;
                prevArticle.onclick = () => window.location.href = prevFilename;
                prevArticle.style.cursor = 'pointer';
            } else {
                prevTitle.textContent = '最初の記事です';
                prevArticle.classList.add('disabled');
                prevArticle.onclick = null;
            }

            // 次の記事
            if (currentIndex < articleList.length - 1 && currentIndex !== -1) {
                const nextFilename = articleList[currentIndex + 1];
                const nextTitleText = getArticleTitle(nextFilename);
                nextTitle.textContent = nextTitleText.length > 50 ? 
                    nextTitleText.substring(0, 50) + '...' : nextTitleText;
                nextArticle.onclick = () => window.location.href = nextFilename;
                nextArticle.style.cursor = 'pointer';
            } else {
                nextTitle.textContent = '最後の記事です';
                nextArticle.classList.add('disabled');
                nextArticle.onclick = null;
            }
        }

        // DOMが読み込まれたら初期化
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    </script>
</body>
</html>`;

let processedCount = 0;
let skippedCount = 0;
let errorCount = 0;

console.log('ブログ記事ナビゲーション一括追加スクリプト開始...');
console.log(`対象記事数: ${articleList.length}`);

for (const article of articleList) {
    const filePath = path.join('blog', article);
    
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`❌ ファイルが見つかりません: ${article}`);
            continue;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 既にナビゲーションが存在するかチェック
        if (content.includes('myblog-article-navigation')) {
            console.log(`⏭️  スキップ（既存）: ${article}`);
            skippedCount++;
            continue;
        }
        
        let modified = false;
        
        // 1. CSSスタイル追加
        if (!content.includes('記事ナビゲーション用スタイル')) {
            content = content.replace(
                /(    <link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">)/,
                cssStyle
            );
            modified = true;
        }
        
        // 2. HTMLナビゲーション追加
        if (!content.includes('<div class="myblog-article-navigation">')) {
            content = content.replace(
                /                <!-- 関連記事 -->/,
                navigationHtml
            );
            modified = true;
        }
        
        // 3. JavaScript追加
        if (!content.includes('全ブログ記事の配列')) {
            content = content.replace(
                /(    <script src="\.\.\/js\/main\.js" defer><\/script>\s+<script src="myblog-script\.js" defer><\/script>\s+<\/body>\s+<\/html>)/,
                jsCode
            );
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 処理完了: ${article}`);
            processedCount++;
        } else {
            console.log(`ℹ️  変更なし: ${article}`);
        }
        
    } catch (error) {
        console.log(`❌ エラー: ${article} - ${error.message}`);
        errorCount++;
    }
}

console.log('\n=== 処理結果 ===');
console.log(`✅ 処理済み: ${processedCount} 件`);
console.log(`⏭️  スキップ: ${skippedCount} 件`);
console.log(`❌ エラー: ${errorCount} 件`);
console.log(`📊 合計: ${articleList.length} 件`);

if (processedCount > 0) {
    console.log('\n🎉 記事ナビゲーション機能の追加が完了しました！');
}
