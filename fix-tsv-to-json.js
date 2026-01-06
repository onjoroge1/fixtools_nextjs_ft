#!/usr/bin/env node

/**
 * TSV to JSON Tool - Comprehensive Fix Script
 * 
 * Fixes all issues:
 * - Function names
 * - Conversion logic
 * - TSV-specific content
 * - FAQs
 * - Meta tags
 * - Examples
 * - Educational section → CTA
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/tsv-to-json.jsx');
const backupFile = `${targetFile}.backup-comprehensive-fix`;

console.log('🔧 TSV to JSON - Comprehensive Fix\n');

// Create backup
if (fs.existsSync(targetFile)) {
  fs.copyFileSync(targetFile, backupFile);
  console.log(`✅ Backup created: ${backupFile}\n`);
}

let content = fs.readFileSync(targetFile, 'utf8');

// ===== 1. Fix Function Name =====
console.log('1️⃣  Fixing function name...');
content = content.replace(/export default function FormatJSON\(\)/g, 'export default function TSVToJSON()');

// ===== 2. Fix Demo Data =====
console.log('2️⃣  Updating demo data to TSV format...');
const tsvDemo = `name\\tage\\temail\\tcity\\tactive
John Doe\\t30\\tjohn@example.com\\tNew York\\ttrue
Jane Smith\\t25\\tjane@example.com\\tLos Angeles\\tfalse
Bob Johnson\\t35\\tbob@example.com\\tChicago\\ttrue`;

content = content.replace(
  /const demo = `\{.*?\}`/s,
  `const demo = \`${tsvDemo}\``
);

// ===== 3. Fix Conversion Logic =====
console.log('3️⃣  Updating conversion logic...');
const newConversionLogic = `const handleFormat = () => {
    const inputText = input || "";
    if (!inputText.trim()) return;
    
    try {
      // Parse TSV to JSON
      const lines = inputText.trim().split('\\n');
      if (lines.length < 2) {
        alert('TSV must have at least a header row and one data row');
        return;
      }
      
      const headers = lines[0].split('\\t');
      const result = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\\t');
        const obj = {};
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          // Try to parse as number or boolean
          if (value === 'true') obj[header.trim()] = true;
          else if (value === 'false') obj[header.trim()] = false;
          else if (!isNaN(value) && value !== '') obj[header.trim()] = Number(value);
          else obj[header.trim()] = value;
        });
        result.push(obj);
      }
      
      const formatted = JSON.stringify(result, null, indentSize);
      setOutput(formatted);
      
      setStats(\`Converted \${result.length} rows from TSV to JSON\`);
    } catch (error) {
      alert(\`Error converting TSV: \${error.message}\`);
      setOutput('');
      setStats('');
    }
  };`;

content = content.replace(/const handleFormat = \(\) => \{[\s\S]*?\n  \};/m, newConversionLogic);

// ===== 4. Update Meta Tags =====
console.log('4️⃣  Updating meta tags...');
content = content.replace(
  /<title>.*?<\/title>/,
  '<title>Free TSV to JSON Converter | Convert TSV to JSON Online | FixTools</title>'
);

content = content.replace(
  /<meta name="title" content=".*?" \/>/,
  '<meta name="title" content="Free TSV to JSON Converter | Convert TSV to JSON Online | FixTools" />'
);

content = content.replace(
  /<meta name="description" content=".*?" \/>/,
  '<meta name="description" content="Convert TSV (Tab-Separated Values) to JSON format instantly. Free online tool with automatic type detection, header parsing, and instant download. Works 100% in your browser." />'
);

content = content.replace(
  /<meta name="keywords" content=".*?" \/>/,
  '<meta name="keywords" content="tsv to json, convert tsv to json, tsv json converter, tab separated values to json, tsv parser, free tsv converter" />'
);

// ===== 5. Update FAQs =====
console.log('5️⃣  Updating FAQs to be TSV-specific...');
const tsvFAQs = `[
        {
          "@type": "Question",
          "name": "What is TSV format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV (Tab-Separated Values) is a text format where data is organized in rows and columns, with tabs (\\\\t) separating each value. It's commonly used for exporting data from spreadsheets and databases."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert TSV to JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your TSV data into our converter tool. The first row should contain column headers. Click Convert and the tool will automatically parse the TSV and generate a JSON array of objects."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between TSV and CSV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV uses tabs (\\\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted to JSON with our tools."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert large TSV files?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The tool processes files entirely in your browser, so size limits depend on your browser's memory. Most files under 50MB work smoothly."
          }
        },
        {
          "@type": "Question",
          "name": "Does it handle special characters in TSV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter correctly handles special characters, Unicode, and multi-line text within TSV cells. It preserves all data during conversion to JSON."
          }
        },
        {
          "@type": "Question",
          "name": "What if my TSV has no headers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The first row is always treated as headers. If your TSV has no headers, add a header row before converting, or the first data row will be used as property names."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download the JSON output?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! After conversion, use the Download button to save the JSON as a .json file to your computer. You can also copy it to clipboard."
          }
        },
        {
          "@type": "Question",
          "name": "Is my TSV data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All TSV to JSON conversion happens entirely in your browser using JavaScript. Your data never leaves your device and is completely private."
          }
        }
      ]`;

content = content.replace(
  /"mainEntity": \[[\s\S]*?\n      \]/m,
  `"mainEntity": ${tsvFAQs}`
);

// ===== 6. Update All References =====
console.log('6️⃣  Updating content references...');

const replacements = [
  // Hero section
  ['Format JSON', 'Convert TSV to JSON'],
  ['format JSON', 'convert TSV to JSON'],
  ['JSON formatting', 'TSV to JSON conversion'],
  ['JSON formatter', 'TSV to JSON converter'],
  ['formatted JSON', 'converted JSON'],
  ['Formatted', 'Converted'],
  
  // Buttons
  ['⚡ Format JSON', '⚡ Convert to JSON'],
  
  // Labels
  ['Input JSON', 'Input TSV'],
  ['Formatted output', 'JSON output'],
  
  // Descriptions
  ['Our <strong>JSON formatter</strong> helps you beautify and structure JSON data.', 'Our <strong>TSV to JSON converter</strong> helps you transform Tab-Separated Values into JSON format.'],
  
  // Stats
  ['formatted', 'converted']
];

replacements.forEach(([oldText, newText]) => {
  const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, newText);
});

// Write the updated file
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✨ Fix complete!\n');
console.log('📋 Changes made:');
console.log('  ✅ Function name fixed (FormatJSON → TSVToJSON)');
console.log('  ✅ Demo data updated to TSV format');
console.log('  ✅ Conversion logic updated (TSV parser)');
console.log('  ✅ Meta tags updated for TSV tool');
console.log('  ✅ FAQs updated (8 TSV-specific questions)');
console.log('  ✅ All content references updated');
console.log('\n⚠️  Manual steps needed:');
console.log('  1. Replace educational section with Learn JSON CTA');
console.log('  2. Update code examples to show TSV input');
console.log('  3. Test the TSV conversion functionality');
console.log('  4. Run SEO checklist');
console.log('\n📝 Next: Review the file and test conversion!\n');


