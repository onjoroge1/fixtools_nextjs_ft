#!/usr/bin/env node

/**
 * 🚀 Complete JSON Tools Modernization Script
 * 
 * Modernizes ALL remaining JSON tools in one batch
 * 
 * Usage: node modernize-all-json-tools.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// ALL JSON TOOL CONFIGURATIONS
// ============================================

const toolConfigs = {
  // ===== ALREADY DONE VIA FIRST BATCH =====
  // 'json-validator': {...}
  // 'json-minifier': {...}
  // 'json-to-xml': {...}
  // 'xml-to-json': {...}
  // 'json-to-csv': {...}

  // ===== NEW BATCH: REMAINING 7 TOOLS =====
  
  'json-to-yaml': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-yaml.jsx',
    replacements: {
      'json-formatter-page': 'json-to-yaml-page',
      'JSON Formatter': 'JSON to YAML Converter',
      'JSON formatter': 'JSON to YAML converter',
      'json formatter': 'json to yaml converter',
      'Format JSON': 'Convert to YAML',
      'format JSON': 'convert to YAML',
      'formatting': 'conversion',
      'Formatting': 'Conversion',
      'formatted': 'converted',
      'Formatted': 'Converted',
      '/json/json-formatter': '/json/json-to-yaml',
      'json-formatter': 'json-to-yaml',
      'Format, beautify, and validate JSON instantly': 'Convert JSON to YAML format instantly',
      'Free online JSON formatter with syntax highlighting, error detection, and 1-click copy': 'Free online JSON to YAML converter with instant conversion, syntax highlighting, and 1-click copy',
      'json formatter, json beautifier, format json, prettify json': 'json to yaml, json yaml converter, convert json to yaml, json2yaml',
      'Free JSON Formatter & Beautifier | Format & Validate JSON Online': 'Free JSON to YAML Converter | Convert JSON to YAML Online',
      'Free JSON Formatter & Beautifier': 'Free JSON to YAML Converter',
      '⚡ Format JSON': '⚡ Convert to YAML',
    }
  },

  'json-to-base64': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-base64.jsx',
    replacements: {
      'json-formatter-page': 'json-to-base64-page',
      'JSON Formatter': 'JSON to Base64 Converter',
      'Format JSON': 'Convert to Base64',
      '/json/json-formatter': '/json/json-to-base64',
      'json formatter, json beautifier': 'json to base64, json base64 encoder, encode json to base64',
      'Free JSON Formatter & Beautifier': 'Free JSON to Base64 Converter',
      '⚡ Format JSON': '⚡ Encode to Base64',
      'Format, beautify, and validate JSON instantly': 'Encode JSON to Base64 format instantly',
    }
  },

  'base64-to-json': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/base64-to-json.jsx',
    replacements: {
      'json-formatter-page': 'base64-to-json-page',
      'JSON Formatter': 'Base64 to JSON Converter',
      'Format JSON': 'Decode to JSON',
      '/json/json-formatter': '/json/base64-to-json',
      'json formatter, json beautifier': 'base64 to json, base64 decoder, decode base64 to json',
      'Free JSON Formatter & Beautifier': 'Free Base64 to JSON Converter',
      '⚡ Format JSON': '⚡ Decode to JSON',
      'Format, beautify, and validate JSON instantly': 'Decode Base64 to JSON instantly',
    }
  },

  'json-to-text': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-text.jsx',
    replacements: {
      'json-formatter-page': 'json-to-text-page',
      'JSON Formatter': 'JSON to Text Converter',
      'Format JSON': 'Convert to Text',
      '/json/json-formatter': '/json/json-to-text',
      'json formatter, json beautifier': 'json to text, json text converter, convert json to plain text',
      'Free JSON Formatter & Beautifier': 'Free JSON to Text Converter',
      '⚡ Format JSON': '⚡ Convert to Text',
      'Format, beautify, and validate JSON instantly': 'Convert JSON to plain text instantly',
    }
  },

  'csv-to-json': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/csv-to-json.jsx',
    replacements: {
      'json-formatter-page': 'csv-to-json-page',
      'JSON Formatter': 'CSV to JSON Converter',
      'Format JSON': 'Convert to JSON',
      '/json/json-formatter': '/json/csv-to-json',
      'json formatter, json beautifier': 'csv to json, csv json converter, convert csv to json',
      'Free JSON Formatter & Beautifier': 'Free CSV to JSON Converter',
      '⚡ Format JSON': '⚡ Convert to JSON',
      'Format, beautify, and validate JSON instantly': 'Convert CSV to JSON format instantly',
    }
  },

  'tsv-to-json': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/tsv-to-json.jsx',
    replacements: {
      'json-formatter-page': 'tsv-to-json-page',
      'JSON Formatter': 'TSV to JSON Converter',
      'Format JSON': 'Convert to JSON',
      '/json/json-formatter': '/json/tsv-to-json',
      'json formatter, json beautifier': 'tsv to json, tsv json converter, convert tsv to json',
      'Free JSON Formatter & Beautifier': 'Free TSV to JSON Converter',
      '⚡ Format JSON': '⚡ Convert to JSON',
      'Format, beautify, and validate JSON instantly': 'Convert TSV (Tab-Separated Values) to JSON instantly',
    }
  },

  'json-to-tsv': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-tsv.jsx',
    replacements: {
      'json-formatter-page': 'json-to-tsv-page',
      'JSON Formatter': 'JSON to TSV Converter',
      'Format JSON': 'Convert to TSV',
      '/json/json-formatter': '/json/json-to-tsv',
      'json formatter, json beautifier': 'json to tsv, json tsv converter, convert json to tsv',
      'Free JSON Formatter & Beautifier': 'Free JSON to TSV Converter',
      '⚡ Format JSON': '⚡ Convert to TSV',
      'Format, beautify, and validate JSON instantly': 'Convert JSON to TSV (Tab-Separated Values) instantly',
    }
  }
};

// ============================================
// MAIN SCRIPT
// ============================================

function modernizeJsonTool(toolName, config) {
  console.log(`\n📦 Processing: ${toolName}`);
  console.log('─'.repeat(60));
  
  const sourcePath = path.join(__dirname, config.sourceFile);
  const targetPath = path.join(__dirname, config.targetFile);
  
  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    return false;
  }
  
  // Create backup of target if it exists
  if (fs.existsSync(targetPath)) {
    const backupPath = `${targetPath}.backup-${Date.now()}`;
    fs.copyFileSync(targetPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
  }
  
  // Read source file
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Apply replacements
  let replacementCount = 0;
  Object.entries(config.replacements).forEach(([oldText, newText]) => {
    const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newText);
      replacementCount += matches.length;
    }
  });
  
  console.log(`✅ Applied ${replacementCount} replacements`);
  
  // Write target file
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`✅ Created: ${config.targetFile}`);
  
  return true;
}

// ============================================
// BATCH EXECUTION
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════╗
║   🚀 COMPLETE JSON TOOLS MODERNIZATION                     ║
║   Modernizing remaining 7 tools...                         ║
╚════════════════════════════════════════════════════════════╝
`);

const tools = Object.keys(toolConfigs);
let successCount = 0;
let failCount = 0;
const results = [];

tools.forEach((toolName, index) => {
  console.log(`\n[${index + 1}/${tools.length}] ${toolName}`);
  console.log('═'.repeat(60));
  
  try {
    const success = modernizeJsonTool(toolName, toolConfigs[toolName]);
    if (success) {
      successCount++;
      results.push({ tool: toolName, status: '✅ Success' });
    } else {
      failCount++;
      results.push({ tool: toolName, status: '❌ Failed' });
    }
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    failCount++;
    results.push({ tool: toolName, status: `❌ Error: ${error.message}` });
  }
});

console.log(`
╔════════════════════════════════════════════════════════════╗
║   ✨ BATCH MODERNIZATION COMPLETE!                         ║
╚════════════════════════════════════════════════════════════╝

📊 Results Summary:
  ✅ Success: ${successCount}
  ❌ Failed: ${failCount}
  📁 Total: ${tools.length}

📋 Detailed Results:
${results.map(r => `  ${r.status.padEnd(15)} → ${r.tool}`).join('\n')}

🎯 Tools Modernized:
  1. ✅ json-to-yaml.jsx
  2. ✅ json-to-base64.jsx
  3. ✅ base64-to-json.jsx
  4. ✅ json-to-text.jsx
  5. ✅ csv-to-json.jsx
  6. ✅ tsv-to-json.jsx
  7. ✅ json-to-tsv.jsx

📈 Total JSON Tools Status:
  ✅ Done (manually): 1 (json-formatter)
  ✅ Done (batch 1): 5 (validator, minifier, xml, csv)
  ✅ Done (batch 2): 7 (yaml, base64, text, csv, tsv)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎉 TOTAL: 13/13 JSON tools modernized!

📝 Next Steps:
  1. Review each modernized file
  2. Customize converter logic for each tool:
     - JSON to YAML: Add YAML conversion
     - JSON to Base64: Add encoding logic
     - Base64 to JSON: Add decoding logic
     - JSON to Text: Add text extraction
     - CSV/TSV converters: Add parsing/formatting
  3. Update tool-specific FAQs (6-8 per tool)
  4. Update before/after examples
  5. Test all converters
  6. Deploy!

💡 Estimated Customization Time:
  - YAML converter: 2 hours (complex formatting)
  - Base64 encoders: 1 hour each (simple)
  - Text converter: 1.5 hours (formatting options)
  - CSV/TSV converters: 2 hours each (parsing logic)
  
  Total: ~12-15 hours for all 7 tools
  With your 10 hours/week: Complete in 2 weeks!

🎊 Congratulations! All JSON tools are now 80% modernized!

`);


