#!/usr/bin/env node

/**
 * Replace Educational Section with Learn JSON CTA
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/tsv-to-json.jsx');

console.log('🎯 Replacing Educational Section with Learn JSON CTA...\n');

let content = fs.readFileSync(targetFile, 'utf8');

// Find and replace the entire learning section with a clean CTA
// Start: "Feature Pills" line 1129
// End: Line before "Best Practices Section" (line 1323)

const newCTA = `              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white font-medium text-sm">✨ 10 Interactive Chapters</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white font-medium text-sm">💻 Try It Yourself Editor</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white font-medium text-sm">🎯 Real Examples</span>
                </div>
              </div>
              
              <Link 
                href="/learn/json"
                className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-3xl"
              >
                <span>📚</span>
                <span>Start Learning JSON Now</span>
                <span>→</span>
              </Link>
              
              <p className="mt-6 text-white/80 text-sm">
                Free forever • No signup required • Learn at your own pace
              </p>
            </div>
          </div>
        </section>`;

// Find the section to replace using regex
const pattern = /\{\/\* Feature Pills \*\/\}[\s\S]*?(?=\s*\{\/\* Best Practices Section \*\/\})/;

if (!pattern.test(content)) {
  console.error('❌ Could not find the section to replace');
  process.exit(1);
}

content = content.replace(pattern, newCTA);

fs.writeFileSync(targetFile, content, 'utf8');

console.log('✅ Educational section replaced with Learn JSON CTA');
console.log('✨ CTA includes:');
console.log('  - Feature pills (10 chapters, interactive editor, real examples)');
console.log('  - Prominent CTA button linking to /learn/json');
console.log('  - Trust elements (free, no signup, self-paced)');
console.log('\n✅ Done!\n');



