#!/usr/bin/env node

/**
 * 🚀 JSON Tools Batch Modernization Script
 * 
 * This script automates 80% of the work to modernize JSON tool pages
 * by cloning the JSON Formatter template and customizing it.
 * 
 * Usage: node modernize-json-tool.js [tool-config-name]
 * Example: node modernize-json-tool.js json-validator
 */

const fs = require('fs');
const path = require('path');

// ============================================
// TOOL CONFIGURATIONS
// ============================================

const toolConfigs = {
  'json-validator': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-validator.jsx',
    replacements: {
      // Class names
      'json-formatter-page': 'json-validator-page',
      
      // Tool names
      'JSON Formatter': 'JSON Validator',
      'JSON formatter': 'JSON validator',
      'json formatter': 'json validator',
      'Format JSON': 'Validate JSON',
      'Format JSON': 'Validate JSON',
      'format JSON': 'validate JSON',
      'formatting': 'validating',
      'Formatting': 'Validating',
      'formatted': 'validated',
      'Formatted': 'Validated',
      
      // URLs & Links
      '/json/json-formatter': '/json/json-validator',
      'json-formatter': 'json-validator',
      
      // Meta descriptions
      'Format, beautify, and validate JSON instantly': 'Validate JSON syntax and structure instantly',
      'Free online JSON formatter with syntax highlighting, error detection, and 1-click copy': 'Free online JSON validator with detailed error messages, syntax checking, and structure validation',
      
      // Keywords
      'json formatter, json beautifier, format json, prettify json': 'json validator, validate json, json validation, json syntax checker, json lint',
      
      // Titles
      'Free JSON Formatter & Beautifier | Format & Validate JSON Online': 'Free JSON Validator | Validate JSON Syntax & Structure Online',
      'Free JSON Formatter & Beautifier': 'Free JSON Validator & Syntax Checker',
      
      // Action buttons
      '⚡ Format JSON': '✓ Validate JSON',
      'Format and export': 'Validate and fix',
      
      // Educational content
      'JSON formatting (also called JSON beautification or pretty-printing) is the process of adding proper indentation, line breaks, and spacing to JSON data to make it more readable for humans.': 'JSON validation is the process of checking whether a JSON document follows the correct syntax rules and structure defined by the JSON specification (RFC 8259).',
      
      'While JSON doesn\'t require formatting to function, well-formatted JSON is exponentially easier to read, debug, and maintain.': 'Valid JSON is essential for APIs, configuration files, and data exchange between systems. Invalid JSON will cause parsing errors and application failures.',
      
      'A <strong>JSON formatter</strong> transforms this compressed data into a structured, hierarchical format that clearly shows the relationships between objects, arrays, and values.': 'A <strong>JSON validator</strong> checks your data against JSON syntax rules, identifying errors like trailing commas, unquoted keys, incorrect data types, and malformed structures.',
      
      // Stats
      'formatted JSON': 'validated JSON',
      'Formatted': 'Validated',
      
      // Breadcrumbs
      'JSON Formatter': 'JSON Validator',
      
      // Hero description
      'Our <strong>JSON formatter</strong> helps you beautify and structure JSON data.': 'Our <strong>JSON validator</strong> helps you check and verify JSON syntax.',
      
      // Feature cards
      'Format JSON files instantly in your browser': 'Validate JSON syntax instantly in your browser',
      'Never leaves your browser': 'Never leaves your browser',
      'No limits, no sign-up': 'No limits, no sign-up',
      
      // How it works
      'Our JSON formatter takes your compressed or messy JSON data and transforms it into a beautifully structured, readable format in seconds.': 'Our JSON validator checks your JSON data against the official specification, identifying syntax errors, structural problems, and providing helpful error messages to fix issues quickly.',
      
      // Benefits
      'Improved code readability': 'Catch errors before deployment',
      'Faster debugging and error detection': 'Prevent runtime failures',
      'Better team collaboration': 'Ensure data integrity',
      'Essential for API development': 'Critical for API development',
      'Instant validation and formatting': 'Instant syntax checking',
      
      // Related tools section
      'Related JSON & Data Tools': 'Related JSON & Data Tools',
      'JSON Minifier': 'JSON Formatter',
      'Validate, beautify, and minify JSON': 'Format, validate, and beautify JSON',
    }
  },
  
  'json-minifier': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/minify-json.jsx',
    replacements: {
      'json-formatter-page': 'json-minifier-page',
      'JSON Formatter': 'JSON Minifier',
      'JSON formatter': 'JSON minifier',
      'json formatter': 'json minifier',
      'Format JSON': 'Minify JSON',
      'format JSON': 'minify JSON',
      'formatting': 'minifying',
      'Formatting': 'Minifying',
      'formatted': 'minified',
      'Formatted': 'Minified',
      '/json/json-formatter': '/json/minify-json',
      'json-formatter': 'json-minifier',
      'Free JSON Formatter & Beautifier | Format & Validate JSON Online': 'Free JSON Minifier | Compress & Minify JSON Online',
      '⚡ Format JSON': '⚡ Minify JSON',
      'json formatter, json beautifier, format json': 'json minifier, minify json, compress json, json compression',
      'Format, beautify, and validate JSON instantly': 'Minify and compress JSON instantly',
    }
  },
  
  'json-to-xml': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-xml.jsx',
    replacements: {
      'json-formatter-page': 'json-to-xml-page',
      'JSON Formatter': 'JSON to XML Converter',
      'Format JSON': 'Convert to XML',
      '/json/json-formatter': '/json/json-to-xml',
      'json formatter, json beautifier': 'json to xml, json xml converter, convert json to xml',
      'Free JSON Formatter & Beautifier': 'Free JSON to XML Converter',
      '⚡ Format JSON': '⚡ Convert to XML',
    }
  },
  
  'xml-to-json': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/xml-to-json.jsx',
    replacements: {
      'json-formatter-page': 'xml-to-json-page',
      'JSON Formatter': 'XML to JSON Converter',
      'Format JSON': 'Convert to JSON',
      '/json/json-formatter': '/json/xml-to-json',
      'json formatter, json beautifier': 'xml to json, xml json converter, convert xml to json',
      'Free JSON Formatter & Beautifier': 'Free XML to JSON Converter',
      '⚡ Format JSON': '⚡ Convert to JSON',
    }
  },
  
  'json-to-csv': {
    sourceFile: 'pages/json/json-formatter.jsx',
    targetFile: 'pages/json/json-to-csv.jsx',
    replacements: {
      'json-formatter-page': 'json-to-csv-page',
      'JSON Formatter': 'JSON to CSV Converter',
      'Format JSON': 'Convert to CSV',
      '/json/json-formatter': '/json/json-to-csv',
      'json formatter, json beautifier': 'json to csv, json csv converter, convert json to csv',
      'Free JSON Formatter & Beautifier': 'Free JSON to CSV Converter',
      '⚡ Format JSON': '⚡ Convert to CSV',
    }
  }
};

