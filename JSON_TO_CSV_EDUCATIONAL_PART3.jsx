{/* Part 3: Examples, Best Practices, Comparison Table, FAQ, Related Tools */}

{/* Examples Section - CSV-Specific */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-slate-900">JSON to CSV Examples</h2>
    </div>
    
    <p className="text-base text-slate-600 mb-6 leading-relaxed">
      See how different JSON structures transform into CSV format:
    </p>

    {/* Example 1: Simple Array */}
    <div className="mb-8 p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm">1</span>
        Simple User List
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Input JSON:</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{`[
  {
    "id": 1,
    "name": "Alice",
    "role": "Developer"
  },
  {
    "id": 2,
    "name": "Bob",
    "role": "Designer"
  }
]`}</code></pre>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Output CSV:</p>
          <pre className="text-xs bg-emerald-900 text-emerald-100 p-4 rounded-lg overflow-x-auto"><code>{`id,name,role
1,Alice,Developer
2,Bob,Designer`}</code></pre>
        </div>
      </div>
    </div>

    {/* Example 2: Nested Objects */}
    <div className="mb-8 p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white text-sm">2</span>
        Nested Objects (Automatically Flattened)
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Input JSON:</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{`[
  {
    "id": 1,
    "name": "John",
    "address": {
      "city": "New York",
      "country": "USA"
    }
  }
]`}</code></pre>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Output CSV:</p>
          <pre className="text-xs bg-emerald-900 text-emerald-100 p-4 rounded-lg overflow-x-auto"><code>{`id,name,address.city,address.country
1,John,New York,USA`}</code></pre>
          <p className="text-xs text-slate-600 mt-2">Note: Nested objects use dot notation</p>
        </div>
      </div>
    </div>

    {/* Example 3: API Response */}
    <div className="mb-8 p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white text-sm">3</span>
        API Response to Spreadsheet
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Input JSON (API Response):</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{`[
  {
    "product_id": "A101",
    "name": "Laptop",
    "price": 999.99,
    "in_stock": true
  },
  {
    "product_id": "A102",
    "name": "Mouse",
    "price": 29.99,
    "in_stock": false
  }
]`}</code></pre>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Output CSV (Excel-Ready):</p>
          <pre className="text-xs bg-emerald-900 text-emerald-100 p-4 rounded-lg overflow-x-auto"><code>{`product_id,name,price,in_stock
A101,Laptop,999.99,true
A102,Mouse,29.99,false`}</code></pre>
          <p className="text-xs text-slate-600 mt-2">Ready to import into inventory systems</p>
        </div>
      </div>
    </div>

    {/* Example 4: Arrays within Objects */}
    <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm">4</span>
        Arrays Within Objects
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Input JSON:</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{`[
  {
    "user": "Alice",
    "skills": ["JavaScript", "React"]
  }
]`}</code></pre>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Output CSV:</p>
          <pre className="text-xs bg-emerald-900 text-emerald-100 p-4 rounded-lg overflow-x-auto"><code>{`user,skills
Alice,"[""JavaScript"",""React""]"`}</code></pre>
          <p className="text-xs text-slate-600 mt-2">Arrays are JSON-stringified in a single cell</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Best Practices Section */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-slate-900">Best Practices for JSON to CSV Conversion</h2>
    </div>
    
    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
      Follow these guidelines to ensure smooth conversion and avoid common pitfalls:
    </p>
    
    <div className="space-y-6">
      {/* Best Practice 1 */}
      <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ensure JSON is an Array of Objects</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              CSV format requires tabular data, which means your JSON must be an array of objects where each object represents a row. Single objects or nested arrays without a consistent structure won't convert well. If you have a single object, wrap it in an array: <code className="bg-white px-2 py-0.5 rounded">[{`{...}`}]</code>
            </p>
            <div className="p-3 rounded-lg bg-white border border-emerald-200">
              <p className="text-xs text-slate-600 font-mono">
                ✅ <strong>DO:</strong> <code>[{`{"id": 1, "name": "John"}`}, {`{"id": 2, "name": "Jane"}`}]</code><br />
                ❌ <strong>DON'T:</strong> <code>{`{"id": 1, "name": "John"}`}</code> (single object)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Practice 2 */}
      <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Delimiter</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Use commas (,) for standard CSV files. Use semicolons (;) if your data contains commas. Use tabs for TSV format. Use pipes (|) when working with databases that support it. The delimiter should not appear unescaped in your data values.
            </p>
            <div className="p-3 rounded-lg bg-white border border-blue-200">
              <p className="text-xs text-slate-600">
                <strong>Common scenarios:</strong> US/International data → Comma | European Excel → Semicolon | Database exports → Tab | Log parsing → Pipe
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Practice 3 */}
      <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Test in Your Target Application</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              After conversion, open the CSV in your intended application (Excel, Google Sheets, database) to verify it imports correctly. Check that special characters, dates, and numbers display properly. Different applications may handle CSV encoding (UTF-8, Latin-1) differently.
            </p>
            <div className="p-3 rounded-lg bg-white border border-purple-200">
              <p className="text-xs text-slate-600">
                <strong>Testing checklist:</strong> Column alignment • Special characters • Number formatting • Date parsing • Escaped quotes
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Practice 4 */}
      <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
            4
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Handle Nested Data Thoughtfully</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Deeply nested JSON may create too many columns or lose structure. Consider whether flattening makes sense for your use case. For very complex nested data, you might need to pre-process the JSON or use multiple CSV files. Arrays within objects are stringified, so you'll need to parse them if needed later.
            </p>
            <div className="p-3 rounded-lg bg-white border border-orange-200">
              <p className="text-xs text-slate-600">
                <strong>Alternatives for complex nesting:</strong> Multiple related CSV files • Pre-flatten with jq • Keep as JSON for some columns • Use JSON to XML for hierarchical preservation
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Practice 5 */}
      <div className="p-6 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold text-lg shadow-lg">
            5
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Include Headers for Clarity</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Always include header rows unless you have a specific reason not to. Headers make the CSV self-documenting and easier to work with in spreadsheets. Most import tools expect headers. If importing to a database, headers help with column mapping.
            </p>
            <div className="p-3 rounded-lg bg-white border border-cyan-200">
              <p className="text-xs text-slate-600">
                <strong>Exception:</strong> Skip headers only when appending to existing files or when the target system explicitly requires no headers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Comparison Table */}
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-slate-900">JSON to CSV Conversion Methods</h2>
    </div>
    
    <p className="text-base text-slate-600 mb-6 leading-relaxed">
      Choose the right conversion method based on your needs and technical expertise:
    </p>
    
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="text-left p-4 rounded-tl-xl font-semibold">Method</th>
            <th className="text-center p-4 font-semibold">Ease of Use</th>
            <th className="text-center p-4 font-semibold">Speed</th>
            <th className="text-center p-4 font-semibold">Cost</th>
            <th className="text-center p-4 rounded-tr-xl font-semibold">Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b-2 border-slate-200 bg-emerald-50">
            <td className="p-4 font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                Online Tool (This Page)
              </div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-yellow-500">⭐⭐⭐</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Very Easy</div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-emerald-600">⚡⚡⚡</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Instant</div>
            </td>
            <td className="text-center p-4">
              <div className="font-bold text-green-600">Free</div>
            </td>
            <td className="p-4 text-sm text-slate-700">
              Quick conversions, testing, small files, non-developers
            </td>
          </tr>
          
          <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
            <td className="p-4 font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                Command Line (jq)
              </div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-yellow-500">⭐⭐</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Moderate</div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-purple-600">⚡⚡⚡</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Very Fast</div>
            </td>
            <td className="text-center p-4">
              <div className="font-bold text-green-600">Free</div>
            </td>
            <td className="p-4 text-sm text-slate-700">
              Large files, automation, scripting, batch processing
            </td>
          </tr>
          
          <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
            <td className="p-4 font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐍</span>
                Python (pandas)
              </div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-yellow-500">⭐⭐</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Moderate</div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-blue-600">⚡⚡⚡</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Fast</div>
            </td>
            <td className="text-center p-4">
              <div className="font-bold text-green-600">Free</div>
            </td>
            <td className="p-4 text-sm text-slate-700">
              Data science, complex transformations, analysis pipelines
            </td>
          </tr>
          
          <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
            <td className="p-4 font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                Node.js (json2csv)
              </div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-yellow-500">⭐⭐</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Moderate</div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-indigo-600">⚡⚡⚡</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Very Fast</div>
            </td>
            <td className="text-center p-4">
              <div className="font-bold text-green-600">Free</div>
            </td>
            <td className="p-4 text-sm text-slate-700">
              JavaScript projects, API integrations, web apps
            </td>
          </tr>
          
          <tr className="hover:bg-slate-50">
            <td className="p-4 font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                Excel (Import Data)
              </div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-yellow-500">⭐⭐⭐</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Easy</div>
            </td>
            <td className="text-center p-4">
              <div className="inline-flex gap-1">
                <span className="text-orange-600">⚡⚡</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">Moderate</div>
            </td>
            <td className="text-center p-4">
              <div className="font-bold text-orange-600">$$</div>
              <div className="text-xs text-slate-600 mt-1">Paid</div>
            </td>
            <td className="p-4 text-sm text-slate-700">
              Excel users, one-time conversions, GUI preference
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <h4 className="font-bold text-slate-900 mb-2">Recommendation</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            For <strong>quick one-off conversions</strong>, use this online tool. For <strong>automated workflows</strong>, use command-line tools like jq or programming libraries. For <strong>data analysis</strong>, use Python pandas which provides powerful transformation capabilities. For <strong>business users</strong>, Excel's built-in import feature is most familiar.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Continue with FAQ and Related Tools in final part... */}



