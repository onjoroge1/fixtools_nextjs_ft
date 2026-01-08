# PDF Server Utilities

Server-side utilities for PDF processing operations.

## Structure

```
lib/pdf-server/
├── converters/          # PDF conversion utilities
│   └── pdf-to-word.js   # PDF to Word converter
└── utils/               # Utility functions
    ├── file-handler.js  # File operations
    └── error-handler.js # Error handling
```

## Converters

### `pdf-to-word.js`
Converts PDF documents to Word (.docx) format.

**Usage:**
```javascript
import { convertPDFToWord } from '@/lib/pdf-server/converters/pdf-to-word';

const pdfBuffer = fs.readFileSync('document.pdf');
const docxBuffer = await convertPDFToWord(pdfBuffer);
```

## Utilities

### `file-handler.js`
File operations and validation:
- `validateFileType()` - Validate file extensions
- `getFileSize()` - Get file size in bytes
- `formatFileSize()` - Format file size for display
- `cleanupFiles()` - Clean up temporary files
- `generateOutputFilename()` - Generate output filename
- `validateFileSize()` - Validate file size limits

### `error-handler.js`
Error handling utilities:
- `createErrorResponse()` - Create standardized error responses
- `handleApiError()` - Handle API errors consistently
- Custom error classes: `ValidationError`, `ConversionError`, `FileError`

## Dependencies

Required packages:
```bash
npm install pdf-lib docx formidable
```

Optional (for better text extraction):
```bash
npm install pdf-parse pdfjs-dist
```

## Development

All utilities are designed to work with Next.js API routes and can be imported using:
```javascript
import { functionName } from '@/lib/pdf-server/path/to/file';
```

