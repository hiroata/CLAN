# Udemyスタイルコース機能実装仕様書

## 📋 実装概要

既存のCLANブログデザインを維持しながら、Udemyスタイルのコース機能を追加実装します。
現在の優れたSEO対策、レスポンシブデザイン、ユーザビリティを損なうことなく、コース販売機能を統合します。

---

## 🎯 実装目標

1. **既存デザインとの完全統合** - 現在のブランディング・色彩・タイポグラフィを維持
2. **レスポンシブ対応** - モバイル・タブレット・デスクトップ全対応
3. **SEO最適化** - 構造化データ、メタデータ完備
4. **高いコンバージョン率** - 効果的なCTA配置とユーザー導線設計

---

## 🏗️ 実装フェーズ

### Phase 1: 基盤構築（優先度：高）
1. コースデータ構造設計
2. 右サイドバーおすすめコース表示
3. 基本的なコース一覧ページ

### Phase 2: 機能拡張（優先度：中）
1. コース詳細ページ
2. カテゴリ・検索機能
3. 評価・レビューシステム

### Phase 3: 高度機能（優先度：低）
1. 受講進捗管理
2. 動画プレイヤー統合
3. ユーザーダッシュボード

---

## 📊 データ構造設計

### コース情報オブジェクト
```javascript
const courseData = {
  id: "course-001",
  title: "UTAGEマスター講座 - 完全攻略ガイド",
  description: "UTAGEを使った自動化システム構築の全てを学ぶ",
  instructor: "前田由紀子",
  category: "マーケティング",
  subcategory: "UTAGE",
  thumbnail: "/assets/courses/utage-master.webp",
  price: 29800,
  originalPrice: 49800,
  discount: 40,
  rating: 4.8,
  reviewCount: 156,
  studentCount: 1240,
  duration: "8時間30分",
  lectureCount: 45,
  level: "初級〜上級",
  language: "日本語",
  lastUpdated: "2025-01-09",
  isNew: true,
  isBestseller: true,
  tags: ["UTAGE", "マーケティング自動化", "ファネル構築"],
  curriculum: [
    {
      section: "基礎編",
      lectures: [
        { title: "UTAGEとは何か", duration: "15:30" },
        { title: "アカウント設定", duration: "20:45" }
      ]
    }
  ],
  requirements: ["パソコンの基本操作", "インターネット環境"],
  targetAudience: ["マーケティング担当者", "経営者", "フリーランス"],
  preview: "/assets/courses/previews/utage-master-preview.mp4"
};
```

---

## 🎨 デザインシステム統合

### 既存デザインとの整合性
```css
/* 既存のCSSカスタムプロパティを活用 */
:root {
  --course-primary: #0071e3;    /* 既存のプライマリーカラー */
  --course-success: #4CAF50;    /* 既存の成功色 */
  --course-warning: #FF9800;    /* 既存の警告色 */
  --course-text: #333;          /* 既存のテキスト色 */
  --course-border: #e0e0e0;     /* 既存のボーダー色 */
  --course-background: #f8f9fa; /* 既存の背景色 */
}

/* 既存のフォントファミリーを継承 */
.course-card {
  font-family: 'Noto Sans JP', sans-serif;
}
```

### コンポーネント命名規則
- プレフィックス: `course-` を使用
- 既存の `myblog-` 命名規則と統一
- BEM記法での実装

---

## 📱 右サイドバーコース表示実装

### HTML構造
```html
<!-- 既存の関連記事セクション後に追加 -->
<section class="course-recommended">
  <div class="course-recommended-container">
    <h2 class="course-recommended-title">🎓 おすすめUTAGE講座</h2>
    <div class="course-recommended-grid">
      <!-- コースカード -->
    </div>
  </div>
</section>
```

### コースカード仕様
```css
.course-card {
  /* 既存の myblog-related-card スタイルを基盤とする */
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #0071e3;
}
```

### 表示要素
1. **コースサムネイル** (280px × 158px)
2. **コースタイトル** (2行まで表示)
3. **講師名**
4. **評価（星）+ レビュー数**
5. **受講者数**
6. **価格（割引表示含む）**
7. **ベストセラー・新着バッジ**

---

## 📄 新規ページ作成

### 1. コース一覧ページ (`/courses/index.html`)
```html
<!-- 既存のブログ一覧ページ構造を基盤とする -->
<main class="course-main">
  <div class="course-container">
    <!-- フィルタリング機能 -->
    <div class="course-filters">
      <div class="course-search">
        <input type="text" placeholder="コースを検索...">
      </div>
      <div class="course-categories">
        <!-- カテゴリフィルター -->
      </div>
    </div>
    
    <!-- コース一覧グリッド -->
    <div class="course-grid">
      <!-- コースカード一覧 -->
    </div>
  </div>
</main>
```

### 2. コース詳細ページ (`/courses/[course-id].html`)
```html
<!-- 既存の記事詳細ページ構造を基盤とする -->
<main class="course-detail-main">
  <div class="course-detail-container">
    <!-- コースヘッダー -->
    <header class="course-detail-header">
      <!-- タイトル、説明、評価、価格など -->
    </header>
    
    <!-- コース内容 -->
    <div class="course-detail-content">
      <!-- カリキュラム、要件、対象者など -->
    </div>
    
    <!-- 購入CTA -->
    <div class="course-purchase-cta">
      <!-- 購入ボタン、カートに追加など -->
    </div>
  </div>
</main>
```

