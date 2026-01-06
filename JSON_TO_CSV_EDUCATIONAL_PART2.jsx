{/* Educational Sections for JSON to CSV Converter */}
{/* Insert these sections between Tool UI and Footer */}

{/* What is JSON to CSV Conversion? */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-slate-900">What is JSON to CSV Conversion?</h2>
    </div>
    
    <div className="prose prose-slate max-w-none">
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        <strong>JSON to CSV conversion</strong> is the process of transforming hierarchical JSON data into a flat, tabular CSV (Comma-Separated Values) format. JSON (JavaScript Object Notation) stores data in nested objects and arrays, while CSV organizes data in rows and columns like a spreadsheet. This conversion is essential when you need to analyze JSON data in Excel, import it into databases, or share it with users who prefer spreadsheet formats.
      </p>
      
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        When you convert JSON to CSV, each object in a JSON array becomes a row in the CSV file, and each property becomes a column. For example, an array of user objects with properties like "name," "email," and "age" will produce a CSV with three columns and one row per user. This transformation makes complex API responses and database exports immediately usable in spreadsheet applications.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 my-6">
        <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📝</span>
            JSON (Hierarchical)
          </h3>
          <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]`}</code></pre>
          <p className="text-sm text-slate-600 mt-3">Nested structure, hard to analyze in spreadsheets</p>
        </div>
        
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">📊</span>
            CSV (Tabular)
          </h3>
          <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com`}</code></pre>
          <p className="text-sm text-emerald-700 font-semibold mt-3">Flat table format, ready for Excel and analysis</p>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How the Conversion Works</h3>
      <ul className="space-y-2 mb-4">
        <li className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold mt-1">•</span>
          <span className="text-slate-700"><strong>Parsing:</strong> The JSON array is parsed and validated</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold mt-1">•</span>
          <span className="text-slate-700"><strong>Flattening:</strong> Nested objects are flattened using dot notation (e.g., user.address.city)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold mt-1">•</span>
          <span className="text-slate-700"><strong>Header Extraction:</strong> All unique keys become column headers</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold mt-1">•</span>
          <span className="text-slate-700"><strong>Row Mapping:</strong> Each object's values are mapped to the corresponding columns</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold mt-1">•</span>
          <span className="text-slate-700"><strong>CSV Generation:</strong> Data is formatted with proper delimiters and escaping</span>
        </li>
      </ul>

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        The conversion process handles edge cases like nested objects, arrays within objects, missing properties, and special characters that need escaping in CSV format. This ensures your data maintains integrity while becoming more accessible for spreadsheet analysis, data science workflows, and business intelligence tools.
      </p>
      
      <p className="text-base text-slate-700 leading-relaxed">
        <strong>JSON to CSV conversion</strong> is particularly useful for developers working with APIs, data analysts who prefer spreadsheets, and teams that need to share structured data with non-technical stakeholders who are more comfortable with Excel or Google Sheets than raw JSON.
      </p>
    </div>
  </div>
</section>

