const fs = require('fs');
const path = require('path');

// 統一されたナビゲーションスタイル
const unifiedNavigationCSS = `
    <!-- 記事ナビゲーション用スタイル -->
    <style>
        .myblog-article-navigation {
            margin: 60px 0 40px;
            padding: 40px 0;
            border-top: 2px solid #e0e0e0;
            border-bottom: 2px solid #e0e0e0;
            background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
        }
        
        .myblog-nav-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            max-width: 100%;
        }
        
        .myblog-nav-prev,
        .myblog-nav-next {
            padding: 24px;
            border: 1px solid #e0e0e0;
            border-radius: 16px;
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: block;
            min-height: 100px;
            position: relative;
            overflow: hidden;
        }
        
        .myblog-nav-prev::before,
        .myblog-nav-next::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 113, 227, 0.05), transparent);
            transition: left 0.6s ease;
        }
        
        .myblog-nav-prev:hover::before,
        .myblog-nav-next:hover::before {
            left: 100%;
        }
        
        .myblog-nav-prev:hover,
        .myblog-nav-next:hover {
            background: #f8f9fa;
            border-color: #0071e3;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 113, 227, 0.15);
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
            font-size: 0.875rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .myblog-nav-title {
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.5;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .myblog-nav-prev .myblog-nav-label::before {
            content: "← ";
            margin-right: 4px;
            font-weight: 700;
        }
        
        .myblog-nav-next {
            text-align: right;
        }
        
        .myblog-nav-next .myblog-nav-label::after {
            content: " →";
            margin-left: 4px;
            font-weight: 700;
        }
        
        /* 関連記事セクション統一スタイル */
        .myblog-related {
            margin: 60px 0;
            padding: 40px 0;
            background: #f8f9fa;
            border-radius: 16px;
        }
        
        .myblog-related-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 32px;
            text-align: center;
            position: relative;
        }
        
        .myblog-related-title::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: #0071e3;
            border-radius: 2px;
        }
        
        .myblog-related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            padding: 0 20px;
        }
        
        .myblog-related-card {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .myblog-related-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
            border-color: #0071e3;
        }
        
        .myblog-related-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .myblog-related-image {
            width: 100%;
            height: 200px;
            background: #f0f0f0;
            position: relative;
            overflow: hidden;
        }
        
        .myblog-related-content {
            padding: 20px;
        }
        
        .myblog-related-card-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 12px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .myblog-related-date {
            font-size: 0.875rem;
            color: #666;
            font-weight: 500;
        }
        
        @media (max-width: 768px) {
            .myblog-nav-container {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .myblog-nav-prev,
            .myblog-nav-next {
                padding: 20px;
                min-height: 80px;
                text-align: left;
            }
            
            .myblog-nav-title {
                font-size: 0.938rem;
            }
            
            .myblog-related {
                padding: 24px 0;
                margin: 40px 0;
            }
            
            .myblog-related-grid {
                grid-template-columns: 1fr;
                padding: 0 16px;
            }
            
            .myblog-related-title {
                font-size: 1.5rem;
            }
        }
    </style>`;

// 統一されたナビゲーションHTML構造
const unifiedNavigationHTML = `
    <!-- 記事ナビゲーション -->
    <section class="myblog-article-navigation">
        <div class="myblog-nav-container">
            <div class="myblog-nav-prev" id="prevArticle">
                <span class="myblog-nav-label">前の記事</span>
                <div class="myblog-nav-title" id="prevTitle"></div>
            </div>
            <div class="myblog-nav-next" id="nextArticle">
                <span class="myblog-nav-label">次の記事</span>
                <div class="myblog-nav-title" id="nextTitle"></div>
            </div>
        </div>
    </section>`;

