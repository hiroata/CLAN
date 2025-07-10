const fs = require('fs');
const path = require('path');

// ブログディレクトリのパス
const blogDir = path.join(__dirname, 'blog');

// 記事ファイルの検索パターン
const articlePattern = /^article-utage-.*\.html$/;

// ナビゲーションHTMLテンプレート
const navigationTemplate = `
                <!-- 記事ナビゲーション -->
                <nav class="myblog-article-navigation">
                    <div class="myblog-nav-container">
                        <a href="#" class="myblog-nav-prev" id="prevArticle">
                            <span class="myblog-nav-label">前の記事</span>
                            <div class="myblog-nav-title" id="prevTitle">読み込み中...</div>
                        </a>
                        <a href="#" class="myblog-nav-next" id="nextArticle">
                            <span class="myblog-nav-label">次の記事</span>
                            <div class="myblog-nav-title" id="nextTitle">読み込み中...</div>
                        </a>
                    </div>
                </nav>`;

// ナビゲーション用JavaScriptテンプレート
const navigationScript = `
    <!-- 記事ナビゲーション機能 -->
    <script>
        (function() {
            // 記事タイトルマップ（日本語タイトル）
            const articleTitles = {
                'article-utage-accounting-cloud-bookkeeping.html': 'UTAGE活用法｜会計事務所向けクラウド記帳代行サービスの構築方法',
                'article-utage-administrative-scrivener-license-permit.html': 'UTAGE活用法｜行政書士の許認可申請オンライン相談システム',
                'article-utage-beauty-clinic-strategy.html': 'UTAGE活用法｜美容クリニックの集客・リピーター獲得戦略',
                'article-utage-beauty-health-digital-marketing.html': 'UTAGE活用事例｜美容・健康業界でのデジタルマーケティング成功法',
                'article-utage-calligraphy-school-strategy.html': 'UTAGE活用法｜書道教室のオンライン集客・生徒管理システム',
                'article-utage-chamber-commerce-seminar-member.html': 'UTAGE活用法｜商工会議所向けセミナー運営・会員管理システム',
                'article-utage-checkout-optimization.html': 'UTAGEチェックアウト最適化｜カゴ落ち率20%改善の実践テクニック',
                'article-utage-coaching-business-automation.html': 'UTAGEでコーチングビジネス｜個人指導の予約・決済・フォロー自動化',
                'article-utage-consultant-success-patterns.html': 'UTAGE活用事例｜コンサルタント業界での売上アップ成功パターン',
                'article-utage-consulting-diagnosis-funnel.html': 'UTAGE活用法｜コンサルティング向け診断ファネル構築マニュアル',
                'article-utage-content-management.html': 'UTAGEコンテンツ管理システム｜効率的な教材配信と受講管理の方法',
                'article-utage-cooking-school-recipe-videos.html': 'UTAGE活用法｜料理教室のレシピ動画販売・オンライン教室運営',
                'article-utage-corporate-training-elearning.html': 'UTAGE活用法｜企業研修のeラーニング化・オンライン講座構築',
                'article-utage-dance-school-automation.html': 'UTAGE活用法｜ダンススクールの予約管理・月謝徴収自動化',
                'article-utage-dental-clinic-patient-follow-up.html': 'UTAGE活用法｜歯科医院の患者フォローアップ・予約管理システム',
                'article-utage-domain-dkim-spf-setup.html': 'UTAGE独自ドメイン設定｜DKIM・SPF完全ガイドでメール到達率UP',
                'article-utage-education-committee-parent-notification.html': 'UTAGE活用法｜教育委員会向け保護者連絡システムの構築',
                'article-utage-email-setup.html': 'UTAGEメール配信機能の使い方｜初心者でも5分で設定完了する方法',
                'article-utage-email-spam-prevention.html': 'UTAGEメールが届かない？迷惑メール判定を回避する設定方法',
                'article-utage-english-school-level-check.html': 'UTAGE活用法｜英会話スクールのレベルチェック・体験レッスン自動化',
                'article-utage-event-management-automation.html': 'UTAGEでイベント運営｜セミナー・ワークショップの集客から決済まで',
                'article-utage-fire-department-disaster-prevention.html': 'UTAGE活用法｜消防署向け防災啓発・講習会管理システム',
                'article-utage-fitness-gym-trial-membership-automation.html': 'UTAGE活用法｜フィットネスジムの体験予約・入会手続き自動化',
                'article-utage-fitness-sports-online-expansion.html': 'UTAGE活用事例｜フィットネス・スポーツ業界でのオンライン展開',
                'article-utage-fp-lifeplan-consultation.html': 'UTAGE活用法｜FP向けライフプラン相談・資産運用提案システム',
                'article-utage-free-trial-guide.html': 'UTAGE無料トライアル完全ガイド｜7日間で売上アップの仕組みを構築',
                'article-utage-funnel-guide.html': 'UTAGEファネル機能完全ガイド｜売れるセールスファネルの作り方',
                'article-utage-funnel-seo-strategy.html': 'UTAGEファネルのSEO対策｜検索エンジンに強い販売ページの作り方',
                'article-utage-funnel-vs-clickfunnels.html': 'UTAGEファネル vs ClickFunnels｜日本向けツール徹底比較',
                'article-utage-golf-school-trial-lesson-video-sales.html': 'UTAGE活用法｜ゴルフスクールの体験レッスン集客・動画レッスン販売',
                'article-utage-health-center-consultation-screening.html': 'UTAGE活用法｜保健センター向け健康相談・検診予約システム',
                'article-utage-hellowork-employment-seminar-consultation.html': 'UTAGE活用法｜ハローワーク向け就職セミナー・相談予約システム',
                'article-utage-hospital-nurse-recruitment.html': 'UTAGE活用法｜病院の看護師採用・研修管理システム構築',
                'article-utage-hotel-ryokan-direct-booking.html': 'UTAGE活用法｜ホテル・旅館の直接予約システム構築で手数料削減',
                'article-utage-internship-recruitment-system.html': 'UTAGE活用法｜インターンシップ採用管理システムの構築方法',
                'article-utage-it-engineer-recruitment.html': 'UTAGE活用法｜ITエンジニア採用特化型システムの構築方法',
                'article-utage-japanese-language-school.html': 'UTAGE活用法｜日本語学校の入学申込・学習管理システム構築',
                'article-utage-judicial-scrivener-inheritance-diagnosis.html': 'UTAGE活用法｜司法書士の相続診断・オンライン相談システム',
                'article-utage-kindergarten-trial-newsletter.html': 'UTAGE活用法｜幼稚園の体験入園申込・保護者向けニュースレター',
                'article-utage-label-automation.html': 'UTAGEラベル自動化完全ガイド｜顧客セグメント管理の効率化',
                'article-utage-landing-page-guide.html': 'UTAGEランディングページ作成ガイド｜CVR30%超えのLP制作法',
                'article-utage-lawyer-consultation-estimate-automation.html': 'UTAGE活用法｜弁護士事務所の相談予約・見積もり自動化システム',
                'article-utage-learning-academy-trial-lessons.html': 'UTAGE活用法｜学習塾の体験授業申込・生徒管理システム構築',
                'article-utage-legal-professionals-online-system.html': 'UTAGE活用法｜士業（税理士・行政書士）のオンライン集客システム',
                'article-utage-line-delivery-guide.html': 'UTAGE LINE配信完全ガイド｜公式アカウント連携から配信まで',
                'article-utage-line-step-delivery.html': 'UTAGEでLINEステップ配信を作る方法｜CVR20%超えのシナリオ構築術',
                'article-utage-local-business-digital-transformation.html': 'UTAGEで地方ビジネス｜地域密着型企業のデジタル変革成功事例',
                'article-utage-marriage-agency-consultation-matchmaking-knowledge.html': 'UTAGE活用法｜結婚相談所の面談予約・マッチング効率化システム',
                'article-utage-membership-site-manual.html': 'UTAGE会員サイト構築マニュアル｜月額課金で安定収入を実現',
                'article-utage-merits-demerits-2.html': 'UTAGEのメリット・デメリット完全解説2025年最新版',
                'article-utage-mid-career-recruitment-strategy.html': 'UTAGE活用法｜中途採用の応募から内定まで完全自動化戦略',
                'article-utage-mobile-optimization.html': 'UTAGEのモバイル最適化完全ガイド｜スマホCV率を3倍にする方法',
                'article-utage-multistep-funnel.html': 'UTAGEマルチステップファネル完全ガイド｜段階的成約の極意',
                'article-utage-municipality-resident-notification.html': 'UTAGE活用法｜市区町村向け住民通知・イベント管理システム',
                'article-utage-municipality-staff-recruitment.html': 'UTAGE活用法｜自治体職員採用システムの構築と運用方法',
                'article-utage-music-school-trial-lessons.html': 'UTAGE活用法｜音楽教室の体験レッスン予約・生徒管理システム',
                'article-utage-new-graduate-recruitment.html': 'UTAGE活用法｜新卒採用の母集団形成から内定まで完全自動化',
                'article-utage-nursing-home-tour-booking-automation.html': 'UTAGE活用法｜介護施設の見学予約・入居相談自動化システム',
                'article-utage-obstetrics-maternity-class-automation.html': 'UTAGE活用法｜産婦人科のマタニティクラス予約・フォロー自動化',
                'article-utage-online-course-creation.html': 'UTAGEでオンライン講座を作る方法｜受講生満足度90%の秘訣',
                'article-utage-online-education-complete-guide.html': 'UTAGEオンライン教育完全ガイド｜教育ビジネスDX成功の秘訣',
                'article-utage-optin-page-design.html': 'UTAGEオプトインページ最適化｜登録率50%超えのデザイン戦略',
                'article-utage-part-time-recruitment-automation.html': 'UTAGE活用法｜アルバイト・パート採用の応募から面接まで自動化',
                'article-utage-payment-integration-guide.html': 'UTAGE決済連携完全ガイド｜Stripe・PayPal設定と売上最大化',
                'article-utage-pet-hotel-booking-care-video-sales.html': 'UTAGE活用法｜ペットホテルの予約管理・ケア動画販売システム',
                'article-utage-pharmacy-health-consultation.html': 'UTAGE活用法｜薬局の健康相談予約・服薬指導システム構築',
                'article-utage-photo-studio-booking-photographer-training.html': 'UTAGE活用法｜写真スタジオの予約管理・カメラマン養成講座',
                'article-utage-pricing.html': 'UTAGE料金プラン徹底解説｜最適なプランの選び方と費用対効果',
                'article-utage-programming-school-free-courses.html': 'UTAGE活用法｜プログラミングスクールの無料講座・本講座誘導',
                'article-utage-psychiatry-initial-consultation-questionnaire.html': 'UTAGE活用法｜精神科・心療内科の初診問診票デジタル化',
                'article-utage-qualification-prep-school.html': 'UTAGE活用法｜資格試験予備校のオンライン講座・合格保証システム',
                'article-utage-real-estate-digital-transformation.html': 'UTAGEで不動産業界｜顧客育成から成約までのデジタル化手法',
                'article-utage-real-estate-property-training.html': 'UTAGE活用法｜不動産会社の物件案内予約・営業研修システム',
                'article-utage-rehabilitation-center-training-videos.html': 'UTAGE活用法｜リハビリセンターの予約管理・トレーニング動画配信',
                'article-utage-reminder-system.html': 'UTAGEリマインダー機能完全ガイド｜予約忘れゼロの仕組み作り',
                'article-utage-restaurant-reservation-member-menu.html': 'UTAGE活用法｜飲食店の予約管理・会員限定メニュー提供システム',
                'article-utage-sales-page-psychology.html': 'UTAGEセールスページの心理学｜成約率を高める7つの要素',
                'article-utage-seitai-clinic-management.html': 'UTAGE活用法｜整体院の予約・顧客管理・リピーター獲得システム',
                'article-utage-sme-consultant-subsidy-guide.html': 'UTAGE活用法｜中小企業診断士の補助金申請サポートシステム',
                'article-utage-sr-firm-labor-diagnosis.html': 'UTAGE活用法｜社労士事務所の労務診断・顧問契約獲得システム',
                'article-utage-sr-subsidy-diagnosis-consultation.html': 'UTAGE活用法｜社労士向け助成金診断・相談予約システム構築',
                'article-utage-staffing-company-management.html': 'UTAGE活用法｜人材派遣会社のスタッフ管理・案件マッチング',
                'article-utage-step-mail-course.html': 'UTAGEステップメール作成講座｜売上3倍のシナリオ設計法',
                'article-utage-student-management.html': 'UTAGE生徒管理システム完全ガイド｜教育ビジネスの効率化',
                'article-utage-subscription-business.html': 'UTAGEで定期課金システム｜サブスクリプションビジネスの始め方',
                'article-utage-support-guide.html': 'UTAGEサポート完全ガイド｜困った時の問い合わせ方法と解決策',
                'article-utage-tax-office-consultation-conversion.html': 'UTAGE活用法｜税理士事務所の無料相談から顧問契約への転換率向上',
                'article-utage-teacher-recruitment-strategy.html': 'UTAGE活用法｜教員採用の応募管理・選考プロセス自動化',
                'article-utage-template-guide.html': 'UTAGEテンプレート活用ガイド｜プロ級デザインを5分で実現',
                'article-utage-thanks-page-upsell.html': 'UTAGEサンクスページ最適化｜購入後アップセルで売上2倍',
                'article-utage-tourism-association-tour-booking.html': 'UTAGE活用法｜観光協会向けツアー予約・観光情報配信システム',
                'article-utage-veterinary-clinic-vaccination-reminder.html': 'UTAGE活用法｜動物病院の予約管理・ワクチン接種リマインダー',
                'article-utage-video-content-management.html': 'UTAGE動画コンテンツ管理｜効率的な配信と視聴分析の方法',
                'article-utage-visiting-nurse-schedule-management.html': 'UTAGE活用法｜訪問看護ステーションのスケジュール管理システム',
                'article-utage-vs-comparison-new.html': 'UTAGE vs 他社サービス新比較｜2025年最新版マーケティングツール比較',
                'article-utage-vs-comparison.html': 'UTAGE vs 他社サービス徹底比較｜あなたに最適なツールの選び方',
                'article-utage-vs-myasp-email-comparison.html': 'UTAGE vs MyASPメール配信機能比較｜どちらが優秀？',
                'article-utage-vs-teachable-comparison.html': 'UTAGE vs Teachable徹底比較｜日本向けオンライン講座プラットフォーム',
                'article-utage-webinar-registration-page.html': 'UTAGEウェビナー登録ページ作成｜参加率85%を実現する設計法',
                'article-utage-welfare-facility-recruitment.html': 'UTAGE活用法｜福祉施設の職員採用・研修管理システム',
                'article-utage-yoga-studio-class-booking-online-lessons.html': 'UTAGE活用法｜ヨガスタジオのクラス予約・オンラインレッスン配信'
            };

            // 全記事リスト（順序）
            const articleList = Object.keys(articleTitles);

            // 現在の記事のファイル名を取得
            function getCurrentArticleFilename() {
                const path = window.location.pathname;
                return path.substring(path.lastIndexOf('/') + 1);
            }

            // ナビゲーションを初期化
            function initializeNavigation() {
                const currentFilename = getCurrentArticleFilename();
                const currentIndex = articleList.indexOf(currentFilename);
                
                if (currentIndex === -1) {
                    console.error('現在の記事がリストに見つかりません:', currentFilename);
                    return;
                }

                const prevArticle = document.getElementById('prevArticle');
                const nextArticle = document.getElementById('nextArticle');
                const prevTitle = document.getElementById('prevTitle');
                const nextTitle = document.getElementById('nextTitle');

                // 前の記事
                if (currentIndex > 0) {
                    const prevFilename = articleList[currentIndex - 1];
                    const prevTitleText = articleTitles[prevFilename] || '前の記事';
                    prevTitle.textContent = prevTitleText.length > 40 ? 
                        prevTitleText.substring(0, 40) + '...' : prevTitleText;
                    prevArticle.href = prevFilename;
                    prevArticle.classList.remove('disabled');
                } else {
                    prevTitle.textContent = '最初の記事です';
                    prevArticle.classList.add('disabled');
                    prevArticle.removeAttribute('href');
                    prevArticle.addEventListener('click', function(e) {
                        e.preventDefault();
                    });
                }

                // 次の記事
                if (currentIndex < articleList.length - 1) {
                    const nextFilename = articleList[currentIndex + 1];
                    const nextTitleText = articleTitles[nextFilename] || '次の記事';
                    nextTitle.textContent = nextTitleText.length > 40 ? 
                        nextTitleText.substring(0, 40) + '...' : nextTitleText;
                    nextArticle.href = nextFilename;
                    nextArticle.classList.remove('disabled');
                } else {
                    nextTitle.textContent = '最後の記事です';
                    nextArticle.classList.add('disabled');
                    nextArticle.removeAttribute('href');
                    nextArticle.addEventListener('click', function(e) {
                        e.preventDefault();
                    });
                }
            }

            // DOMが読み込まれたら初期化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeNavigation);
            } else {
                initializeNavigation();
            }
        })();
    </script>`;

