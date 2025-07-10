# 全記事の「読み込み中...」問題を直接修正
# より確実なアプローチ

$blogDir = "blog"
$fixedCount = 0

# 記事リスト（手動で定義）
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
    'article-utage-landing-page-guide.html',
    'article-utage-lawyer-consultation-estimate-automation.html',
    'article-utage-learning-academy-trial-lessons.html',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html',
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

# 日本語タイトル対応表
$titleMap = @{
    'article-utage-accounting-cloud-bookkeeping.html' = '会計事務所のUTAGE｜クラウド会計導入支援'
    'article-utage-administrative-scrivener-license-permit.html' = '行政書士のUTAGE活用｜許認可業務の効率化'
    'article-utage-beauty-clinic-strategy.html' = '美容クリニックのUTAGE戦略'
    'article-utage-beauty-health-digital-marketing.html' = '美容・健康業界のデジタルマーケティング'
    'article-utage-calligraphy-school-strategy.html' = '書道教室のUTAGE戦略'
    'article-utage-chamber-commerce-seminar-member.html' = '商工会議所のUTAGE活用'
    'article-utage-checkout-optimization.html' = 'UTAGEチェックアウト最適化'
    'article-utage-coaching-business-automation.html' = 'コーチング業界のビジネス自動化'
    'article-utage-consultant-success-patterns.html' = 'UTAGEコンサルタント成功パターン'
    'article-utage-consulting-diagnosis-funnel.html' = 'コンサルティング診断ファンネル'
    'article-utage-content-management.html' = 'UTAGEコンテンツ管理システム'
    'article-utage-cooking-school-recipe-videos.html' = '料理教室のレシピ動画販売'
    'article-utage-corporate-training-elearning.html' = '企業研修のeラーニング'
    'article-utage-dance-school-automation.html' = 'ダンススクールの自動化'
    'article-utage-dental-clinic-patient-follow-up.html' = '歯科医院の患者フォローアップ'
    'article-utage-domain-dkim-spf-setup.html' = 'UTAGEドメイン・DKIM・SPF設定'
    'article-utage-education-committee-parent-notification.html' = '教育委員会の保護者通知'
    'article-utage-email-setup.html' = 'UTAGEメール設定完全ガイド'
    'article-utage-email-spam-prevention.html' = 'UTAGEメールスパム対策'
    'article-utage-english-school-level-check.html' = '英会話スクールのレベルチェック'
    'article-utage-event-management-automation.html' = 'イベント管理の自動化'
    'article-utage-fire-department-disaster-prevention.html' = '消防署の災害対策'
    'article-utage-fitness-gym-trial-membership-automation.html' = 'フィットネスジムの体験入会自動化'
    'article-utage-fitness-sports-online-expansion.html' = 'フィットネス・スポーツのオンライン展開'
    'article-utage-fp-lifeplan-consultation.html' = 'FPのライフプラン相談'
    'article-utage-free-trial-guide.html' = 'UTAGE無料トライアル完全ガイド'
    'article-utage-funnel-guide.html' = 'UTAGEファンネル構築ガイド'
    'article-utage-funnel-seo-strategy.html' = 'UTAGEファンネルSEO戦略'
    'article-utage-funnel-vs-clickfunnels.html' = 'UTAGE vs ClickFunnels 比較'
    'article-utage-golf-school-trial-lesson-video-sales.html' = 'ゴルフスクールの体験レッスン動画販売'
    'article-utage-health-center-consultation-screening.html' = '保健センターの相談・検診'
    'article-utage-hellowork-employment-seminar-consultation.html' = 'ハローワークの就職セミナー・相談'
    'article-utage-hospital-nurse-recruitment.html' = '病院の看護師募集'
    'article-utage-hotel-ryokan-direct-booking.html' = 'ホテル・旅館の直接予約'
    'article-utage-internship-recruitment-system.html' = 'インターンシップ募集システム'
    'article-utage-it-engineer-recruitment.html' = 'ITエンジニア募集'
    'article-utage-japanese-language-school.html' = '日本語学校'
    'article-utage-judicial-scrivener-inheritance-diagnosis.html' = '司法書士の相続診断'
    'article-utage-kindergarten-trial-newsletter.html' = '幼稚園の体験・お便り'
    'article-utage-landing-page-guide.html' = 'UTAGEランディングページ作成ガイド'
    'article-utage-lawyer-consultation-estimate-automation.html' = '弁護士の相談・見積もり自動化'
    'article-utage-learning-academy-trial-lessons.html' = '学習塾の体験授業'
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html' = '結婚相談所の相談・お見合い知識'
    'article-utage-merits-demerits-2.html' = 'UTAGEのメリット・デメリット完全解説'
    'article-utage-mid-career-recruitment-strategy.html' = '中途採用戦略'
    'article-utage-mobile-optimization.html' = 'UTAGEモバイル最適化'
    'article-utage-multistep-funnel.html' = 'UTAGEマルチステップファンネル'
    'article-utage-municipality-resident-notification.html' = '自治体の住民通知'
    'article-utage-municipality-staff-recruitment.html' = '自治体職員募集'
    'article-utage-music-school-trial-lessons.html' = '音楽教室の体験レッスン'
    'article-utage-new-graduate-recruitment.html' = '新卒採用'
    'article-utage-nursing-home-tour-booking-automation.html' = '老人ホームの見学予約自動化'
    'article-utage-obstetrics-maternity-class-automation.html' = '産婦人科のマタニティクラス自動化'
    'article-utage-online-course-creation.html' = 'UTAGEオンラインコース作成'
    'article-utage-online-education-complete-guide.html' = 'UTAGEオンライン教育完全ガイド'
    'article-utage-optin-page-design.html' = 'UTAGEオプトインページデザイン'
    'article-utage-part-time-recruitment-automation.html' = 'アルバイト募集自動化'
    'article-utage-payment-integration-guide.html' = 'UTAGE決済連携ガイド'
    'article-utage-pet-hotel-booking-care-video-sales.html' = 'ペットホテル予約・ケア動画販売'
    'article-utage-pharmacy-health-consultation.html' = '薬局の健康相談'
    'article-utage-photo-studio-booking-photographer-training.html' = 'フォトスタジオ予約・カメラマン研修'
    'article-utage-pricing.html' = 'UTAGE料金プラン完全ガイド'
    'article-utage-programming-school-free-courses.html' = 'プログラミングスクールの無料講座'
    'article-utage-psychiatry-initial-consultation-questionnaire.html' = '精神科の初診問診票'
    'article-utage-qualification-prep-school.html' = '資格予備校'
    'article-utage-real-estate-digital-transformation.html' = '不動産業界のデジタル変革'
    'article-utage-real-estate-property-training.html' = '不動産物件研修'
    'article-utage-rehabilitation-center-training-videos.html' = 'リハビリセンターの研修動画'
    'article-utage-reminder-system.html' = 'UTAGEリマインダーシステム'
    'article-utage-restaurant-reservation-member-menu.html' = 'レストラン予約・会員メニュー'
    'article-utage-sales-page-psychology.html' = 'UTAGEセールスページ心理学'
    'article-utage-seitai-clinic-management.html' = '整体院の経営'
    'article-utage-sme-consultant-subsidy-guide.html' = '中小企業診断士の補助金ガイド'
    'article-utage-sr-firm-labor-diagnosis.html' = '社労士事務所の労働診断'
    'article-utage-sr-subsidy-diagnosis-consultation.html' = '社労士の助成金診断・相談'
    'article-utage-staffing-company-management.html' = '人材派遣会社の管理'
    'article-utage-step-mail-course.html' = 'UTAGEステップメール講座'
    'article-utage-student-management.html' = 'UTAGE受講生管理システム'
    'article-utage-subscription-business.html' = 'UTAGEサブスクリプションビジネス'
    'article-utage-support-guide.html' = 'UTAGEサポート完全ガイド'
    'article-utage-tax-office-consultation-conversion.html' = '税理士事務所の無料相談'
    'article-utage-teacher-recruitment-strategy.html' = '教員採用戦略'
    'article-utage-template-guide.html' = 'UTAGEテンプレート活用ガイド'
    'article-utage-thanks-page-upsell.html' = 'UTAGEサンクスページアップセル'
    'article-utage-tourism-association-tour-booking.html' = '観光協会のツアー予約'
    'article-utage-veterinary-clinic-vaccination-reminder.html' = '動物病院のワクチン予約リマインダー'
    'article-utage-video-content-management.html' = 'UTAGE動画コンテンツ管理'
    'article-utage-visiting-nurse-schedule-management.html' = '訪問看護のスケジュール管理'
    'article-utage-vs-comparison-new.html' = 'UTAGE比較 最新版'
    'article-utage-vs-comparison.html' = 'UTAGE vs 他社ツール比較'
    'article-utage-vs-myasp-email-comparison.html' = 'UTAGE vs MyASP メール比較'
    'article-utage-vs-teachable-comparison.html' = 'UTAGE vs Teachable 比較'
    'article-utage-webinar-registration-page.html' = 'UTAGEウェビナー登録ページ'
    'article-utage-welfare-facility-recruitment.html' = '福祉施設の職員募集'
    'article-utage-yoga-studio-class-booking-online-lessons.html' = 'ヨガスタジオのクラス予約・オンラインレッスン'
}

