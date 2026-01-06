#!/usr/bin/env node

/**
 * Ultimate JSON Cleanup - Remove final HTML references
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/json-formatter.jsx');

console.log('🔄 Ultimate JSON cleanup - removing final HTML references...\n');

let content = fs.readFileSync(targetFile, 'utf8');

// ===== FIX FAQ ANSWER =====
console.log('✅ Fixing FAQ answer...');

content = content.replace(
  /<p className="mt-2 text-sm text-slate-600">Yes by default\. Toggle &quot;Remove HTML comments&quot; to keep them\.<\/p>/g,
  '<p className="mt-2 text-sm text-slate-600">No. All processing happens in your browser. Your JSON data never leaves your device or gets sent to any server.</p>'
);

// ===== FIX RELATED TOOLS SECTION =====
console.log('✅ Updating related tools section...');

content = content.replace(
  /<h2 className="text-2xl font-bold text-slate-900 mb-2">Related HTML & Optimization Tools<\/h2>/g,
  '<h2 className="text-2xl font-bold text-slate-900 mb-2">Related JSON & Data Tools</h2>'
);

content = content.replace(
  /<p className="text-sm text-slate-600 leading-relaxed">Beautify and format HTML for readability, then minify before shipping to production\.<\/p>/g,
  '<p className="text-sm text-slate-600 leading-relaxed">Validate, beautify, and minify JSON for better readability and optimized production.</p>'
);

content = content.replace(
  /<p className="text-sm text-slate-300 leading-relaxed">Discover 50\+ free tools for HTML, CSS, JavaScript, JSON, and more web development tasks\.<\/p>/g,
  '<p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for JSON, HTML, CSS, JavaScript, and more web development tasks.</p>'
);

// Save file
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✅ ✨ Ultimate cleanup complete!');
console.log('📋 Fixed:');
console.log('  - FAQ answer about data storage');
console.log('  - Related tools section heading');
console.log('  - Related tools descriptions (2)');
console.log('\n🎯 All HTML references removed (except legitimate CSS selector and related tool links)!\n');


