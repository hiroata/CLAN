const fs = require('fs');
const path = require('path');

class CodeConsolidator {
    constructor() {
        this.unusedFiles = [];
        this.redundantCode = [];
        this.consolidations = [];
        this.issues = [];
        this.allFiles = [];
        this.references = new Map();
        this.inlineScripts = [];
        this.duplicateContent = new Map();
    }

    // プロジェクト内のすべてのファイルを検出
    findAllFiles(dir, fileList = []) {
        try {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', '.vscode', 'vendor'].includes(file)) {
                        this.findAllFiles(filePath, fileList);
                    }
                } else {
                    // スクリプトファイルや古いファイルを除外
                    if (!file.includes('.ps1') && !file.includes('emergency-') && !file.includes('final-') && !file.includes('restore-')) {
                        this.allFiles.push(filePath);
                        
                        // ファイル参照をマップに追加
                        const relativePath = path.relative(process.cwd(), filePath);
                        this.references.set(relativePath, new Set());
                    }
                }
            });
        } catch (error) {
            this.issues.push({
                type: 'scan_error',
                message: `ディレクトリスキャンエラー: ${error.message}`,
                location: dir
            });
        }
        
        return fileList;
    }

    // ファイル参照を分析
    analyzeFileReferences() {
        console.log('🔍 ファイル参照を分析中...');
        
        this.allFiles.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(process.cwd(), filePath);
                
                // CSS/JS/画像ファイルへの参照を検出
                const patterns = [
                    /src\s*=\s*["']([^"']+)["']/g,
                    /href\s*=\s*["']([^"']+)["']/g,
                    /@import\s+url\s*\(\s*["']?([^"')]+)["']?\s*\)/g,
                    /require\s*\(\s*["']([^"']+)["']\s*\)/g,
                    /import\s+.*from\s+["']([^"']+)["']/g
                ];

                patterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        let referencedFile = match[1];
                        
                        // 相対パスを解決
                        if (referencedFile.startsWith('./') || referencedFile.startsWith('../')) {
                            referencedFile = path.resolve(path.dirname(filePath), referencedFile);
                            referencedFile = path.relative(process.cwd(), referencedFile);
                        } else if (referencedFile.startsWith('/')) {
                            referencedFile = referencedFile.substring(1);
                        }
                        
                        // 存在するファイルの場合のみ参照を記録
                        if (this.references.has(referencedFile)) {
                            this.references.get(referencedFile).add(relativePath);
                        }
                    }
                });

            } catch (error) {
                this.issues.push({
                    type: 'reference_analysis_error',
                    message: `参照分析エラー: ${error.message}`,
                    location: path.relative(process.cwd(), filePath)
                });
            }
        });
    }

    // 未使用ファイルを検出
    findUnusedFiles() {
        console.log('🗑️ 未使用ファイルを検出中...');
        
        this.references.forEach((refs, filePath) => {
            // メインファイルは除外
            const mainFiles = ['index.html', 'robots.txt', 'sitemap.xml', '.htaccess', 'service-worker.js'];
            const isMainFile = mainFiles.some(main => filePath.endsWith(main));
            
            // 自動生成されたスクリプトファイルかチェック
            const isGeneratedScript = filePath.includes('fix-') || 
                                    filePath.includes('add-') || 
                                    filePath.includes('update-') ||
                                    filePath.includes('cache-clear') ||
                                    filePath.includes('project-analysis') ||
                                    filePath.includes('code-consolidation');
            
            if (!isMainFile && !isGeneratedScript && refs.size === 0) {
                // ファイルが実際に存在するかチェック
                const fullPath = path.resolve(filePath);
                if (fs.existsSync(fullPath)) {
                    const stat = fs.statSync(fullPath);
                    this.unusedFiles.push({
                        file: filePath,
                        size: stat.size,
                        lastModified: stat.mtime
                    });
                }
            }
        });
    }

    // インラインスクリプトを検出
    findInlineScripts() {
        console.log('📝 インラインスクリプトを検出中...');
        
        this.allFiles.forEach(filePath => {
            if (!filePath.endsWith('.html')) return;
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(process.cwd(), filePath);
                
                // インラインスクリプトタグを検出
                const scriptMatches = content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
                for (const match of scriptMatches) {
                    const scriptContent = match[1].trim();
                    
                    // 外部スクリプト読み込みはスキップ
                    if (scriptContent.length > 50 && 
                        !scriptContent.includes('src=') && 
                        !scriptContent.includes('AOS.init') &&
                        !scriptContent.includes('document.write')) {
                        
                        // 内容のハッシュを計算して重複検出
                        const contentHash = this.simpleHash(scriptContent);
                        if (!this.duplicateContent.has(contentHash)) {
                            this.duplicateContent.set(contentHash, []);
                        }
                        this.duplicateContent.get(contentHash).push({
                            file: relativePath,
                            content: scriptContent.substring(0, 200) + '...',
                            fullContent: scriptContent,
                            size: scriptContent.length
                        });
                    }
                }
                
            } catch (error) {
                this.issues.push({
                    type: 'inline_script_error',
                    message: `インラインスクリプト検出エラー: ${error.message}`,
                    location: path.relative(process.cwd(), filePath)
                });
            }
        });
    }

    // 重複するインラインスクリプトを特定
    findDuplicateInlineScripts() {
        const duplicates = [];
        this.duplicateContent.forEach((occurrences, hash) => {
            if (occurrences.length > 1) {
                duplicates.push({
                    hash,
                    count: occurrences.length,
                    totalSize: occurrences.reduce((sum, occ) => sum + occ.size, 0),
                    occurrences
                });
            }
        });
        return duplicates.sort((a, b) => b.totalSize - a.totalSize);
    }

    // コンテンツの簡単なハッシュ計算
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return hash;
    }

    // 古い自動生成ファイルを検出
    findOldGeneratedFiles() {
        console.log('🧹 古い自動生成ファイルを検出中...');
        
        const generatedPatterns = [
            /^add-.*\.js$/,
            /^fix-.*\.js$/,
            /^update-.*\.js$/,
            /.*emergency.*\.ps1$/,
            /.*final.*\.ps1$/,
            /.*restore.*\.ps1$/
        ];
        
        this.allFiles.forEach(filePath => {
            const fileName = path.basename(filePath);
            const relativePath = path.relative(process.cwd(), filePath);
            
            // パターンにマッチするファイルを検出
            const isGenerated = generatedPatterns.some(pattern => pattern.test(fileName));
            if (isGenerated) {
                try {
                    const stat = fs.statSync(filePath);
                    this.unusedFiles.push({
                        file: relativePath,
                        size: stat.size,
                        lastModified: stat.mtime,
                        type: 'generated'
                    });
                } catch (error) {
                    // ファイルが存在しない場合はスキップ
                }
            }
        });
    }

    // 統廃合の実行
    performConsolidation() {
        console.log('🛠️ コード統廃合を実行中...');
        
        // 古い生成ファイルの削除（PowerShellスクリプトのみ）
        const filesToDelete = this.unusedFiles.filter(item => 
            item.type === 'generated' && item.file.endsWith('.ps1')
        );
        
        filesToDelete.forEach(item => {
            try {
                const fullPath = path.resolve(item.file);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    this.consolidations.push({
                        type: 'file_deletion',
                        file: item.file,
                        savedSize: item.size,
                        reason: '古いPowerShellスクリプト'
                    });
                }
            } catch (error) {
                this.issues.push({
                    type: 'deletion_error',
                    message: `ファイル削除エラー: ${error.message}`,
                    location: item.file
                });
            }
        });
    }

    // メイン実行関数
    analyze() {
        console.log('🔍 コード統廃合分析を開始...');
        
        // ファイル検索
        this.findAllFiles(process.cwd());
        console.log(`📁 ${this.allFiles.length}ファイルを検出`);

        // 分析実行
        this.analyzeFileReferences();
        this.findUnusedFiles();
        this.findInlineScripts();
        this.findOldGeneratedFiles();

        // 重複インラインスクリプトの検出
        const duplicateScripts = this.findDuplicateInlineScripts();

        // 結果レポート
        console.log('\n📊 統廃合分析結果:');
        console.log(`├─ 未使用ファイル: ${this.unusedFiles.length}個`);
        console.log(`├─ 重複インラインスクリプト: ${duplicateScripts.length}グループ`);
        console.log(`├─ 分析エラー: ${this.issues.length}個`);
        console.log(`└─ 総ファイル数: ${this.allFiles.length}個`);

        // 詳細レポート
        if (this.unusedFiles.length > 0) {
            console.log('\n🗑️ 未使用/古いファイル:');
            this.unusedFiles.slice(0, 10).forEach(item => {
                const sizeKB = (item.size / 1024).toFixed(1);
                const type = item.type || 'unused';
                console.log(`  ${item.file} (${sizeKB}KB, ${type})`);
            });
            if (this.unusedFiles.length > 10) {
                console.log(`  ... 他${this.unusedFiles.length - 10}個`);
            }
        }

        if (duplicateScripts.length > 0) {
            console.log('\n🔄 重複インラインスクリプト:');
            duplicateScripts.slice(0, 5).forEach(dup => {
                const sizeKB = (dup.totalSize / 1024).toFixed(1);
                console.log(`  重複${dup.count}回 (${sizeKB}KB total)`);
                dup.occurrences.slice(0, 3).forEach(occ => {
                    console.log(`    ${occ.file}`);
                });
                if (dup.occurrences.length > 3) {
                    console.log(`    ... 他${dup.occurrences.length - 3}個`);
                }
            });
        }

        // 統廃合実行
        console.log('\n🛠️ 統廃合を実行中...');
        this.performConsolidation();

        // 統廃合結果
        if (this.consolidations.length > 0) {
            console.log('\n✅ 統廃合完了:');
            const totalSaved = this.consolidations.reduce((sum, cons) => sum + (cons.savedSize || 0), 0);
            const totalSavedKB = (totalSaved / 1024).toFixed(1);
            console.log(`├─ 処理ファイル数: ${this.consolidations.length}`);
            console.log(`└─ 削減サイズ: ${totalSavedKB}KB`);

            this.consolidations.forEach(cons => {
                const sizeKB = ((cons.savedSize || 0) / 1024).toFixed(1);
                console.log(`  ${cons.file}: ${cons.type} (${cons.reason}, -${sizeKB}KB)`);
            });
        } else {
            console.log('\n✅ 統廃合が必要なファイルは見つかりませんでした');
        }

        if (this.issues.length > 0) {
            console.log('\n❌ エラー:');
            this.issues.forEach(issue => {
                console.log(`  ${issue.location || 'unknown'}: ${issue.message}`);
            });
        }

        // 推奨事項
        console.log('\n💡 推奨事項:');
        if (duplicateScripts.length > 0) {
            console.log('  - 重複するインラインスクリプトを外部ファイルに統合することを検討');
        }
        if (this.unusedFiles.filter(f => !f.type).length > 0) {
            console.log('  - 未使用ファイルの削除を検討（手動で確認してください）');
        }
        console.log('  - 定期的な統廃合分析の実施を推奨');

        console.log('\n🎉 コード統廃合分析が完了しました！');
    }
}

// 実行
const consolidator = new CodeConsolidator();
consolidator.analyze();