{/* Why Convert JSON to CSV? - Benefits Section */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-slate-900">Why Convert JSON to CSV?</h2>
    </div>
    
    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
      Converting JSON to CSV opens up powerful possibilities for data analysis, sharing, and integration. Here's why this transformation is essential for developers and data professionals:
    </p>
    
    <div className="grid md:grid-cols-2 gap-6">
      {/* Benefit 1 */}
      <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Spreadsheet Compatibility</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              CSV is the lingua franca of data formats. It opens seamlessly in Excel, Google Sheets, LibreOffice Calc, Apple Numbers, and virtually every spreadsheet application. Unlike JSON, which requires specialized tools or technical knowledge, CSV files can be viewed and edited by anyone with basic computer skills. This makes CSV the ideal format for sharing data with clients, managers, or team members who aren't developers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefit 2 */}
      <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <span className="text-2xl">🔬</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Data Analysis</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              CSV format enables immediate data analysis using spreadsheet formulas, pivot tables, charts, and graphs. Data scientists can import CSV directly into pandas, R, or statistical software. Business analysts can use Excel's powerful filtering, sorting, and aggregation features. The tabular structure makes it easy to spot patterns, calculate totals, and create visualizations—all without writing code.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefit 3 */}
      <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <span className="text-2xl">🗄️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Database Import Ready</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Most databases (MySQL, PostgreSQL, SQL Server, Oracle) have built-in CSV import functionality. You can bulk-import thousands of records in seconds using `LOAD DATA` or `COPY` commands. CSV is also the standard format for ETL (Extract, Transform, Load) pipelines. Converting JSON API responses to CSV allows you to quickly populate databases, migrate data between systems, or create backups.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefit 4 */}
      <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <span className="text-2xl">🤝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cross-Platform Data Sharing</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              CSV files work everywhere—Windows, Mac, Linux, mobile devices, and web applications. They're lightweight (typically smaller than JSON), easy to email, and require no special software to open. This universal compatibility makes CSV the go-to format for data exchange between different systems, departments, and organizations. It's the safest choice when you don't know what tools your recipient will use.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefit 5 */}
      <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <span className="text-2xl">📈</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Business Intelligence Integration</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              BI tools like Tableau, Power BI, Looker, and QlikView all support CSV imports out of the box. Converting your JSON API data to CSV enables stakeholders to create dashboards, reports, and visualizations without developer intervention. This democratizes data access and accelerates decision-making by putting insights directly in the hands of business users.
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Simplified Data Backup</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              CSV provides a human-readable, long-term storage format that will remain accessible for decades. Unlike proprietary formats or databases that may become obsolete, CSV files can be opened with basic text editors. This makes CSV ideal for data archiving, compliance requirements, and ensuring your data remains accessible regardless of technological changes. It's also easier to version control and diff than JSON.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <h4 className="font-bold text-slate-900 mb-2">Real-World Use Cases</h4>
          <p className="text-sm text-slate-700 leading-relaxed mb-2">
            E-commerce platforms convert product catalogs from JSON APIs to CSV for bulk price updates in Excel. Data analysts export API responses to CSV for statistical analysis in R or Python. Marketing teams transform customer data to CSV for CRM imports. Financial departments convert transaction logs to CSV for accounting software.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Whether you're debugging an API, migrating databases, creating reports, or just need to view structured data in a spreadsheet, <strong>JSON to CSV conversion</strong> is an essential tool in your data workflow.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* How It Works Section */}
<section id="how" className="mx-auto max-w-6xl px-4 pb-12">
  <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
    {/* Left Column - Steps */}
    <div className="md:col-span-7">
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-slate-900">How JSON to CSV Conversion Works</h2>
      </div>
      
      <p className="mt-2 text-slate-600 leading-relaxed">
        Our converter transforms hierarchical JSON data into flat, spreadsheet-ready CSV format in three simple steps:
      </p>

      <ol className="mt-6 space-y-4">
        <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
          <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
            1
          </span>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-base">Paste your JSON array</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Copy your JSON data (must be an array of objects like <code className="bg-slate-100 px-1 rounded text-xs">[{`{...}`}, {`{...}`}]</code>) and paste it into the input field. Works with API responses, database exports, or any valid JSON array.
            </p>
          </div>
        </li>
        
        <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
          <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
            2
          </span>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-base">Choose CSV formatting options</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Select your delimiter (comma, semicolon, tab, or pipe), decide whether to include column headers, and enable quote-all if needed. The tool handles nested objects by flattening them with dot notation.
            </p>
          </div>
        </li>
        
        <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
          <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
            3
          </span>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-base">Convert and export your CSV</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Click Convert to transform your JSON into CSV format. The output appears instantly with proper escaping and formatting. Copy to clipboard or download as a .csv file ready to open in Excel or Google Sheets.
            </p>
          </div>
        </li>
      </ol>
    </div>

    {/* Right Column - Info Card */}
    <div className="md:col-span-5">
      <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 pt-2">
            Key Features
          </h3>
        </div>
        
        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-3 group">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm text-slate-700 font-medium leading-relaxed">
              Automatic nested object flattening
            </span>
          </li>
          <li className="flex items-start gap-3 group">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm text-slate-700 font-medium leading-relaxed">
              Handles arrays and complex structures
            </span>
          </li>
          <li className="flex items-start gap-3 group">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm text-slate-700 font-medium leading-relaxed">
              Proper CSV escaping (quotes, commas, newlines)
            </span>
          </li>
          <li className="flex items-start gap-3 group">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm text-slate-700 font-medium leading-relaxed">
              Multiple delimiter options
            </span>
          </li>
          <li className="flex items-start gap-3 group">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm text-slate-700 font-medium leading-relaxed">
              Excel and Google Sheets compatible
            </span>
          </li>
        </ul>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
          <div className="flex gap-2">
            <span className="text-lg flex-shrink-0">💡</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold">Pro tip:</span> For large datasets, consider using command-line tools like{' '}
              <code className="bg-white px-1 rounded">jq</code> or programming libraries. For quick conversions and testing, this online tool is perfect.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Continue in next part... */}