// タイトルマッピング
const titleMapping = {
    'article-utage-accounting-cloud-bookkeeping.html': 'UTAGEでクラウド会計士の記帳代行受付｜業務効率化',
    'article-utage-administrative-scrivener-license-permit.html': '行政書士のUTAGE戦略｜許認可チェックリストと申請代行受付',
    'article-utage-beauty-clinic-strategy.html': '美容クリニックのUTAGE戦略｜カウンセリング予約とアフターケア自動化',
    'article-utage-beauty-health-digital-marketing.html': '美容・健康業界のデジタルマーケティング｜UTAGE活用術',
    'article-utage-calligraphy-school-strategy.html': '書道教室のUTAGE戦略｜お手本動画配信と通信添削受付',
    'article-utage-chamber-commerce-seminar-member.html': '商工会議所のUTAGE｜セミナー集客と会員企業向け情報配信',
    'article-utage-checkout-optimization.html': 'UTAGEチェックアウト最適化｜決済完了率を上げる5つの戦略',
    'article-utage-coaching-business-automation.html': 'コーチングビジネスの自動化｜UTAGE活用で収益アップ',
    'article-utage-consultant-success-patterns.html': 'UTAGEコンサルタント成功パターン｜クライアント獲得戦略',
    'article-utage-consulting-diagnosis-funnel.html': 'コンサルティング業のUTAGE診断ファネル｜見込み客育成術',
    'article-utage-content-management.html': 'UTAGEコンテンツ管理術｜効率的な配信スケジュール戦略',
    'article-utage-cooking-school-recipe-videos.html': '料理教室のUTAGE｜レシピ動画配信と体験レッスン集客',
    'article-utage-corporate-training-elearning.html': '企業研修のUTAGE活用｜eラーニングと受講者管理システム',
    'article-utage-dance-school-automation.html': 'ダンススクールのUTAGE自動化｜体験レッスンから入会まで',
    'article-utage-dental-clinic-patient-follow-up.html': '歯科医院のUTAGE｜患者フォローアップと予約管理システム',
    'article-utage-domain-dkim-spf-setup.html': 'UTAGE独自ドメイン設定｜DKIM・SPFで迷惑メール対策',
    'article-utage-education-committee-parent-notification.html': '教育委員会のUTAGE｜保護者への一斉通知システム',
    'article-utage-email-setup.html': 'UTAGEメール配信機能の使い方｜初心者でも5分で設定完了する方法',
    'article-utage-email-spam-prevention.html': 'UTAGEメール迷惑メール対策｜到達率向上の完全ガイド',
    'article-utage-english-school-level-check.html': '英語スクールのUTAGE｜レベルチェックテストと体験レッスン',
    'article-utage-event-management-automation.html': 'イベント管理の自動化｜UTAGE活用で参加者満足度向上',
    'article-utage-fire-department-disaster-prevention.html': '消防署のUTAGE活用｜防災訓練と市民向け安全啓発',
    'article-utage-fitness-gym-trial-membership-automation.html': 'フィットネスジムのUTAGE｜体験入会から継続まで自動化',
    'article-utage-fitness-sports-online-expansion.html': 'フィットネス・スポーツ業界のオンライン展開｜UTAGE戦略',
    'article-utage-fp-lifeplan-consultation.html': 'FPのUTAGE活用｜ライフプラン相談から契約まで自動化',
    'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全ガイド｜機能制限なしで14日間',
    'article-utage-funnel-guide.html': 'UTAGEファネル構築完全ガイド｜初心者から上級者まで',
    'article-utage-funnel-seo-strategy.html': 'UTAGEファネルSEO戦略｜検索流入からCV向上まで',
    'article-utage-funnel-vs-clickfunnels.html': 'UTAGE vs ClickFunnels比較｜日本企業に最適な選択は？',
    'article-utage-golf-school-trial-lesson-video-sales.html': 'ゴルフスクールのUTAGE｜体験レッスン動画販売システム',
    'article-utage-health-center-consultation-screening.html': '保健センターのUTAGE｜健康相談とスクリーニング受付',
    'article-utage-hellowork-employment-seminar-consultation.html': 'ハローワークのUTAGE｜就職セミナーと相談予約システム',
    'article-utage-hospital-nurse-recruitment.html': '病院のUTAGE活用｜看護師採用から研修まで効率化',
    'article-utage-hotel-ryokan-direct-booking.html': 'ホテル・旅館のUTAGE｜直接予約獲得とリピーター育成',
    'article-utage-internship-recruitment-system.html': 'インターンシップ募集システム｜UTAGE活用で効率化',
    'article-utage-it-engineer-recruitment.html': 'IT企業のUTAGE活用｜エンジニア採用から研修まで',
    'article-utage-japanese-language-school.html': '日本語学校のUTAGE活用｜留学生募集から学習サポート',
    'article-utage-judicial-scrivener-inheritance-diagnosis.html': '司法書士のUTAGE｜相続診断から相談予約まで自動化',
    'article-utage-kindergarten-trial-newsletter.html': '幼稚園のUTAGE活用｜体験入園とお便り配信システム',
    'article-utage-label-automation.html': 'UTAGEラベル機能活用術｜顧客セグメント自動化戦略',
    'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成ガイド｜CV率向上のコツ',
    'article-utage-lawyer-consultation-estimate-automation.html': '弁護士のUTAGE活用｜法律相談と見積もり自動化システム',
    'article-utage-learning-academy-trial-lessons.html': '学習塾のUTAGE｜無料体験授業から入塾まで自動化',
    'article-utage-legal-professionals-online-system.html': '士業のオンライン化｜UTAGE活用で業務効率向上',
    'article-utage-line-delivery-guide.html': 'UTAGE LINE配信完全ガイド｜効果的な活用方法',
    'article-utage-line-step-delivery.html': 'UTAGEステップLINE配信｜自動フォローアップ戦略',
    'article-utage-local-business-digital-transformation.html': '地域企業のデジタル変革｜UTAGE導入成功事例',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': '結婚相談所のUTAGE｜お見合い知識と相談予約システム',
    'article-utage-membership-site-manual.html': 'UTAGEメンバーサイト構築マニュアル｜会員制ビジネス成功法',
    'article-utage-merits-demerits-2.html': 'UTAGEメリット・デメリット｜導入前に知っておくべき全て',
    'article-utage-mid-career-recruitment-strategy.html': '中途採用戦略｜UTAGE活用で優秀人材獲得',
    'article-utage-mobile-optimization.html': 'UTAGEモバイル最適化｜スマホCV率向上の秘訣',
    'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネル｜複雑な購買行動を攻略',
    'article-utage-municipality-resident-notification.html': '自治体のUTAGE活用｜住民への一斉通知システム',
    'article-utage-municipality-staff-recruitment.html': '自治体職員募集｜UTAGE活用で効率的な採用活動',
    'article-utage-music-school-trial-lessons.html': '音楽教室のUTAGE｜無料体験レッスンから入会まで',
    'article-utage-new-graduate-recruitment.html': '新卒採用戦略｜UTAGE活用で学生との接点最大化',
    'article-utage-nursing-home-tour-booking-automation.html': '介護施設のUTAGE｜見学予約から入居まで自動化',
    'article-utage-obstetrics-maternity-class-automation.html': '産婦人科のUTAGE｜母親学級から出産まで自動フォロー',
    'article-utage-online-course-creation.html': 'UTAGEオンライン講座作成｜収益化まで完全ガイド',
    'article-utage-online-education-complete-guide.html': 'オンライン教育完全ガイド｜UTAGE活用で成功する方法',
    'article-utage-optin-page-design.html': 'UTAGEオプトインページデザイン｜登録率向上のコツ',
    'article-utage-part-time-recruitment-automation.html': 'アルバイト採用自動化｜UTAGE活用で人手不足解消',
    'article-utage-payment-integration-guide.html': 'UTAGE決済連携ガイド｜PayPal・Stripe設定方法',
    'article-utage-pet-hotel-booking-care-video-sales.html': 'ペットホテルのUTAGE｜予約管理とケア動画販売',
    'article-utage-pharmacy-health-consultation.html': '薬局のUTAGE活用｜健康相談とお薬手帳管理',
    'article-utage-photo-studio-booking-photographer-training.html': 'フォトスタジオのUTAGE｜撮影予約とカメラマン研修',
    'article-utage-pricing.html': 'UTAGE料金プラン徹底比較｜コスパ最強の選び方',
    'article-utage-programming-school-free-courses.html': 'プログラミングスクールのUTAGE｜無料講座から有料へ',
    'article-utage-psychiatry-initial-consultation-questionnaire.html': '精神科のUTAGE｜初診問診票と予約システム自動化',
    'article-utage-qualification-prep-school.html': '資格予備校のUTAGE活用｜受講生管理から合格まで',
    'article-utage-real-estate-digital-transformation.html': '不動産業界のデジタル変革｜UTAGE活用事例',
    'article-utage-real-estate-property-training.html': '不動産のUTAGE活用｜物件研修と営業スキルアップ',
    'article-utage-rehabilitation-center-training-videos.html': 'リハビリセンターのUTAGE｜訓練動画と患者フォロー',
    'article-utage-reminder-system.html': 'UTAGEリマインダーシステム｜予約忘れ防止の自動化',
    'article-utage-restaurant-reservation-member-menu.html': 'レストランのUTAGE｜予約管理と会員限定メニュー',
    'article-utage-sales-page-psychology.html': 'UTAGEセールスページ心理学｜購買意欲を高める技術',
    'article-utage-seitai-clinic-management.html': '整体院のUTAGE活用｜予約管理から症状改善まで',
    'article-utage-sme-consultant-subsidy-guide.html': '中小企業診断士のUTAGE｜補助金診断から申請まで',
    'article-utage-sr-firm-labor-diagnosis.html': '社労士事務所のUTAGE｜労務診断から顧問契約まで',
    'article-utage-sr-subsidy-diagnosis-consultation.html': '社労士のUTAGE活用｜助成金診断と相談予約システム',
    'article-utage-staffing-company-management.html': '人材派遣会社のUTAGE｜登録から就業まで一元管理',
    'article-utage-step-mail-course.html': 'UTAGEステップメール講座｜読者を顧客に変える技術',
    'article-utage-student-management.html': 'UTAGE受講生管理システム｜教育ビジネス効率化',
    'article-utage-subscription-business.html': 'UTAGEサブスクリプションビジネス｜継続課金モデル構築',
    'article-utage-support-guide.html': 'UTAGEサポート活用ガイド｜問題解決を速くする方法',
    'article-utage-tax-office-consultation-conversion.html': '税務署のUTAGE活用｜相談予約から申告書作成まで',
    'article-utage-teacher-recruitment-strategy.html': '教員採用戦略｜UTAGE活用で優秀な人材確保',
    'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド｜時短で美しいページ作成',
    'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページ活用｜アップセル売上最大化',
    'article-utage-tourism-association-tour-booking.html': '観光協会のUTAGE｜ツアー予約と地域PR自動化',
    'article-utage-veterinary-clinic-vaccination-reminder.html': '動物病院のUTAGE｜ワクチン接種リマインダー自動化',
    'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理｜効果的な配信戦略',
    'article-utage-visiting-nurse-schedule-management.html': '訪問看護のUTAGE｜スケジュール管理と患者情報共有',
    'article-utage-vs-comparison-new.html': 'UTAGE vs 他社ツール徹底比較｜マイスピー・エキスパ・Lステップとの違い',
    'article-utage-vs-comparison.html': 'UTAGE徹底比較｜他社ツールとの違いを詳しく解説',
    'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASP メール配信機能比較｜どちらが最適？',
    'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable比較｜オンライン講座プラットフォーム',
    'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページ｜参加率を高める作成術',
    'article-utage-welfare-facility-recruitment.html': '福祉施設の職員採用｜UTAGE活用で人材確保',
    'article-utage-yoga-studio-class-booking-online-lessons.html': 'ヨガスタジオのクラス予約・オンラインレッスン｜UTAGE活用'
};

