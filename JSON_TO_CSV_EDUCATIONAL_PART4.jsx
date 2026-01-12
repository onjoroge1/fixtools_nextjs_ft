{/* Part 4: FAQ Section and Related Tools - FINAL */}

{/* FAQ Section - Expanded with Full Answers */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert JSON to CSV format?</summary>
        <p className="mt-2 text-sm text-slate-600">
          Paste your JSON array into the input field, choose your CSV options (delimiter, headers), and click Convert. The tool will transform your JSON data into CSV format that you can copy or download. Make sure your JSON is an array of objects for proper conversion.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does the tool handle nested JSON objects?</summary>
        <p className="mt-2 text-sm text-slate-600">
          Yes! The converter automatically flattens nested objects using dot notation. For example, {`{user: {name: 'John'}}`} becomes a column named 'user.name' with value 'John'. This makes complex JSON structures easy to work with in spreadsheets.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I open the CSV in Excel?</summary>
        <p className="mt-2 text-sm text-slate-600">
          Absolutely. The generated CSV is fully compatible with Excel, Google Sheets, LibreOffice Calc, and all major spreadsheet applications. Just double-click the downloaded .csv file or use File → Open in your spreadsheet software.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">What delimiter options are available?</summary>
        <p className="mt-2 text-sm text-slate-600">
          You can choose between comma (,), semicolon (;), tab, or pipe (|) as your delimiter. Comma is the standard for CSV files. Use semicolon for European Excel compatibility, tab for TSV format, or pipe for database exports.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my JSON data stored on your servers?</summary>
        <p className="mt-2 text-sm text-slate-600">
          No. All conversion happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server. This ensures complete privacy and security for sensitive information.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert JSON arrays of different structures?</summary>
        <p className="mt-2 text-sm text-slate-600">
          Yes. The tool extracts all unique keys from all objects and creates a column for each. Objects missing certain keys will have empty values in those columns. This handles inconsistent API responses gracefully.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">What happens to JSON arrays within objects?</summary>
        <p className="mt-2 text-sm text-slate-600">
          Arrays are converted to JSON string format and placed in a single cell. This preserves the data structure while maintaining CSV compatibility. If you need to work with these arrays, you'll need to parse them in your target application.
        </p>
      </details>
      
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why use CSV instead of JSON?</summary>
        <p className="mt-2 text-sm text-slate-600">
          CSV is ideal for tabular data analysis in spreadsheets, importing into databases, data science tools like pandas, and sharing with non-technical users who prefer Excel. It's universally supported and much easier to work with for row-column data than JSON.
        </p>
      </details>
    </div>
  </div>
</section>

{/* MarqueeCTA for Learning */}
<MarqueeCTA
  href="/learn"
  title="Learn JSON - Free Interactive Tutorial"
  description="Master JSON syntax, data types, and best practices with our W3Schools-style interactive guide. Perfect for beginners and experienced developers."
  buttonText="Start Learning JSON"
  emoji="📚"
/>

{/* Related Tools Section - FIXED (No formatting/minification references) */}
<section className="mx-auto max-w-6xl px-4 pb-16">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Data Conversion Tools</h2>
    <p className="text-slate-600">Explore our complete suite of JSON and data transformation tools:</p>
  </div>
  
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
    <Link href="/json/json-to-xml" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">🔄</span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">JSON to XML</p>
          <p className="text-xs text-slate-500">Data Conversion</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">Convert JSON data to XML format for legacy systems, SOAP APIs, and enterprise integrations.</p>
      <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
    </Link>
    
    <Link href="/json/json-to-yaml" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">📋</span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">JSON to YAML</p>
          <p className="text-xs text-slate-500">Configuration Format</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">Transform JSON to YAML for Kubernetes configs, Docker Compose, and CI/CD pipelines.</p>
      <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
    </Link>
    
    <Link href="/json/csv-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">↩️</span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">CSV to JSON</p>
          <p className="text-xs text-slate-500">Reverse Conversion</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">Convert CSV spreadsheets back to JSON format for APIs, databases, and web applications.</p>
      <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
    </Link>
  </div>
  
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <Link href="/json/json-validator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">✅</span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">JSON Validator</p>
          <p className="text-xs text-slate-500">Syntax Checker</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">Validate JSON syntax and structure to ensure your data is error-free before conversion.</p>
      <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
    </Link>
    
    <Link href="/json/json-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">📝</span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">JSON Formatter</p>
          <p className="text-xs text-slate-500">Pretty Print</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">Beautify and format JSON with proper indentation for better readability and debugging.</p>
      <p className="mt-4 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700">Open tool →</p>
    </Link>
    
    <Link href="/categories/developer-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">🛠️</span>
        </div>
        <div>
          <p className="text-base font-bold text-white">All Developer Tools</p>
          <p className="text-xs text-slate-400">Browse Complete Suite</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for JSON, HTML, CSS, data conversion, and more web development tasks.</p>
      <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
    </Link>
  </div>
</section>



