#!/usr/bin/env node

/**
 * BATCH TOOL AUDITOR
 * 
 * Scans all tool pages for terminology issues
 * Generates a comprehensive report
 */

const fs = require('fs');
const path = require('path');
const { auditToolPage, TOOL_TYPES } = require('./audit-tool-terminology.js');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Tool type mappings (can be configured)
const TOOL_MAPPINGS = {
  // Converters
  'json-to-xml.jsx': 'converter',
  'xml-to-json.jsx': 'converter',
  'json-to-csv.jsx': 'converter',
  'csv-to-json.jsx': 'converter',
  'yaml-to-json.jsx': 'converter',
  'json-to-yaml.jsx': 'converter',
  'tsv-to-json.jsx': 'converter',
  'json-to-tsv.jsx': 'converter',
  
  // Validators
  'json-validator.jsx': 'validator',
  'xml-validator.jsx': 'validator',
  'csv-validator.jsx': 'validator',
  
  // Formatters
  'json-formatter.jsx': 'formatter',
  'xml-formatter.jsx': 'formatter',
  'html-formatter.jsx': 'formatter',
  'css-formatter.jsx': 'formatter',
  
  // Minifiers
  'json-minify.jsx': 'minifier',
  'minify-json.jsx': 'minifier',
  'html-minify.jsx': 'minifier',
  'css-minify.jsx': 'minifier',
  'js-minify.jsx': 'minifier'
};

function findToolFiles(directory) {
  const toolFiles = [];
  
  if (!fs.existsSync(directory)) {
    console.log(`${colors.red}Directory not found: ${directory}${colors.reset}`);
    return toolFiles;
  }
  
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    if (file.endsWith('.jsx') && !file.startsWith('_') && !file.includes('index')) {
      const filePath = path.join(directory, file);
      const toolType = TOOL_MAPPINGS[file] || null;
      
      toolFiles.push({
        path: filePath,
        name: file,
        toolType
      });
    }
  });
  
  return toolFiles;
}

function auditAllTools(directories) {
  const results = [];
  
  directories.forEach(dir => {
    console.log(`\n${colors.bold}${colors.cyan}📂 Scanning: ${dir}${colors.reset}`);
    const files = findToolFiles(dir);
    
    files.forEach(file => {
      const report = auditToolPage(file.path, file.toolType);
      if (report) {
        results.push(report);
      }
    });
  });
  
  return results;
}

function generateSummaryReport(results) {
  console.log(`\n\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}                    AUDIT SUMMARY REPORT                        ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  const totalFiles = results.length;
  const filesWithIssues = results.filter(r => r.issueCount > 0).length;
  const cleanFiles = totalFiles - filesWithIssues;
  const totalIssues = results.reduce((sum, r) => sum + r.issueCount, 0);
  
  console.log(`${colors.bold}📊 Overview:${colors.reset}`);
  console.log(`   Total Files Audited: ${colors.cyan}${totalFiles}${colors.reset}`);
  console.log(`   Clean Files: ${colors.green}${cleanFiles} ✅${colors.reset}`);
  console.log(`   Files with Issues: ${colors.red}${filesWithIssues} ⚠️${colors.reset}`);
  console.log(`   Total Issues: ${colors.yellow}${totalIssues}${colors.reset}\n`);
  
  // Group by tool type
  const byType = {};
  results.forEach(r => {
    if (!byType[r.toolType]) {
      byType[r.toolType] = { files: [], issues: 0 };
    }
    byType[r.toolType].files.push(r);
    byType[r.toolType].issues += r.issueCount;
  });
  
  console.log(`${colors.bold}📁 By Tool Type:${colors.reset}\n`);
  Object.keys(byType).forEach(type => {
    const data = byType[type];
    const cleanCount = data.files.filter(f => f.issueCount === 0).length;
    const icon = data.issues === 0 ? '✅' : '⚠️';
    
    console.log(`   ${icon} ${colors.magenta}${type.toUpperCase()}${colors.reset}: ${data.files.length} files, ${data.issues} issues (${cleanCount} clean)`);
  });
  
  if (filesWithIssues > 0) {
    console.log(`\n${colors.bold}⚠️  Files Requiring Attention:${colors.reset}\n`);
    
    results
      .filter(r => r.issueCount > 0)
      .sort((a, b) => b.issueCount - a.issueCount)
      .forEach((r, index) => {
        const fileName = path.basename(r.filePath);
        console.log(`   ${index + 1}. ${colors.yellow}${fileName}${colors.reset} (${colors.magenta}${r.toolType}${colors.reset}): ${colors.red}${r.issueCount} issues${colors.reset}`);
      });
  }
  
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  if (cleanFiles === totalFiles) {
    console.log(`${colors.green}${colors.bold}🎉 All files are clean! Great job!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}${colors.bold}⚡ Next Steps:${colors.reset}`);
    console.log(`   1. Review files with issues using: node audit-tool-terminology.js <file-path>`);
    console.log(`   2. Fix terminology mismatches`);
    console.log(`   3. Re-run this audit to verify\n`);
  }
}

function saveReportToFile(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, `audit-report-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      filesWithIssues: results.filter(r => r.issueCount > 0).length,
      totalIssues: results.reduce((sum, r) => sum + r.issueCount, 0)
    },
    results: results.map(r => ({
      file: path.basename(r.filePath),
      toolType: r.toolType,
      issueCount: r.issueCount,
      issues: r.issues
    }))
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`${colors.blue}📄 Full report saved to: ${reportPath}${colors.reset}\n`);
}

// Main execution
if (require.main === module) {
  console.log(`${colors.bold}${colors.cyan}
╔═══════════════════════════════════════════════════════════════╗
║              BATCH TOOL TERMINOLOGY AUDITOR                   ║
║   Scans all tool pages for conceptual mismatches             ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}
`);
  
  const directories = [
    'pages/json',
    'pages/html',
    'pages/css',
    'pages/xml',
    'pages/csv',
    'pages/yaml'
  ].map(dir => path.join(__dirname, dir));
  
  const results = auditAllTools(directories);
  
  if (results.length > 0) {
    generateSummaryReport(results);
    saveReportToFile(results);
  } else {
    console.log(`${colors.red}No tool files found in specified directories.${colors.reset}\n`);
  }
}

module.exports = { auditAllTools, findToolFiles };



