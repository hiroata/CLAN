# 全ブログ記事の英語タイトル問題を一括修正するスクリプト
# 70記事のgetArticleTitle関数を日本語タイトル対応に修正

$blogDir = "c:\Users\atara\Desktop\CLAN\blog"
$fixedCount = 0
$errorCount = 0

# 修正対象の記事リスト（英語タイトル問題がある70記事）
$problematicFiles = @(
    "article-utage-accounting-cloud-bookkeeping.html",
    "article-utage-yoga-studio-class-booking-online-lessons.html",
    "article-utage-welfare-facility-recruitment.html",
    "article-utage-vs-comparison.html",
    "article-utage-vs-comparison-new.html",
    "article-utage-visiting-nurse-schedule-management.html",
    "article-utage-veterinary-clinic-vaccination-reminder.html",
    "article-utage-tourism-association-tour-booking.html",
    "article-utage-thanks-page-upsell.html",
    "article-utage-template-guide.html",
    "article-utage-teacher-recruitment-strategy.html",
    "article-utage-tax-office-consultation-conversion.html",
    "article-utage-support-guide.html",
    "article-utage-step-mail-course.html",
    "article-utage-staffing-company-management.html",
    "article-utage-sr-subsidy-diagnosis-consultation.html",
    "article-utage-sr-firm-labor-diagnosis.html",
    "article-utage-sme-consultant-subsidy-guide.html",
    "article-utage-seitai-clinic-management.html",
    "article-utage-sales-page-psychology.html",
    "article-utage-restaurant-reservation-member-menu.html",
    "article-utage-rehabilitation-center-training-videos.html",
    "article-utage-real-estate-property-training.html",
    "article-utage-qualification-prep-school.html",
    "article-utage-psychiatry-initial-consultation-questionnaire.html",
    "article-utage-programming-school-free-courses.html",
    "article-utage-pricing.html",
    "article-utage-photo-studio-booking-photographer-training.html",
    "article-utage-pharmacy-health-consultation.html",
    "article-utage-pet-hotel-booking-care-video-sales.html",
    "article-utage-part-time-recruitment-automation.html",
    "article-utage-optin-page-design.html",
    "article-utage-obstetrics-maternity-class-automation.html",
    "article-utage-nursing-home-tour-booking-automation.html",
    "article-utage-new-graduate-recruitment.html",
    "article-utage-music-school-trial-lessons.html",
    "article-utage-municipality-staff-recruitment.html",
    "article-utage-municipality-resident-notification.html",
    "article-utage-mobile-optimization.html",
    "article-utage-mid-career-recruitment-strategy.html",
    "article-utage-merits-demerits-2.html",
    "article-utage-marriage-agency-consultation-matchmaking-knowledge.html",
    "article-utage-lawyer-consultation-estimate-automation.html",
    "article-utage-landing-page-guide.html",
    "article-utage-learning-academy-trial-lessons.html",
    "article-utage-kindergarten-trial-newsletter.html",
    "article-utage-judicial-scrivener-inheritance-diagnosis.html",
    "article-utage-japanese-language-school.html",
    "article-utage-it-engineer-recruitment.html",
    "article-utage-internship-recruitment-system.html",
    "article-utage-hotel-ryokan-direct-booking.html",
    "article-utage-hospital-nurse-recruitment.html",
    "article-utage-health-center-consultation-screening.html",
    "article-utage-hellowork-employment-seminar-consultation.html",
    "article-utage-golf-school-trial-lesson-video-sales.html",
    "article-utage-funnel-vs-clickfunnels.html",
    "article-utage-free-trial-guide.html",
    "article-utage-fp-lifeplan-consultation.html",
    "article-utage-fitness-gym-trial-membership-automation.html",
    "article-utage-fire-department-disaster-prevention.html",
    "article-utage-english-school-level-check.html",
    "article-utage-email-setup.html",
    "article-utage-education-committee-parent-notification.html",
    "article-utage-dental-clinic-patient-follow-up.html",
    "article-utage-dance-school-automation.html",
    "article-utage-corporate-training-elearning.html",
    "article-utage-cooking-school-recipe-videos.html",
    "article-utage-consulting-diagnosis-funnel.html",
    "article-utage-chamber-commerce-seminar-member.html",
    "article-utage-administrative-scrivener-license-permit.html"
)

Write-Host "=== 英語タイトル問題一括修正開始 ===" -ForegroundColor Yellow
Write-Host "対象記事数: $($problematicFiles.Count)" -ForegroundColor Cyan

foreach ($filename in $problematicFiles) {
    $filePath = Join-Path $blogDir $filename
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  ファイルが見つかりません: $filename" -ForegroundColor Yellow
        continue
    }
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 英語タイトル化のパターンを日本語対応に修正
        $patterns = @(
            @{
                Old = "return filename\.replace\('article-utage-', ''\)\.replace\('\.html', ''\)\.replace\(/-/g, ' '\);"
                New = "return articleTitles[filename] || filename.replace('article-utage-', '').replace('.html', '').replace(/-/g, ' ');"
            }
        )
        
        $modified = $false
        foreach ($pattern in $patterns) {
            if ($content -match $pattern.Old) {
                $content = $content -replace $pattern.Old, $pattern.New
                $modified = $true
                Write-Host "✅ $filename - 英語タイトル→日本語対応に修正" -ForegroundColor Green
            }
        }
        
        if ($modified) {
            # UTF8で保存
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            $fixedCount++
        } else {
            Write-Host "⚠️  $filename - パターンが見つかりませんでした" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ $filename - エラー: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n=== 修正完了 ===" -ForegroundColor Yellow
Write-Host "修正完了: $fixedCount 記事" -ForegroundColor Green
Write-Host "エラー: $errorCount 記事" -ForegroundColor Red

# 修正後の状況を確認
Write-Host "`n=== 修正後の確認 ===" -ForegroundColor Yellow
$remainingIssues = 0
Get-ChildItem -Path "$blogDir\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($content -match "return filename\.replace.*\.replace.*[^|]$") {
        $remainingIssues++
        Write-Host "❌ 英語タイトル問題が残っています: $($_.Name)" -ForegroundColor Red
    }
}

if ($remainingIssues -eq 0) {
    Write-Host "🎉 すべての英語タイトル問題が解決されました！" -ForegroundColor Green
} else {
    Write-Host "⚠️  まだ $remainingIssues 記事に英語タイトル問題が残っています" -ForegroundColor Yellow
}
