#!/usr/bin/env node

/**
 * 🚀 Batch Modernize All JSON Tools
 * 
 * Runs the modernization script for all JSON tools in sequence
 */

const { execSync } = require('child_process');

const tools = [
  'json-validator',
  'json-minifier',
  'json-to-xml',
  'xml-to-json',
  'json-to-csv'
];

console.log(`
╔════════════════════════════════════════════════════════════╗
║   🚀 JSON TOOLS BATCH MODERNIZATION                        ║
║   Modernizing ${tools.length} tools...                                   ║
╚════════════════════════════════════════════════════════════╝
`);

let successCount = 0;
let failCount = 0;

tools.forEach((tool, index) => {
  console.log(`\n[${ index + 1}/${tools.length}] Processing: ${tool}`);
  console.log('═'.repeat(60));
  
  try {
    execSync(`node modernize-json-tool.js ${tool}`, {
      stdio: 'inherit',
      cwd: __dirname
    });
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to modernize ${tool}`);
    failCount++;
  }
});

console.log(`
╔════════════════════════════════════════════════════════════╗
║   ✨ BATCH MODERNIZATION COMPLETE!                         ║
╚════════════════════════════════════════════════════════════╝

📊 Results:
  ✅ Success: ${successCount}
  ❌ Failed: ${failCount}
  📁 Total: ${tools.length}

📝 Next Steps:
  1. Review each modernized file
  2. Customize tool-specific functionality:
     - JSON Validator: Add validation logic
     - JSON Minifier: Add minification logic
     - Converters: Add conversion logic
  3. Update FAQs for each tool
  4. Test all tools
  5. Deploy to production

💡 Tip: Each tool is 80% complete. Focus on:
  - Tool functionality (the actual JSON processing)
  - Tool-specific FAQs (6-8 questions per tool)
  - Before/after examples specific to each tool

🎯 Estimated time to complete: 2-3 hours per tool
   Total for 5 tools: 10-15 hours (perfect for your weekly budget!)

`);



