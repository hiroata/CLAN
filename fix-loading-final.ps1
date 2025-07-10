# 「読み込み中...」を確実に修正するシンプルなスクリプト

$blogDir = "blog"
$fixedCount = 0

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

# 全HTMLファイルを取得
$htmlFiles = Get-ChildItem "$blogDir\*.html" | Sort-Object Name

Write-Host "=== 「読み込み中...」を直接置換修正 ===" -ForegroundColor Red

foreach ($file in $htmlFiles) {
    $fileName = $file.Name
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match '読み込み中\.\.\.') {
        # 該当記事のインデックスを見つける
        $articleIndex = [array]::IndexOf($htmlFiles.Name, $fileName)
        
        # 前後の記事を決定
        $prevTitle = "最初の記事です"
        $nextTitle = "最後の記事です"
        $prevLink = ""
        $nextLink = ""
        
        if ($articleIndex -gt 0) {
            $prevFileName = $htmlFiles[$articleIndex - 1].Name
            $prevTitle = $titleMap[$prevFileName]
            if (-not $prevTitle) { $prevTitle = $prevFileName -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
            $prevLink = $prevFileName
        }
        
        if ($articleIndex -lt ($htmlFiles.Count - 1)) {
            $nextFileName = $htmlFiles[$articleIndex + 1].Name
            $nextTitle = $titleMap[$nextFileName]
            if (-not $nextTitle) { $nextTitle = $nextFileName -replace 'article-utage-', '' -replace '\.html', '' -replace '-', ' ' }
            $nextLink = $nextFileName
        }
        
        # シンプルな置換
        $content = $content -replace '読み込み中\.\.\.', "記事を読み込み中"
        $content = $content -replace '<div class="myblog-nav-title" id="prevTitle">記事を読み込み中</div>', "<div class=`"myblog-nav-title`" id=`"prevTitle`">$prevTitle</div>"
        $content = $content -replace '<div class="myblog-nav-title" id="nextTitle">記事を読み込み中</div>', "<div class=`"myblog-nav-title`" id=`"nextTitle`">$nextTitle</div>"
        
        # リンクを追加
        if ($prevLink) {
            $content = $content -replace '<div class="myblog-nav-prev"([^>]*)>', "<a href=`"$prevLink`" class=`"myblog-nav-prev`"`$1>"
            $content = $content -replace '</div>\s*<div class="myblog-nav-next"', "</a>`n                        <div class=`"myblog-nav-next`""
        }
        
        if ($nextLink) {
            $content = $content -replace '<div class="myblog-nav-next"([^>]*)>', "<a href=`"$nextLink`" class=`"myblog-nav-next`"`$1>"
            $content = $content -replace '</div>\s*</div>\s*</div>\s*<!-- 関連記事 -->', "</a>`n                    </div>`n                </div>`n`n                <!-- 関連記事 -->"
        }
        
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "✅ $fileName" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`n🎉 修正完了: $fixedCount 記事" -ForegroundColor Green
