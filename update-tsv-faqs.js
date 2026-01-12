#!/usr/bin/env node

/**
 * Update Visible FAQs to be TSV-specific
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/tsv-to-json.jsx');

console.log('❓ Updating Visible FAQs to TSV-specific...\n');

let content = fs.readFileSync(targetFile, 'utf8');

// Replace the entire FAQ section with TSV-specific FAQs
const newFAQs = `            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is TSV format?</summary>
                <p className="mt-2 text-sm text-slate-600">TSV (Tab-Separated Values) is a text format where data is organized in rows and columns, with tabs (\\t) separating each value. It&apos;s commonly used for exporting data from spreadsheets and databases.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert TSV to JSON?</summary>
                <p className="mt-2 text-sm text-slate-600">Paste your TSV data into our converter tool. The first row should contain column headers. Click Convert and the tool will automatically parse the TSV and generate a JSON array of objects.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What&apos;s the difference between TSV and CSV?</summary>
                <p className="mt-2 text-sm text-slate-600">TSV uses tabs (\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted to JSON with our tools.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert large TSV files?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes! The tool processes files entirely in your browser, so size limits depend on your browser&apos;s memory. Most files under 50MB work smoothly.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does it handle special characters in TSV?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our converter correctly handles special characters, Unicode, and multi-line text within TSV cells. It preserves all data during conversion to JSON.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What if my TSV has no headers?</summary>
                <p className="mt-2 text-sm text-slate-600">The first row is always treated as headers. If your TSV has no headers, add a header row before converting, or the first data row will be used as property names.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I download the JSON output?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes! After conversion, use the Download button to save the JSON as a .json file to your computer. You can also copy it to clipboard.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my TSV data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600">No. All TSV to JSON conversion happens entirely in your browser using JavaScript. Your data never leaves your device and is completely private.</p>
              </details>
            </div>`;

// Replace FAQ section
const faqPattern = /<h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions<\/h2>[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*{\/\* Related tools \*\/}/;

if (!faqPattern.test(content)) {
  console.error('❌ Could not find FAQ section');
  process.exit(1);
}

content = content.replace(faqPattern, `${newFAQs}
          </div>
        </section>

        {/* Related tools */}`);

fs.writeFileSync(targetFile, content, 'utf8');

console.log('✅ Updated all 8 visible FAQs to TSV-specific questions:');
console.log('  1. What is TSV format?');
console.log('  2. How do I convert TSV to JSON?');
console.log('  3. What\'s the difference between TSV and CSV?');
console.log('  4. Can I convert large TSV files?');
console.log('  5. Does it handle special characters in TSV?');
console.log('  6. What if my TSV has no headers?');
console.log('  7. Can I download the JSON output?');
console.log('  8. Is my TSV data stored on your servers?');
console.log('\n✅ Done!\n');



