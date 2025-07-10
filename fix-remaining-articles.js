const fs = require('fs');
const path = require('path');

// 記事ファイル名と日本語タイトルのマッピング
const titleMapping = {
    'article-utage-accounting-cloud-bookkeeping.html': 'クラウド会計ソフトでUTAGE活用｜自動化戦略',
    'article-utage-administrative-scrivener-license-permit.html': '行政書士のUTAGE戦略｜許認可チェックリストと申請代行受付',
    'article-utage-beauty-clinic-strategy.html': '美容クリニックのUTAGE戦略｜カウンセリング予約自動化',
    'article-utage-beauty-health-digital-marketing.html': '美容・健康業界のデジタルマーケティング｜UTAGE活用術',
    'article-utage-calligraphy-school-strategy.html': '書道教室のUTAGE戦略｜体験レッスン予約と継続率向上',
    'article-utage-chamber-commerce-seminar-member.html': '商工会議所のUTAGE活用｜セミナー運営と会員管理',
    'article-utage-checkout-optimization.html': 'UTAGE決済最適化ガイド｜コンバージョン率向上テクニック',
    'article-utage-coaching-business-automation.html': 'コーチング業のUTAGE自動化｜顧客獲得から継続まで',
    'article-utage-consultant-success-patterns.html': 'コンサルタントのUTAGE成功パターン｜実績と事例',
    'article-utage-consulting-diagnosis-funnel.html': 'コンサルティング診断ファネル｜UTAGE活用戦略',
    'article-utage-content-management.html': 'UTAGEコンテンツ管理術｜効率的な運用方法',
    'article-utage-cooking-school-recipe-videos.html': '料理教室のUTAGE戦略｜レシピ動画と体験レッスン',
    'article-utage-corporate-training-elearning.html': '企業研修のeラーニング化｜UTAGE活用ガイド',
    'article-utage-dance-school-automation.html': 'ダンススクールのUTAGE自動化｜体験レッスンから入会まで',
    'article-utage-dental-clinic-patient-follow-up.html': '歯科医院の患者フォローアップ｜UTAGE活用術',
    'article-utage-domain-dkim-spf-setup.html': 'UTAGEドメイン設定｜DKIM・SPF設定完全ガイド',
    'article-utage-education-committee-parent-notification.html': '教育委員会の保護者連絡｜UTAGE活用事例',
    'article-utage-email-setup.html': 'UTAGEメール設定ガイド｜初心者向け完全マニュアル',
    'article-utage-email-spam-prevention.html': 'UTAGEメール迷惑メール対策｜到達率向上テクニック',
    'article-utage-english-school-level-check.html': '英会話スクールのレベルチェック｜UTAGE自動化',
    'article-utage-event-management-automation.html': 'イベント管理自動化｜UTAGE活用でスムーズ運営',
    'article-utage-fire-department-disaster-prevention.html': '消防署の防災啓発｜UTAGE活用で効果的情報配信',
    'article-utage-fitness-gym-trial-membership-automation.html': 'フィットネスジムの体験入会自動化｜UTAGE戦略',
    'article-utage-fitness-sports-online-expansion.html': 'フィットネス・スポーツのオンライン展開｜UTAGE活用',
    'article-utage-fp-lifeplan-consultation.html': 'FPのライフプラン相談｜UTAGE活用で顧客獲得',
    'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全ガイド｜始め方から活用まで',
    'article-utage-funnel-guide.html': 'UTAGEファネル構築ガイド｜効果的な導線設計',
    'article-utage-funnel-seo-strategy.html': 'UTAGEファネルSEO戦略｜検索流入最大化テクニック',
    'article-utage-funnel-vs-clickfunnels.html': 'UTAGE vs ClickFunnels比較｜日本市場に最適な選択',
    'article-utage-golf-school-trial-lesson-video-sales.html': 'ゴルフスクールの体験レッスン｜動画セールス活用',
    'article-utage-health-center-consultation-screening.html': '保健所の相談・健診｜UTAGE活用で効率化',
    'article-utage-hellowork-employment-seminar-consultation.html': 'ハローワークの就職セミナー・相談｜UTAGE活用',
    'article-utage-hospital-nurse-recruitment.html': '病院の看護師採用｜UTAGE活用で人材確保',
    'article-utage-hotel-ryokan-direct-booking.html': 'ホテル・旅館の直接予約｜UTAGE活用で収益向上',
    'article-utage-internship-recruitment-system.html': 'インターンシップ採用システム｜UTAGE活用事例',
    'article-utage-it-engineer-recruitment.html': 'IT企業のエンジニア採用｜UTAGE活用戦略',
    'article-utage-japanese-language-school.html': '日本語学校のUTAGE活用｜留学生募集自動化',
    'article-utage-judicial-scrivener-inheritance-diagnosis.html': '司法書士の相続診断｜UTAGE活用で顧客獲得',
    'article-utage-kindergarten-trial-newsletter.html': '幼稚園の体験・お便り｜UTAGE活用で保護者対応',
    'article-utage-label-automation.html': 'UTAGEラベル自動化｜効率的な顧客管理術',
    'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成ガイド｜高コンバージョン設計',
    'article-utage-lawyer-consultation-estimate-automation.html': '弁護士の相談・見積もり自動化｜UTAGE活用術',
    'article-utage-learning-academy-trial-lessons.html': '学習塾の体験授業｜UTAGE活用で入塾率向上',
    'article-utage-legal-professionals-online-system.html': '士業のオンライン化｜UTAGE活用でデジタル戦略',
    'article-utage-line-delivery-guide.html': 'UTAGE×LINE連携ガイド｜効果的な配信戦略',
    'article-utage-line-step-delivery.html': 'UTAGEステップ配信とLINE｜自動化完全ガイド',
    'article-utage-local-business-digital-transformation.html': '地域ビジネスのDX｜UTAGE活用で競争力強化',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': '結婚相談所のお見合い知識｜UTAGE活用術',
    'article-utage-membership-site-manual.html': 'UTAGEメンバーサイト構築マニュアル｜完全ガイド',
    'article-utage-merits-demerits-2.html': 'UTAGEのメリット・デメリット徹底解説【2024年版】',
    'article-utage-mid-career-recruitment-strategy.html': '中途採用戦略｜UTAGE活用で優秀人材確保',
    'article-utage-mobile-optimization.html': 'UTAGEモバイル最適化｜スマホ対応完全ガイド',
    'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネル｜高度な導線設計',
    'article-utage-municipality-resident-notification.html': '自治体の住民通知｜UTAGE活用で効率化',
    'article-utage-municipality-staff-recruitment.html': '自治体職員採用｜UTAGE活用で人材確保',
    'article-utage-music-school-trial-lessons.html': '音楽教室の体験レッスン｜UTAGE活用で入会率向上',
    'article-utage-new-graduate-recruitment.html': '新卒採用戦略｜UTAGE活用で優秀学生確保',
    'article-utage-nursing-home-tour-booking-automation.html': '介護施設の見学予約自動化｜UTAGE活用術',
    'article-utage-obstetrics-maternity-class-automation.html': '産婦人科のマタニティクラス｜UTAGE自動化',
    'article-utage-online-course-creation.html': 'UTAGEオンライン講座作成ガイド｜効果的コンテンツ設計',
    'article-utage-online-education-complete-guide.html': 'オンライン教育完全ガイド｜UTAGE活用術',
    'article-utage-optin-page-design.html': 'UTAGEオプトインページデザイン｜登録率向上テクニック',
    'article-utage-part-time-recruitment-automation.html': 'パート・アルバイト採用自動化｜UTAGE活用術',
    'article-utage-payment-integration-guide.html': 'UTAGE決済連携ガイド｜設定から運用まで',
    'article-utage-pet-hotel-booking-care-video-sales.html': 'ペットホテルの予約・ケア動画セールス｜UTAGE活用',
    'article-utage-pharmacy-health-consultation.html': '薬局の健康相談｜UTAGE活用で顧客満足度向上',
    'article-utage-photo-studio-booking-photographer-training.html': 'フォトスタジオの予約・撮影研修｜UTAGE活用',
    'article-utage-pricing.html': 'UTAGE料金体系完全ガイド｜プラン選択のポイント',
    'article-utage-programming-school-free-courses.html': 'プログラミングスクールの無料講座｜UTAGE活用',
    'article-utage-psychiatry-initial-consultation-questionnaire.html': '精神科の初診問診票｜UTAGE活用で効率化',
    'article-utage-qualification-prep-school.html': '資格予備校のUTAGE活用｜合格率向上戦略',
    'article-utage-real-estate-digital-transformation.html': '不動産業界のDX｜UTAGE活用で業務効率化',
    'article-utage-real-estate-property-training.html': '不動産の物件研修｜UTAGE活用で営業力強化',
    'article-utage-rehabilitation-center-training-videos.html': 'リハビリセンターの研修動画｜UTAGE活用術',
    'article-utage-reminder-system.html': 'UTAGEリマインダーシステム｜自動通知活用術',
    'article-utage-restaurant-reservation-member-menu.html': '飲食店の予約・会員メニュー｜UTAGE活用術',
    'article-utage-sales-page-psychology.html': 'UTAGEセールスページ心理学｜購買欲求向上テクニック',
    'article-utage-seitai-clinic-management.html': '整体院のUTAGE活用｜予約管理から顧客フォローまで',
    'article-utage-sme-consultant-subsidy-guide.html': '中小企業診断士の補助金ガイド｜UTAGE活用術',
    'article-utage-sr-firm-labor-diagnosis.html': '社労士事務所の労務診断｜UTAGE活用で顧客獲得',
    'article-utage-sr-subsidy-diagnosis-consultation.html': '社労士の助成金診断・相談｜UTAGE活用術',
    'article-utage-staffing-company-management.html': '人材派遣会社のUTAGE活用｜効率的運営術',
    'article-utage-step-mail-course.html': 'UTAGEステップメール講座｜効果的な設計と運用',
    'article-utage-student-management.html': 'UTAGE受講生管理｜効率的な顧客対応術',
    'article-utage-subscription-business.html': 'サブスクリプションビジネス｜UTAGE活用戦略',
    'article-utage-support-guide.html': 'UTAGEサポート活用ガイド｜困った時の解決法',
    'article-utage-tax-office-consultation-conversion.html': '税務署の相談対応｜UTAGE活用で効率化',
    'article-utage-teacher-recruitment-strategy.html': '教員採用戦略｜UTAGE活用で優秀教師確保',
    'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド｜効率的なページ作成',
    'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページアップセル｜収益最大化テクニック',
    'article-utage-tourism-association-tour-booking.html': '観光協会のツアー予約｜UTAGE活用で効率化',
    'article-utage-veterinary-clinic-vaccination-reminder.html': '動物病院の予防接種リマインダー｜UTAGE活用',
    'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理｜効果的な配信戦略',
    'article-utage-visiting-nurse-schedule-management.html': '訪問看護のスケジュール管理｜UTAGE活用術',
    'article-utage-vs-comparison-new.html': 'UTAGE比較検討ガイド｜他社サービスとの違い【最新版】',
    'article-utage-vs-comparison.html': 'UTAGE vs 他社比較｜選択のポイント完全ガイド',
    'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASP メール配信機能比較｜徹底解説',
    'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable比較｜オンライン講座プラットフォーム',
    'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページ｜効果的な集客戦略',
    'article-utage-welfare-facility-recruitment.html': '福祉施設の職員採用｜UTAGE活用で人材確保',
    'article-utage-yoga-studio-class-booking-online-lessons.html': 'ヨガスタジオのクラス予約・オンラインレッスン｜UTAGE活用'
};

