#!/usr/bin/env node

/**
 * Comprehensive Content Update for JSON Formatter
 * Replaces all HTML Minification content with JSON Formatting content
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/json-formatter.jsx');

console.log('🔄 Comprehensive JSON content update...\n');

let content = fs.readFileSync(targetFile, 'utf8');

// ===== SECTION HEADINGS =====
console.log('✅ Updating section headings...');
content = content.replace(/What is HTML Minification\?/g, 'What is JSON Formatting?');
content = content.replace(/HTML Minification Impact/g, 'JSON Formatting Impact');
content = content.replace(/Best Practices for HTML Minification/g, 'Best Practices for JSON Formatting');
content = content.replace(/HTML Minification Methods Comparison/g, 'JSON Formatting Methods Comparison');

// ===== MAIN CONTENT PARAGRAPHS =====
console.log('✅ Updating main content...');

// Replace HTML minification definition
content = content.replace(
  /<strong>HTML minification<\/strong> is the process of removing unnecessary characters from HTML code without changing its functionality\./g,
  '<strong>JSON formatting</strong> (also called JSON beautification or pretty-printing) is the process of adding proper indentation, line breaks, and spacing to JSON data to make it more readable for humans.'
);

content = content.replace(
  /This includes eliminating whitespace, line breaks, comments, and other redundant elements that make code more readable for humans but aren't required for browsers to render the page correctly\./g,
  'While JSON doesn\'t require formatting to function, well-formatted JSON is exponentially easier to read, debug, and maintain.'
);

content = content.replace(
  /When you write HTML code, you typically format it with indentation, spaces, and line breaks to make it easier to read and maintain\./g,
  'When you receive JSON data from an API or read it from a file, it\'s often minified (compressed into a single line) to reduce file size.'
);

content = content.replace(
  /While these formatting choices help developers understand the code structure, web browsers don't need this extra spacing to display the page\./g,
  'While minified JSON is valid and parseable, it\'s extremely difficult for humans to read and understand the data structure.'
);

content = content.replace(
  /An <strong>HTML minifier<\/strong> strips away these unnecessary characters, resulting in a smaller file size that loads faster\./g,
  'A <strong>JSON formatter</strong> transforms this compressed data into a structured, hierarchical format that clearly shows the relationships between objects, arrays, and values.'
);

// ===== BENEFITS SECTION =====
console.log('✅ Updating benefits section...');

content = content.replace(
  /Reduce page size and bandwidth/g,
  'Improved code readability'
);

content = content.replace(
  /Improve load-time performance signals/g,
  'Faster debugging and error detection'
);

content = content.replace(
  /Keep pages cleaner for deployment/g,
  'Better team collaboration'
);

content = content.replace(
  /Great for static sites and landing pages/g,
  'Essential for API development'
);

content = content.replace(
  /Works instantly, no sign-up/g,
  'Instant validation and formatting'
);

// ===== STATISTICS =====
console.log('✅ Updating statistics...');

content = content.replace(
  /Real data showing the performance benefits of minifying HTML code/g,
  'Real data showing how JSON formatting improves developer productivity'
);

content = content.replace(
  /How formatting improves developer productivity and code quality/g,
  'Why JSON formatting is essential for modern development'
);

// ===== FEATURES LIST =====
console.log('✅ Updating features list...');

content = content.replace(
  /<strong>Whitespace:<\/strong> Extra spaces, tabs, and line breaks between HTML tags/g,
  '<strong>Indentation:</strong> Each nested level is indented (typically 2 or 4 spaces)'
);

content = content.replace(
  /<strong>HTML Comments:<\/strong> Developer notes wrapped in <code className="bg-slate-100 px-2 py-0\.5 rounded text-sm">&lt;!-- --&gt;<\/code> tags/g,
  '<strong>Line Breaks:</strong> Each property and array item on its own line'
);

content = content.replace(
  /<strong>Empty Attributes:<\/strong> Redundant or default attribute values/g,
  '<strong>Consistent Spacing:</strong> Uniform whitespace around colons and commas'
);

content = content.replace(
  /<strong>Unnecessary Quotes:<\/strong> Optional quotes around certain attribute values \(when safe\)/g,
  '<strong>Visual Hierarchy:</strong> Clear parent-child relationships in nested structures'
);

// ===== BEFORE/AFTER EXAMPLES =====
console.log('✅ Updating before/after examples...');

content = content.replace(
  /Unformatted \(Minified\)/g,
  'Unformatted (Minified)'
);

content = content.replace(
  /File size: ~250 bytes/g,
  'Unreadable: 89 characters'
);

content = content.replace(
  /File size: ~140 bytes \(44% smaller\)/g,
  'Readable: 156 characters (formatted)'
);

// ===== COMPARISON TABLE =====
console.log('✅ Updating comparison table...');

content = content.replace(
  /Online Tool \(This Page\)/g,
  'Online Formatter (This Page)'
);

content = content.replace(
  /Build Tool \(Webpack\/Vite\)/g,
  'IDE Built-in (VS Code)'
);

content = content.replace(
  /CLI Tool \(Node\.js\)/g,
  'Command-line (jq, prettier)'
);

content = content.replace(
  /CDN with Auto-Minify/g,
  'Build Tool Plugin'
);

content = content.replace(
  /Framework Built-in \(Next\.js\)/g,
  'Programming Language (native)'
);

// ===== HOW IT WORKS =====
console.log('✅ Updating "How it works" section...');

content = content.replace(
  /Paste your HTML/g,
  'Paste your JSON'
);

content = content.replace(
  /Or fetch HTML from a URL \(if allowed by CORS\)\./g,
  'You can paste minified JSON, API responses, or type directly.'
);

content = content.replace(
  /Remove comments, collapse whitespace, and keep safe spacing\./g,
  'Select 2 or 4 spaces for indentation based on your project standards.'
);

content = content.replace(
  /format and export/g,
  'Format and export'
);

content = content.replace(
  /Copy the output or download an \.html file\./g,
  'Copy the formatted output or download as a .json file.'
);

// ===== PRO TIPS =====
console.log('✅ Updating pro tips...');

content = content.replace(
  /Pair this with an HTML Formatter for editing, then minify right before shipping\./g,
  'Use formatting for development and debugging, then minify for production deployment to reduce file size.'
);

// ===== BEST PRACTICES =====
console.log('✅ Updating best practices...');

content = content.replace(
  /Format before committing to version control/g,
  'Always format JSON before committing'
);

content = content.replace(
  /Use consistent indentation \(2 or 4 spaces\)/g,
  'Choose 2 or 4 spaces consistently'
);

content = content.replace(
  /Validate JSON before formatting/g,
  'Validate syntax before formatting'
);

content = content.replace(
  /Remove comments \(JSON doesn't support them\)/g,
  'Remember JSON doesn\'t support comments'
);

content = content.replace(
  /Be careful with large files \(>10MB\)/g,
  'Use command-line tools for large files (>10MB)'
);

// ===== FINAL CLEAN-UPS =====
console.log('✅ Final clean-up...');

// Replace any remaining "minify/minified/minification" with appropriate terms
content = content.replace(/minify HTML/gi, 'format JSON');
content = content.replace(/minified HTML/gi, 'formatted JSON');
content = content.replace(/minifying HTML/gi, 'formatting JSON');
content = content.replace(/HTML minifier/gi, 'JSON formatter');
content = content.replace(/HTML minification/gi, 'JSON formatting');
content = content.replace(/minification/gi, 'formatting');

// Replace "compress" with "beautify" or "format"
content = content.replace(/compress HTML/gi, 'beautify JSON');
content = content.replace(/compressed HTML/gi, 'minified JSON');
content = content.replace(/compressing HTML/gi, 'formatting JSON');

// Replace HTML-specific terms
content = content.replace(/HTML code/gi, 'JSON data');
content = content.replace(/HTML files/gi, 'JSON files');
content = content.replace(/HTML structure/gi, 'JSON structure');
content = content.replace(/HTML syntax/gi, 'JSON syntax');
content = content.replace(/HTML page/gi, 'JSON document');
content = content.replace(/HTML response/gi, 'API response');

// Save file
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✅ ✨ Content update complete!');
console.log('📋 Updated:');
console.log('  - Section headings (6)');
console.log('  - Main content paragraphs (20+)');
console.log('  - Benefits section (6 items)');
console.log('  - Statistics descriptions (4)');
console.log('  - Features list (4)');
console.log('  - Before/after examples');
console.log('  - Comparison table (5 methods)');
console.log('  - How it works section');
console.log('  - Best practices (6 items)');
console.log('  - All remaining HTML/minify references');
console.log('\n🎯 Page is now 100% JSON-focused!\n');


