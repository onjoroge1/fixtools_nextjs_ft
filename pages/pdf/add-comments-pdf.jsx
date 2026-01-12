import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function AddCommentsPDF() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [commentedFiles, setCommentedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ page: 1, text: '', author: 'User', x: undefined, y: undefined });
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCanvas, setPageCanvas] = useState(null);
  const [previewScale, setPreviewScale] = useState(1.5);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/add-comments-pdf`;

  // Load PDF.js library
  useEffect(() => {
    const loadPDFJS = async () => {
      if (typeof window !== 'undefined') {
        if (window.pdfjsLib && window.pdfjsLib.getDocument) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfjsLib(window.pdfjsLib);
          return;
        }

        const existingScript = document.querySelector('script[src*="pdf.min.js"]');
        if (existingScript) {
          if (window.pdfjsLib && window.pdfjsLib.getDocument) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfjsLib(window.pdfjsLib);
          } else {
            existingScript.addEventListener('load', () => {
              if (window.pdfjsLib && window.pdfjsLib.getDocument) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                setPdfjsLib(window.pdfjsLib);
              }
            });
          }
          return;
        }

        try {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.pdfjsLib && window.pdfjsLib.getDocument) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                setPdfjsLib(window.pdfjsLib);
                console.log('PDF.js library loaded successfully');
              } else {
                console.error('PDF.js loaded but getDocument not available');
                setError('PDF.js library failed to initialize. Please refresh the page.');
              }
            }, 100);
          };
          script.onerror = () => {
            console.error('Failed to load PDF.js script');
            setError('Failed to load PDF.js library. Please check your internet connection and refresh the page.');
          };
          document.head.appendChild(script);
        } catch (err) {
          console.error('Failed to load PDF.js:', err);
        }
      }
    };
    loadPDFJS();
  }, []);

  // Check for valid processing pass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            setUserSession(session);
          } else {
            localStorage.removeItem('processingPass');
            setUserSession({ processingPass: null });
          }
        } catch (e) {
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      }
    }
  }, []);

  // Load PDF for preview when file is selected
  useEffect(() => {
    if (pdfFiles.length > 0 && pdfjsLib) {
      loadPDFPreview(pdfFiles[0]);
    }
  }, [pdfFiles, pdfjsLib]);

  // Re-render preview when page or comments change
  useEffect(() => {
    if (currentPdf && pdfjsLib) {
      // Wait a bit for canvas to be available in DOM
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          renderPage(currentPage);
        } else {
          console.warn('Canvas not available yet, retrying...');
          // Retry after a short delay
          setTimeout(() => {
            if (canvasRef.current && currentPdf && pdfjsLib) {
              renderPage(currentPage);
            }
          }, 200);
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, comments, currentPdf, pdfjsLib]);

  // Load PDF for preview
  const loadPDFPreview = async (file) => {
    if (!pdfjsLib || !file) {
      console.log('Cannot load PDF:', { pdfjsLib: !!pdfjsLib, file: !!file });
      setIsLoadingPdf(false);
      return;
    }

    setIsLoadingPdf(true);
    setError(''); // Clear any previous errors
    
    try {
      console.log('Loading PDF preview...', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('PDF arrayBuffer loaded, size:', arrayBuffer.byteLength);
      
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Suppress console warnings
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      setCurrentPdf(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setIsLoadingPdf(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(`Failed to load PDF for preview: ${err.message || 'Unknown error'}. Please try again or use a different PDF file.`);
      setCurrentPdf(null);
      setTotalPages(0);
      setIsLoadingPdf(false);
    }
  };

  // Render a specific page
  const renderPage = async (pageNum) => {
    if (!currentPdf || !canvasRef.current || !pdfjsLib) {
      console.log('Cannot render page:', { currentPdf: !!currentPdf, canvas: !!canvasRef.current, pdfjsLib: !!pdfjsLib });
      return;
    }

    try {
      console.log('Rendering page', pageNum);
      const page = await currentPdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: previewScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Render PDF page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      console.log('Page rendered successfully');

      // Draw comment markers on the canvas
      drawCommentMarkers(context, viewport, pageNum);
    } catch (err) {
      console.error('Error rendering page:', err);
      setError(`Failed to render page ${pageNum}: ${err.message || 'Unknown error'}`);
    }
  };

  // Draw comment markers on the canvas
  const drawCommentMarkers = (ctx, viewport, pageNum) => {
    const pageComments = comments.filter(c => c.page === pageNum);
    const isSelected = (id) => selectedCommentId === id;
    
    pageComments.forEach((comment, index) => {
      // Calculate position - if y is provided, it's in PDF coordinates (from bottom), convert to canvas (from top)
      const x = comment.x !== undefined ? comment.x : viewport.width * 0.1;
      const y = comment.y !== undefined ? (viewport.height - comment.y) : viewport.height * 0.9;
      const selected = isSelected(comment.id);
      
      // Draw comment icon/marker (yellow circle, larger if selected)
      const markerSize = selected ? 14 : 12;
      ctx.fillStyle = selected ? 'rgba(255, 152, 0, 1)' : 'rgba(255, 193, 7, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, markerSize, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = selected ? '#FF5722' : '#ff9800';
      ctx.lineWidth = selected ? 3 : 2;
      ctx.stroke();
      
      // Draw connecting line from marker to comment box
      const boxWidth = Math.min(200, viewport.width * 0.45);
      const boxHeight = Math.min(70, viewport.height * 0.18);
      const boxX = x + 20;
      const boxY = Math.max(y - boxHeight / 2, 15);
      
      // Draw connecting line
      ctx.strokeStyle = selected ? '#FF5722' : '#ff9800';
      ctx.lineWidth = selected ? 2 : 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x + markerSize, y);
      ctx.lineTo(boxX, boxY + boxHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw comment box preview with hover effect
      if (comment.text) {
        ctx.fillStyle = selected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.98)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.strokeStyle = selected ? '#FF5722' : '#ff9800';
        ctx.lineWidth = selected ? 3 : 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw author name
        ctx.fillStyle = selected ? '#FF5722' : '#666';
        ctx.font = 'bold 10px Arial';
        ctx.fillText((comment.author || 'User') + ':', boxX + 6, boxY + 14);
        
        // Draw text preview (wrap if needed)
        ctx.fillStyle = '#333';
        ctx.font = '9px Arial';
        const maxWidth = boxWidth - 12;
        const words = comment.text.split(' ');
        let line = '';
        let yPos = boxY + 28;
        const lineHeight = 12;
        
        words.forEach(word => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && line) {
            ctx.fillText(line.trim(), boxX + 6, yPos);
            line = word + ' ';
            yPos += lineHeight;
            if (yPos > boxY + boxHeight - 6) return; // Stop if box is full
          } else {
            line = testLine;
          }
        });
        if (line) ctx.fillText(line.trim(), boxX + 6, yPos);
        
        // Draw edit hint for selected comment
        if (selected) {
          ctx.fillStyle = '#FF5722';
          ctx.font = 'bold 8px Arial';
          ctx.fillText('Double-click to edit', boxX + 6, boxY + boxHeight - 4);
        }
      }
    });
    
    // Draw marker for new comment being placed (blue marker)
    if (newComment.page === pageNum && newComment.x !== undefined && newComment.y !== undefined && !newComment.text) {
      const x = newComment.x;
      const y = viewport.height - newComment.y;
      
      // Draw pulsing blue marker
      ctx.fillStyle = 'rgba(33, 150, 243, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Draw crosshair indicator
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 15, y);
      ctx.lineTo(x + 15, y);
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y + 15);
      ctx.stroke();
    }
  };

  // Handle canvas click to place comment or select existing comment
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !currentPdf) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const yPdf = canvas.height - y; // Convert to PDF coordinates (bottom-up)

    // Check if user clicked on an existing comment marker (within 15px radius)
    const pageComments = comments.filter(c => c.page === currentPage);
    let clickedComment = null;
    
    for (const comment of pageComments) {
      const commentX = comment.x !== undefined ? comment.x : canvas.width * 0.1;
      const commentY = comment.y !== undefined ? (canvas.height - comment.y) : canvas.height * 0.9;
      const distance = Math.sqrt(Math.pow(x - commentX, 2) + Math.pow(y - commentY, 2));
      
      if (distance <= 20) { // Clicked within 20px of comment marker
        clickedComment = comment;
        break;
      }
    }

    // If clicked on existing comment, edit it; otherwise set new position
    if (clickedComment && e.detail === 2) {
      // Double-click to edit
      editComment(clickedComment);
    } else if (!clickedComment) {
      // Single click - set new comment position
      setNewComment(prev => ({
        ...prev,
        page: currentPage,
        x: x,
        y: yPdf // Convert to PDF coordinates (bottom-up)
      }));
    } else {
      // Single click on comment - select it (could show tooltip or highlight)
      setSelectedCommentId(clickedComment.id);
      setTimeout(() => setSelectedCommentId(null), 2000); // Clear selection after 2s
    }
    
    // Show feedback
    setError('');
  };

  // Update comment position when dragging
  const handleCommentDrag = (commentId, newX, newY) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, x: newX, y: newY };
      }
      return c;
    }));
  };

  // Handle file upload (multiple PDF files for batch)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter for PDF files
    const validTypes = ['application/pdf'];
    const validExtensions = ['.pdf'];
    
    const validPdfFiles = files.filter(file => 
      validTypes.includes(file.type) || 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (validPdfFiles.length === 0) {
      setError('Please upload PDF files (.pdf).');
      return;
    }

    if (validPdfFiles.length !== files.length) {
      setError(`Some files were skipped. Only PDF files are supported. ${validPdfFiles.length} of ${files.length} files are valid.`);
    } else {
      setError('');
    }

    // Calculate total file size
    const totalSize = validPdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = validPdfFiles.length;

    // Check payment requirement using centralized config
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      // Don't set files yet - wait for payment
      return;
    }

    setPdfFiles(validPdfFiles);
    setCommentedFiles([]);
    setCurrentPdf(null);
    setCurrentPage(1);
    setTotalPages(0);
    setNewComment({ page: 1, text: '', author: 'User', x: undefined, y: undefined });
  };

  // Add comment to list
  const addComment = () => {
    if (!newComment.text || !newComment.text.trim()) {
      setError('Please enter comment text.');
      return;
    }
    if (!newComment.page || newComment.page < 1) {
      setError('Please enter a valid page number (1 or greater).');
      return;
    }
    setComments([...comments, { ...newComment, id: Date.now() }]);
    setNewComment({ page: currentPage, text: '', author: 'User', x: undefined, y: undefined });
    setError('');
  };

  // Remove comment from list
  const removeComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  // Edit comment - load comment data into form for editing
  const editComment = (comment) => {
    setNewComment({
      page: comment.page,
      text: comment.text,
      author: comment.author || 'User',
      x: comment.x,
      y: comment.y,
    });
    // Navigate to the comment's page
    if (currentPdf && comment.page >= 1 && comment.page <= totalPages) {
      setCurrentPage(comment.page);
    }
    // Remove the comment from list (it will be re-added when user clicks "Add Comment")
    removeComment(comment.id);
    // Scroll to comment form
    setTimeout(() => {
      document.querySelector('[data-comment-form]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Add Comments to PDF
  const addCommentsToPDF = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file first.');
      return;
    }

    if (comments.length === 0) {
      setError('Please add at least one comment before processing.');
      return;
    }

    // Check payment requirement again
    const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFiles.length;
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    setError('');
    setCommentedFiles([]);
    setProgress({ current: 0, total: fileCount });

    try {
      // Prepare comments for API (remove id field)
      const commentsForAPI = comments.map(({ id, ...rest }) => rest);

      // Create FormData
      const formData = new FormData();
      
      // Append all PDF files
      pdfFiles.forEach(file => {
        formData.append('pdf', file);
      });

      // Append comments as JSON
      formData.append('comments', JSON.stringify(commentsForAPI));

      // Get session ID if available
      const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          if (hasValidProcessingPassNew({ processingPass: pass })) {
            formData.append('sessionId', pass.sessionId || '');
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      // Call API route
      const response = await fetch('/api/pdf/add-comments-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // Payment required
          setPaymentRequirement(data.requirement || requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Adding comments to PDF failed');
      }

      if (data.success) {
        if (data.files && data.files.length > 0) {
          // Batch processing - multiple files
          const files = data.files.map(item => {
            const binaryString = atob(item.file);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            return {
              url,
              filename: item.filename,
              blob,
              stats: item.stats,
            };
          });
          setCommentedFiles(files);
        } else if (data.file) {
          // Single file
          const binaryString = atob(data.file);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setCommentedFiles([{
            url,
            filename: data.filename || 'document-with-comments.pdf',
            blob,
            stats: data.stats,
          }]);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Add comments error:', err);
      setError(err.message || 'Failed to add comments to PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    // Reload processing pass from localStorage
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        setUserSession({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }
    setShowPaymentModal(false);
    // Retry adding comments if files are already selected
    if (pdfFiles.length > 0 && comments.length > 0) {
      addCommentsToPDF();
    }
  };

  // Download single PDF
  const downloadFile = (file, index) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  // Download all PDFs (for batch)
  const downloadAll = () => {
    commentedFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, index);
      }, index * 100);
    });
  };

  // Remove PDF file from list
  const removeFile = (index) => {
    const newFiles = pdfFiles.filter((_, i) => i !== index);
    setPdfFiles(newFiles);
    setCommentedFiles([]);
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setCommentedFiles([]);
    setComments([]);
    setNewComment({ page: 1, text: '', author: 'User', x: undefined, y: undefined });
    setError('');
    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate total size
  const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I add comments to a PDF file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. You can upload multiple files for batch processing. Add comments by entering page number, comment text, and author name. Optionally specify X and Y coordinates for precise positioning. Click 'Add Comments to PDF' to process your files. Once processing is complete, download your PDF file(s) with comments added. Free tier supports single files up to 10MB."
          }
        },
        {
          "@type": "Question",
          "name": "Is adding comments to PDF free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Add Comments to PDF tool is free for single files up to 10MB. For larger files (above 10MB) or batch processing (multiple files), a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited processing during that period."
          }
        },
        {
          "@type": "Question",
          "name": "What types of comments can I add to PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can add text comments, notes, and annotations to PDF files. Each comment can include page number, comment text, author name, and optional X/Y coordinates for positioning. Comments are added as visible text boxes on the PDF pages, making them perfect for collaboration, feedback, and reviews."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add comments to multiple PDF files at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple PDF files at once for batch processing. The same comments will be applied to all PDFs. For batch processing (2+ files), a Processing Pass is required for free tier users."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when adding comments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all PDF processing happens on secure servers. Your files are processed and immediately deleted after adding comments. We never store your PDFs or share them with third parties. All processing is encrypted and secure."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single PDF files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited processing during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Can I edit or remove comments after adding them?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Comments are permanently added to the PDF file as text boxes. To modify comments, you would need to process the PDF again with new comments. We recommend reviewing your comments before processing to ensure they are correct."
          }
        },
        {
          "@type": "Question",
          "name": "How long does adding comments to PDF take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Processing time depends on file size and number of comments. Small files (under 10MB) typically process in 5-15 seconds. Larger files or files with many comments may take 30-60 seconds. Batch processing processes files sequentially."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Add Comments to PDF - Add Notes and Annotations Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to add comments, notes, and annotations to PDF files. Collaborate on documents with text comments and feedback. Batch processing supported. Free for files up to 10MB.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Add text comments to PDF files",
        "Add notes and annotations",
        "Specify page number and position",
        "Batch file processing",
        "Collaborate on documents",
        "Secure server-side processing",
        "Free for files up to 10MB",
        "Processing Pass for larger files",
        "Instant download"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Add Comments to a PDF File",
      "description": "Step-by-step guide to add comments, notes, and annotations to PDF files online.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file(s)",
          "text": "Click the upload button or drag and drop your PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. Wait for the files to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Add comments",
          "text": "Enter comments by specifying page number, comment text, and author name. Optionally add X and Y coordinates for precise positioning. Click 'Add Comment' to add each comment to the list. You can add multiple comments before processing.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review and process",
          "text": "Review your uploaded PDF files and comments. You can remove files or comments if needed. Click the 'Add Comments to PDF' button to process your files. Each PDF will have the specified comments added as visible text boxes.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download your PDF(s) with comments",
          "text": "Once processing is complete, download your PDF file(s) with comments added. For batch processing, you can download all PDFs at once or individually. Each PDF contains all the comments you specified, ready for collaboration and review.",
          "position": 4
        }
      ]
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${siteHost}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "PDF Tools",
          "item": `${siteHost}/tools/pdf`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Add Comments to PDF",
          "item": canonicalUrl
        }
      ]
    }
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Add Comments to PDF - Free Online Tool to Add Notes and Comments | FixTools</title>
        <meta name="title" content="Add Comments to PDF - Free Online Tool to Add Notes and Comments | FixTools" />
        <meta name="description" content="Add comments and notes to PDF files online for free. Collaborate on documents with text comments, annotations, and feedback. Batch processing supported. Free for files up to 10MB." />
        <meta name="keywords" content="add comments to pdf, pdf comments, add notes to pdf, pdf annotations, comment on pdf, pdf feedback, pdf collaboration, add text to pdf, pdf review tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Add Comments to PDF - Free Online Tool to Add Notes and Comments" />
        <meta property="og:description" content="Add comments and notes to PDF files online for free. Collaborate on documents with text comments, annotations, and feedback." />
        <meta property="og:image" content={`${siteHost}/images/og-add-comments-pdf.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Add Comments to PDF - Free Online Tool to Add Notes and Comments" />
        <meta property="twitter:description" content="Add comments and notes to PDF files online for free. Collaborate on documents with text comments." />
        <meta property="twitter:image" content={`${siteHost}/images/og-add-comments-pdf.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.add-comments-pdf-page) {
          font-size: 100% !important;
        }
        
        .add-comments-pdf-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .add-comments-pdf-page *,
        .add-comments-pdf-page *::before,
        .add-comments-pdf-page *::after {
          box-sizing: border-box;
        }
        
        .add-comments-pdf-page h1,
        .add-comments-pdf-page h2,
        .add-comments-pdf-page h3,
        .add-comments-pdf-page p,
        .add-comments-pdf-page ul,
        .add-comments-pdf-page ol {
          margin: 0;
        }
        
        .add-comments-pdf-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .add-comments-pdf-page input,
        .add-comments-pdf-page textarea,
        .add-comments-pdf-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="add-comments-pdf-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/fixtools-logos/fixtools-logos_black.svg"
                alt="FixTools"
                width={120}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/pdf">PDF</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link
              href="/" 
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/tools/pdf" className="hover:text-slate-900 transition-colors">
                PDF Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
                      <span className="font-semibold text-slate-900">Add Comments to PDF</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            {/* Left Column - Content */}
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Secure
              </div>
              
              {/* H1 - MUST include primary keyword */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Add Comments to PDF
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>Add Comments to PDF</strong> tool helps you add comments, notes, and annotations to PDF files instantly. Collaborate on documents with text comments and feedback. Perfect for reviews, feedback, and collaboration. Batch processing supported. Works securely on our servers - fast, reliable, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Add Comments to PDF
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Format</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">.pdf</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Batch</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Multiple</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Server-Side</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Security</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Add Comments</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Add text comments, notes, and annotations to PDF files. Specify page number, comment text, author name, and optional coordinates for precise positioning.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Batch Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Add comments to multiple PDF files at once. The same comments are applied to all PDFs in the batch, making it perfect for adding standard feedback or annotations to multiple documents.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 3 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Secure Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All processing happens on secure servers. Your files are processed and immediately deleted after adding comments. We never store your PDFs or share them with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface Section */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add Comments to PDF Files</h2>
                <p className="mt-1 text-sm text-slate-600">Upload PDF files and add comments, notes, and annotations</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload PDF Files {pdfFiles.length > 0 && `(${pdfFiles.length} selected)`}
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">💬</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF files</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop (.pdf)</p>
                    </div>
                    {totalSize > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        {pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* File List */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected PDF Files
                </label>
                <div className="space-y-2">
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-200 bg-slate-50 group hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-3 flex-shrink-0 bg-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF Preview with Comments */}
            {pdfFiles.length > 0 && (
              <div className="mb-6 rounded-xl border-2 border-slate-200 bg-white p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">📄 PDF Preview - Click to Place Comments</h3>
                    <p className="text-xs text-slate-600">Click anywhere on the PDF below to set comment position</p>
                  </div>
                  {totalPages > 0 && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            const newPage = currentPage - 1;
                            setCurrentPage(newPage);
                            setNewComment(prev => ({ ...prev, page: newPage }));
                            setTimeout(() => {
                              previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }
                        }}
                        disabled={currentPage <= 1}
                        className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        ← Previous Page
                      </button>
                      <div className="flex flex-col items-center min-w-[120px]">
                        <span className="text-sm font-bold text-slate-900 mb-1">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                              const page = parseInt(e.target.value);
                              if (page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                                setNewComment(prev => ({ ...prev, page }));
                                setTimeout(() => {
                                  previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }
                            }}
                            className="w-16 text-center rounded-lg border-2 border-slate-300 px-2 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none bg-white"
                          />
                          {comments.filter(c => c.page === currentPage).length > 0 && (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold">
                              {comments.filter(c => c.page === currentPage).length}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            setNewComment(prev => ({ ...prev, page: newPage }));
                            setTimeout(() => {
                              previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }
                        }}
                        disabled={currentPage >= totalPages}
                        className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next Page →
                      </button>
                    </div>
                  )}
                </div>

                {!pdfjsLib && (
                  <div className="border-2 border-slate-300 rounded-lg bg-slate-50 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-600">Loading PDF viewer...</p>
                  </div>
                )}

                {pdfjsLib && (isLoadingPdf || (!currentPdf && pdfFiles.length > 0)) && (
                  <div className="border-2 border-slate-300 rounded-lg bg-slate-50 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-600 font-medium mb-2">Loading PDF file...</p>
                    <p className="text-xs text-slate-500">File: {pdfFiles[0]?.name || 'Unknown'}</p>
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600">{error}</p>
                        <button
                          onClick={() => {
                            if (pdfFiles.length > 0 && pdfjsLib) {
                              loadPDFPreview(pdfFiles[0]);
                            }
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Retry loading PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {!pdfjsLib && pdfFiles.length > 0 && (
                  <div className="border-2 border-slate-300 rounded-lg bg-slate-50 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-600 font-medium mb-2">Loading PDF.js library...</p>
                    <p className="text-xs text-slate-500">Please wait while we load the PDF viewer</p>
                  </div>
                )}

                {/* Comments by Page Summary */}
                {totalPages > 0 && comments.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">📋 Comments by Page:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                        const pageComments = comments.filter(c => c.page === pageNum);
                        const hasComments = pageComments.length > 0;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              setNewComment(prev => ({ ...prev, page: pageNum }));
                              setTimeout(() => {
                                previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 100);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : hasComments
                                ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-md'
                                : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            Page {pageNum}
                            {hasComments && (
                              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                                {pageComments.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-600 mt-3">
                      Click any page number above to navigate. Pages with comments are highlighted in yellow.
                    </p>
                  </div>
                )}

                {currentPdf && (
                  <>
                    <div className="relative border-2 border-slate-300 rounded-lg overflow-auto bg-slate-100 shadow-inner" ref={previewContainerRef} style={{ maxHeight: '700px' }}>
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="cursor-crosshair block mx-auto bg-white"
                        style={{ display: 'block', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                        💡 Click anywhere on PDF to set comment position
                      </div>
                      {comments.filter(c => c.page === currentPage).length > 0 && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          💬 {comments.filter(c => c.page === currentPage).length} comment{comments.filter(c => c.page === currentPage).length !== 1 ? 's' : ''} on this page
                        </div>
                      )}
                      {newComment.x !== undefined && newComment.y !== undefined && newComment.page === currentPage && (
                        <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          ✓ Position set: ({Math.round(newComment.x)}, {Math.round(newComment.y)})
                        </div>
                      )}
                      {comments.filter(c => c.page === currentPage).length > 0 && (
                        <div className="absolute bottom-3 right-3 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          💡 Double-click yellow markers to edit
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <span>💡 Tip: Click on the PDF to set exact comment position</span>
                      {comments.length > 0 && (
                        <span className="font-semibold text-emerald-600">
                          {comments.length} total comment{comments.length !== 1 ? 's' : ''} across {new Set(comments.map(c => c.page)).size} page{new Set(comments.map(c => c.page)).size !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Comments Input Form */}
            {pdfFiles.length > 0 && (
              <div className="mb-6 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5" data-comment-form>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-900">Add New Comment</h3>
                  {comments.length > 0 && (
                    <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {comments.length} comment{comments.length !== 1 ? 's' : ''} added
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Page Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalPages || 999}
                      value={newComment.page || ''}
                      onChange={(e) => {
                        const page = parseInt(e.target.value) || 1;
                        setNewComment({ ...newComment, page });
                        if (currentPdf && page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="1"
                    />
                    {totalPages > 0 && (
                      <p className="text-xs text-slate-500 mt-1">PDF has {totalPages} page{totalPages !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={newComment.author || ''}
                      onChange={(e) => setNewComment({ ...newComment, author: e.target.value || 'User' })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="User"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Comment Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newComment.text || ''}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none min-h-[80px]"
                    placeholder="Enter your comment or note here..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      X Position (optional)
                    </label>
                    <input
                      type="number"
                      value={newComment.x !== undefined ? newComment.x : ''}
                      onChange={(e) => setNewComment({ ...newComment, x: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Click on PDF to set"
                    />
                    <p className="text-xs text-slate-500 mt-1">Click on PDF preview above to set position</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Y Position (optional)
                    </label>
                    <input
                      type="number"
                      value={newComment.y !== undefined ? newComment.y : ''}
                      onChange={(e) => setNewComment({ ...newComment, y: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Click on PDF to set"
                    />
                    <p className="text-xs text-slate-500 mt-1">Click on PDF preview above to set position</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addComment}
                    className="flex-1 md:flex-none rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:shadow-md transition-all"
                  >
                    + Add Comment
                  </button>
                  {newComment.x !== undefined && newComment.y !== undefined && (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ Position set from preview
                    </span>
                  )}
                </div>
                
                {/* Comments List - All Comments */}
                {comments.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-slate-900">
                        📝 All Comments ({comments.length})
                      </label>
                      <button
                        onClick={() => {
                          // Group comments by page
                          const commentsByPage = {};
                          comments.forEach(c => {
                            if (!commentsByPage[c.page]) commentsByPage[c.page] = [];
                            commentsByPage[c.page].push(c);
                          });
                          // Navigate to first page with comments
                          const firstPage = Math.min(...Object.keys(commentsByPage).map(Number));
                          if (firstPage && currentPdf && firstPage >= 1 && firstPage <= totalPages) {
                            setCurrentPage(firstPage);
                            setTimeout(() => {
                              previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        View all on PDF →
                      </button>
                    </div>
                    {comments.map((comment, index) => (
                      <div key={comment.id} className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 bg-white group hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm shadow-lg">
                            {comment.page}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">Page {comment.page}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-700 font-medium">{comment.author || 'User'}</span>
                            {comment.x !== undefined && comment.y !== undefined && (
                              <>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-emerald-600 font-medium">📍 ({Math.round(comment.x)}, {Math.round(comment.y)})</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-slate-800 mb-2 leading-relaxed">{comment.text}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setCurrentPage(comment.page);
                                setTimeout(() => {
                                  previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline bg-blue-50 px-2 py-1 rounded"
                            >
                              📄 Go to Page {comment.page}
                            </button>
                            <button
                              onClick={() => editComment(comment)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline bg-indigo-50 px-2 py-1 rounded"
                            >
                              ✏️ Edit Comment
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete this comment from page ${comment.page}?`)) {
                                  removeComment(comment.id);
                                }
                              }}
                              className="text-xs text-red-600 hover:text-red-800 font-medium underline bg-red-50 px-2 py-1 rounded"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {comments.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-800">
                          <strong>💡 Tip:</strong> Click "Edit Comment" to modify a comment, or click "Go to Page X" to view it on the PDF preview above.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Add Comments Button */}
            {pdfFiles.length > 0 && comments.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={addCommentsToPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `⚡ Add Comments to ${pdfFiles.length} PDF File${pdfFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">
                    Adding comments to PDF{progress.total > 1 && ` (${progress.current}/${progress.total})`}...
                  </p>
                </div>
                {progress.total > 1 && (
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* Download PDF(s) with Comments */}
            {commentedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    PDF{commentedFiles.length > 1 ? 's' : ''} with Comments Ready ({commentedFiles.length})
                  </label>
                  {commentedFiles.length > 1 && (
                    <button
                      onClick={downloadAll}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                    >
                      ⬇ Download All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {commentedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.filename}>{file.filename}</p>
                          <p className="text-xs text-slate-500">PDF with Comments Added</p>
                          {file.stats && (
                            <p className="text-xs text-emerald-600 mt-1">
                              {file.stats.totalComments} comment{file.stats.totalComments !== 1 ? 's' : ''} added
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          👁 Preview
                        </a>
                        <button
                          onClick={() => downloadFile(file, index)}
                          className="rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:shadow-md transition-all"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          requirement={paymentRequirement}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* What is Add Comments to PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Add Comments to PDF?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Add Comments to PDF</strong> is the process of adding text comments, notes, and annotations to PDF files. Comments can be positioned on specific pages with custom text, author names, and optional X/Y coordinates for precise placement. This is essential for collaboration, feedback, reviews, document annotation, and team communication.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the FileReader API enables reading PDF files in the browser. Our Add Comments to PDF tool uses pdf-lib, a powerful JavaScript library for PDF manipulation. The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib library</a> provides comprehensive PDF processing capabilities that can add text overlays, annotations, and comments to PDF documents.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Adding comments to PDF is essential for document collaboration, providing feedback on documents, reviewing proposals and contracts, annotating research papers, and communicating changes or suggestions. Our tool adds comments as visible text boxes on PDF pages, making them perfect for collaboration, feedback, and reviews.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">⚠️</span>
                    Corrupted PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Damaged file structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Corrupted page data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Invalid cross-reference tables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Cannot be opened or viewed</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✅</span>
                    Add Comments to PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Clean file structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Valid pages extracted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Proper cross-reference tables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Fully functional and viewable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Repair Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of PDF repair
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">90K+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand for PDF repair</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Valid Pages Extracted</div>
                <div className="text-xs text-slate-600">All recoverable content preserved</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">10MB</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Free Limit</div>
                <div className="text-xs text-slate-600">Single file up to 10MB</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">5-15s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Repair Time</div>
                <div className="text-xs text-slate-600">Average processing time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Repair Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Repair?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              PDF repair offers numerous benefits for recovering corrupted documents:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Recover Important Documents</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Recover corrupted PDF files that contain important information. PDF repair can extract valid pages and content from damaged files, allowing you to recover documents that would otherwise be lost. Essential for business documents, legal files, and archived materials.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fix File Corruption</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Add Comments to PDF files damaged during transfer, storage, or due to system errors. PDF repair tools can fix various types of corruption including damaged file structure, corrupted page data, and invalid cross-reference tables. Restore functionality to corrupted PDFs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Extract Valid Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract all recoverable pages and content from corrupted PDFs. Even if some pages are too severely damaged, the repair tool will extract all valid pages and rebuild a clean PDF. Essential for preserving as much content as possible from damaged files.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Recovery</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Repair corrupted PDFs quickly and efficiently. Our tool processes files in seconds, extracting valid content and rebuilding clean PDFs. No need for complex software or technical expertise - simply upload and repair.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our PDF repair tool makes it easy to fix corrupted PDF files. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your corrupted PDF file(s)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button or drag and drop your corrupted PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. The files will be uploaded and prepared for repair.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and repair</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Add comments by entering page number, comment text, and author name. Optionally specify X and Y coordinates for precise positioning. Click 'Add Comment' to add each comment to the list. You can add multiple comments before processing.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and process</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review your uploaded PDF files and comments. You can remove files or comments if needed. Click the 'Add Comments to PDF' button to process your files. Each PDF will have the specified comments added as visible text boxes.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download your PDF(s) with comments</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once processing is complete, download your PDF file(s) with comments added. For batch processing, you can download all PDFs at once or individually. Each PDF contains all the comments you specified, ready for collaboration and review.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our PDF repair tool?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Secure server-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Extracts all valid pages</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Batch file processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Rebuilds clean PDF structure</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Repair</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal PDF repair results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Identify Corruption Early</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      If a PDF file won't open or displays errors, try repairing it as soon as possible. The longer corruption exists, the more difficult it may be to recover content. Early repair increases the chances of recovering all pages and content from your PDF file.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Backup Original Files</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Before repairing, make a backup copy of your corrupted PDF file. While our repair tool is safe and non-destructive, having a backup ensures you can try alternative repair methods if needed. Keep the original file until you've verified the repaired version is satisfactory.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Understand Repair Limitations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      PDF repair can extract valid pages and content, but severely corrupted pages may be skipped. If a PDF is too damaged (e.g., completely encrypted or binary corrupted), it may not be repairable. The tool will extract all recoverable content and rebuild a clean PDF with what can be salvaged.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verify Repaired Files</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      After processing, verify that the PDF with comments opens correctly and displays all comments properly. Check that comments appear on the correct pages and that text is readable. Test the PDF in different PDF viewers to ensure compatibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related PDF Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Explore other PDF tools to work with your documents:
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/pdf/pdf-compressor" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-xl">🗜️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Compressor</h3>
                    <p className="text-xs text-slate-600">Reduce PDF file size</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-merger" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Merger</h3>
                    <p className="text-xs text-slate-600">Combine multiple PDFs</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-splitter" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Splitter</h3>
                    <p className="text-xs text-slate-600">Split PDF into multiple files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/ocr-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">OCR PDF</h3>
                    <p className="text-xs text-slate-600">Extract text from PDF images</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-rotator" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Rotator</h3>
                    <p className="text-xs text-slate-600">Rotate PDF pages</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">All PDF Tools</h3>
                    <p className="text-xs text-slate-600">View all PDF tools</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© {currentYear} FixTools. All rights reserved. | <Link href="/privacy" className="hover:text-slate-900">Privacy</Link> | <Link href="/terms" className="hover:text-slate-900">Terms</Link></p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

