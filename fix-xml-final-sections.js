#!/usr/bin/env node

/**
 * JSON TO XML - Fix Final Three Blocker Sections
 * 1. "Why Convert to XML?" - remove performance/SEO claims
 * 2. "JSON Formatting Methods Comparison" - change to conversion methods
 */

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'pages/json/json-to-xml.jsx');
const backupFile = `${targetFile}.backup-final-sections`;

console.log('🔧 JSON TO XML - Fixing Final Blocker Sections\n');

// Create backup
fs.copyFileSync(targetFile, backupFile);
console.log(`✅ Backup: ${backupFile}\n`);

let content = fs.readFileSync(targetFile, 'utf8');

// ===== 1. REPLACE "Why Convert to XML?" SECTION =====
console.log('1️⃣  Replacing "Why Convert to XML?" section...');

// Find the section
const whyConvertStart = content.indexOf('        {/* Why Convert to XML - Benefits Section */}');
const whyConvertEnd = content.indexOf('        {/* How it works */}', whyConvertStart);

if (whyConvertStart > -1 && whyConvertEnd > -1) {
  const newWhyConvertSection = `        {/* Why Convert JSON to XML? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert JSON to XML?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Many enterprise and legacy platforms still require XML for data exchange. JSON to XML conversion enables seamless interoperability, compliance, and system integration without manual data mapping.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Legacy System Integration</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many enterprise systems (ERP, CRM, middleware) were built when XML was the standard. JSON to XML conversion lets modern applications communicate with these systems without costly rewrites or complex middleware.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">SOAP Web Services</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      SOAP APIs require XML-formatted payloads. Converting JSON to XML allows modern JSON-based applications to interact with SOAP endpoints, WSDL services, and enterprise service buses (ESB) without manual payload construction.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Schema Validation & Compliance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      XML Schema (XSD) validation is required for many regulated industries and government systems. Converting JSON to XML enables schema-based validation, ensuring data conforms to strict structural and type requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Accelerated Migration Projects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Data migration between JSON and XML systems becomes streamlined with automated conversion. Reduce integration time from weeks to days by eliminating manual data transformation and custom mapping scripts.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Government & Regulatory Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many government agencies, healthcare systems, and financial institutions mandate XML for data submission and reporting. JSON to XML conversion ensures compliance without rebuilding your entire data pipeline.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Vendor API Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Some third-party vendors still require XML input for their APIs. Converting JSON from your application to XML for vendor systems eliminates integration friction and maintains compatibility across diverse platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Integration Reality</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    While JSON has become the dominant format for modern APIs, XML remains deeply embedded in enterprise infrastructure. JSON to XML conversion is not about choosing one format over the other—it's about bridging the gap between modern and legacy systems to enable seamless data flow across your entire technology stack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

`;

  content = content.substring(0, whyConvertStart) + newWhyConvertSection + content.substring(whyConvertEnd);
  console.log('   ✅ Replaced "Why Convert to XML?" section');
} else {
  console.log('   ⚠️  Could not find "Why Convert to XML?" section');
}

// ===== 2. REPLACE "JSON Formatting Methods Comparison" SECTION =====
console.log('2️⃣  Replacing "JSON Formatting Methods Comparison" section...');

// Find the section
const comparisonStart = content.indexOf('<h2 className="text-3xl font-bold text-slate-900">JSON Formatting Methods Comparison</h2>');
if (comparisonStart > -1) {
  content = content.replace(
    /<h2 className="text-3xl font-bold text-slate-900">JSON Formatting Methods Comparison<\/h2>/,
    '<h2 className="text-3xl font-bold text-slate-900">JSON to XML Conversion Methods</h2>'
  );
  
  content = content.replace(
    /Choose the right <strong>JSON formatter<\/strong> approach based on your project needs and workflow:/,
    'Choose the right JSON to XML conversion approach based on your integration requirements:'
  );
  
  content = content.replace(
    /<th className="text-center p-4 font-semibold">File Size Reduction<\/th>/,
    '<th className="text-center p-4 font-semibold">Accuracy</th>'
  );
  
  content = content.replace(
    /Online Formatter \(This Page\)/,
    'Online Converter (This Page)'
  );
  
  content = content.replace(
    /<div className="font-bold text-emerald-700">80%<\/div>\s*<div className="text-xs text-slate-600 mt-1">Good<\/div>/,
    '<div className="font-bold text-emerald-700">High</div>\n                      <div className="text-xs text-slate-600 mt-1">Accurate</div>'
  );
  
  content = content.replace(
    /Quick tests, one-off files, small projects/,
    'Quick conversions, testing, development'
  );
  
  // Fix IDE Built-in row
  content = content.replace(
    /<div className="font-bold text-blue-700">50-70%<\/div>\s*<div className="text-xs text-slate-600 mt-1">Excellent<\/div>/,
    '<div className="font-bold text-blue-700">Medium</div>\n                      <div className="text-xs text-slate-600 mt-1">Variable</div>'
  );
  
  console.log('   ✅ Replaced "JSON Formatting Methods Comparison" section');
}

// Write the updated file
fs.writeFileSync(targetFile, content, 'utf8');

console.log('\n✨ FINAL SECTIONS FIX COMPLETE!\n');
console.log('📋 Fixed:');
console.log('  ✅ "Why Convert to XML?" - 6 conversion-focused benefits');
console.log('  ✅ "JSON Formatting Methods Comparison" → "JSON to XML Conversion Methods"');
console.log('\n📖 Backup:', backupFile, '\n');