// ディレクトリ内のファイルを読み取る
const files = fs.readdirSync(blogDir);

// 記事ファイルのみフィルタリング
const articleFiles = files.filter(file => articlePattern.test(file));

console.log(`総記事数: ${articleFiles.length}`);

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

// 各記事ファイルを処理
articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        
        // 既にナビゲーションHTMLが存在するかチェック
        if (content.includes('<nav class="myblog-article-navigation"') || 
            content.includes('<div class="myblog-article-navigation"')) {
            console.log(`⏭️  スキップ（既存）: ${file}`);
            skipCount++;
            return;
        }
        
        // 1. ナビゲーションHTMLを追加
        // 著者プロフィールの後、関連記事の前に挿入
        const authorRegex = /<\/div>\s*<\/div>\s*(?=\s*<\/article>)/;
        const relatedRegex = /(?=\s*<!-- 関連記事 -->)/;
        
        if (relatedRegex.test(content)) {
            // 関連記事セクションの前に挿入
            content = content.replace(relatedRegex, navigationTemplate + '\n');
            modified = true;
        } else if (authorRegex.test(content)) {
            // 著者プロフィールの後に挿入
            content = content.replace(authorRegex, '$&' + navigationTemplate);
            modified = true;
        }
        
        // 2. JavaScriptを追加（</body>タグの前）
        if (!content.includes('記事ナビゲーション機能')) {
            content = content.replace(/<\/body>/, navigationScript + '\n</body>');
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ 成功: ${file}`);
            successCount++;
        } else {
            console.log(`⚠️  変更なし: ${file}`);
            skipCount++;
        }
        
    } catch (error) {
        console.error(`❌ エラー: ${file} - ${error.message}`);
        errorCount++;
    }
});

console.log('\n=== 処理結果 ===');
console.log(`✅ 成功: ${successCount}記事`);
console.log(`⏭️  スキップ: ${skipCount}記事`);
console.log(`❌ エラー: ${errorCount}記事`);
console.log(`📊 合計: ${articleFiles.length}記事`);