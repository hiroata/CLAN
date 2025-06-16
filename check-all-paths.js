const fs = require('fs');
const path = require('path');

class PathChecker {
    constructor() {
        this.issues = [];
        this.checkedFiles = 0;
        this.problemPatterns = [
            { pattern: /\.\.\.\.+\//g, description: '4つ以上のドット' },
            { pattern: /href\s*=\s*["']\.\.\.\.+\//g, description: 'href属性の4つ以上のドット' },
            { pattern: /src\s*=\s*["']\.\.\.\.+\//g, description: 'src属性の4つ以上のドット' },
            { pattern: /@import\s+url\s*\(\s*["']?\.\.\.\.+\//g, description: '@importの4つ以上のドット' }
        ];
    }

    // すべてのHTMLとCSSファイルを検索
    findAllFiles(dir, fileList = []) {
        try {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    // 除外ディレクトリ
                    if (!['node_modules', '.git', '.vscode', 'vendor'].includes(file)) {
                        this.findAllFiles(filePath, fileList);
                    }
                } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
                    fileList.push(filePath);
                }
            });
        } catch (error) {
            console.error(`ディレクトリ読み込みエラー: ${dir} - ${error.message}`);
        }
        
        return fileList;
    }

    // ファイルをチェック
    checkFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(process.cwd(), filePath);
            const fileIssues = [];

            // 各パターンをチェック
            this.problemPatterns.forEach(({ pattern, description }) => {
                const matches = content.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        // 行番号を取得
                        const lines = content.substring(0, content.indexOf(match)).split('\n');
                        const lineNumber = lines.length;
                        
                        fileIssues.push({
                            type: description,
                            match: match.trim(),
                            line: lineNumber
                        });
                    });
                }
            });

            // その他の問題パターンもチェック
            // 絶対パスの残存チェック（ローカルリソース）
            const absolutePaths = content.match(/(?:href|src)\s*=\s*["']\/(?!\/|https?:)[^"']+["']/g);
            if (absolutePaths) {
                absolutePaths.forEach(match => {
                    // 除外パターン（正当な絶対パス）
                    const excludePatterns = [
                        '/js/script.js',
                        '/css/footer-hover.css',
                        '/images/',
                        '/assets/images/logo.webp'
                    ];
                    
                    const shouldExclude = excludePatterns.some(pattern => match.includes(pattern));
                    if (!shouldExclude) {
                        const lines = content.substring(0, content.indexOf(match)).split('\n');
                        fileIssues.push({
                            type: '潜在的な絶対パス問題',
                            match: match.trim(),
                            line: lines.length
                        });
                    }
                });
            }

            if (fileIssues.length > 0) {
                this.issues.push({
                    file: relativePath,
                    issues: fileIssues
                });
            }

            this.checkedFiles++;

        } catch (error) {
            console.error(`ファイル読み込みエラー: ${filePath} - ${error.message}`);
        }
    }

    // 結果を表示
    displayResults() {
        console.log('\n📊 パスチェック結果:');
        console.log(`├─ チェックしたファイル数: ${this.checkedFiles}`);
        console.log(`└─ 問題のあるファイル数: ${this.issues.length}`);

        if (this.issues.length > 0) {
            console.log('\n❌ 問題が見つかったファイル:');
            
            // 問題タイプ別に集計
            const issueTypes = {};
            this.issues.forEach(({ file, issues }) => {
                issues.forEach(issue => {
                    if (!issueTypes[issue.type]) {
                        issueTypes[issue.type] = [];
                    }
                    issueTypes[issue.type].push({ file, match: issue.match, line: issue.line });
                });
            });

            // タイプ別に表示
            Object.entries(issueTypes).forEach(([type, occurrences]) => {
                console.log(`\n🔍 ${type}: ${occurrences.length}件`);
                occurrences.slice(0, 10).forEach(({ file, match, line }) => {
                    console.log(`  ${file}:${line} → ${match}`);
                });
                if (occurrences.length > 10) {
                    console.log(`  ... 他${occurrences.length - 10}件`);
                }
            });

        } else {
            console.log('\n✅ すべてのファイルが正常です！パスの問題は見つかりませんでした。');
        }
    }

    // メイン実行
    run() {
        console.log('🔍 全ファイルのパスチェックを開始...');
        console.log('チェック対象: HTMLファイル、CSSファイル、JSファイル');
        console.log('チェック内容: 4つ以上のドット、不正な絶対パス\n');

        const allFiles = this.findAllFiles(process.cwd());
        console.log(`📁 ${allFiles.length}個のファイルをチェック中...\n`);

        // プログレス表示
        allFiles.forEach((file, index) => {
            if (index % 50 === 0) {
                process.stdout.write(`\r処理中... ${index}/${allFiles.length}`);
            }
            this.checkFile(file);
        });
        process.stdout.write(`\r処理完了: ${allFiles.length}/${allFiles.length}\n`);

        this.displayResults();
    }
}

// 実行
const checker = new PathChecker();
checker.run();