const fs = require('fs');
const path = require('path');

// Get all article files
const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(file => 
    file.startsWith('article-utage-') && file.endsWith('.html')
);

const articles = [];

// Extract title from each file
files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(' | CLAN', '').trim() : '';
    
    // Extract meta description for topic understanding
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : '';
    
    // Categorize based on filename and content patterns
    const categories = [];
    
    // Business type categories
    if (file.includes('clinic') || file.includes('dental') || file.includes('beauty') || 
        file.includes('health') || file.includes('pharmacy') || file.includes('hospital') ||
        file.includes('psychiatry') || file.includes('obstetrics') || file.includes('veterinary') ||
        file.includes('rehabilitation') || file.includes('nursing') || file.includes('seitai')) {
        categories.push('医療・健康');
    }
    
    if (file.includes('school') || file.includes('education') || file.includes('academy') ||
        file.includes('kindergarten') || file.includes('qualification')) {
        categories.push('教育・スクール');
    }
    
    if (file.includes('recruitment') || file.includes('internship') || file.includes('hellowork')) {
        categories.push('採用・人材');
    }
    
    if (file.includes('municipality') || file.includes('fire-department') || 
        file.includes('education-committee') || file.includes('welfare')) {
        categories.push('公共・行政');
    }
    
    if (file.includes('consultant') || file.includes('consulting') || file.includes('coaching') ||
        file.includes('lawyer') || file.includes('judicial') || file.includes('administrative') ||
        file.includes('tax') || file.includes('accounting') || file.includes('sr-firm') ||
        file.includes('sr-subsidy') || file.includes('sme-consultant') || file.includes('fp')) {
        categories.push('士業・コンサル');
    }
    
    if (file.includes('hotel') || file.includes('restaurant') || file.includes('tourism')) {
        categories.push('観光・飲食');
    }
    
    if (file.includes('real-estate')) {
        categories.push('不動産');
    }
    
    if (file.includes('fitness') || file.includes('sports') || file.includes('yoga') ||
        file.includes('dance') || file.includes('golf')) {
        categories.push('フィットネス・スポーツ');
    }
    
    // Feature categories
    if (file.includes('funnel') || file.includes('landing') || file.includes('optin') ||
        file.includes('sales-page') || file.includes('checkout')) {
        categories.push('ファネル・LP機能');
    }
    
    if (file.includes('email') || file.includes('step-mail') || file.includes('line') ||
        file.includes('reminder') || file.includes('spam')) {
        categories.push('メール・LINE配信');
    }
    
    if (file.includes('automation') || file.includes('management')) {
        categories.push('自動化・管理');
    }
    
    if (file.includes('online') || file.includes('webinar') || file.includes('video') ||
        file.includes('content') || file.includes('course') || file.includes('elearning')) {
        categories.push('オンライン教育・動画');
    }
    
    if (file.includes('booking') || file.includes('reservation')) {
        categories.push('予約システム');
    }
    
    if (file.includes('payment') || file.includes('subscription') || file.includes('membership')) {
        categories.push('決済・会員制');
    }
    
    if (file.includes('comparison') || file.includes('vs-')) {
        categories.push('比較・選定');
    }
    
    if (file.includes('guide') || file.includes('manual') || file.includes('template') ||
        file.includes('support') || file.includes('setup')) {
        categories.push('ガイド・設定');
    }
    
    articles.push({
        file,
        title,
        description,
        categories: categories.length > 0 ? categories : ['その他']
    });
});

// Sort articles alphabetically
articles.sort((a, b) => a.file.localeCompare(b.file));

// Output results
console.log('Total articles:', articles.length);
console.log('\n=== Article Information ===\n');

articles.forEach(article => {
    console.log(`File: ${article.file}`);
    console.log(`Title: ${article.title}`);
    console.log(`Categories: ${article.categories.join(', ')}`);
    console.log(`Description: ${article.description.substring(0, 100)}...`);
    console.log('---');
});

// Create category mapping
console.log('\n\n=== Category Mapping ===\n');

const categoryMap = {};
articles.forEach(article => {
    article.categories.forEach(category => {
        if (!categoryMap[category]) {
            categoryMap[category] = [];
        }
        categoryMap[category].push({
            file: article.file,
            title: article.title
        });
    });
});

Object.keys(categoryMap).sort().forEach(category => {
    console.log(`\n${category} (${categoryMap[category].length} articles):`);
    categoryMap[category].forEach(article => {
        console.log(`  - ${article.file}`);
    });
});

// Generate related articles mapping
console.log('\n\n=== Related Articles Mapping ===\n');

const relatedArticles = {};

articles.forEach(article => {
    const related = [];
    
    // Find articles with matching categories
    articles.forEach(otherArticle => {
        if (article.file === otherArticle.file) return;
        
        // Count common categories
        const commonCategories = article.categories.filter(cat => 
            otherArticle.categories.includes(cat)
        ).length;
        
        if (commonCategories > 0) {
            related.push({
                file: otherArticle.file,
                title: otherArticle.title,
                score: commonCategories,
                commonCategories: article.categories.filter(cat => 
                    otherArticle.categories.includes(cat)
                )
            });
        }
    });
    
    // Sort by score and take top 4
    related.sort((a, b) => b.score - a.score);
    relatedArticles[article.file] = related.slice(0, 4);
});

// Output related articles as JSON for easy use
console.log('\n\n=== JSON Output for Related Articles ===\n');
console.log(JSON.stringify(relatedArticles, null, 2));

// Save to file
fs.writeFileSync('related-articles-mapping.json', JSON.stringify({
    articles,
    categoryMap,
    relatedArticles
}, null, 2));

console.log('\n\nResults saved to related-articles-mapping.json');