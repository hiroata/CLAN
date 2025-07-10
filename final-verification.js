const fs = require('fs');
const path = require('path');

class FinalVerification {
    constructor() {
        this.results = {
            fileIntegrity: [],
            linkValidation: [],
            scriptVerification: [],
            cssVerification: [],
            performanceMetrics: {},
            errors: [],
            warnings: [],
            summary: {}
        };
        this.checkedFiles = 0;
        this.totalFiles = 0;
    }

    // プロジェクト内のファイルを検証
    verifyFileIntegrity() {
        console.log('🔍 ファイル整合性を検証中...');
        
        const criticalFiles = [
            'index.html',
            'css/style.css',
            'css/common-variables.css',
            'css/common-hamburger.css',
            'blog/myblog-style.css',
            'js/main.js',
            'js/common-cache.js',
            'js/common-init.js',
            'js/common-lazy-loading.js',
            'js/blog-navigation.js',
            'service-worker.js'
        ];

        criticalFiles.forEach(filePath => {
            const fullPath = path.resolve(filePath);
            if (fs.existsSync(fullPath)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const isValid = content.length > 0;
                    
                    this.results.fileIntegrity.push({
                        file: filePath,
                        status: isValid ? 'OK' : 'EMPTY',
                        size: content.length
                    });
                } catch (error) {
                    this.results.fileIntegrity.push({
                        file: filePath,
                        status: 'ERROR',
                        error: error.message
                    });
                }
            } else {
                this.results.fileIntegrity.push({
                    file: filePath,
                    status: 'MISSING'
                });
            }
        });
    }

    // HTMLファイルの構文チェック
    verifyHTMLStructure() {
        console.log('📝 HTML構文を検証中...');
        
        const htmlFiles = [
            'index.html',
            'blog/index.html',
            'achievement/index.html',
            'tools/index.html'
        ];

        // サンプルのブログ記事もチェック
        const blogDir = path.join(process.cwd(), 'blog');
        if (fs.existsSync(blogDir)) {
            const blogFiles = fs.readdirSync(blogDir)
                .filter(file => file.startsWith('article-utage-') && file.endsWith('.html'))
                .slice(0, 3); // 最初の3ファイルだけテスト
            
            blogFiles.forEach(file => {
                htmlFiles.push(`blog/${file}`);
            });
        }

        htmlFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // 基本的なHTML構文チェック
                    const hasDoctype = content.includes('<!DOCTYPE html>');
                    const hasHtml = content.includes('<html') && content.includes('</html>');
                    const hasHead = content.includes('<head>') && content.includes('</head>');
                    const hasBody = content.includes('<body') && content.includes('</body>');
                    const hasTitle = content.includes('<title>') && content.includes('</title>');
                    
                    // 最適化後の要素チェック
                    const hasOptimizedCSS = content.includes('?v=1750032505143');
                    const hasNavigationScript = filePath.includes('blog/article-') ? 
                        content.includes('blog-navigation.js') : true;
                    
                    const issues = [];
                    if (!hasDoctype) issues.push('DOCTYPE missing');
                    if (!hasHtml) issues.push('HTML tags missing');
                    if (!hasHead) issues.push('HEAD section missing');
                    if (!hasBody) issues.push('BODY section missing');
                    if (!hasTitle) issues.push('TITLE missing');
                    if (!hasOptimizedCSS) issues.push('Cache busting not applied');
                    if (!hasNavigationScript) issues.push('Navigation script missing');

                    this.results.scriptVerification.push({
                        file: filePath,
                        status: issues.length === 0 ? 'VALID' : 'ISSUES',
                        issues: issues,
                        size: content.length
                    });

                } catch (error) {
                    this.results.errors.push({
                        file: filePath,
                        type: 'html_verification',
                        message: error.message
                    });
                }
            }
        });
    }

    // CSS最適化の効果を検証
    verifyCSSOptimization() {
        console.log('🎨 CSS最適化を検証中...');
        
        const cssFiles = [
            'css/style.css',
            'css/common-variables.css',
            'css/common-hamburger.css',
            'blog/myblog-style.css'
        ];

        cssFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // CSS品質チェック
                    const hasComments = content.includes('/*') && content.includes('*/');
                    const hasVendorPrefixes = content.includes('-webkit-') || content.includes('-moz-');
                    const hasCustomProperties = content.includes('--');
                    const hasMediaQueries = content.includes('@media');
                    
                    // 問題のあるパターンをチェック
                    const hasImportant = (content.match(/!important/g) || []).length;
                    const hasFixedPixels = (content.match(/\d+px/g) || []).length;
                    
                    this.results.cssVerification.push({
                        file: filePath,
                        size: content.length,
                        hasComments,
                        hasVendorPrefixes,
                        hasCustomProperties,
                        hasMediaQueries,
                        importantCount: hasImportant,
                        fixedPixelCount: hasFixedPixels,
                        status: 'ANALYZED'
                    });

                } catch (error) {
                    this.results.errors.push({
                        file: filePath,
                        type: 'css_verification',
                        message: error.message
                    });
                }
            }
        });
    }

    // JavaScript最適化の効果を検証
    verifyJSOptimization() {
        console.log('⚡ JavaScript最適化を検証中...');
        
        const jsFiles = [
            'js/main.js',
            'js/common-cache.js',
            'js/common-init.js',
            'js/common-lazy-loading.js',
            'js/blog-navigation.js'
        ];

        jsFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // JavaScript品質チェック
                    const hasConsoleLog = content.includes('console.log');
                    const hasStrictMode = content.includes('use strict');
                    const hasComments = content.includes('//') || content.includes('/*');
                    const hasFunctions = content.includes('function') || content.includes('=>');
                    
                    // 特別な検証 - blog-navigation.jsの場合
                    if (filePath === 'js/blog-navigation.js') {
                        const hasArticleTitles = content.includes('articleTitles');
                        const hasNavigationFunctions = content.includes('getCurrentArticleFilename') && 
                                                      content.includes('getArticleTitle');
                        
                        this.results.scriptVerification.push({
                            file: filePath,
                            status: (hasArticleTitles && hasNavigationFunctions) ? 'CONSOLIDATED' : 'INCOMPLETE',
                            hasArticleTitles,
                            hasNavigationFunctions,
                            hasConsoleLog: hasConsoleLog,
                            size: content.length
                        });
                    } else {
                        this.results.scriptVerification.push({
                            file: filePath,
                            status: hasConsoleLog ? 'HAS_CONSOLE' : 'CLEAN',
                            hasConsoleLog,
                            hasStrictMode,
                            hasComments,
                            hasFunctions,
                            size: content.length
                        });
                    }

                } catch (error) {
                    this.results.errors.push({
                        file: filePath,
                        type: 'js_verification',
                        message: error.message
                    });
                }
            }
        });
    }

    // リンクの整合性を検証
    verifyLinkIntegrity() {
        console.log('🔗 リンク整合性を検証中...');
        
        // いくつかのHTMLファイルでリンクをテスト
        const testFiles = ['index.html', 'blog/index.html'];
        
        testFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // CSS/JSリンクを抽出
                    const cssLinks = content.match(/href\s*=\s*["']([^"']+\.css[^"']*)["']/g) || [];
                    const jsLinks = content.match(/src\s*=\s*["']([^"']+\.js[^"']*)["']/g) || [];
                    
                    const brokenLinks = [];
                    
                    // CSSリンクを検証
                    cssLinks.forEach(link => {
                        const href = link.match(/href\s*=\s*["']([^"']+)["']/)[1];
                        let resolvedPath;
                        
                        if (href.startsWith('http')) return; // 外部リンクはスキップ
                        
                        if (href.startsWith('/')) {
                            resolvedPath = href.substring(1);
                        } else {
                            resolvedPath = path.resolve(path.dirname(filePath), href);
                            resolvedPath = path.relative(process.cwd(), resolvedPath);
                        }
                        
                        // バージョンパラメータを除去
                        const cleanPath = resolvedPath.split('?')[0];
                        
                        if (!fs.existsSync(cleanPath)) {
                            brokenLinks.push({ type: 'CSS', link: href, resolved: cleanPath });
                        }
                    });
                    
                    // JSリンクを検証
                    jsLinks.forEach(link => {
                        const src = link.match(/src\s*=\s*["']([^"']+)["']/)[1];
                        let resolvedPath;
                        
                        if (src.startsWith('http')) return; // 外部リンクはスキップ
                        
                        if (src.startsWith('/')) {
                            resolvedPath = src.substring(1);
                        } else {
                            resolvedPath = path.resolve(path.dirname(filePath), src);
                            resolvedPath = path.relative(process.cwd(), resolvedPath);
                        }
                        
                        // バージョンパラメータを除去
                        const cleanPath = resolvedPath.split('?')[0];
                        
                        if (!fs.existsSync(cleanPath)) {
                            brokenLinks.push({ type: 'JS', link: src, resolved: cleanPath });
                        }
                    });

                    this.results.linkValidation.push({
                        file: filePath,
                        cssLinks: cssLinks.length,
                        jsLinks: jsLinks.length,
                        brokenLinks: brokenLinks,
                        status: brokenLinks.length === 0 ? 'ALL_VALID' : 'HAS_BROKEN'
                    });

                } catch (error) {
                    this.results.errors.push({
                        file: filePath,
                        type: 'link_verification',
                        message: error.message
                    });
                }
            }
        });
    }

    // パフォーマンス指標を計算
    calculatePerformanceMetrics() {
        console.log('📊 パフォーマンス指標を計算中...');
        
        let totalSize = 0;
        let htmlSize = 0;
        let cssSize = 0;
        let jsSize = 0;
        let fileCount = 0;

        // 主要ファイルのサイズを計算
        const calculateDirSize = (dir, extensions = []) => {
            let size = 0;
            let count = 0;
            
            if (!fs.existsSync(dir)) return { size, count };
            
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isFile()) {
                    const ext = path.extname(file);
                    if (extensions.length === 0 || extensions.includes(ext)) {
                        size += stat.size;
                        count++;
                    }
                } else if (stat.isDirectory() && !['node_modules', '.git'].includes(file)) {
                    const subResult = calculateDirSize(filePath, extensions);
                    size += subResult.size;
                    count += subResult.count;
                }
            });
            
            return { size, count };
        };

        // HTMLファイル
        const htmlResult = calculateDirSize('.', ['.html']);
        htmlSize = htmlResult.size;
        
        // CSSファイル
        const cssResult = calculateDirSize('.', ['.css']);
        cssSize = cssResult.size;
        
        // JSファイル
        const jsResult = calculateDirSize('.', ['.js']);
        jsSize = jsResult.size;
        
        totalSize = htmlSize + cssSize + jsSize;
        fileCount = htmlResult.count + cssResult.count + jsResult.count;

        this.results.performanceMetrics = {
            totalSize: totalSize,
            htmlSize: htmlSize,
            cssSize: cssSize,
            jsSize: jsSize,
            fileCount: fileCount,
            averageFileSize: fileCount > 0 ? totalSize / fileCount : 0
        };
    }

    // 最終サマリーを生成
    generateSummary() {
        const okFiles = this.results.fileIntegrity.filter(f => f.status === 'OK').length;
        const validHTML = this.results.scriptVerification.filter(f => f.status === 'VALID' || f.status === 'CONSOLIDATED').length;
        const cleanJS = this.results.scriptVerification.filter(f => f.status === 'CLEAN' || f.status === 'CONSOLIDATED').length;
        const validLinks = this.results.linkValidation.filter(f => f.status === 'ALL_VALID').length;
        
        this.results.summary = {
            fileIntegrityRate: this.results.fileIntegrity.length > 0 ? (okFiles / this.results.fileIntegrity.length * 100).toFixed(1) : 0,
            htmlValidityRate: this.results.scriptVerification.length > 0 ? (validHTML / this.results.scriptVerification.length * 100).toFixed(1) : 0,
            jsCleanlinessRate: this.results.scriptVerification.length > 0 ? (cleanJS / this.results.scriptVerification.length * 100).toFixed(1) : 0,
            linkValidityRate: this.results.linkValidation.length > 0 ? (validLinks / this.results.linkValidation.length * 100).toFixed(1) : 0,
            totalErrors: this.results.errors.length,
            totalWarnings: this.results.warnings.length
        };
    }

    // メイン実行関数
    runVerification() {
        console.log('🔍 最終検証を開始...');
        console.log('=' .repeat(50));
        
        this.verifyFileIntegrity();
        this.verifyHTMLStructure();
        this.verifyCSSOptimization();
        this.verifyJSOptimization();
        this.verifyLinkIntegrity();
        this.calculatePerformanceMetrics();
        this.generateSummary();

        // 結果レポート出力
        this.printReport();
        
        console.log('\n🎉 最終検証が完了しました！');
    }

    // レポートを出力
    printReport() {
        console.log('\n📊 最終検証レポート');
        console.log('=' .repeat(50));
        
        // サマリー
        console.log('\n🎯 総合評価:');
        console.log(`├─ ファイル整合性: ${this.results.summary.fileIntegrityRate}%`);
        console.log(`├─ HTML構文有効性: ${this.results.summary.htmlValidityRate}%`);
        console.log(`├─ JavaScript品質: ${this.results.summary.jsCleanlinessRate}%`);
        console.log(`├─ リンク有効性: ${this.results.summary.linkValidityRate}%`);
        console.log(`├─ エラー数: ${this.results.summary.totalErrors}個`);
        console.log(`└─ 警告数: ${this.results.summary.totalWarnings}個`);

        // パフォーマンス指標
        console.log('\n⚡ パフォーマンス指標:');
        const metrics = this.results.performanceMetrics;
        console.log(`├─ 総サイズ: ${(metrics.totalSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`├─ HTMLサイズ: ${(metrics.htmlSize / 1024).toFixed(1)}KB`);
        console.log(`├─ CSSサイズ: ${(metrics.cssSize / 1024).toFixed(1)}KB`);
        console.log(`├─ JSサイズ: ${(metrics.jsSize / 1024).toFixed(1)}KB`);
        console.log(`├─ ファイル数: ${metrics.fileCount}個`);
        console.log(`└─ 平均ファイルサイズ: ${(metrics.averageFileSize / 1024).toFixed(1)}KB`);

        // エラー詳細
        if (this.results.errors.length > 0) {
            console.log('\n❌ エラー詳細:');
            this.results.errors.forEach(error => {
                console.log(`  ${error.file}: ${error.message}`);
            });
        }

        // 最適化確認
        console.log('\n✅ 最適化確認:');
        const consolidatedNav = this.results.scriptVerification.find(f => f.file === 'js/blog-navigation.js');
        if (consolidatedNav && consolidatedNav.status === 'CONSOLIDATED') {
            console.log('  ✅ ナビゲーションスクリプト統廃合: 成功');
        }
        
        const cleanScripts = this.results.scriptVerification.filter(f => !f.hasConsoleLog).length;
        console.log(`  ✅ Console.log除去: ${cleanScripts}/${this.results.scriptVerification.length}ファイル`);
        
        const validLinks = this.results.linkValidation.filter(f => f.status === 'ALL_VALID').length;
        console.log(`  ✅ リンク修復: ${validLinks}/${this.results.linkValidation.length}ファイル確認済み`);

        // 推奨事項
        console.log('\n💡 推奨事項:');
        if (this.results.summary.fileIntegrityRate < 100) {
            console.log('  - 一部のファイルに問題があります。詳細を確認してください。');
        }
        if (this.results.summary.totalErrors > 0) {
            console.log('  - エラーがあります。上記のエラー詳細を確認して修正してください。');
        }
        if (this.results.summary.fileIntegrityRate >= 95 && this.results.summary.totalErrors === 0) {
            console.log('  - プロジェクトは良好な状態です！定期的な監視を継続してください。');
        }
    }
}

// 実行
const verifier = new FinalVerification();
verifier.runVerification();