/*!
 * オートウェビナー大学 - メインスクリプト
 * 作成日: 2025年5月31日
 */

(function() {
  'use strict';
  
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
      // 全体キャッシュクリア
      this.clearAllCache();
      
      this.componentLoader = new ComponentLoader();
      this.componentLoader.loadAll();
      
      this.initLazyLoading();
      this.initMainSite();
      
      console.log('🚀 サイト初期化完了');
    }
    
    /**
     * 全体キャッシュクリア機能
     */
    clearAllCache() {
      // sessionStorage 完全クリア
      sessionStorage.clear();
      
      // localStorage クリア（サイト関連のもの）
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('scroll') || 
          key.includes('menu') || 
          key.includes('animation') ||
          key.includes('clan') ||
          key.includes('site') ||
          key.includes('utage')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Service Worker キャッシュクリア
      if ('caches' in window) {
        caches.keys().then(function(names) {
          names.forEach(function(name) {
            caches.delete(name);
          });
        });
      }
      
      // history.scrollRestoration を自動に設定
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
      
      console.log('🧹 全サイトキャッシュをクリアしました');
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
     * 画像の遅延読み込み初期化
     */
    initLazyLoading() {
      if (!('IntersectionObserver' in window)) {
        // フォールバック: 即時読み込み
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        });
        return;
      }
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    /**
     * ハンバーガーメニューの初期化
     */
    initHamburgerMenu() {
      const hamburgerBtn = document.querySelector('.hamburger-button');
      if (!hamburgerBtn) return;
      
      const body = document.body;
      const mobileMenu = document.querySelector('.mobile-menu') || this.createMobileMenu();
      
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
      
      const contactBtn = document.querySelector('.btn-contact');
      if (contactBtn) {
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'mobile-cta';
        const btnClone = contactBtn.cloneNode(true);
        ctaDiv.appendChild(btnClone);
        mobileMenu.appendChild(ctaDiv);
      }
      
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
          
          // クリックされたFAQの開閉
          item.classList.toggle('active', !isOpen);
        });
      });
    }
    
    /**
     * アニメーション初期化
     */
    initAnimations() {
      if (!('IntersectionObserver' in window)) return;
      
      const fadeElements = document.querySelectorAll('.fade-in');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });
      
      fadeElements.forEach(element => observer.observe(element));
    }
    
    /**
     * フッターエフェクトの初期化
     */
    initFooterEffects() {
      const footer = document.querySelector('.site-footer');
      if (!footer || !('IntersectionObserver' in window)) return;
      
      const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footer.classList.add('footer-visible');
          }
        });
      }, { threshold: 0.2 });
      
      footerObserver.observe(footer);
    }
  }
  
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
        if (!response.ok) {
          throw new Error(`${templatePath} の読み込みに失敗: ${response.status}`);
        }
        
        const data = await response.text();
        targetElement.innerHTML = data;
        
        if (callback && typeof callback === 'function') {
          callback(targetElement);
        }
      } catch (error) {
        console.error('テンプレート読み込みエラー:', error);
      }
    }
    
    /**
     * SVG定義を読み込み
     */
    async loadSvgDefs() {
      try {
        const response = await fetch('/common/svg-defs.html');
        if (!response.ok) return;
        
        const data = await response.text();
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = data;
        
        const svgElement = svgContainer.querySelector('svg');
        if (svgElement) {
          document.body.insertBefore(svgElement, document.body.firstChild);
        }
      } catch (error) {
        console.error('SVG定義読み込みエラー:', error);
      }
    }
    
    /**
     * ヘッダーを読み込み
     */
    loadHeader() {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        this.loadComponent('/common/header.html', '#header-placeholder', () => {
          this.setActiveNavItem();
          this.initializeHamburgerMenu();
        });
      }
    }
    
    /**
     * フッターを読み込み
     */
    loadFooter() {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        const currentPath = window.location.pathname;
        const isSubpage = this.isSubpagePath(currentPath);
        const footerPath = isSubpage ? '../common/footer.html' : '/common/footer.html';
        this.loadComponent(footerPath, '#footer-placeholder');
      }
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
  
  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', () => {
    window.siteManager = new SiteManager();
  });
  
  // グローバルに公開
  window.SiteManager = SiteManager;
  window.ComponentLoader = ComponentLoader;
  
  /**
   * 画像ツール共通ユーティリティクラス
   */
  class ImageToolsUtils {
    // ファイルドロップとファイル選択の設定
    static setupFileDropAndSelection(dropArea, fileInput, handleFilesCallback) {
      // ドラッグ&ドロップ機能
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.highlight.bind(null, dropArea), false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, this.unhighlight.bind(null, dropArea), false);
      });

      // ファイルドロップ処理
      dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFilesCallback(files);
      });

      // ファイル選択ボタン処理
      dropArea.addEventListener('click', function() {
        fileInput.click();
      });

      fileInput.addEventListener('change', function() {
        handleFilesCallback(this.files);
      });
    }

    static preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    static highlight(dropArea) {
      dropArea.classList.add('drag-over');
    }

    static unhighlight(dropArea) {
      dropArea.classList.remove('drag-over');
    }

    // ファイルアイテムのUI作成
    static createFileItem(file, imageSrc, onRemoveCallback) {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      const sizeInKB = (file.size / 1024).toFixed(1);
      
      fileItem.innerHTML = `
        <div class="file-preview">
          <img src="${imageSrc}" alt="${file.name}" class="preview-image">
        </div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${sizeInKB} KB</div>
        </div>
        <button type="button" class="remove-file-btn" aria-label="ファイルを削除">×</button>
      `;

      // 削除ボタンイベント
      const removeBtn = fileItem.querySelector('.remove-file-btn');
      removeBtn.addEventListener('click', function() {
        fileItem.remove();
        if (onRemoveCallback) onRemoveCallback();
      });

      return fileItem;
    }

    // UI状態更新
    static updateUI(message, isError = false) {
      const messageElement = document.querySelector('.message') || this.createMessageElement();
      messageElement.textContent = message;
      messageElement.className = isError ? 'message error' : 'message success';
      
      // 3秒後に自動で消去
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 3000);
    }

    static createMessageElement() {
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      document.querySelector('.tool-container').appendChild(messageElement);
      return messageElement;
    }

    // ファイルサイズをフォーマット
    static formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 画像の寸法を取得
    static getImageDimensions(file) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
          resolve({
            width: this.naturalWidth,
            height: this.naturalHeight
          });
        };
        img.src = URL.createObjectURL(file);
      });
    }
  }

  // グローバルに公開
  window.ImageToolsUtils = ImageToolsUtils;
  
  // レガシー関数のサポート（後方互換性）
  window.setupFileDropAndSelection = ImageToolsUtils.setupFileDropAndSelection.bind(ImageToolsUtils);
  window.createFileItem = ImageToolsUtils.createFileItem.bind(ImageToolsUtils);
  window.updateUI = ImageToolsUtils.updateUI.bind(ImageToolsUtils);
  window.formatFileSize = ImageToolsUtils.formatFileSize.bind(ImageToolsUtils);
  window.getImageDimensions = ImageToolsUtils.getImageDimensions.bind(ImageToolsUtils);
  
  // グローバルキャッシュクリア関数
  window.clearSiteCache = function() {
    console.log('🧹 サイト全体のキャッシュクリアを開始...');
    
    // 全ストレージクリア
    sessionStorage.clear();
    localStorage.clear();
    
    // Service Worker にキャッシュクリアメッセージを送信
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.success) {
          console.log('🧹 Service Worker キャッシュクリア完了');
          // ハードリロード
          window.location.reload(true);
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        {type: 'CLEAR_CACHE'}, 
        [messageChannel.port2]
      );
    } else {
      // Service Worker がない場合は直接キャッシュクリア
      if ('caches' in window) {
        caches.keys().then(function(names) {
          return Promise.all(names.map(name => caches.delete(name)));
        }).then(function() {
          console.log('🧹 ブラウザキャッシュクリア完了');
          window.location.reload(true);
        });
      } else {
        console.log('🧹 ストレージクリア完了');
        window.location.reload(true);
      }
    }
  };

})();
