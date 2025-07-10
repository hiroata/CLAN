// Blog Navigation - Shared navigation functions for all blog articles
// Generated to consolidate duplicate inline scripts across 103 blog articles

// Article titles mapping for navigation
const articleTitles = {
    'article-utage-accounting-cloud-bookkeeping.html': 'UTAGEでクラウド会計連携システム構築ガイド',
    'article-utage-administrative-scrivener-license-permit.html': 'UTAGE行政書士事務所の許認可申請オンライン受付システム構築法',
    'article-utage-beauty-clinic-strategy.html': 'UTAGEで美容クリニックの集客戦略を自動化する方法',
    'article-utage-beauty-health-digital-marketing.html': 'UTAGEで美容・健康業界のデジタルマーケティングを完全自動化',
    'article-utage-calligraphy-school-strategy.html': 'UTAGEで書道教室の生徒募集とオンライン指導システム構築法',
    'article-utage-chamber-commerce-seminar-member.html': 'UTAGE商工会議所セミナー会員募集システム構築ガイド',
    'article-utage-checkout-optimization.html': 'UTAGEチェックアウト最適化で売上を劇的に向上させる方法',
    'article-utage-coaching-business-automation.html': 'UTAGEでコーチングビジネスを完全自動化する究極のガイド',
    'article-utage-consultant-success-patterns.html': 'UTAGEコンサルタント成功事例から学ぶ効果的な活用パターン',
    'article-utage-consulting-diagnosis-funnel.html': 'UTAGEコンサルティング診断ファネル構築完全マニュアル',
    'article-utage-content-management.html': 'UTAGEコンテンツ管理を効率化する実践的テクニック集',
    'article-utage-cooking-school-recipe-videos.html': 'UTAGEで料理教室のレシピ動画配信システム構築法',
    'article-utage-corporate-training-elearning.html': 'UTAGE企業研修eラーニングシステム構築完全ガイド',
    'article-utage-dance-school-automation.html': 'UTAGEでダンススクールの生徒管理と指導システム自動化',
    'article-utage-dental-clinic-patient-follow-up.html': 'UTAGE歯科クリニック患者フォローアップシステム構築法',
    'article-utage-domain-dkim-spf-setup.html': 'UTAGEドメイン設定：DKIM・SPF完全設定ガイド',
    'article-utage-education-committee-parent-notification.html': 'UTAGE教育委員会保護者通知システム構築ガイド',
    'article-utage-email-setup.html': 'UTAGEメール設定完全ガイド：到達率向上の秘訣',
    'article-utage-email-spam-prevention.html': 'UTAGEメール配信でスパム判定を回避する実践的対策法',
    'article-utage-english-school-level-check.html': 'UTAGE英会話スクールレベルチェック自動システム構築法',
    'article-utage-event-management-automation.html': 'UTAGEでイベント管理を完全自動化する実践ガイド',
    'article-utage-fire-department-disaster-prevention.html': 'UTAGE消防署防災講習申込管理システム構築ガイド',
    'article-utage-fitness-gym-trial-membership-automation.html': 'UTAGEフィットネスジム体験会員システム自動化ガイド',
    'article-utage-fitness-sports-online-expansion.html': 'UTAGEでフィットネス・スポーツ業界のオンライン展開戦略',
    'article-utage-fp-lifeplan-consultation.html': 'UTAGEファイナンシャルプランナーライフプラン相談システム構築法',
    'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全活用ガイド2025年版',
    'article-utage-funnel-guide.html': 'UTAGEファネル構築完全ガイド：売上を最大化する設計法',
    'article-utage-funnel-seo-strategy.html': 'UTAGEファネルSEO戦略で検索流入を売上に直結させる方法',
    'article-utage-funnel-vs-clickfunnels.html': 'UTAGE vs ClickFunnels 徹底比較：日本企業に最適な選択は？',
    'article-utage-golf-school-trial-lesson-video-sales.html': 'UTAGEゴルフスクール体験レッスン動画セールス構築法',
    'article-utage-health-center-consultation-screening.html': 'UTAGE保健センター相談・検診予約システム構築ガイド',
    'article-utage-hellowork-employment-seminar-consultation.html': 'UTAGEハローワーク就職セミナー相談システム構築ガイド',
    'article-utage-hospital-nurse-recruitment.html': 'UTAGE病院看護師募集システム構築完全マニュアル',
    'article-utage-hotel-ryokan-direct-booking.html': 'UTAGEホテル・旅館直接予約システム構築ガイド',
    'article-utage-internship-recruitment-system.html': 'UTAGEインターンシップ募集システム構築完全ガイド',
    'article-utage-it-engineer-recruitment.html': 'UTAGEでIT エンジニア採用システムを構築する実践ガイド',
    'article-utage-japanese-language-school.html': 'UTAGE日本語学校入学案内・体験授業システム構築法',
    'article-utage-judicial-scrivener-inheritance-diagnosis.html': 'UTAGE司法書士事務所相続診断システム構築完全ガイド',
    'article-utage-kindergarten-trial-newsletter.html': 'UTAGE幼稚園体験入園・お便り配信システム構築法',
    'article-utage-label-automation.html': 'UTAGEラベル自動化で顧客管理を効率化する実践テクニック',
    'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成完全ガイド2025年版',
    'article-utage-lawyer-consultation-estimate-automation.html': 'UTAGE弁護士事務所相談・見積もり自動化システム構築法',
    'article-utage-learning-academy-trial-lessons.html': 'UTAGEで学習塾体験授業申込システム構築完全ガイド',
    'article-utage-legal-professionals-online-system.html': 'UTAGE士業オンラインシステム構築で業務効率を劇的改善',
    'article-utage-line-delivery-guide.html': 'UTAGEのLINE配信完全ガイド：効果的な活用法とは',
    'article-utage-line-step-delivery.html': 'UTAGEのLINEステップ配信で顧客育成を自動化する方法',
    'article-utage-local-business-digital-transformation.html': 'UTAGEで地域ビジネスのデジタルトランスフォーメーション',
    'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': 'UTAGE結婚相談所相談・お見合い知識システム構築法',
    'article-utage-membership-site-manual.html': 'UTAGEメンバーシップサイト構築完全マニュアル2025',
    'article-utage-merits-demerits-2.html': 'UTAGEのメリット・デメリットを徹底解説【2025年最新版】',
    'article-utage-mid-career-recruitment-strategy.html': 'UTAGEで中途採用戦略を成功させる実践的アプローチ',
    'article-utage-mobile-optimization.html': 'UTAGEモバイル最適化で売上を向上させる実践テクニック',
    'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネルで顧客単価を最大化する方法',
    'article-utage-municipality-resident-notification.html': 'UTAGE自治体住民通知システム構築完全ガイド',
    'article-utage-municipality-staff-recruitment.html': 'UTAGE自治体職員募集システム構築実践マニュアル',
    'article-utage-music-school-trial-lessons.html': 'UTAGE音楽教室体験レッスン申込システム構築完全ガイド',
    'article-utage-new-graduate-recruitment.html': 'UTAGE新卒採用システム構築で優秀な人材を獲得する方法',
    'article-utage-nursing-home-tour-booking-automation.html': 'UTAGE介護施設見学予約自動化システム構築ガイド',
    'article-utage-obstetrics-maternity-class-automation.html': 'UTAGE産婦人科マタニティクラス自動化システム構築法',
    'article-utage-online-course-creation.html': 'UTAGEオンラインコース作成で収益化を実現する方法',
    'article-utage-online-education-complete-guide.html': 'UTAGEオンライン教育プラットフォーム構築完全ガイド',
    'article-utage-optin-page-design.html': 'UTAGEオプトインページデザインで登録率を最大化する方法',
    'article-utage-part-time-recruitment-automation.html': 'UTAGEアルバイト募集自動化で採用効率を劇的に向上',
    'article-utage-payment-integration-guide.html': 'UTAGE決済連携完全ガイド：売上管理を自動化する方法',
    'article-utage-pet-hotel-booking-care-video-sales.html': 'UTAGEペットホテル予約・ケア動画セールス構築法',
    'article-utage-pharmacy-health-consultation.html': 'UTAGE薬局健康相談システム構築で地域医療に貢献',
    'article-utage-photo-studio-booking-photographer-training.html': 'UTAGEフォトスタジオ予約・カメラマン研修システム構築法',
    'article-utage-pricing.html': 'UTAGE料金プラン完全解説：最適なプランの選び方',
    'article-utage-programming-school-free-courses.html': 'UTAGEプログラミングスクール無料講座システム構築法',
    'article-utage-psychiatry-initial-consultation-questionnaire.html': 'UTAGE精神科初診問診票システム構築で診療効率向上',
    'article-utage-qualification-prep-school.html': 'UTAGE資格予備校体験授業・模試システム構築完全ガイド',
    'article-utage-real-estate-digital-transformation.html': 'UTAGEで不動産業界のデジタルトランスフォーメーション',
    'article-utage-real-estate-property-training.html': 'UTAGE不動産物件紹介・研修システム構築実践ガイド',
    'article-utage-rehabilitation-center-training-videos.html': 'UTAGEリハビリセンター研修動画配信システム構築法',
    'article-utage-reminder-system.html': 'UTAGEリマインダーシステムで顧客フォローを完全自動化',
    'article-utage-restaurant-reservation-member-menu.html': 'UTAGEレストラン予約・会員メニューシステム構築ガイド',
    'article-utage-sales-page-psychology.html': 'UTAGEセールスページ心理学：購買意欲を高める設計法',
    'article-utage-seitai-clinic-management.html': 'UTAGE整体院経営システムで集客と顧客管理を自動化',
    'article-utage-sme-consultant-subsidy-guide.html': 'UTAGE中小企業診断士補助金ガイド作成システム構築法',
    'article-utage-sr-firm-labor-diagnosis.html': 'UTAGE社労士事務所労務診断システム構築完全ガイド',
    'article-utage-sr-subsidy-diagnosis-consultation.html': 'UTAGE社労士助成金診断・相談システム構築実践法',
    'article-utage-staffing-company-management.html': 'UTAGE人材派遣会社管理システムで業務効率を劇的改善',
    'article-utage-step-mail-course.html': 'UTAGEステップメール講座で見込み客を顧客に育成する方法',
    'article-utage-student-management.html': 'UTAGE生徒管理システムで教育機関の運営を効率化',
    'article-utage-subscription-business.html': 'UTAGEサブスクリプションビジネス構築で安定収益を実現',
    'article-utage-support-guide.html': 'UTAGEサポート完全ガイド：困ったときの解決法',
    'article-utage-tax-office-consultation-conversion.html': 'UTAGE税理士事務所相談・転換システム構築実践ガイド',
    'article-utage-teacher-recruitment-strategy.html': 'UTAGEで教員採用戦略を成功に導く実践的手法',
    'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド：効率的なページ作成法',
    'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページアップセルで売上を倍増させる方法',
    'article-utage-tourism-association-tour-booking.html': 'UTAGE観光協会ツアー予約システム構築完全ガイド',
    'article-utage-veterinary-clinic-vaccination-reminder.html': 'UTAGE動物病院ワクチン接種リマインダーシステム構築法',
    'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理で効果的な配信を実現する方法',
    'article-utage-visiting-nurse-schedule-management.html': 'UTAGE訪問看護スケジュール管理システム構築ガイド',
    'article-utage-vs-comparison-new.html': 'UTAGE競合比較最新版：他ツールとの違いを徹底解説',
    'article-utage-vs-comparison.html': 'UTAGE vs 他ツール徹底比較：選ぶべき理由を解説',
    'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASP メール配信機能徹底比較ガイド',
    'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable オンライン教育プラットフォーム比較',
    'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページで参加率を最大化する方法',
    'article-utage-welfare-facility-recruitment.html': 'UTAGE福祉施設職員募集システムで人材確保を効率化',
    'article-utage-yoga-studio-class-booking-online-lessons.html': 'UTAGEヨガスタジオクラス予約・オンラインレッスン構築法'
};

