#!/usr/bin/env node

/**
 * TSV to JSON - COMPREHENSIVE CONTENT FIX
 * 
 * Fixes the fundamental conceptual mismatch:
 * FROM: JSON minification/formatting language
 * TO: TSV to JSON conversion language
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/tsv-to-json.jsx');
const backupFile = `${targetFile}.backup-content-fix`;

console.log('🔧 TSV to JSON - COMPREHENSIVE CONTENT FIX\n');
console.log('Fixing: Conceptual mismatch (minification → conversion)\n');

// Create backup
fs.copyFileSync(targetFile, backupFile);
console.log(`✅ Backup: ${backupFile}\n`);

let content = fs.readFileSync(targetFile, 'utf8');

// ===== 1. FIX HERO DESCRIPTION =====
console.log('1️⃣  Fixing hero description...');
content = content.replace(
  /Our <strong>TSV to JSON converter<\/strong> helps you beautify JSON code by removing unnecessary whitespace and comments\. Convert to JSON to reduce file size by up to 60%, speed up page load times, and improve Core Web Vitals for better SEO performance\./,
  `Convert <strong>tab-separated values (TSV)</strong> from spreadsheets or databases into structured, clean JSON instantly. Our <strong>TSV to JSON converter</strong> works 100% in your browser—fast, private, and perfect for APIs, data pipelines, and web applications.`
);

// ===== 2. FIX "WHAT IS" SECTION TITLE & CONTENT =====
console.log('2️⃣  Fixing "What is" section...');
content = content.replace(
  /What is JSON Formatting\?/g,
  'What is TSV to JSON Conversion?'
);

content = content.replace(
  /<p className="text-base text-slate-700 leading-relaxed mb-4">[\s\S]*?<strong>TSV to JSON conversion<\/strong> is the process of removing unnecessary characters from JSON data without changing its functionality\.[\s\S]*?<\/p>/,
  `<p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>TSV to JSON conversion</strong> is the process of transforming tab-separated data (commonly exported from spreadsheets like Excel or Google Sheets, or database exports) into structured JSON format. Each row becomes a JSON object, each column becomes a key, and data types (numbers, booleans, strings) are automatically inferred when possible.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                Unlike CSV (comma-separated), TSV uses tab characters as delimiters, making it ideal for data that contains commas. Our converter intelligently parses your TSV data, handles edge cases like empty cells, and generates clean, valid JSON that&apos;s ready to use in APIs, web applications, or data analysis tools.
              </p>`
);

// ===== 3. REMOVE "WHAT GETS REMOVED" SECTION =====
console.log('3️⃣  Removing incorrect "What Gets Removed" section...');
// This section doesn't apply to TSV conversion - we'll remove it entirely
content = content.replace(
  /<div className="mt-6 space-y-4">[\s\S]*?Removes whitespace between tags[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="mt-6 space-y-4">
                {/* What Happens During Conversion */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Headers Become JSON Keys</h3>
                    <p className="text-sm text-slate-700">The first row of your TSV is parsed as column headers, which become the property names in each JSON object.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Rows Become JSON Objects</h3>
                    <p className="text-sm text-slate-700">Each data row is transformed into a JSON object with key-value pairs matching your column headers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Automatic Type Detection</h3>
                    <p className="text-sm text-slate-700">Numbers stay as numbers, "true"/"false" become booleans, and text remains as strings—no manual formatting needed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Empty Cells Handled Safely</h3>
                    <p className="text-sm text-slate-700">Missing data is preserved as empty strings, ensuring your output structure remains consistent across all rows.</p>
                  </div>
                </div>
              </div>
            </div>`
);

// ===== 4. FIX STATISTICS SECTION =====
console.log('4️⃣  Fixing statistics section...');
content = content.replace(
  /<div className="text-center mb-8">[\s\S]*?<h2 className="text-3xl font-bold text-slate-900 mb-2">TSV to JSON conversion by the Numbers<\/h2>[\s\S]*?<\/div>/,
  `<div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">TSV to JSON Conversion by the Numbers</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Why developers and data analysts choose TSV to JSON conversion for data transformation
              </p>
            </div>`
);

// Update stat cards
content = content.replace(
  /<p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">60%<\/p>\s*<p className="text-sm text-slate-600">Average file size reduction<\/p>/,
  `<p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">100%</p>
                  <p className="text-sm text-slate-600">Browser-based conversion<br/>(your data never leaves your device)</p>`
);

content = content.replace(
  /<p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">5x<\/p>\s*<p className="text-sm text-slate-600">Faster page load times<\/p>/,
  `<p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">&lt;1s</p>
                  <p className="text-sm text-slate-600">Instant conversion<br/>(even for large files)</p>`
);

content = content.replace(
  /<p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">92%<\/p>\s*<p className="text-sm text-slate-600">Of top websites format JSON<\/p>/,
  `<p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">∞</p>
                  <p className="text-sm text-slate-600">Unlimited conversions<br/>(completely free forever)</p>`
);

content = content.replace(
  /<p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">\+40%<\/p>\s*<p className="text-sm text-slate-600">Improvement in Core Web Vitals<\/p>/,
  `<p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Auto</p>
                  <p className="text-sm text-slate-600">Type detection<br/>(numbers, booleans, strings)</p>`
);

// ===== 5. FIX "WHY CONVERT" SECTION =====
console.log('5️⃣  Fixing "Why Convert to JSON" benefits...');
content = content.replace(
  /<h2 className="text-3xl font-bold text-slate-900">Why use an TSV to JSON Converter\?<\/h2>/,
  '<h2 className="text-3xl font-bold text-slate-900">Why Convert TSV to JSON?</h2>'
);

// Fix first benefit (Faster Page Loads → API Compatible)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">Faster Page Loads<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?makes pages load noticeably faster\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    🔌
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">API-Ready Format</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">JSON is the universal data interchange format for APIs. Converting TSV to JSON makes your data immediately usable in REST APIs, GraphQL, and modern web services without additional parsing.</p>`
);

