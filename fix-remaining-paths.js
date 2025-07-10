const fs = require('fs');
const path = require('path');

class PathFixer {
    constructor() {
        this.fixedFiles = [];
        this.errors = [];
    }

    // achievementディレクトリの絶対パスを修正
    fixAchievementPaths() {
        console.log('🔧 achievementディレクトリの絶対パスを修正中...');
        
        const achievementDir = path.join(process.cwd(), 'achievement');
        const files = fs.readdirSync(achievementDir).filter(f => f.endsWith('.html'));
        
        files.forEach(filename => {
            const filePath = path.join(achievementDir, filename);
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                const originalContent = content;
                let changeCount = 0;
                
                // ナビゲーションリンクの修正
                const replacements = [
                    { from: 'href="/index.html"', to: 'href="../index.html"' },
                    { from: 'href="/achievement/index.html"', to: 'href="index.html"' },
                    { from: 'href="/achievement/"', to: 'href="./"' },
                    { from: 'href="/blog/index.html"', to: 'href="../blog/index.html"' },
                    { from: 'href="/tools/index.html"', to: 'href="../tools/index.html"' },
                    { from: 'href="/owner.html"', to: 'href="../owner.html"' },
                    { from: 'href="/terms.html"', to: 'href="../terms.html"' },
                    { from: 'href="/privacy.html"', to: 'href="../privacy.html"' },
                    { from: 'href="/tokutei.html"', to: 'href="../tokutei.html"' }
                ];
                
                replacements.forEach(({ from, to }) => {
                    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                    const matches = content.match(regex);
                    if (matches) {
                        changeCount += matches.length;
                        content = content.replace(regex, to);
                    }
                });
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    this.fixedFiles.push({
                        file: filename,
                        changes: changeCount
                    });
                    console.log(`✅ ${filename} - ${changeCount}箇所を修正`);
                }
                
            } catch (error) {
                this.errors.push({
                    file: filename,
                    error: error.message
                });
            }
        });
    }

    // achievement/index.htmlの4つドット問題を修正
    fixAchievementIndexDots() {
        console.log('\n🔧 achievement/index.htmlの4つドット問題を修正中...');
        
        const filePath = path.join(process.cwd(), 'achievement', 'index.html');
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 4つ以上のドットを2つに修正
            content = content.replace(/\.\.\.\.+\//g, '../');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('✅ achievement/index.html - 4つドット問題を修正');
            
        } catch (error) {
            this.errors.push({
                file: 'achievement/index.html',
                error: error.message
            });
        }
    }

    // ツールページの絶対パスを修正
    fixToolsPaths() {
        console.log('\n🔧 toolsディレクトリの絶対パスを修正中...');
        
        const toolsDir = path.join(process.cwd(), 'tools');
        const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
        
        files.forEach(filename => {
            const filePath = path.join(toolsDir, filename);
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                const originalContent = content;
                let changeCount = 0;
                
                // 同じ修正パターンを適用
                const replacements = [
                    { from: 'href="/index.html"', to: 'href="../index.html"' },
                    { from: 'href="/achievement/index.html"', to: 'href="../achievement/index.html"' },
                    { from: 'href="/blog/index.html"', to: 'href="../blog/index.html"' },
                    { from: 'href="/tools/index.html"', to: 'href="index.html"' },
                    { from: 'href="/owner.html"', to: 'href="../owner.html"' },
                    { from: 'href="/terms.html"', to: 'href="../terms.html"' },
                    { from: 'href="/privacy.html"', to: 'href="../privacy.html"' },
                    { from: 'href="/tokutei.html"', to: 'href="../tokutei.html"' }
                ];
                
                replacements.forEach(({ from, to }) => {
                    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                    const matches = content.match(regex);
                    if (matches) {
                        changeCount += matches.length;
                        content = content.replace(regex, to);
                    }
                });
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    this.fixedFiles.push({
                        file: `tools/${filename}`,
                        changes: changeCount
                    });
                    console.log(`✅ ${filename} - ${changeCount}箇所を修正`);
                }
                
            } catch (error) {
                this.errors.push({
                    file: `tools/${filename}`,
                    error: error.message
                });
            }
        });
    }

    // メイン実行
    run() {
        console.log('🔍 残りのパス問題を修正開始...\n');
        
        this.fixAchievementPaths();
        this.fixAchievementIndexDots();
        this.fixToolsPaths();
        
        // 結果表示
        console.log('\n📊 修正結果:');
        console.log(`├─ 修正したファイル数: ${this.fixedFiles.length}`);
        const totalChanges = this.fixedFiles.reduce((sum, f) => sum + (f.changes || 0), 0);
        console.log(`├─ 修正箇所数: ${totalChanges}`);
        console.log(`└─ エラー: ${this.errors.length}件`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ エラー:');
            this.errors.forEach(({ file, error }) => {
                console.log(`  ${file}: ${error}`);
            });
        }
        
        console.log('\n✅ パス修正が完了しました！');
    }
}

// 実行
const fixer = new PathFixer();
fixer.run();