// ============================================
// MAIN SCRIPT
// ============================================

function modernizeJsonTool(toolName) {
  const config = toolConfigs[toolName];
  
  if (!config) {
    console.error(`❌ Tool "${toolName}" not found in configurations.`);
    console.log('\n📋 Available tools:');
    Object.keys(toolConfigs).forEach(key => {
      console.log(`  - ${key}`);
    });
    process.exit(1);
  }
  
  console.log(`\n🚀 Modernizing ${toolName}...\n`);
  
  const sourcePath = path.join(__dirname, config.sourceFile);
  const targetPath = path.join(__dirname, config.targetFile);
  
  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    process.exit(1);
  }
  
  // Create backup of target if it exists
  if (fs.existsSync(targetPath)) {
    const backupPath = `${targetPath}.backup`;
    fs.copyFileSync(targetPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
  }
  
  // Read source file
  let content = fs.readFileSync(sourcePath, 'utf8');
  console.log(`✅ Read source: ${config.sourceFile}`);
  
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
  
  console.log(`\n✨ ${toolName} modernization complete!`);
  console.log(`\n📝 Next steps:`);
  console.log(`  1. Review ${config.targetFile}`);
  console.log(`  2. Customize tool-specific functionality`);
  console.log(`  3. Update FAQs and examples`);
  console.log(`  4. Test the tool`);
  console.log(`  5. Deploy!\n`);
}

// ============================================
// CLI
// ============================================

const toolName = process.argv[2];

if (!toolName) {
  console.log(`
🚀 JSON Tools Batch Modernization Script

Usage: node modernize-json-tool.js [tool-name]

Available tools:
${Object.keys(toolConfigs).map(key => `  - ${key}`).join('\n')}

Examples:
  node modernize-json-tool.js json-validator
  node modernize-json-tool.js json-minifier
  node modernize-json-tool.js json-to-xml

To modernize all tools at once:
  node batch-modernize-all.js
  `);
  process.exit(0);
}

modernizeJsonTool(toolName);


