/*!
 * オートウェビナー大学 - メインスクリプト
 * 作成日: 2025年5月31日
 */

(function() {
  'use strict';
  
  /**
   * 共通コンポーネント管理クラス
   */
  class ComponentLoader {
    constructor() {
      this.loadSvgDefs();
    }
    
    /**
     * 全ての共通コンポーネントを読み込み
     */
    loadAll() {
      this.loadHeader();
      this.loadFooter();
    }
    
    /**
     * テンプレートファイルを読み込み、指定セレクタの要素に挿入
     */
    async loadComponent(templatePath, targetSelector, callback) {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;
      
      try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        targetElement.innerHTML = html;
        
        if (callback) callback();
      } catch (error) {
        console.error(`コンポーネントの読み込みに失敗しました: ${templatePath}`, error);
      }
    }
    
    /**
     * SVG定義を読み込み
     */
    loadSvgDefs() {
      const svgContainer = document.getElementById('svg-defs');
      if (svgContainer) return;
      
      const svgDiv = document.createElement('div');
      svgDiv.id = 'svg-defs';
      svgDiv.style.display = 'none';
      document.body.appendChild(svgDiv);
      
      this.loadComponent('/common/svg-defs.html', '#svg-defs');
    }
    
    /**
     * ヘッダーを読み込み
     */
    loadHeader() {
      // ヘッダーが既に存在する場合はスキップ
      if (document.querySelector('.site-header')) {
        this.initializeHamburgerMenu();
        this.setActiveNavItem();
        return;
      }
      
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (!headerPlaceholder) return;
      
      const path = this.isSubpage() ? '../common/header.html' : 'common/header.html';
      this.loadComponent(path, '#header-placeholder', () => {
        this.setActiveNavItem();
        this.initializeHamburgerMenu();
      });
    }
    
    /**
     * フッターを読み込み
     */
    loadFooter() {
      // フッターが既に存在する場合はスキップ
      if (document.querySelector('.site-footer')) return;
      
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (!footerPlaceholder) return;
      
      const path = this.isSubpage() ? '../common/footer.html' : 'common/footer.html';
      this.loadComponent(path, '#footer-placeholder');
    }
    
    /**
     * 現在のページがサブページかどうかを判定
     */
    isSubpage() {
      const path = window.location.pathname;
      return this.isSubpagePath(path);
    }
    
    /**
     * サブページかどうかを判定
     */
    isSubpagePath(path) {
      return path.includes('/blog/') || 
             path.includes('/tools/') ||
             path.includes('/achievement/') ||
             path.includes('/course/') ||
             path.includes('blog/') ||
             path.includes('tools/') ||
             path.includes('achievement/') ||
             path.includes('course/');
    }
    
    /**
     * アクティブなナビゲーションアイテムを設定
     */
    setActiveNavItem() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.global-nav a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('index.html', '').replace('.html', ''))) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
    
    /**
     * ヘッダー読み込み後のハンバーガーメニュー初期化
     */
    initializeHamburgerMenu() {
      if (window.siteManager) {
        window.siteManager.initHamburgerMenu();
      }
    }
  }
  
  /**
   * サイト全体の管理クラス
   */
  class SiteManager {
    constructor() {
      this.init();
    }
    
    /**
     * サイト初期化
     */
    init() {
      // 統合キャッシュシステムでキャッシュクリア
      if (window.cacheManager) {
        window.cacheManager.clearSiteCache();
      }
      
      this.componentLoader = new ComponentLoader();
      this.componentLoader.loadAll();
      
      this.initMainSite();
      
      console.log('🚀 サイト初期化完了');
    }
    
    /**
     * メインサイト機能の初期化
     */
    initMainSite() {
      this.initHamburgerMenu();
      this.initSmoothScroll();
      this.initFaq();
      this.initAnimations();
      this.initFooterEffects();
    }
    
    
    /**
     * ハンバーガーメニューの初期化
     */
    initHamburgerMenu() {
      const hamburgerBtn = document.querySelector('.hamburger-button');
      if (!hamburgerBtn) {
        console.warn('ハンバーガーボタンが見つかりません');
        return;
      }
      
      const body = document.body;
      let mobileMenu = document.querySelector('.mobile-menu');
      
      if (!mobileMenu) {
        try {
          mobileMenu = this.createMobileMenu();
        } catch (error) {
          console.error('モバイルメニューの作成に失敗しました:', error);
          return;
        }
      }
      
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        this.toggleMenu(!isOpen, mobileMenu, body, hamburgerBtn);
      });
      
      // メニュー外クリックで閉じる
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
      
      // ESCキーでメニューを閉じる
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          this.toggleMenu(false, mobileMenu, body, hamburgerBtn);
        }
      });
    }
    
    /**
     * メニューの開閉
     */
    toggleMenu(isOpen, mobileMenu, body, hamburgerBtn) {
      if (isOpen) {
        mobileMenu.classList.add('active');
        body.classList.add('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
      } else {
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
      }
    }
    
    /**
     * モバイルメニューの動的作成
     */
    createMobileMenu() {
      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      
      const nav = document.querySelector('.global-nav');
      if (nav) {
        const navClone = nav.cloneNode(true);
        mobileMenu.appendChild(navClone);
      }
      
      // CTAボタンは削除されたため、この部分をコメントアウト
      // const contactBtn = document.querySelector('.btn-contact');
      // if (contactBtn) {
      //   const ctaDiv = document.createElement('div');
      //   ctaDiv.className = 'mobile-cta';
      //   const btnClone = contactBtn.cloneNode(true);
      //   ctaDiv.appendChild(btnClone);
      //   mobileMenu.appendChild(ctaDiv);
      // }
      
      document.body.appendChild(mobileMenu);
      return mobileMenu;
    }
    
    /**
     * スムーススクロール初期化
     */
    initSmoothScroll() {
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href').substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
    
    /**
     * FAQ機能の初期化
     */
    initFaq() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          // 他のFAQを閉じる
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // 現在のFAQをトグル
          item.classList.toggle('active');
          
          // ARIA属性を更新
          question.setAttribute('aria-expanded', !isOpen);
        });
      });
    }
    
    /**
     * アニメーション初期化
     */
    initAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);
      
      // アニメーション対象要素を監視
      document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
        animationObserver.observe(el);
      });
    }
    
    /**
     * フッターエフェクト初期化
     */
    initFooterEffects() {
      const footer = document.querySelector('.site-footer');
      if (!footer) return;
      
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footer.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      footerObserver.observe(footer);
    }
  }
  
  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', () => {
    window.siteManager = new SiteManager();
  });
  
  // グローバルに公開
  window.SiteManager = SiteManager;
  window.ComponentLoader = ComponentLoader;
  
})();