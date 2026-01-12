#!/usr/bin/env node

/**
 * JSON TO XML - DEEP COMPREHENSIVE FIX
 * 
 * Fixes ALL remaining formatting/minification language
 * Makes page 100% about format conversion
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/json-to-xml.jsx');
const backupFile = `${targetFile}.backup-deep-fix`;

console.log('🔧 JSON TO XML - DEEP COMPREHENSIVE FIX\n');

// Create backup
fs.copyFileSync(targetFile, backupFile);
console.log(`✅ Backup: ${backupFile}\n`);

let content = fs.readFileSync(targetFile, 'utf8');

// ===== 1. FIX TOOL METADATA BOX =====
console.log('1️⃣  Fixing tool metadata box...');
content = content.replace(
  /<dd className="mt-1\.5 text-sm font-bold text-slate-900">formatted JSON<\/dd>/,
  '<dd className="mt-1.5 text-sm font-bold text-slate-900">XML</dd>'
);

// ===== 2. FIX OUTPUT PLACEHOLDER =====
console.log('2️⃣  Fixing output placeholder...');
content = content.replace(
  /placeholder="Your formatted JSON will appear here\.\.\."/,
  'placeholder="Your converted XML will appear here..."'
);

// ===== 3. FIX STAT CARD =====
console.log('3️⃣  Fixing statistics cards...');
content = content.replace(
  /<div className="text-xs text-slate-600">With formatted JSON<\/div>/,
  '<div className="text-xs text-slate-600">Legacy system support</div>'
);

// ===== 4. REMOVE CORE WEB VITALS CLAIM =====
console.log('4️⃣  Removing Core Web Vitals claims...');
content = content.replace(
  /Google considers page speed as a ranking factor\. formatted JSON improves Core Web Vitals metrics like <strong>First Contentful Paint \(FCP\)<\/strong> and <strong>Largest Contentful Paint \(LCP\)<\/strong>\. Better performance signals to search engines that your site provides a quality user experience, potentially boosting your search rankings\./,
  'XML is the required format for SOAP web services, legacy enterprise systems, and many government platforms. Converting JSON to XML enables seamless integration with these systems without manual data transformation or custom middleware.'
);

// ===== 5. FIX VERSION CONTROL SECTION =====
console.log('5️⃣  Fixing version control section...');
content = content.replace(
  /Store your formatted JSON in version control systems like <strong>Git<\/strong>\. Always commit formatted files \(not minified\) to your repository for better code review and diff tracking\. Use <code className="bg-slate-100 px-2 py-0\.5 rounded">\.prettierrc<\/code> or <code className="bg-slate-100 px-2 py-0\.5 rounded">\.editorconfig<\/code> to enforce consistent formatting across your team\./,
  'Store both your source JSON and converted XML in version control when working on data migration projects. This allows you to track transformations, verify conversion accuracy, and maintain an audit trail of data format changes during system integration projects.'
);

content = content.replace(
  /Example \.prettierrc: <code className="bg-slate-100 px-2 py-0\.5 rounded">\{`\{ "tabWidth": 2, "semi": true \}`\}<\/code>/,
  'Tip: Keep conversion configs documented for reproducible transformations'
);

// ===== 6. FIX "FORMATTED JSON EXAMPLES" SECTION =====
console.log('6️⃣  Fixing JSON examples section...');
content = content.replace(
  /Here are some correctly formatted JSON examples you can use as templates:/,
  'Common JSON structures that convert well to XML:'
);

// Write the updated file
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✨ DEEP FIX COMPLETE!\n');
console.log('📋 Fixed:');
console.log('  ✅ Tool metadata: "formatted JSON" → "XML"');
console.log('  ✅ Output placeholder: "formatted JSON" → "converted XML"');
console.log('  ✅ Stat card: "formatted JSON" → "Legacy system support"');
console.log('  ✅ Removed Core Web Vitals claims');
console.log('  ✅ Fixed version control section');
console.log('  ✅ Fixed JSON examples section');
console.log('\n📖 Backup:', backupFile, '\n');