// Fix second benefit (SEO Boost → Data Validation)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">SEO Performance Boost<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?Google&apos;s ranking algorithm\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    ✓
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Easy Data Validation</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">JSON provides built-in structure validation. Instantly spot data errors, inconsistencies, or missing values that might be hidden in raw TSV format—catch issues before they reach production.</p>`
);

// Fix third benefit (Bandwidth Savings → JavaScript Compatible)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">Reduced Bandwidth<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?mobile users\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    💻
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">JavaScript Native</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">JSON is JavaScript&apos;s native data format. Use your converted data instantly in Node.js, React, Vue, or any JavaScript framework—no additional libraries or parsing required.</p>`
);

// Fix fourth benefit (Better UX → Database Integration)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">Improved User Experience<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?better engagement\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    🗄️
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Database Integration</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">MongoDB, PostgreSQL (JSONB), and other NoSQL databases work natively with JSON. Convert TSV exports to JSON for seamless database imports and efficient data storage.</p>`
);

// Fix fifth benefit (Developer Tools → Spreadsheet Migration)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">Developer-Friendly<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?process easier\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    📊
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Spreadsheet Migration</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">Easily migrate data from Excel, Google Sheets, or CSV exports into JSON format for modern web applications. Perfect for data migrations, API seeding, and frontend mock data.</p>`
);

// Fix sixth benefit (Green Web → Tool Ecosystem)
content = content.replace(
  /<span className="flex h-12 w-12[\s\S]*?<\/span>\s*<\/div>\s*<h3 className="text-lg font-semibold text-slate-900">Eco-Friendly Web<\/h3>\s*<p className="mt-2 text-sm text-slate-600 leading-relaxed">[\s\S]*?carbon footprint\.<\/p>/,
  `<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    🛠️
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Rich Tool Ecosystem</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">JSON has extensive tooling support—validators, formatters, schema generators, and more. Convert to JSON to leverage this entire ecosystem for better data quality and developer productivity.</p>`
);

// ===== 6. FIX "HOW IT WORKS" STEPS =====
console.log('6️⃣  Fixing "How It Works" steps...');
content = content.replace(
  /<h3 className="text-lg font-bold text-slate-900 mb-2">1\. Paste Your JSON<\/h3>\s*<p className="text-sm text-slate-700 leading-relaxed">[\s\S]*?<\/p>/,
  `<h3 className="text-lg font-bold text-slate-900 mb-2">1. Paste Your TSV Data</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Copy your tab-separated data from Excel, Google Sheets, database exports, or any TSV file. Ensure the first row contains column headers for best results.
                    </p>`
);

content = content.replace(
  /<h3 className="text-lg font-bold text-slate-900 mb-2">2\. Choose Options<\/h3>\s*<p className="text-sm text-slate-700 leading-relaxed">[\s\S]*?<\/p>/,
  `<h3 className="text-lg font-bold text-slate-900 mb-2">2. Adjust Settings (Optional)</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Choose your preferred JSON indentation (2 or 4 spaces). The converter automatically detects data types and handles edge cases.
                    </p>`
);

content = content.replace(
  /<h3 className="text-lg font-bold text-slate-900 mb-2">3\. Convert Instantly<\/h3>\s*<p className="text-sm text-slate-700 leading-relaxed">[\s\S]*?<\/p>/,
  `<h3 className="text-lg font-bold text-slate-900 mb-2">3. Convert & Download</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Click "Convert to JSON" and watch your TSV transform into clean, structured JSON instantly. All processing happens in your browser—nothing is uploaded.
                    </p>`
);

content = content.replace(
  /<h3 className="text-lg font-bold text-slate-900 mb-2">4\. Export & Use<\/h3>\s*<p className="text-sm text-slate-700 leading-relaxed">[\s\S]*?<\/p>/,
  `<h3 className="text-lg font-bold text-slate-900 mb-2">4. Copy or Download</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Copy the JSON to your clipboard or download as a .json file. Use it immediately in your APIs, applications, or data pipelines.
                    </p>`
);

// Write changes
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✨ COMPREHENSIVE CONTENT FIX COMPLETE!\n');
console.log('📋 Changes made:');
console.log('  ✅ Hero description (minification → conversion)');
console.log('  ✅ "What is" section (formatting → conversion)');
console.log('  ✅ Removed "What Gets Removed" (added "What Happens")');
console.log('  ✅ Statistics cards (performance → conversion features)');
console.log('  ✅ All 6 benefits (SEO/speed → API/database/tools)');
console.log('  ✅ "How It Works" steps (JSON input → TSV input)');
console.log('\n🎯 Result: 100% TSV to JSON conversion focus\n');
console.log('📖 Backup saved to:', backupFile, '\n');



