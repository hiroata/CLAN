/**
 * ブログ用JavaScript
 * ハンバーガーメニュー、目次、クイズ機能を提供
 */

(function() {
  'use strict';

  // DOM要素を取得する関数
  function getElement(selector) {
    return document.querySelector(selector);
  }

  function getElements(selector) {
    return document.querySelectorAll(selector);
  }

  // タイトルの文字数制限
  function limitTitleLength() {
    // 記事一覧のタイトル制限
    const titles = getElements('.myblog-article-card-title');
    titles.forEach(function(title) {
      const originalText = title.textContent.trim();
      if (originalText.length > 45) {
        title.textContent = originalText.substring(0, 45) + '...';
      }
    });

    // 関連記事のサムネイルタイトル制限
    const autoImages = getElements('.myblog-auto-image[data-title]');
    autoImages.forEach(function(img) {
      const originalTitle = img.getAttribute('data-title');
      if (originalTitle && originalTitle.length > 40) {
        img.setAttribute('data-title', originalTitle.substring(0, 40) + '...');
      }
    });

    // 関連記事カードのタイトル制限
    const relatedTitles = getElements('.myblog-related-card-title');
    relatedTitles.forEach(function(title) {
      const originalText = title.textContent.trim();
      if (originalText.length > 40) {
        title.textContent = originalText.substring(0, 40) + '...';
      }
    });
  }

  // ハンバーガーメニューの制御
  function initHamburgerMenu() {
    const hamburger = getElement('#myblog-hamburger');
    const nav = getElement('#myblog-nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function() {
      const isActive = hamburger.classList.contains('active');
      
      if (isActive) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      } else {
        hamburger.classList.add('active');
        nav.classList.add('active');
        hamburger.setAttribute('aria-label', 'メニューを閉じる');
      }
    });

    // ナビゲーションリンクをクリックしたらメニューを閉じる
    const navLinks = getElements('.myblog-nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      });
    });

    // ウィンドウサイズが変更されたらメニューを閉じる
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });
  }

  // 目次の制御（スマートフォン用アコーディオン）
  function initTableOfContents() {
    const tocToggle = getElement('#myblog-toc-toggle');
    const tocNav = getElement('#myblog-toc-nav');

    if (!tocToggle || !tocNav) return;

    // スマートフォンサイズの場合のみ目次を折りたたみ可能にする
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        tocToggle.style.display = 'flex';
        tocNav.classList.remove('active');
      } else {
        tocToggle.style.display = 'none';
        tocNav.classList.add('active');
      }
    }

    // 初期化時とリサイズ時にチェック
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // トグルボタンのクリックイベント
    tocToggle.addEventListener('click', function() {
      const isActive = tocNav.classList.contains('active');
      
      if (isActive) {
        tocNav.classList.remove('active');
        tocToggle.classList.remove('active');
        tocToggle.setAttribute('aria-label', '目次を開く');
      } else {
        tocNav.classList.add('active');
        tocToggle.classList.add('active');
        tocToggle.setAttribute('aria-label', '目次を閉じる');
      }
    });

    // 目次リンクのスムーズスクロール
    const tocLinks = getElements('.myblog-toc-link');
    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = getElement('#' + targetId);
        
        if (targetElement) {
          // ヘッダーの高さを考慮してオフセットを設定
          const headerHeight = getElement('.myblog-header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // スマートフォンの場合は目次を閉じる
          if (window.innerWidth <= 768) {
            tocNav.classList.remove('active');
            tocToggle.classList.remove('active');
            tocToggle.setAttribute('aria-label', '目次を開く');
          }
        }
      });
    });
  }

  // クイズ機能の初期化
  function initQuiz() {
    const quizItems = getElements('.myblog-quiz-item');
    
    quizItems.forEach(function(quizItem, index) {
      const options = quizItem.querySelectorAll('.myblog-quiz-option');
      const feedback = quizItem.querySelector('.myblog-quiz-feedback');
      let answered = false;

      options.forEach(function(option) {
        option.addEventListener('click', function() {
          if (answered) return;

          answered = true;
          const isCorrect = this.getAttribute('data-correct') === 'true';
          
          // すべてのオプションを無効化
          options.forEach(function(opt) {
            opt.disabled = true;
            const optIsCorrect = opt.getAttribute('data-correct') === 'true';
            
            if (optIsCorrect) {
              opt.classList.add('correct');
            } else {
              opt.classList.add('incorrect');
            }
          });

          // フィードバックを表示
          if (feedback) {
            feedback.classList.add('show');
            
            if (isCorrect) {
              feedback.classList.add('correct');
              feedback.textContent = '正解です！よくできました。';
            } else {
              feedback.classList.add('incorrect');
              feedback.textContent = '残念、不正解です。正解は上記のとおりです。';
            }
          }
        });
      });
    });
  }

  // シェアボタンの機能
  function initShareButtons() {
    const shareButtons = getElements('.myblog-share-btn');
    
    shareButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const buttonType = this.classList.contains('myblog-share-btn--twitter') ? 'twitter' :
                          this.classList.contains('myblog-share-btn--facebook') ? 'facebook' :
                          this.classList.contains('myblog-share-btn--hatena') ? 'hatena' : '';
        
        let shareUrl = '';
        
        switch (buttonType) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          case 'hatena':
            shareUrl = `https://b.hatena.ne.jp/entry/panel/?url=${url}&title=${title}`;
            break;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        }
      });
    });
  }

  // 検索ボタンの機能（プレースホルダー）
  function initSearchButton() {
    const searchBtn = getElement('.myblog-search-btn');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        // 実際の検索機能はここに実装
        alert('検索機能は今後実装予定です。');
      });
    }
  }

  // 遅延読み込み（統合システム使用）
  function initLazyLoading() {
    // 統合遅延読み込みシステムが利用可能な場合は委譲
    if (window.lazyLoader) {
      window.lazyLoader.observeImages();
      return;
    }
    
    // フォールバック: 基本的な遅延読み込み
    const images = getElements('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0px', threshold: 0.1 });
      images.forEach(img => imageObserver.observe(img));
    }
  }

  // WebP対応チェック
  function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // フォームのバリデーション（今後の拡張用）
  function initFormValidation() {
    // フォームがある場合のバリデーション処理
    const forms = getElements('form');
    
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        // バリデーション処理をここに追加
      });
    });
  }

  // エラーハンドリング
  function handleError(error, context) {
    console.error(`ブログスクリプトエラー (${context}):`, error);
  }

  // スクロール位置の復元（ブログ記事間の遷移では無効化）
  function restoreScrollPosition() {
    // ブログ記事からブログ記事への遷移の場合は復元しない
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    // ブログ記事間の遷移をチェック
    if (referrer && referrer.includes('/blog/') && currentUrl.includes('/blog/article-')) {
      // ブログ記事間の遷移の場合は自動でトップにスクロール
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
      sessionStorage.removeItem('myblog-scroll-position');
      // 明示的にトップにスクロール
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);
      return;
    }
    
    // それ以外の場合は通常の復元処理
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    const savedPosition = sessionStorage.getItem('myblog-scroll-position');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
      sessionStorage.removeItem('myblog-scroll-position');
    }
  }

  // スクロール位置の保存（ブログ記事遷移時は無効化）
  function saveScrollPosition() {
    window.addEventListener('beforeunload', function() {
      // ブログ記事へのリンクをクリックした場合は保存しない
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'A' && 
          activeElement.href && activeElement.href.includes('/blog/article-')) {
        sessionStorage.removeItem('myblog-scroll-position');
        return;
      }
      
      sessionStorage.setItem('myblog-scroll-position', window.pageYOffset.toString());
    });
  }

  // パフォーマンス最適化：デバウンス関数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = function() {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // リサイズイベントのデバウンス処理
  function initResizeHandler() {
    const debouncedResize = debounce(function() {
      // リサイズ時の処理
      const event = new CustomEvent('myblog:resize');
      window.dispatchEvent(event);
    }, 250);

    window.addEventListener('resize', debouncedResize);
  }

  // ダークモード対応（将来の拡張用 - 現在は無効）
  function initThemeToggle() {
    // 現在はライトテーマ固定のため、この機能は無効
    // 将来ダークモードを追加する場合はここで実装
  }

  // アクセシビリティの向上
  function improveAccessibility() {
    // キーボードナビゲーションの改善
    const focusableElements = getElements('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    // フォーカス可能要素にスキップリンク機能を追加
    focusableElements.forEach(function(element, index) {
      // タブキーでのナビゲーション向上
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          // 最後の要素で次に進む場合は最初に戻る
          if (!e.shiftKey && index === focusableElements.length - 1) {
            e.preventDefault();
            focusableElements[0].focus();
          }
          // 最初の要素で前に戻る場合は最後に移動
          else if (e.shiftKey && index === 0) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
          }
        }
      });
    });
    
    // ESCキーでモーダルやメニューを閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // ハンバーガーメニューを閉じる
        const hamburger = getElement('#myblog-hamburger');
        const nav = getElement('#myblog-nav');
        if (hamburger && nav && nav.classList.contains('active')) {
          hamburger.classList.remove('active');
          nav.classList.remove('active');
          hamburger.setAttribute('aria-label', 'メニューを開く');
          hamburger.focus(); // フォーカスを戻す
        }

        // 目次を閉じる（スマホ時）
        const tocToggle = getElement('#myblog-toc-toggle');
        const tocNav = getElement('#myblog-toc-nav');
        if (tocToggle && tocNav && window.innerWidth <= 768 && tocNav.classList.contains('active')) {
          tocNav.classList.remove('active');
          tocToggle.classList.remove('active');
          tocToggle.setAttribute('aria-label', '目次を開く');
          tocToggle.focus(); // フォーカスを戻す
        }
      }
    });
    
    // ARIA属性の動的更新
    updateAriaAttributes();
  }

  // ARIA属性の更新
  function updateAriaAttributes() {
    // ページネーション番号にaria-labelを追加
    const paginationNumbers = getElements('.myblog-pagination-number');
    paginationNumbers.forEach(function(number) {
      const pageNum = number.textContent;
      number.setAttribute('aria-label', `${pageNum}ページへ移動`);
    });
    
    // 記事カードにaria-labelを追加
    const articleCards = getElements('.myblog-article-card-link');
    articleCards.forEach(function(link) {
      const title = link.querySelector('.myblog-article-card-title');
      if (title) {
        link.setAttribute('aria-label', `記事「${title.textContent}」を読む`);
      }
    });
  }

  // 記事一覧ページのフィルター機能
  function initArticleFilters() {
    const categoryFilter = getElement('#myblog-category-filter');
    const sortFilter = getElement('#myblog-sort-filter');
    const articleCards = getElements('.myblog-article-card');

    if (!categoryFilter || !sortFilter || articleCards.length === 0) return;

    // フィルター処理
    function filterArticles() {
      const selectedCategory = categoryFilter.value;
      const selectedSort = sortFilter.value;

      // 記事を配列に変換
      const articlesArray = Array.from(articleCards);

      // カテゴリーフィルター
      articlesArray.forEach(function(card) {
        const cardTags = card.querySelectorAll('.myblog-tag');
        const cardCategories = Array.from(cardTags).map(tag => tag.textContent.toLowerCase());
        
        let categoryMatch = true;
        if (selectedCategory) {
          const categoryMap = {
            'web-design': ['ウェブデザイン', 'css', 'レスポンシブ'],
            'programming': ['javascript', 'プログラミング'],
            'marketing': ['マーケティング', 'seo'],
            'business': ['ビジネス', '効率化']
          };
          
          const targetCategories = categoryMap[selectedCategory] || [selectedCategory];
          categoryMatch = targetCategories.some(category => 
            cardCategories.some(cardCategory => cardCategory.includes(category.toLowerCase()))
          );
        }

        if (categoryMatch) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // ソート処理
      const visibleCards = articlesArray.filter(card => card.style.display !== 'none');
      const grid = getElement('.myblog-articles-grid');
      
      if (selectedSort === 'newest') {
        // 新着順（デフォルト）
        visibleCards.sort(function(a, b) {
          const dateA = new Date(a.querySelector('.myblog-article-card-date').getAttribute('datetime'));
          const dateB = new Date(b.querySelector('.myblog-article-card-date').getAttribute('datetime'));
          return dateB - dateA;
        });
      } else if (selectedSort === 'oldest') {
        // 古い順
        visibleCards.sort(function(a, b) {
          const dateA = new Date(a.querySelector('.myblog-article-card-date').getAttribute('datetime'));
          const dateB = new Date(b.querySelector('.myblog-article-card-date').getAttribute('datetime'));
          return dateA - dateB;
        });
      }
      // 人気順は実装が複雑なため、今回は省略

      // DOMを再構築
      if (grid) {
        // 非表示の記事を一時的に削除
        articlesArray.forEach(card => {
          if (card.style.display === 'none') {
            card.remove();
          }
        });

        // ソート済みの記事を追加
        visibleCards.forEach(card => {
          grid.appendChild(card);
        });

        // 非表示の記事を再追加
        articlesArray.forEach(card => {
          if (card.style.display === 'none') {
            grid.appendChild(card);
          }
        });
      }
    }

    // イベントリスナーを追加
    categoryFilter.addEventListener('change', filterArticles);
    sortFilter.addEventListener('change', filterArticles);
  }

  // ページネーション機能（基本的な見た目のみ）
  function initPagination() {
    const paginationNumbers = getElements('.myblog-pagination-number');
    const prevBtn = getElement('.myblog-pagination-btn--prev');
    const nextBtn = getElement('.myblog-pagination-btn--next');

    // ページ番号クリック時の処理
    paginationNumbers.forEach(function(number) {
      number.addEventListener('click', function(e) {
        e.preventDefault();
        
        // アクティブクラスを移動
        paginationNumbers.forEach(num => num.classList.remove('myblog-pagination-number--active'));
        this.classList.add('myblog-pagination-number--active');
        
        // 実際のページ切り替え処理はここに実装
        console.log('ページ ' + this.textContent + ' がクリックされました');
      });
    });

    // 前後ボタンの処理
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 前のページへの処理
        console.log('前のページボタンがクリックされました');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 次のページへの処理
        console.log('次のページボタンがクリックされました');
      });
    }
  }

  // 記事カードのインタラクション強化
  function enhanceArticleCards() {
    const articleCards = getElements('.myblog-article-card');
    
    articleCards.forEach(function(card) {
      // キーボードナビゲーション対応
      const link = card.querySelector('.myblog-article-card-link');
      if (link) {
        // フォーカス時のスタイリング
        link.addEventListener('focus', function() {
          card.style.transform = 'translateY(-2px)';
          card.style.boxShadow = 'var(--myblog-shadow-hover)';
        });

        link.addEventListener('blur', function() {
          card.style.transform = '';
          card.style.boxShadow = '';
        });

        // クリック時にスクロール位置をリセット
        link.addEventListener('click', function(e) {
          // セッションストレージをクリア
          sessionStorage.removeItem('myblog-scroll-position');
          
          // モバイルデバイスの場合は特別な処理
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const targetUrl = this.href;
            
            // 即座にページ遷移（スクロール位置を保存する前に）
            setTimeout(function() {
              window.location.href = targetUrl;
            }, 0);
          }
        });

        // Enter キーでリンクを開く
        link.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            sessionStorage.removeItem('myblog-scroll-position');
            window.location.href = this.href;
          }
        });
      }
    });
  }

  // キャッシュクリア機能（統合システム使用）
  function clearAllCache() {
    // 統合キャッシュシステムが利用可能な場合は委譲
    if (window.cacheManager) {
      return window.cacheManager.clearBlogCache();
    }
    
    // フォールバック: 基本的なキャッシュクリア
    sessionStorage.clear();
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('myblog') || key.includes('scroll'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('ブログキャッシュをクリアしました');
  }

  // 初期化関数
  function init() {
    try {
      // 記事ページの場合、ページロード時に確実にトップにスクロール
      if (window.location.pathname.includes('/blog/article-')) {
        // 強制的にキャッシュクリア
        clearAllCache();
        
        // ページ読み込み直後にトップへスクロール
        window.scrollTo(0, 0);
        
        // DOMContentLoaded後にも再度トップへ
        document.addEventListener('DOMContentLoaded', function() {
          window.scrollTo(0, 0);
        });
        
        // 画像読み込み完了後にも念のため
        window.addEventListener('load', function() {
          window.scrollTo(0, 0);
        });
      }
      
      // ブログ一覧ページでもキャッシュクリア
      if (window.location.pathname.includes('/blog/') && !window.location.pathname.includes('/blog/article-')) {
        clearAllCache();
      }
      
      // 基本機能の初期化
      initHamburgerMenu();
      initTableOfContents();
      initQuiz();
      initShareButtons();
      initSearchButton();
      
      // 記事一覧ページの機能
      initArticleFilters();
      initPagination();
      enhanceArticleCards();
      limitTitleLength();
      
      // UX向上機能
      initLazyLoading();
      initFormValidation();
      restoreScrollPosition();
      saveScrollPosition();
      initResizeHandler();
      improveAccessibility();
      
      // 自動アイキャッチ画像の生成
      initAutoFeaturedImages();
      
      // 画像再生成イベントリスナー
      window.addEventListener('myblog:refresh-images', function() {
        initAutoFeaturedImages();
        // 画像生成後にARIA属性を更新
        setTimeout(updateAriaAttributes, 100);
      });
      
      // カスタムイベントを発火（他のスクリプトとの連携用）
      const initEvent = new CustomEvent('myblog:initialized', {
        detail: {
          version: '1.0.0',
          features: ['hamburger-menu', 'toc', 'quiz', 'share', 'lazy-loading', 'filters', 'pagination']
        }
      });
      window.dispatchEvent(initEvent);
      
    } catch (error) {
      handleError(error, 'initialization');
    }
  }

  // DOMContentLoaded イベントで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // パブリックAPIの提供（必要に応じて外部からアクセス可能）
  window.MyBlog = {
    version: '1.0.0',
    
    // キャッシュクリア機能を公開（統合システム使用）
    clearCache: function() {
      if (window.cacheManager) {
        return window.cacheManager.hardReload('blog');
      } else {
        clearAllCache();
        window.location.reload(true);
      }
    },
    
    // 目次を手動で更新する関数
    updateToc: function() {
      initTableOfContents();
    },
    
    // クイズを手動で初期化する関数
    resetQuiz: function() {
      const quizItems = getElements('.myblog-quiz-item');
      quizItems.forEach(function(item) {
        const options = item.querySelectorAll('.myblog-quiz-option');
        const feedback = item.querySelector('.myblog-quiz-feedback');
        
        options.forEach(function(option) {
          option.disabled = false;
          option.classList.remove('correct', 'incorrect');
        });
        
        if (feedback) {
          feedback.classList.remove('show', 'correct', 'incorrect');
        }
      });
      
      initQuiz();
    },
    
    // スムーズスクロール機能
    scrollTo: function(targetId) {
      const targetElement = getElement('#' + targetId);
      if (targetElement) {
        const headerHeight = getElement('.myblog-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    },

    // フィルターを手動でリセット
    resetFilters: function() {
      const categoryFilter = getElement('#myblog-category-filter');
      const sortFilter = getElement('#myblog-sort-filter');
      const articleCards = getElements('.myblog-article-card');

      if (categoryFilter) categoryFilter.value = '';
      if (sortFilter) sortFilter.value = 'newest';
      
      articleCards.forEach(function(card) {
        card.style.display = 'block';
      });
    },
    
    // 自動画像生成を外部から呼び出し可能にする
    refreshImages: function() {
      initAutoFeaturedImages();
      // 統合遅延読み込みシステムも更新
      if (window.lazyLoader) {
        window.lazyLoader.observeImages();
      }
    }
  };
  
  // グローバル関数として自動画像生成を公開
  window.initAutoFeaturedImages = initAutoFeaturedImages;
  // 自動アイキャッチ画像の生成
  function initAutoFeaturedImages() {
    const autoImages = getElements('.myblog-auto-image');
    
    // カラーパレット（美しいグラデーション）
    const colorPalettes = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
      'linear-gradient(135deg, #667db6 0%, #0082c8 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ffb74d 100%)',
    ];

    autoImages.forEach(function(imageElement, index) {
      const title = imageElement.getAttribute('data-title');
      if (!title) return;

      // 既に処理済みかチェック
      if (imageElement.classList.contains('myblog-auto-image-processed')) {
        return;
      }

      // 処理済みマークを追加
      imageElement.classList.add('myblog-auto-image-processed');

      // タイトルの長さに基づいてカラーパレットを選択
      const colorIndex = title.length % colorPalettes.length;
      imageElement.style.background = colorPalettes[colorIndex];
      
      // テキスト要素を作成
      const textElement = document.createElement('div');
      textElement.className = 'myblog-auto-image-text';
      
      // タイトルを適切に3行に分割（日本語対応）
      const formattedTitle = formatTitleForThreeLines(title);
      textElement.textContent = formattedTitle;

      imageElement.appendChild(textElement);
    });
  }

  // タイトルを3行に適切に分割する関数
  function formatTitleForThreeLines(title) {
    // 20文字以下の場合はそのまま返す
    if (title.length <= 20) {
      return title;
    }

    // 60文字以上の場合は57文字で切り詰める
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }

    // 自然な分割ポイントを探す
    const breakPoints = ['の', 'を', 'に', 'で', 'は', 'が', 'と', 'から', 'まで', 'について', '？', '！', '。'];
    const oneThirdLength = Math.floor(title.length / 3);
    const twoThirdLength = Math.floor(title.length * 2 / 3);
    
    let firstBreak = -1;
    let secondBreak = -1;
    
    // 最初の分割点を探す（1/3付近）
    for (let i = oneThirdLength - 3; i <= oneThirdLength + 3; i++) {
      if (i > 0 && i < title.length - 1) {
        const char = title.charAt(i);
        if (breakPoints.includes(char)) {
          firstBreak = i + 1;
          break;
        }
      }
    }
    
    // 2番目の分割点を探す（2/3付近）
    for (let i = twoThirdLength - 3; i <= twoThirdLength + 3; i++) {
      if (i > firstBreak && i < title.length - 1) {
        const char = title.charAt(i);
        if (breakPoints.includes(char)) {
          secondBreak = i + 1;
          break;
        }
      }
    }
    
    // 両方の分割点が見つかった場合
    if (firstBreak > 0 && secondBreak > 0) {
      return title.substring(0, firstBreak) + '\n' + 
             title.substring(firstBreak, secondBreak) + '\n' + 
             title.substring(secondBreak);
    }
    
    // 1つの分割点のみ見つかった場合
    if (firstBreak > 0) {
      const remaining = title.substring(firstBreak);
      const remainingHalf = Math.floor(remaining.length / 2);
      return title.substring(0, firstBreak) + '\n' + 
             remaining.substring(0, remainingHalf) + '\n' + 
             remaining.substring(remainingHalf);
    }
    
    // 自然な分割点が見つからない場合は等分に分割
    return title.substring(0, oneThirdLength) + '\n' + 
           title.substring(oneThirdLength, twoThirdLength) + '\n' + 
           title.substring(twoThirdLength);
  }


})();