const articleList = Object.keys(titleMapping);

const blogDir = './blog';
let processedCount = 0;
let errors = [];

// 各記事ファイルを処理
articleList.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    
    if (!fs.existsSync(filePath)) {
        errors.push(`File not found: ${filename}`);
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. 既存の記事ナビゲーション用スタイルを削除して統一スタイルに置換
        const styleRegex = /<!-- 記事ナビゲーション用スタイル -->[\s\S]*?<\/style>/g;
        if (styleRegex.test(content)) {
            content = content.replace(styleRegex, unifiedNavigationCSS);
            modified = true;
        } else {
            // スタイルがない場合は </head> の前に追加
            const headEndPos = content.indexOf('</head>');
            if (headEndPos !== -1) {
                content = content.slice(0, headEndPos) + unifiedNavigationCSS + '\n' + content.slice(headEndPos);
                modified = true;
            }
        }

        // 2. 既存のナビゲーションHTMLを統一版に置換
        const navRegex = /<!-- 記事ナビゲーション -->[\s\S]*?<\/section>/g;
        if (navRegex.test(content)) {
            content = content.replace(navRegex, unifiedNavigationHTML);
            modified = true;
        }

        // 3. 関連記事セクションのスタイルも統一（既にスタイルに含まれている）
        // 関連記事のHTMLは各記事固有の内容なので、構造だけチェック

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            processedCount++;
            console.log(`✓ Unified design applied to: ${filename}`);
        }
        
    } catch (error) {
        errors.push(`Error processing ${filename}: ${error.message}`);
    }
});

console.log(`\n処理完了: ${processedCount}/${articleList.length} ファイルを更新`);
if (errors.length > 0) {
    console.log('\nエラー:');
    errors.forEach(err => console.log(`- ${err}`));
}