---

## 🔧 JavaScript機能実装

### 1. コース表示管理
```javascript
class CourseManager {
  constructor() {
    this.courses = [];
    this.currentFilter = 'all';
    this.searchTerm = '';
  }
  
  async loadCourses() {
    // コースデータの読み込み
  }
  
  renderCourseCards(container) {
    // コースカードのレンダリング
  }
  
  filterCourses(category) {
    // カテゴリフィルタリング
  }
  
  searchCourses(term) {
    // 検索機能
  }
}
```

### 2. 評価システム
```javascript
class RatingSystem {
  renderStars(rating, reviewCount) {
    // 星評価の表示
  }
  
  calculateAverageRating(reviews) {
    // 平均評価の計算
  }
}
```

---

## 📊 SEO対策

### 構造化データ（Course）
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "UTAGEマスター講座",
  "description": "UTAGEを使った自動化システム構築の全てを学ぶ",
  "provider": {
    "@type": "Organization",
    "name": "CLAN",
    "url": "https://clanbiz.net"
  },
  "instructor": {
    "@type": "Person",
    "name": "前田由紀子"
  },
  "offers": {
    "@type": "Offer",
    "price": "29800",
    "priceCurrency": "JPY"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "156"
  }
}
```

---

## 📱 レスポンシブ対応

### ブレークポイント
- **モバイル**: 〜768px
- **タブレット**: 769px〜1024px  
- **デスクトップ**: 1025px〜

### グリッドレイアウト
```css
.course-grid {
  display: grid;
  gap: 24px;
}

/* デスクトップ */
@media (min-width: 1025px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* タブレット */
@media (min-width: 769px) and (max-width: 1024px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* モバイル */
@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🎯 コンバージョン最適化

### 1. CTA配置戦略
- **ファーストビュー**: 目立つ「コース一覧を見る」ボタン
- **記事中**: 関連コースの自然な紹介
- **記事末**: 強力なコース推奨CTA
- **サイドバー**: 常時表示のおすすめコース

### 2. 価格表示戦略
```html
<div class="course-price">
  <span class="course-price-current">¥29,800</span>
  <span class="course-price-original">¥49,800</span>
  <span class="course-discount">40%OFF</span>
</div>
```

### 3. 社会的証明
- 受講者数表示
- 評価・レビュー
- ベストセラーバッジ
- 「残り◯名」など限定性の演出

---

## 🔄 既存コンテンツとの連携

### 1. ブログ記事からの導線
```html
<!-- 記事内に関連コース紹介ボックス -->
<div class="article-course-recommendation">
  <h4>📚 この記事で学んだ内容をさらに深く</h4>
  <div class="recommended-course-card">
    <!-- コース情報 -->
  </div>
</div>
```

### 2. 自動関連付けシステム
- 記事のタグとコースのタグをマッチング
- UTAGEタグの記事 → UTAGEコースを自動表示
- 関連度の高いコースを優先表示

---

## 📈 アナリティクス設定

### トラッキング項目
1. **コース表示回数**
2. **コースクリック率**
3. **コース詳細ページ滞在時間**
4. **購入コンバージョン率**
5. **カテゴリ別人気度**

### Google Analytics イベント
```javascript
// コースカードクリック
gtag('event', 'course_card_click', {
  'course_id': courseId,
  'course_title': courseTitle,
  'position': position
});

// コース詳細ページ閲覧
gtag('event', 'course_detail_view', {
  'course_id': courseId,
  'referrer': document.referrer
});
```

---

## 🚀 実装優先順位

### Phase 1（1-2週間）- 基本機能
1. ✅ コースデータ構造設計
2. ✅ 右サイドバーおすすめコース表示
3. ✅ 基本的なコース一覧ページ
4. ✅ レスポンシブ対応

### Phase 2（3-4週間）- 拡張機能  
1. ✅ コース詳細ページ
2. ✅ 検索・フィルタリング機能
3. ✅ 評価・レビューシステム
4. ✅ SEO最適化

### Phase 3（5-6週間）- 高度機能
1. ✅ 受講進捗管理
2. ✅ 動画プレイヤー統合
3. ✅ ユーザーダッシュボード
4. ✅ アナリティクス強化

---

## 💻 Claude Code への指示事項

### 実装順序
1. **既存CSSの継承** - 現在のデザインシステムを完全に活用
2. **段階的実装** - Phase 1から順次実装
3. **互換性確保** - 既存機能に影響を与えない
4. **パフォーマンス維持** - 現在の読み込み速度を維持

### コーディング規約
- 既存の命名規則に準拠
- CSS Grid/Flexboxの積極活用
- セマンティックHTMLの使用
- アクセシビリティ配慮必須

### テストケース
- 全デバイスでの表示確認
- 既存ページとの整合性チェック
- パフォーマンス影響度測定
- SEO設定の動作確認

---

この仕様書に基づいて、Claude Codeが段階的に実装を進めることで、現在の優れたブログデザインを維持しながら、効果的なコース販売機能を追加できます。