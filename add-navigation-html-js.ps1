# ブログ記事ナビゲーション HTML/JS 追加スクリプト

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

Write-Host "ブログ記事ナビゲーション HTML/JS 追加を開始します..." -ForegroundColor Green
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
            
            # HTMLナビゲーションを追加（関連記事の前）
            $navigationHtml = @"
                </div>

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

                <!-- 関連記事 -->
"@
            
            # 関連記事セクションの前にナビゲーションを挿入
            $content = $content -replace "                <!-- 関連記事 -->", $navigationHtml
            
            # JavaScript を追加（</body>の前）
            $jsCode = @"
    <script src="../js/main.js" defer></script>
    <script src="myblog-script.js" defer></script>
    
    <!-- 記事ナビゲーション機能 -->
    <script>
        // 全ブログ記事の配列（アルファベット順）
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

        // 記事タイトルの対応表（短縮版）
        const articleTitles = {
            'article-utage-accounting-cloud-bookkeeping.html': '会計事務所のUTAGE｜クラウド会計導入支援と記帳代行受付',
            'article-utage-administrative-scrivener-license-permit.html': '行政書士のUTAGE活用｜許認可業務の効率化',
            'article-utage-beauty-clinic-strategy.html': '美容クリニックのUTAGE戦略｜カウンセリング予約',
            'article-utage-beauty-health-digital-marketing.html': '美容・健康業界のデジタルマーケティング',
            'article-utage-calligraphy-school-strategy.html': '書道教室のUTAGE戦略｜体験レッスン集客',
            'article-utage-chamber-commerce-seminar-member.html': '商工会議所のUTAGE活用｜セミナー参加者募集',
            'article-utage-checkout-optimization.html': 'UTAGEチェックアウト最適化｜決済率向上',
            'article-utage-coaching-business-automation.html': 'コーチング業界のビジネス自動化',
            'article-utage-consultant-success-patterns.html': 'コンサルタントの成功パターン分析',
            'article-utage-consulting-diagnosis-funnel.html': 'コンサルティング診断ファンネル構築'
        };

        // 現在の記事のファイル名を取得
        function getCurrentArticleFilename() {
            const path = window.location.pathname;
            return path.substring(path.lastIndexOf('/') + 1);
        }

        // 記事タイトルを取得（実際のページタイトルまたはマッピングから）
        function getArticleTitle(filename) {
            if (articleTitles[filename]) {
                return articleTitles[filename];
            }
            // フォールバック: ファイル名から推測
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
</html>
"@
            
            # JavaScriptを挿入
            $content = $content -replace "    <script src=""\.\.\/js\/main\.js"" defer></script>`r?`n    <script src=""myblog-script\.js"" defer></script>`r?`n</body>`r?`n</html>", $jsCode
            
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
