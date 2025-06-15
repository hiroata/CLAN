# ブログ記事ナビゲーション追加スクリプト

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

Write-Host "ブログ記事ナビゲーション追加を開始します..." -ForegroundColor Green
Write-Host "対象記事数: $($articleList.Count)" -ForegroundColor Cyan

$processedCount = 0
$skippedCount = 0

foreach ($article in $articleList) {
    $filePath = "blog\$article"
    
    if (Test-Path $filePath) {
        Write-Host "処理中: $article" -ForegroundColor Yellow
        
        try {
            # ファイル内容を読み込み
            $content = Get-Content $filePath -Raw -Encoding UTF8
            
            # 既にナビゲーションが存在するかチェック
            if ($content -match "myblog-article-navigation") {
                Write-Host "  -> 既にナビゲーションが存在するためスキップ" -ForegroundColor Gray
                $skippedCount++
                continue
            }
            
            # CSSスタイルを追加（headセクション内）
            $cssStyle = @"
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
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
    
    <!-- SEO関連 -->
"@
            
            # CSSを挿入
            $content = $content -replace "    <link rel=""stylesheet"" href=""https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/6\.4\.0/css/all\.min\.css"">`r?`n", $cssStyle
            
            Write-Host "処理完了: $article" -ForegroundColor Green
            $processedCount++
            
            # ファイルに書き戻し
            Set-Content $filePath -Value $content -Encoding UTF8
        }
        catch {
            Write-Host "  -> エラー: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "ファイルが見つかりません: $filePath" -ForegroundColor Red
    }
}

Write-Host "`n処理完了!" -ForegroundColor Green
Write-Host "処理済み: $processedCount 件" -ForegroundColor Cyan
Write-Host "スキップ: $skippedCount 件" -ForegroundColor Gray