// スキップされたファイルのリスト
const skippedFiles = [
    'article-utage-email-setup.html',
    'article-utage-free-trial-guide.html',
    'article-utage-funnel-vs-clickfunnels.html',
    'article-utage-internship-recruitment-system.html',
    'article-utage-landing-page-guide.html',
    'article-utage-merits-demerits-2.html',
    'article-utage-mid-career-recruitment-strategy.html',
    'article-utage-mobile-optimization.html',
    'article-utage-new-graduate-recruitment.html',
    'article-utage-optin-page-design.html',
    'article-utage-part-time-recruitment-automation.html',
    'article-utage-pricing.html',
    'article-utage-real-estate-property-training.html',
    'article-utage-sales-page-psychology.html',
    'article-utage-staffing-company-management.html',
    'article-utage-step-mail-course.html',
    'article-utage-support-guide.html',
    'article-utage-template-guide.html',
    'article-utage-thanks-page-upsell.html',
    'article-utage-vs-comparison-new.html',
    'article-utage-vs-comparison.html'
];

// 新しいgetArticleTitle関数のコード
const getArticleTitleFunction = `        function getArticleTitle(filename) {
            // 記事ファイル名と日本語タイトルのマッピング
            const titleMapping = {
                'article-utage-accounting-cloud-bookkeeping.html': 'クラウド会計ソフトでUTAGE活用｜自動化戦略',
                'article-utage-administrative-scrivener-license-permit.html': '行政書士のUTAGE戦略｜許認可チェックリストと申請代行受付',
                'article-utage-beauty-clinic-strategy.html': '美容クリニックのUTAGE戦略｜カウンセリング予約自動化',
                'article-utage-beauty-health-digital-marketing.html': '美容・健康業界のデジタルマーケティング｜UTAGE活用術',
                'article-utage-calligraphy-school-strategy.html': '書道教室のUTAGE戦略｜体験レッスン予約と継続率向上',
                'article-utage-chamber-commerce-seminar-member.html': '商工会議所のUTAGE活用｜セミナー運営と会員管理',
                'article-utage-checkout-optimization.html': 'UTAGE決済最適化ガイド｜コンバージョン率向上テクニック',
                'article-utage-coaching-business-automation.html': 'コーチング業のUTAGE自動化｜顧客獲得から継続まで',
                'article-utage-consultant-success-patterns.html': 'コンサルタントのUTAGE成功パターン｜実績と事例',
                'article-utage-consulting-diagnosis-funnel.html': 'コンサルティング診断ファネル｜UTAGE活用戦略',
                'article-utage-content-management.html': 'UTAGEコンテンツ管理術｜効率的な運用方法',
                'article-utage-cooking-school-recipe-videos.html': '料理教室のUTAGE戦略｜レシピ動画と体験レッスン',
                'article-utage-corporate-training-elearning.html': '企業研修のeラーニング化｜UTAGE活用ガイド',
                'article-utage-dance-school-automation.html': 'ダンススクールのUTAGE自動化｜体験レッスンから入会まで',
                'article-utage-dental-clinic-patient-follow-up.html': '歯科医院の患者フォローアップ｜UTAGE活用術',
                'article-utage-domain-dkim-spf-setup.html': 'UTAGEドメイン設定｜DKIM・SPF設定完全ガイド',
                'article-utage-education-committee-parent-notification.html': '教育委員会の保護者連絡｜UTAGE活用事例',
                'article-utage-email-setup.html': 'UTAGEメール設定ガイド｜初心者向け完全マニュアル',
                'article-utage-email-spam-prevention.html': 'UTAGEメール迷惑メール対策｜到達率向上テクニック',
                'article-utage-english-school-level-check.html': '英会話スクールのレベルチェック｜UTAGE自動化',
                'article-utage-event-management-automation.html': 'イベント管理自動化｜UTAGE活用でスムーズ運営',
                'article-utage-fire-department-disaster-prevention.html': '消防署の防災啓発｜UTAGE活用で効果的情報配信',
                'article-utage-fitness-gym-trial-membership-automation.html': 'フィットネスジムの体験入会自動化｜UTAGE戦略',
                'article-utage-fitness-sports-online-expansion.html': 'フィットネス・スポーツのオンライン展開｜UTAGE活用',
                'article-utage-fp-lifeplan-consultation.html': 'FPのライフプラン相談｜UTAGE活用で顧客獲得',
                'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全ガイド｜始め方から活用まで',
                'article-utage-funnel-guide.html': 'UTAGEファネル構築ガイド｜効果的な導線設計',
                'article-utage-funnel-seo-strategy.html': 'UTAGEファネルSEO戦略｜検索流入最大化テクニック',
                'article-utage-funnel-vs-clickfunnels.html': 'UTAGE vs ClickFunnels比較｜日本市場に最適な選択',
                'article-utage-golf-school-trial-lesson-video-sales.html': 'ゴルフスクールの体験レッスン｜動画セールス活用',
                'article-utage-health-center-consultation-screening.html': '保健所の相談・健診｜UTAGE活用で効率化',
                'article-utage-hellowork-employment-seminar-consultation.html': 'ハローワークの就職セミナー・相談｜UTAGE活用',
                'article-utage-hospital-nurse-recruitment.html': '病院の看護師採用｜UTAGE活用で人材確保',
                'article-utage-hotel-ryokan-direct-booking.html': 'ホテル・旅館の直接予約｜UTAGE活用で収益向上',
                'article-utage-internship-recruitment-system.html': 'インターンシップ採用システム｜UTAGE活用事例',
                'article-utage-it-engineer-recruitment.html': 'IT企業のエンジニア採用｜UTAGE活用戦略',
                'article-utage-japanese-language-school.html': '日本語学校のUTAGE活用｜留学生募集自動化',
                'article-utage-judicial-scrivener-inheritance-diagnosis.html': '司法書士の相続診断｜UTAGE活用で顧客獲得',
                'article-utage-kindergarten-trial-newsletter.html': '幼稚園の体験・お便り｜UTAGE活用で保護者対応',
                'article-utage-label-automation.html': 'UTAGEラベル自動化｜効率的な顧客管理術',
                'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成ガイド｜高コンバージョン設計',
                'article-utage-lawyer-consultation-estimate-automation.html': '弁護士の相談・見積もり自動化｜UTAGE活用術',
                'article-utage-learning-academy-trial-lessons.html': '学習塾の体験授業｜UTAGE活用で入塾率向上',
                'article-utage-legal-professionals-online-system.html': '士業のオンライン化｜UTAGE活用でデジタル戦略',
                'article-utage-line-delivery-guide.html': 'UTAGE×LINE連携ガイド｜効果的な配信戦略',
                'article-utage-line-step-delivery.html': 'UTAGEステップ配信とLINE｜自動化完全ガイド',
                'article-utage-local-business-digital-transformation.html': '地域ビジネスのDX｜UTAGE活用で競争力強化',
                'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': '結婚相談所のお見合い知識｜UTAGE活用術',
                'article-utage-membership-site-manual.html': 'UTAGEメンバーサイト構築マニュアル｜完全ガイド',
                'article-utage-merits-demerits-2.html': 'UTAGEのメリット・デメリット徹底解説【2024年版】',
                'article-utage-mid-career-recruitment-strategy.html': '中途採用戦略｜UTAGE活用で優秀人材確保',
                'article-utage-mobile-optimization.html': 'UTAGEモバイル最適化｜スマホ対応完全ガイド',
                'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネル｜高度な導線設計',
                'article-utage-municipality-resident-notification.html': '自治体の住民通知｜UTAGE活用で効率化',
                'article-utage-municipality-staff-recruitment.html': '自治体職員採用｜UTAGE活用で人材確保',
                'article-utage-music-school-trial-lessons.html': '音楽教室の体験レッスン｜UTAGE活用で入会率向上',
                'article-utage-new-graduate-recruitment.html': '新卒採用戦略｜UTAGE活用で優秀学生確保',
                'article-utage-nursing-home-tour-booking-automation.html': '介護施設の見学予約自動化｜UTAGE活用術',
                'article-utage-obstetrics-maternity-class-automation.html': '産婦人科のマタニティクラス｜UTAGE自動化',
                'article-utage-online-course-creation.html': 'UTAGEオンライン講座作成ガイド｜効果的コンテンツ設計',
                'article-utage-online-education-complete-guide.html': 'オンライン教育完全ガイド｜UTAGE活用術',
                'article-utage-optin-page-design.html': 'UTAGEオプトインページデザイン｜登録率向上テクニック',
                'article-utage-part-time-recruitment-automation.html': 'パート・アルバイト採用自動化｜UTAGE活用術',
                'article-utage-payment-integration-guide.html': 'UTAGE決済連携ガイド｜設定から運用まで',
                'article-utage-pet-hotel-booking-care-video-sales.html': 'ペットホテルの予約・ケア動画セールス｜UTAGE活用',
                'article-utage-pharmacy-health-consultation.html': '薬局の健康相談｜UTAGE活用で顧客満足度向上',
                'article-utage-photo-studio-booking-photographer-training.html': 'フォトスタジオの予約・撮影研修｜UTAGE活用',
                'article-utage-pricing.html': 'UTAGE料金体系完全ガイド｜プラン選択のポイント',
                'article-utage-programming-school-free-courses.html': 'プログラミングスクールの無料講座｜UTAGE活用',
                'article-utage-psychiatry-initial-consultation-questionnaire.html': '精神科の初診問診票｜UTAGE活用で効率化',
                'article-utage-qualification-prep-school.html': '資格予備校のUTAGE活用｜合格率向上戦略',
                'article-utage-real-estate-digital-transformation.html': '不動産業界のDX｜UTAGE活用で業務効率化',
                'article-utage-real-estate-property-training.html': '不動産の物件研修｜UTAGE活用で営業力強化',
                'article-utage-rehabilitation-center-training-videos.html': 'リハビリセンターの研修動画｜UTAGE活用術',
                'article-utage-reminder-system.html': 'UTAGEリマインダーシステム｜自動通知活用術',
                'article-utage-restaurant-reservation-member-menu.html': '飲食店の予約・会員メニュー｜UTAGE活用術',
                'article-utage-sales-page-psychology.html': 'UTAGEセールスページ心理学｜購買欲求向上テクニック',
                'article-utage-seitai-clinic-management.html': '整体院のUTAGE活用｜予約管理から顧客フォローまで',
                'article-utage-sme-consultant-subsidy-guide.html': '中小企業診断士の補助金ガイド｜UTAGE活用術',
                'article-utage-sr-firm-labor-diagnosis.html': '社労士事務所の労務診断｜UTAGE活用で顧客獲得',
                'article-utage-sr-subsidy-diagnosis-consultation.html': '社労士の助成金診断・相談｜UTAGE活用術',
                'article-utage-staffing-company-management.html': '人材派遣会社のUTAGE活用｜効率的運営術',
                'article-utage-step-mail-course.html': 'UTAGEステップメール講座｜効果的な設計と運用',
                'article-utage-student-management.html': 'UTAGE受講生管理｜効率的な顧客対応術',
                'article-utage-subscription-business.html': 'サブスクリプションビジネス｜UTAGE活用戦略',
                'article-utage-support-guide.html': 'UTAGEサポート活用ガイド｜困った時の解決法',
                'article-utage-tax-office-consultation-conversion.html': '税務署の相談対応｜UTAGE活用で効率化',
                'article-utage-teacher-recruitment-strategy.html': '教員採用戦略｜UTAGE活用で優秀教師確保',
                'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド｜効率的なページ作成',
                'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページアップセル｜収益最大化テクニック',
                'article-utage-tourism-association-tour-booking.html': '観光協会のツアー予約｜UTAGE活用で効率化',
                'article-utage-veterinary-clinic-vaccination-reminder.html': '動物病院の予防接種リマインダー｜UTAGE活用',
                'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理｜効果的な配信戦略',
                'article-utage-visiting-nurse-schedule-management.html': '訪問看護のスケジュール管理｜UTAGE活用術',
                'article-utage-vs-comparison-new.html': 'UTAGE比較検討ガイド｜他社サービスとの違い【最新版】',
                'article-utage-vs-comparison.html': 'UTAGE vs 他社比較｜選択のポイント完全ガイド',
                'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASP メール配信機能比較｜徹底解説',
                'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable比較｜オンライン講座プラットフォーム',
                'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページ｜効果的な集客戦略',
                'article-utage-welfare-facility-recruitment.html': '福祉施設の職員採用｜UTAGE活用で人材確保',
                'article-utage-yoga-studio-class-booking-online-lessons.html': 'ヨガスタジオのクラス予約・オンラインレッスン｜UTAGE活用'
            };
            
            // マッピングから日本語タイトルを返す、存在しない場合はファイル名をそのまま返す
            return titleMapping[filename] || filename.replace('article-utage-', '').replace('.html', '').replace(/-/g, ' ');
        }`;

