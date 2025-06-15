# 全ブログ記事ナビゲーション一括追加スクリプト

param(
    [switch]$Force = $false  # 既存のナビゲーションを上書きするかどうか
)

# 全記事リスト
$articleList = @(
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
)

Write-Host "=== ブログ記事ナビゲーション一括追加スクリプト ===" -ForegroundColor Cyan
Write-Host "対象記事数: $($articleList.Count)" -ForegroundColor Green
Write-Host "Force モード: $Force" -ForegroundColor Yellow
Write-Host ""

$processedCount = 0
$skippedCount = 0
$errorCount = 0
$notFoundCount = 0

foreach ($article in $articleList) {
    $filePath = "blog\$article"
    
    Write-Host "[$($articleList.IndexOf($article) + 1)/$($articleList.Count)] $article" -ForegroundColor White
    
    if (-not (Test-Path $filePath)) {
        Write-Host "  ❌ ファイルが見つかりません" -ForegroundColor Red
        $notFoundCount++
        continue
    }
    
    try {
        # ファイル内容を読み込み
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 既にナビゲーションが存在するかチェック
        if ($content -match "myblog-article-navigation" -and -not $Force) {
            Write-Host "  ⏭️  既にナビゲーションが存在（スキップ）" -ForegroundColor Gray
            $skippedCount++
            continue
        }
        
        $modified = $false
        
        # 1. CSSスタイル追加（まだ存在しない場合）
        if (-not ($content -match "myblog-article-navigation")) {
            $cssPattern = '(\s+<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/6\.4\.0/css/all\.min\.css">)'
            $cssReplacement = @'
$1
    
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
'@
            $content = $content -replace $cssPattern, $cssReplacement
            $modified = $true
        }
        
        # 2. HTMLナビゲーション追加（関連記事の前）
        if (-not ($content -match '<div class="myblog-article-navigation">')) {
            $htmlPattern = '(\s+)(<!-- 関連記事 -->)'
            $htmlReplacement = @'
$1</div>

$1<!-- 記事ナビゲーション -->
$1<div class="myblog-article-navigation">
$1    <div class="myblog-nav-container">
$1        <div class="myblog-nav-prev" id="prevArticle">
$1            <span class="myblog-nav-label">前の記事</span>
$1            <div class="myblog-nav-title" id="prevTitle">読み込み中...</div>
$1        </div>
$1        <div class="myblog-nav-next" id="nextArticle">
$1            <span class="myblog-nav-label">次の記事</span>
$1            <div class="myblog-nav-title" id="nextTitle">読み込み中...</div>
$1        </div>
$1    </div>
$1</div>

$1$2
'@
            $content = $content -replace $htmlPattern, $htmlReplacement
            $modified = $true
        }
        
        # 3. JavaScript追加（</body>の前）
        if (-not ($content -match "全ブログ記事の配列")) {
            $jsPattern = '(\s+)<script src="../js/main\.js" defer></script>\s+<script src="myblog-script\.js" defer></script>\s+</body>\s+</html>'
            $jsReplacement = @'
$1<script src="../js/main.js" defer></script>
$1<script src="myblog-script.js" defer></script>
$1
$1<!-- 記事ナビゲーション機能 -->
$1<script>
$1    // 全ブログ記事の配列（アルファベット順）
$1    const articleList = [
$1        'article-utage-accounting-cloud-bookkeeping.html',
$1        'article-utage-administrative-scrivener-license-permit.html',
$1        'article-utage-beauty-clinic-strategy.html',
$1        'article-utage-beauty-health-digital-marketing.html',
$1        'article-utage-calligraphy-school-strategy.html',
$1        'article-utage-chamber-commerce-seminar-member.html',
$1        'article-utage-checkout-optimization.html',
$1        'article-utage-coaching-business-automation.html',
$1        'article-utage-consultant-success-patterns.html',
$1        'article-utage-consulting-diagnosis-funnel.html',
$1        'article-utage-content-management.html',
$1        'article-utage-cooking-school-recipe-videos.html',
$1        'article-utage-corporate-training-elearning.html',
$1        'article-utage-dance-school-automation.html',
$1        'article-utage-dental-clinic-patient-follow-up.html',
$1        'article-utage-domain-dkim-spf-setup.html',
$1        'article-utage-education-committee-parent-notification.html',
$1        'article-utage-email-setup.html',
$1        'article-utage-email-spam-prevention.html',
$1        'article-utage-english-school-level-check.html',
$1        'article-utage-event-management-automation.html',
$1        'article-utage-fire-department-disaster-prevention.html',
$1        'article-utage-fitness-gym-trial-membership-automation.html',
$1        'article-utage-fitness-sports-online-expansion.html',
$1        'article-utage-fp-lifeplan-consultation.html',
$1        'article-utage-free-trial-guide.html',
$1        'article-utage-funnel-guide.html',
$1        'article-utage-funnel-seo-strategy.html',
$1        'article-utage-funnel-vs-clickfunnels.html',
$1        'article-utage-golf-school-trial-lesson-video-sales.html',
$1        'article-utage-health-center-consultation-screening.html',
$1        'article-utage-hellowork-employment-seminar-consultation.html',
$1        'article-utage-hospital-nurse-recruitment.html',
$1        'article-utage-hotel-ryokan-direct-booking.html',
$1        'article-utage-internship-recruitment-system.html',
$1        'article-utage-it-engineer-recruitment.html',
$1        'article-utage-japanese-language-school.html',
$1        'article-utage-judicial-scrivener-inheritance-diagnosis.html',
$1        'article-utage-kindergarten-trial-newsletter.html',
$1        'article-utage-label-automation.html',
$1        'article-utage-landing-page-guide.html',
$1        'article-utage-lawyer-consultation-estimate-automation.html',
$1        'article-utage-learning-academy-trial-lessons.html',
$1        'article-utage-legal-professionals-online-system.html',
$1        'article-utage-line-delivery-guide.html',
$1        'article-utage-line-step-delivery.html',
$1        'article-utage-local-business-digital-transformation.html',
$1        'article-utage-marriage-agency-consultation-matchmaking-knowledge.html',
$1        'article-utage-membership-site-manual.html',
$1        'article-utage-merits-demerits-2.html',
$1        'article-utage-mid-career-recruitment-strategy.html',
$1        'article-utage-mobile-optimization.html',
$1        'article-utage-multistep-funnel.html',
$1        'article-utage-municipality-resident-notification.html',
$1        'article-utage-municipality-staff-recruitment.html',
$1        'article-utage-music-school-trial-lessons.html',
$1        'article-utage-new-graduate-recruitment.html',
$1        'article-utage-nursing-home-tour-booking-automation.html',
$1        'article-utage-obstetrics-maternity-class-automation.html',
$1        'article-utage-online-course-creation.html',
$1        'article-utage-online-education-complete-guide.html',
$1        'article-utage-optin-page-design.html',
$1        'article-utage-part-time-recruitment-automation.html',
$1        'article-utage-payment-integration-guide.html',
$1        'article-utage-pet-hotel-booking-care-video-sales.html',
$1        'article-utage-pharmacy-health-consultation.html',
$1        'article-utage-photo-studio-booking-photographer-training.html',
$1        'article-utage-pricing.html',
$1        'article-utage-programming-school-free-courses.html',
$1        'article-utage-psychiatry-initial-consultation-questionnaire.html',
$1        'article-utage-qualification-prep-school.html',
$1        'article-utage-real-estate-digital-transformation.html',
$1        'article-utage-real-estate-property-training.html',
$1        'article-utage-rehabilitation-center-training-videos.html',
$1        'article-utage-reminder-system.html',
$1        'article-utage-restaurant-reservation-member-menu.html',
$1        'article-utage-sales-page-psychology.html',
$1        'article-utage-seitai-clinic-management.html',
$1        'article-utage-sme-consultant-subsidy-guide.html',
$1        'article-utage-sr-firm-labor-diagnosis.html',
$1        'article-utage-sr-subsidy-diagnosis-consultation.html',
$1        'article-utage-staffing-company-management.html',
$1        'article-utage-step-mail-course.html',
$1        'article-utage-student-management.html',
$1        'article-utage-subscription-business.html',
$1        'article-utage-support-guide.html',
$1        'article-utage-tax-office-consultation-conversion.html',
$1        'article-utage-teacher-recruitment-strategy.html',
$1        'article-utage-template-guide.html',
$1        'article-utage-thanks-page-upsell.html',
$1        'article-utage-tourism-association-tour-booking.html',
$1        'article-utage-veterinary-clinic-vaccination-reminder.html',
$1        'article-utage-video-content-management.html',
$1        'article-utage-visiting-nurse-schedule-management.html',
$1        'article-utage-vs-comparison-new.html',
$1        'article-utage-vs-comparison.html',
$1        'article-utage-vs-myasp-email-comparison.html',
$1        'article-utage-vs-teachable-comparison.html',
$1        'article-utage-webinar-registration-page.html',
$1        'article-utage-welfare-facility-recruitment.html',
$1        'article-utage-yoga-studio-class-booking-online-lessons.html'
$1    ];
$1
$1    // 現在の記事のファイル名を取得
$1    function getCurrentArticleFilename() {
$1        const path = window.location.pathname;
$1        return path.substring(path.lastIndexOf('/') + 1);
$1    }
$1
$1    // 記事タイトルを取得（実際のページタイトルまたはファイル名から）
$1    function getArticleTitle(filename) {
$1        // ファイル名から推測
$1        return filename.replace('article-utage-', '').replace('.html', '').replace(/-/g, ' ');
$1    }
$1
$1    // ナビゲーションを初期化
$1    function initializeNavigation() {
$1        const currentFilename = getCurrentArticleFilename();
$1        const currentIndex = articleList.indexOf(currentFilename);
$1        
$1        const prevArticle = document.getElementById('prevArticle');
$1        const nextArticle = document.getElementById('nextArticle');
$1        const prevTitle = document.getElementById('prevTitle');
$1        const nextTitle = document.getElementById('nextTitle');
$1
$1        // 前の記事
$1        if (currentIndex > 0) {
$1            const prevFilename = articleList[currentIndex - 1];
$1            const prevTitleText = getArticleTitle(prevFilename);
$1            prevTitle.textContent = prevTitleText.length > 50 ? 
$1                prevTitleText.substring(0, 50) + '...' : prevTitleText;
$1            prevArticle.onclick = () => window.location.href = prevFilename;
$1            prevArticle.style.cursor = 'pointer';
$1        } else {
$1            prevTitle.textContent = '最初の記事です';
$1            prevArticle.classList.add('disabled');
$1            prevArticle.onclick = null;
$1        }
$1
$1        // 次の記事
$1        if (currentIndex < articleList.length - 1 && currentIndex !== -1) {
$1            const nextFilename = articleList[currentIndex + 1];
$1            const nextTitleText = getArticleTitle(nextFilename);
$1            nextTitle.textContent = nextTitleText.length > 50 ? 
$1                nextTitleText.substring(0, 50) + '...' : nextTitleText;
$1            nextArticle.onclick = () => window.location.href = nextFilename;
$1            nextArticle.style.cursor = 'pointer';
$1        } else {
$1            nextTitle.textContent = '最後の記事です';
$1            nextArticle.classList.add('disabled');
$1            nextArticle.onclick = null;
$1        }
$1    }
$1
$1    // DOMが読み込まれたら初期化
$1    document.addEventListener('DOMContentLoaded', initializeNavigation);
$1</script>
$1</body>
$1</html>
'@
            $content = $content -replace $jsPattern, $jsReplacement
            $modified = $true
        }
        
        if ($modified) {
            # ファイルに書き戻し
            Set-Content $filePath -Value $content -Encoding UTF8
            Write-Host "  ✅ 処理完了" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "  ℹ️  変更なし" -ForegroundColor Blue
        }
    }
    catch {
        Write-Host "  ❌ エラー: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "=== 処理結果 ===" -ForegroundColor Cyan
Write-Host "✅ 処理済み: $processedCount 件" -ForegroundColor Green
Write-Host "⏭️  スキップ: $skippedCount 件" -ForegroundColor Gray
Write-Host "❌ エラー: $errorCount 件" -ForegroundColor Red
Write-Host "📁 見つからず: $notFoundCount 件" -ForegroundColor Yellow
Write-Host "📊 合計: $($articleList.Count) 件" -ForegroundColor White

if ($processedCount -gt 0) {
    Write-Host ""
    Write-Host "🎉 記事ナビゲーション機能の追加が完了しました！" -ForegroundColor Green
    Write-Host "各記事で「前の記事」「次の記事」ボタンが利用できるようになりました。" -ForegroundColor White
}
