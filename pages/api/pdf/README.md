# PDF API Routes

Server-side API routes for PDF processing operations that require backend processing.

## Available Endpoints

### POST `/api/pdf/convert-to-word`
Converts PDF files to editable Word (.docx) format.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'pdf' file field

**Response:**
```json
{
  "success": true,
  "file": "base64-encoded-docx-file",
  "filename": "document.docx",
  "message": "PDF converted to Word successfully"
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Error message",
  "details": "Stack trace (development only)"
}
```

## File Size Limits

- Maximum file size: 50MB
- Response limit: 50MB

## Implementation Status

- ✅ `/api/pdf/convert-to-word` - Basic structure (needs text extraction)

## TODO

1. Install required dependencies:
   ```bash
   npm install pdf-parse pdfjs-dist docx formidable
   ```

2. Implement text extraction in `convertPDFToWord` function
3. Add more conversion endpoints:
   - `/api/pdf/convert-to-excel`
   - `/api/pdf/convert-to-pptx`
   - `/api/pdf/ocr`
   - `/api/pdf/html-to-pdf`

## Development

To test locally:
```bash
curl -X POST http://localhost:3000/api/pdf/convert-to-word \
  -F "pdf=@/path/to/file.pdf"
```

## Production Considerations

- File uploads are handled via formidable
- Temporary files are automatically cleaned up
- Error handling includes proper cleanup
- Response size limits are configured