// 完全なナビゲーションシステムのコード
const fullNavigationCode = `    
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

        // 現在の記事のファイル名を取得
        function getCurrentArticleFilename() {
            const path = window.location.pathname;
            return path.substring(path.lastIndexOf('/') + 1);
        }

        // 記事タイトルを取得（ファイル名から推測）
        ${getArticleTitleFunction}

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
    </script>`;

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const filename = path.basename(filePath);
        let modified = false;

        // 既存のgetArticleTitle関数のパターン
        const oldFunctionPattern = /function getArticleTitle\(filename\)\s*{[^}]+}/;

        // 既存のgetArticleTitle関数を新しいものに置換
        if (oldFunctionPattern.test(content)) {
            content = content.replace(oldFunctionPattern, getArticleTitleFunction);
            modified = true;
            console.log(`✅ getArticleTitle関数を更新: ${filename}`);
        } else {
            // getArticleTitle関数が存在しない場合、ナビゲーションシステム全体を追加
            if (content.includes('myblog-article-navigation') && !content.includes('getArticleTitle')) {
                // </body>タグの前にナビゲーションコードを挿入
                const bodyEndPattern = /<\/body>/;
                if (bodyEndPattern.test(content)) {
                    content = content.replace(bodyEndPattern, fullNavigationCode + '\n</body>');
                    modified = true;
                    console.log(`✅ ナビゲーションシステムを追加: ${filename}`);
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        } else {
            console.log(`⚠️  変更不要またはナビゲーション構造なし: ${filename}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ エラー処理中: ${path.basename(filePath)}`, error.message);
        return false;
    }
}

function main() {
    const blogDir = path.join(__dirname, 'blog');
    
    if (!fs.existsSync(blogDir)) {
        console.error('❌ blogディレクトリが見つかりません');
        return;
    }

    console.log('🚀 残りの記事ファイルの英語タイトルを修正開始...');
    
    let totalFiles = 0;
    let successCount = 0;
    
    // スキップされたファイルのみを処理
    for (const file of skippedFiles) {
        totalFiles++;
        const filePath = path.join(blogDir, file);
        if (fs.existsSync(filePath)) {
            if (processFile(filePath)) {
                successCount++;
            }
        } else {
            console.log(`⚠️  ファイルが見つかりません: ${file}`);
        }
    }
    
    console.log(`\n📊 処理結果:`);
    console.log(`   対象ファイル数: ${totalFiles}`);
    console.log(`   成功: ${successCount}`);
    console.log(`   失敗: ${totalFiles - successCount}`);
    
    if (successCount === totalFiles) {
        console.log('🎉 残りのファイルもすべて修正完了しました！');
    } else {
        console.log('⚠️  一部のファイルで問題が発生しました。ログを確認してください。');
    }
}

if (require.main === module) {
    main();
}