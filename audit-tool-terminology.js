#!/usr/bin/env node

/**
 * TOOL TERMINOLOGY AUDITOR
 * 
 * Scans tool pages for conceptual mismatches and terminology errors.
 * Prevents "formatter" language in converters, "minifier" language in validators, etc.
 */

const fs = require('fs');
const path = require('path');

// Define tool types and their correct terminology
const TOOL_TYPES = {
  'converter': {
    correct: ['convert', 'conversion', 'transform', 'transformation'],
    forbidden: ['format', 'formatting', 'minify', 'minification', 'beautify', 'compress', 'optimize'],
    purpose: 'Changes data structure/format (JSON→XML, CSV→JSON)',
    benefits: ['compatibility', 'integration', 'interoperability', 'migration'],
    notBenefits: ['file size reduction', 'page speed', 'SEO', 'performance', 'bandwidth']
  },
  'formatter': {
    correct: ['format', 'formatting', 'beautify', 'prettify', 'readable', 'readability'],
    forbidden: ['minify', 'minification', 'compress', 'convert', 'conversion'],
    purpose: 'Adds whitespace and indentation for human readability',
    benefits: ['readability', 'debugging', 'code review', 'maintainability'],
    notBenefits: ['file size reduction', 'page speed', 'bandwidth savings']
  },
  'validator': {
    correct: ['validate', 'validation', 'verify', 'check', 'syntax', 'errors'],
    forbidden: ['format', 'formatting', 'minify', 'minification', 'convert', 'beautify'],
    purpose: 'Checks syntax and structure for errors',
    benefits: ['error detection', 'debugging', 'data quality', 'compliance'],
    notBenefits: ['file size reduction', 'performance', 'SEO']
  },
  'minifier': {
    correct: ['minify', 'minification', 'compress', 'compression', 'reduce', 'optimize'],
    forbidden: ['format', 'formatting', 'beautify', 'convert', 'validate'],
    purpose: 'Removes whitespace and comments to reduce file size',
    benefits: ['file size reduction', 'bandwidth savings', 'page speed', 'performance'],
    notBenefits: ['readability', 'debugging', 'code review']
  }
};

// Color codes for terminal output
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

function detectToolType(content, filePath) {
  const fileName = path.basename(filePath);
  
  // Try to detect from filename
  if (fileName.includes('to-') || fileName.includes('-to-')) {
    return 'converter';
  }
  if (fileName.includes('validator') || fileName.includes('validate')) {
    return 'validator';
  }
  if (fileName.includes('minify') || fileName.includes('minifier')) {
    return 'minifier';
  }
  if (fileName.includes('formatter') || fileName.includes('format')) {
    return 'formatter';
  }
  
  // Try to detect from content
  const firstLines = content.split('\n').slice(0, 50).join('\n').toLowerCase();
  
  if (firstLines.includes('convert') && (firstLines.includes('to xml') || firstLines.includes('to json') || firstLines.includes('to csv'))) {
    return 'converter';
  }
  if (firstLines.includes('validate') || firstLines.includes('validator')) {
    return 'validator';
  }
  if (firstLines.includes('minify') || firstLines.includes('minifier')) {
    return 'minifier';
  }
  
  return 'formatter'; // default assumption
}

