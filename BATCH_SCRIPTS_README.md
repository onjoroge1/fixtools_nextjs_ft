# 🚀 Batch Modernization Scripts

Quick reference for modernizing JSON tools.

## Usage

### Modernize All JSON Tools at Once
```bash
node batch-modernize-all.js
```

### Modernize a Single Tool
```bash
node modernize-json-tool.js json-validator
node modernize-json-tool.js json-minifier
node modernize-json-tool.js json-to-xml
node modernize-json-tool.js xml-to-json
node modernize-json-tool.js json-to-csv
```

## What Gets Created

Each tool will be 80% complete with:
- ✅ Full page structure
- ✅ SEO & meta tags
- ✅ Structured data (4 schemas)
- ✅ Hero section
- ✅ Educational content
- ✅ FAQs (needs customization)
- ✅ Related tools links

## What You Need to Do (20%)

1. **Add tool functionality** (30-45 min)
   - JSON processing logic
   - Error handling
   - Copy/download features

2. **Customize FAQs** (20-30 min)
   - Tool-specific questions
   - Update 6-8 questions

3. **Update examples** (20-30 min)
   - Tool-specific before/after
   - Code examples

4. **Test** (15 min)
   - Verify tool works
   - Test edge cases
   - Check mobile

**Total: 1.5-2 hours per tool**

## Files Created

| Script Input | Output File | Based On |
|-------------|-------------|----------|
| `json-validator` | `pages/json/json-validator.jsx` | json-formatter.jsx |
| `json-minifier` | `pages/json/minify-json.jsx` | json-formatter.jsx |
| `json-to-xml` | `pages/json/json-to-xml.jsx` | json-formatter.jsx |
| `xml-to-json` | `pages/json/xml-to-json.jsx` | json-formatter.jsx |
| `json-to-csv` | `pages/json/json-to-csv.jsx` | json-formatter.jsx |

## Backups

All existing files are automatically backed up with `.backup` extension before modification.

## Documentation

See `JSON_BATCH_GUIDE.md` for detailed day-by-day execution plan.

## Troubleshooting

**Script not found?**
```bash
cd /Users/obadiah/Documents/Fixtools/fixtools_nextjs_ft
```

**Permission denied?**
```bash
chmod +x batch-modernize-all.js modernize-json-tool.js
```

**Want to see available tools?**
```bash
node modernize-json-tool.js
```


