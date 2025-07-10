const fs = require('fs');
const path = require('path');

// Configuration
const achievementDir = path.join(__dirname, 'achievement');
const files = ['customer2.html', 'customer3.html', 'customer4.html', 'customer5.html'];
const updatedFiles = [];

console.log('Starting favicon path fix for achievement directory...\n');

// Process each file
files.forEach(filename => {
    const filePath = path.join(achievementDir, filename);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Pattern to match absolute favicon paths
        const faviconPattern = /<link\s+rel="icon"\s+href="\/images\/favicon\.ico">/g;
        
        // Check if the file contains the absolute path
        if (faviconPattern.test(content)) {
            // Replace absolute path with relative path
            content = content.replace(faviconPattern, '<link rel="icon" href="../images/favicon.ico">');
            
            // Write the updated content back to file
            fs.writeFileSync(filePath, content, 'utf8');
            
            updatedFiles.push(filename);
            console.log(`✓ Updated: ${filename}`);
            console.log(`  Changed: <link rel="icon" href="/images/favicon.ico">`);
            console.log(`  To:      <link rel="icon" href="../images/favicon.ico">\n`);
        } else {
            console.log(`- Skipped: ${filename} (no absolute favicon path found)\n`);
        }
    } catch (error) {
        console.error(`✗ Error processing ${filename}: ${error.message}\n`);
    }
});

// Summary
console.log('========================================');
console.log('Summary:');
console.log(`Total files processed: ${files.length}`);
console.log(`Files updated: ${updatedFiles.length}`);
if (updatedFiles.length > 0) {
    console.log('\nUpdated files:');
    updatedFiles.forEach(file => console.log(`  - ${file}`));
}
console.log('\nNote: customer1.html was not included as it already uses a relative path.');
console.log('========================================');