function auditToolPage(filePath, toolType = null) {
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.red}Error: File not found: ${filePath}${colors.reset}`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Auto-detect tool type if not provided
  if (!toolType) {
    toolType = detectToolType(content, filePath);
  }
  
  if (!TOOL_TYPES[toolType]) {
    console.log(`${colors.red}Error: Unknown tool type: ${toolType}${colors.reset}`);
    return null;
  }
  
  const rules = TOOL_TYPES[toolType];
  const issues = [];
  
  // Check for forbidden terms
  rules.forbidden.forEach(term => {
    const regex = new RegExp(`\\b${term}\\w*\\b`, 'gi');
    lines.forEach((line, index) => {
      // Skip comments, imports, and certain acceptable contexts
      if (line.trim().startsWith('//') || 
          line.trim().startsWith('*') ||
          line.includes('import ') ||
          line.includes('href=') ||
          line.includes('Related tools') ||
          line.includes('structured data')) {
        return;
      }
      
      const matches = line.match(regex);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            line: index + 1,
            term: match,
            context: line.trim().substring(0, 100),
            severity: 'error',
            message: `"${match}" should not appear in ${toolType} tool`
          });
        });
      }
    });
  });
  
  // Check for incorrect benefits
  rules.notBenefits.forEach(benefit => {
    const regex = new RegExp(benefit.replace(/\s+/g, '\\s+'), 'gi');
    lines.forEach((line, index) => {
      if (line.match(regex) && !line.includes('//') && !line.includes('href=')) {
        issues.push({
          line: index + 1,
          term: benefit,
          context: line.trim().substring(0, 100),
          severity: 'warning',
          message: `"${benefit}" is not a benefit of ${toolType} tools`
        });
      }
    });
  });
  
  return {
    filePath,
    toolType,
    issueCount: issues.length,
    issues: issues.slice(0, 50), // Limit to first 50 issues
    rules
  };
}

function printReport(report) {
  if (!report) return;
  
  console.log(`\n${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}📄 File:${colors.reset} ${report.filePath}`);
  console.log(`${colors.bold}🔧 Tool Type:${colors.reset} ${colors.magenta}${report.toolType.toUpperCase()}${colors.reset}`);
  console.log(`${colors.bold}📊 Issues Found:${colors.reset} ${report.issueCount > 0 ? colors.red : colors.green}${report.issueCount}${colors.reset}`);
  
  if (report.issueCount === 0) {
    console.log(`\n${colors.green}${colors.bold}✅ No terminology issues found!${colors.reset}`);
  } else {
    console.log(`\n${colors.bold}⚠️  Issues:${colors.reset}\n`);
    
    report.issues.forEach((issue, index) => {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      const color = issue.severity === 'error' ? colors.red : colors.yellow;
      
      console.log(`${icon} ${color}Line ${issue.line}:${colors.reset} ${issue.message}`);
      console.log(`   ${colors.blue}Term:${colors.reset} "${issue.term}"`);
      console.log(`   ${colors.blue}Context:${colors.reset} ${issue.context}...`);
      console.log('');
    });
    
    if (report.issueCount > 50) {
      console.log(`${colors.yellow}... and ${report.issueCount - 50} more issues${colors.reset}\n`);
    }
  }
  
  console.log(`\n${colors.bold}✅ Correct terminology for ${colors.magenta}${report.toolType}${colors.reset}${colors.bold}:${colors.reset}`);
  console.log(`   ${report.rules.correct.join(', ')}`);
  
  console.log(`\n${colors.bold}❌ Forbidden terms:${colors.reset}`);
  console.log(`   ${report.rules.forbidden.join(', ')}`);
  
  console.log(`\n${colors.bold}💡 Purpose:${colors.reset} ${report.rules.purpose}`);
  
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`${colors.bold}${colors.cyan}
╔═══════════════════════════════════════════════════════════════╗
║           TOOL TERMINOLOGY AUDITOR                            ║
║   Prevents conceptual mismatches across tool pages           ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}
${colors.bold}Usage:${colors.reset}
  node audit-tool-terminology.js <file-path> [tool-type]

${colors.bold}Tool Types:${colors.reset}
  - converter  : Changes format (JSON→XML, CSV→JSON)
  - formatter  : Adds whitespace for readability
  - validator  : Checks for syntax errors
  - minifier   : Removes whitespace to reduce size

${colors.bold}Examples:${colors.reset}
  node audit-tool-terminology.js pages/json/json-to-xml.jsx converter
  node audit-tool-terminology.js pages/json/json-validator.jsx validator
  node audit-tool-terminology.js pages/json/json-formatter.jsx formatter

${colors.bold}Auto-detect mode:${colors.reset}
  node audit-tool-terminology.js pages/json/json-to-xml.jsx
  (Will auto-detect tool type from filename and content)
`);
    process.exit(0);
  }
  
  const filePath = args[0];
  const toolType = args[1] || null;
  
  console.log(`${colors.bold}${colors.cyan}🔍 Auditing tool page...${colors.reset}\n`);
  
  const report = auditToolPage(filePath, toolType);
  printReport(report);
  
  process.exit(report && report.issueCount === 0 ? 0 : 1);
}

module.exports = { auditToolPage, TOOL_TYPES };