Write-Host "=== 全記事「読み込み中...」問題緊急修正 ===" -ForegroundColor Red

for ($i = 0; $i -lt $articleList.Count; $i++) {
    $filename = $articleList[$i]
    $filePath = "$blogDir\$filename"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        if ($content -match '読み込み中\.\.\.') {
            # 前後の記事を決定
            $prevTitle = "最初の記事です"
            $nextTitle = "最後の記事です"
            $prevLink = ""
            $nextLink = ""
            
            if ($i -gt 0) {
                $prevFilename = $articleList[$i - 1]
                $prevTitle = $titleMap[$prevFilename]
                if (-not $prevTitle) { $prevTitle = $prevFilename -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
                $prevLink = "href=`"$prevFilename`""
            }
            
            if ($i -lt ($articleList.Count - 1)) {
                $nextFilename = $articleList[$i + 1]
                $nextTitle = $titleMap[$nextFilename]
                if (-not $nextTitle) { $nextTitle = $nextFilename -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
                $nextLink = "href=`"$nextFilename`""
            }
            
            # 旧ナビゲーションを新ナビゲーションで置換
            $oldNavPattern = '<div class="myblog-nav-prev"[^>]*>.*?<div class="myblog-nav-title"[^>]*>読み込み中\.\.\.</div>.*?</div>'
            $newPrevNav = if ($prevLink) { "<a $prevLink class=`"myblog-nav-prev`"><span class=`"myblog-nav-label`">前の記事</span><div class=`"myblog-nav-title`">$prevTitle</div></a>" } else { "<div class=`"myblog-nav-prev disabled`"><span class=`"myblog-nav-label`">前の記事</span><div class=`"myblog-nav-title`">$prevTitle</div></div>" }
            $content = $content -replace $oldNavPattern, $newPrevNav
            
            $oldNextPattern = '<div class="myblog-nav-next"[^>]*>.*?<div class="myblog-nav-title"[^>]*>読み込み中\.\.\.</div>.*?</div>'
            $newNextNav = if ($nextLink) { "<a $nextLink class=`"myblog-nav-next`"><span class=`"myblog-nav-label`">次の記事</span><div class=`"myblog-nav-title`">$nextTitle</div></a>" } else { "<div class=`"myblog-nav-next disabled`"><span class=`"myblog-nav-label`">次の記事</span><div class=`"myblog-nav-title`">$nextTitle</div></div>" }
            $content = $content -replace $oldNextPattern, $newNextNav
            
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "✅ $filename" -ForegroundColor Green
            $fixedCount++
        }
    }
}

Write-Host "`n🎉 修正完了: $fixedCount 記事" -ForegroundColor Green