// Get current article filename
function getCurrentArticleFilename() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename || 'index.html';
}

// Get article title by filename
function getArticleTitle(filename) {
    return articleTitles[filename] || filename.replace('.html', '').replace(/-/g, ' ');
}

// Get all article filenames
function getAllArticleFilenames() {
    return Object.keys(articleTitles);
}

// Get navigation links (previous/next)
function getNavigationLinks(currentFilename) {
    const allFiles = getAllArticleFilenames();
    const currentIndex = allFiles.indexOf(currentFilename);
    
    const result = {
        previous: null,
        next: null
    };
    
    if (currentIndex > 0) {
        result.previous = {
            filename: allFiles[currentIndex - 1],
            title: getArticleTitle(allFiles[currentIndex - 1])
        };
    }
    
    if (currentIndex < allFiles.length - 1) {
        result.next = {
            filename: allFiles[currentIndex + 1],
            title: getArticleTitle(allFiles[currentIndex + 1])
        };
    }
    
    return result;
}

// Initialize navigation for blog articles
function initBlogNavigation() {
    const currentFilename = getCurrentArticleFilename();
    const navigation = getNavigationLinks(currentFilename);
    
    // Update navigation elements if they exist
    const prevLink = document.querySelector('.myblog-nav-prev a');
    const nextLink = document.querySelector('.myblog-nav-next a');
    const prevTitle = document.querySelector('.myblog-nav-prev .myblog-nav-title');
    const nextTitle = document.querySelector('.myblog-nav-next .myblog-nav-title');
    
    if (prevLink && navigation.previous) {
        prevLink.href = navigation.previous.filename;
        if (prevTitle) prevTitle.textContent = navigation.previous.title;
    }
    
    if (nextLink && navigation.next) {
        nextLink.href = navigation.next.filename;
        if (nextTitle) nextTitle.textContent = navigation.next.title;
    }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogNavigation);
} else {
    initBlogNavigation();
}