import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function HighlightPDF() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [highlightedFiles, setHighlightedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState({ page: 1, text: '', x: undefined, y: undefined, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
  const [isDraggingHighlight, setIsDraggingHighlight] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizingHighlight, setIsResizingHighlight] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'nw', 'ne', 'sw', 'se'
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCanvas, setPageCanvas] = useState(null);
  const [previewScale, setPreviewScale] = useState(1.5);
  const [selectedHighlightId, setSelectedHighlightId] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const lastPageWithDefaultRef = useRef(0); // Track last page we set default position for
  const highlightsCountRef = useRef(0); // Track highlights count to detect changes
  const newHighlightRef = useRef(newHighlight); // Track current newHighlight for drag calculations

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/highlight-pdf`;

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

  // Re-render preview when page changes (NO state updates here to prevent loops)
  useEffect(() => {
    if (!currentPdf || !pdfjsLib) return;
    
    let timer;
    let retryTimer;
    
    const doRender = () => {
      if (canvasRef.current) {
        renderPage(currentPage);
      } else {
        console.warn('Canvas not available yet, retrying...');
        retryTimer = setTimeout(() => {
          if (canvasRef.current && currentPdf && pdfjsLib) {
            renderPage(currentPage);
          }
        }, 200);
      }
    };
    
    timer = setTimeout(doRender, 50);
    
    return () => {
      if (timer) clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [currentPage, currentPdf, pdfjsLib]); // Only when these change

  // Set default highlight position when page changes (ONCE per page)
  useEffect(() => {
    // Only set if we haven't set it for this page yet
    if (currentPage > 0 && lastPageWithDefaultRef.current !== currentPage) {
      // Mark as set FIRST to prevent multiple calls
      lastPageWithDefaultRef.current = currentPage;
      
      // Wait for canvas to be rendered, then set default position (single check, no recursion)
      const timer = setTimeout(() => {
        if (canvasRef.current && canvasRef.current.width > 0 && canvasRef.current.height > 0) {
          const canvas = canvasRef.current;
          const defaultX = canvas.width * 0.7;
          const defaultY = canvas.height * 0.9;
          
          // Set default position
          setNewHighlight(prev => {
            // Only set if we're on the right page and don't have a position yet
            if (prev.page === currentPage && (prev.x === undefined || prev.y === undefined)) {
              return { ...prev, page: currentPage, x: defaultX, y: defaultY };
            }
            return prev;
          });
        }
      }, 400); // Wait for canvas to render
      
      return () => clearTimeout(timer);
    }
  }, [currentPage]); // ONLY depend on currentPage

  // Re-render when highlights change OR during drag (with different debounce times)
  useEffect(() => {
    if (!currentPdf || !pdfjsLib || currentPage === 0 || !canvasRef.current?.width) return;
    
    // During drag, re-render more frequently (every 50ms) for smooth experience
    // Otherwise, debounce longer (300ms) to batch updates
    const debounceTime = isDraggingHighlight ? 50 : 300;
    
    const timer = setTimeout(() => {
      if (canvasRef.current && currentPdf && pdfjsLib) {
        renderPage(currentPage);
      }
    }, debounceTime);
    
    return () => clearTimeout(timer);
  }, [highlights.length, newHighlight.x, newHighlight.y, isDraggingHighlight, currentPage, currentPdf, pdfjsLib]); // Re-render when highlights or drag position changes

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

      // Draw highlight markers on the canvas
      drawHighlightMarkers(context, viewport, pageNum);
    } catch (err) {
      console.error('Error rendering page:', err);
      setError(`Failed to render page ${pageNum}: ${err.message || 'Unknown error'}`);
    }
  };

  // Draw highlight markers on the canvas
  const drawHighlightMarkers = (ctx, viewport, pageNum) => {
    const pageHighlights = highlights.filter(h => h.page === pageNum);
    const isSelected = (id) => selectedHighlightId === id;
    
    pageHighlights.forEach((highlight, index) => {
      // Calculate position - if y is provided, it's in PDF coordinates (from bottom), convert to canvas (from top)
      const x = highlight.x !== undefined ? highlight.x : viewport.width * 0.1;
      const y = highlight.y !== undefined ? (viewport.height - highlight.y) : viewport.height * 0.7;
      const width = highlight.width !== undefined ? highlight.width : 150;
      const height = highlight.height !== undefined ? highlight.height : 20;
      const selected = isSelected(highlight.id);
      
      // Get highlight color (default: yellow)
      const color = highlight.color || { r: 1, g: 1, b: 0 };
      const highlightColor = `rgba(${Math.round((color.r || 1) * 255)}, ${Math.round((color.g || 1) * 255)}, ${Math.round((color.b || 0) * 255)}, ${selected ? 0.6 : 0.4})`;
      
      // Draw highlight rectangle (semi-transparent overlay)
      ctx.fillStyle = highlightColor;
      ctx.fillRect(x, y - height, width, height);
      
      // Draw border for selected highlights
      if (selected) {
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x, y - height, width, height);
        ctx.setLineDash([]);
      }
      
      // Draw text label if provided
      if (highlight.text) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 9px Arial';
        ctx.fillText(highlight.text.substring(0, 30) + (highlight.text.length > 30 ? '...' : ''), x + 5, y - height + 14);
      }
    });
    
    // Draw marker for new highlight being placed (draggable preview)
    if (newHighlight.page === pageNum && newHighlight.x !== undefined && newHighlight.y !== undefined) {
      const x = newHighlight.x;
      // Convert PDF Y (bottom-up) to canvas Y (top-down)
      // newHighlight.y is the bottom edge in PDF coordinates, viewport.height is the canvas height
      const yBottomCanvas = viewport.height - newHighlight.y; // Bottom edge in canvas coords
      const width = newHighlight.width || 150;
      const height = newHighlight.height || 20;
      const yTopCanvas = yBottomCanvas - height; // Top edge in canvas coords
      
      // Draw preview highlight rectangle (semi-transparent)
      const previewColor = newHighlight.color || { r: 1, g: 1, b: 0 };
      ctx.fillStyle = `rgba(${Math.round((previewColor.r || 1) * 255)}, ${Math.round((previewColor.g || 1) * 255)}, ${Math.round((previewColor.b || 0) * 255)}, 0.4)`;
      ctx.fillRect(x, yTopCanvas, width, height);
      
      // Draw border for preview (solid if dragging, dashed if not)
      ctx.strokeStyle = isDraggingHighlight ? '#FF5722' : '#2196F3';
      ctx.lineWidth = isDraggingHighlight ? 3 : 2;
      if (!isDraggingHighlight) {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.strokeRect(x, yTopCanvas, width, height);
      ctx.setLineDash([]);
      
      // Draw drag handle icon in corner (more visible)
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(x + width - 14, yTopCanvas - 2, 12, 12);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⋮', x + width - 8, yTopCanvas + 9);
      ctx.textAlign = 'left';
      
      // Draw text hint if no text set
      if (!newHighlight.text) {
        ctx.fillStyle = '#2196F3';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('Drag to move • Click "Add Highlight" to save', x + 5, yTopCanvas + 14);
      } else {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 9px Arial';
        ctx.fillText(newHighlight.text.substring(0, 30) + (newHighlight.text.length > 30 ? '...' : ''), x + 5, yTopCanvas + 14);
      }
    }
  };

  // Handle canvas mouse events for dragging highlights
  const handleCanvasMouseDown = (e) => {
    if (!canvasRef.current || !currentPdf) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const yPdf = canvas.height - y; // Convert to PDF coordinates (bottom-up)

    // Check if user clicked on the new highlight preview (for dragging)
    if (newHighlight.x !== undefined && newHighlight.y !== undefined && newHighlight.page === currentPage) {
      const highlightX = newHighlight.x;
      const highlightWidth = newHighlight.width || 150;
      const highlightHeight = newHighlight.height || 20;
      
      // Convert PDF y (bottom-up) to canvas y (top-down) for bounds checking
      // PDF y represents the bottom of the highlight, canvas y=0 is top
      const highlightYBottom = canvas.height - newHighlight.y; // Bottom edge in canvas coords
      const highlightYTop = highlightYBottom - highlightHeight; // Top edge in canvas coords
      
      // Check if click is within new highlight bounds (with larger margin for easier clicking)
      const margin = 20; // Larger margin for easier clicking
      const isWithinX = x >= highlightX - margin && x <= highlightX + highlightWidth + margin;
      const isWithinY = y >= highlightYTop - margin && y <= highlightYBottom + margin;
      
      if (isWithinX && isWithinY) {
        // Starting drag - store the offset for smooth dragging
        setIsDraggingHighlight(true);
        // Store offset from click position to highlight top-left corner (in canvas coordinates)
        setDragStart({ 
          x: x - highlightX, // X offset: distance from click to left edge of highlight
          y: y - highlightYTop // Y offset: distance from click to top edge of highlight (canvas coords, top is 0)
        });
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    // Check if user clicked on an existing highlight (within rectangle bounds)
    const pageHighlights = highlights.filter(h => h.page === currentPage);
    let clickedHighlight = null;
    
    for (const highlight of pageHighlights) {
      const highlightX = highlight.x !== undefined ? highlight.x : canvas.width * 0.1;
      const highlightY = highlight.y !== undefined ? (canvas.height - highlight.y) : canvas.height * 0.7;
      const highlightWidth = highlight.width !== undefined ? highlight.width : 150;
      const highlightHeight = highlight.height !== undefined ? highlight.height : 20;
      
      // Check if click is within highlight rectangle bounds
      if (x >= highlightX && x <= highlightX + highlightWidth && 
          y >= highlightY - highlightHeight && y <= highlightY) {
        clickedHighlight = highlight;
        break;
      }
    }

    // If clicked on existing highlight, edit it
    if (clickedHighlight && e.detail === 2) {
      // Double-click to edit
      editHighlight(clickedHighlight);
    } else if (clickedHighlight) {
      // Single click on highlight - select it
      setSelectedHighlightId(clickedHighlight.id);
      setTimeout(() => setSelectedHighlightId(null), 2000); // Clear selection after 2s
    } else if (!clickedHighlight && !isDraggingHighlight) {
      // Click on empty space - update new highlight position
      setNewHighlight(prev => ({
        ...prev,
        page: currentPage,
        x: x,
        y: yPdf // Convert to PDF coordinates (bottom-up)
      }));
    }
    
    // Show feedback
    setError('');
  };

  // Update ref whenever newHighlight changes (for drag calculations)
  useEffect(() => {
    newHighlightRef.current = newHighlight;
  }, [newHighlight]);

  // Handle mouse move for dragging (needs to be global to work when dragging outside canvas)
  useEffect(() => {
    if (!isDraggingHighlight) return;

    // Store current dragStart in closure
    const currentDragStart = { x: dragStart.x, y: dragStart.y };
    let animationFrameId = null;

    const handleGlobalMouseMove = (e) => {
      e.preventDefault(); // Prevent default to avoid text selection
      
      if (!canvasRef.current || !currentPdf) return;

      const canvas = canvasRef.current;
      if (canvas.width === 0 || canvas.height === 0) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Get mouse position relative to canvas
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      
      // Cancel previous frame if pending
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Use requestAnimationFrame to throttle updates
      animationFrameId = requestAnimationFrame(() => {
        // Get current highlight dimensions from ref (always up-to-date)
        const currentHighlight = newHighlightRef.current;
        const highlightWidth = currentHighlight.width || 150;
        const highlightHeight = currentHighlight.height || 20;
        
        // Calculate new highlight top-left position (accounting for drag offset)
        // dragStart.x is the offset from click position to left edge of highlight
        // dragStart.y is the offset from click position to top edge of highlight
        const newX = mouseX - currentDragStart.x;
        const newYTopCanvas = mouseY - currentDragStart.y; // Top edge of highlight in canvas coords (top is 0)
        
        // Clamp position to canvas bounds (canvas coordinates)
        const clampedX = Math.max(0, Math.min(canvas.width - highlightWidth, newX));
        const clampedYTopCanvas = Math.max(0, Math.min(canvas.height - highlightHeight, newYTopCanvas));
        
        // Convert canvas Y (top-down) to PDF Y (bottom-up) for storage
        // In PDF coordinates, y represents the bottom of the highlight
        const clampedYPdf = canvas.height - clampedYTopCanvas; // Bottom edge of highlight in PDF coords

        // Update highlight position using functional update to ensure latest state
        setNewHighlight(prev => {
          // Double-check we're updating the right highlight
          if (prev.page !== currentPage) return prev;
          
          return {
            ...prev,
            x: clampedX,
            y: clampedYPdf // Store as PDF Y (bottom of highlight)
          };
        });
      });
    };

    const handleGlobalMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setIsDraggingHighlight(false);
      setDragStart({ x: 0, y: 0 });
    };

    // Add global event listeners when dragging starts
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Prevent text selection while dragging
    const originalUserSelect = document.body.style.userSelect;
    const originalCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    return () => {
      // Cleanup
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = originalUserSelect;
      document.body.style.cursor = originalCursor;
    };
  }, [isDraggingHighlight, dragStart.x, dragStart.y, currentPdf, currentPage]); // Include currentPage for context

  // Handle canvas mouse move (for hover effects, not dragging)
  const handleCanvasMouseMove = (e) => {
    // This is just for hover effects if needed, actual dragging handled globally above
  };

  // Handle mouse up on canvas to stop dragging
  const handleCanvasMouseUp = () => {
    if (isDraggingHighlight) {
      setIsDraggingHighlight(false);
      setDragStart({ x: 0, y: 0 });
    }
  };

  // Update highlight position when dragging
  const handleHighlightDrag = (highlightId, newX, newY) => {
    setHighlights(prev => prev.map(h => {
      if (h.id === highlightId) {
        return { ...h, x: newX, y: newY };
      }
      return h;
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
    setHighlightedFiles([]);
    setCurrentPdf(null);
    setCurrentPage(1);
    setTotalPages(0);
    setNewHighlight({ page: 1, text: '', x: undefined, y: undefined, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
  };


  // Add highlight to list
  const addHighlight = () => {
    if (!newHighlight.page || newHighlight.page < 1) {
      setError('Please enter a valid page number (1 or greater).');
      return;
    }
    // Position is now always set by default, but validate it
    if (newHighlight.x === undefined || newHighlight.y === undefined) {
      // If still undefined, set default position
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const defaultX = canvas.width * 0.7;
        const defaultY = canvas.height * 0.9;
        setNewHighlight(prev => ({ ...prev, x: defaultX, y: defaultY }));
        // Retry after setting position
        setTimeout(() => {
          setHighlights([...highlights, { ...newHighlight, x: defaultX, y: defaultY, id: Date.now() }]);
          setNewHighlight({ page: currentPage, text: '', x: defaultX, y: defaultY, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
        }, 100);
        return;
      }
    }
    setHighlights([...highlights, { ...newHighlight, id: Date.now() }]);
    // Reset to default position for next highlight
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const defaultX = canvas.width * 0.7;
      const defaultY = canvas.height * 0.9;
      setNewHighlight({ page: currentPage, text: '', x: defaultX, y: defaultY, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
    } else {
      setNewHighlight({ page: currentPage, text: '', x: undefined, y: undefined, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
    }
    setError('');
  };

  // Remove highlight from list
  const removeHighlight = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  // Edit highlight - load highlight data into form for editing
  const editHighlight = (highlight) => {
    setNewHighlight({
      page: highlight.page,
      text: highlight.text || '',
      x: highlight.x,
      y: highlight.y,
      width: highlight.width || 150,
      height: highlight.height || 20,
      color: highlight.color || { r: 1, g: 1, b: 0 },
    });
    // Navigate to the highlight's page
    if (currentPdf && highlight.page >= 1 && highlight.page <= totalPages) {
      setCurrentPage(highlight.page);
    }
    // Remove the highlight from list (it will be re-added when user clicks "Add Highlight")
    removeHighlight(highlight.id);
    // Scroll to highlight form
    setTimeout(() => {
      document.querySelector('[data-highlight-form]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Highlight PDF
  const highlightPDF = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file first.');
      return;
    }

    if (highlights.length === 0) {
      setError('Please add at least one highlight before processing.');
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
    setHighlightedFiles([]);
    setProgress({ current: 0, total: fileCount });

    try {
      // Prepare highlights for API (remove id field)
      const highlightsForAPI = highlights.map(({ id, ...rest }) => rest);

      // Create FormData
      const formData = new FormData();
      
      // Append all PDF files
      pdfFiles.forEach(file => {
        formData.append('pdf', file);
      });

      // Append highlights as JSON
      formData.append('highlights', JSON.stringify(highlightsForAPI));

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
      const response = await fetch('/api/pdf/highlight-pdf', {
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
        throw new Error(data.message || data.error || 'Highlighting PDF failed');
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
          setHighlightedFiles(files);
        } else if (data.file) {
          // Single file
          const binaryString = atob(data.file);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setHighlightedFiles([{
            url,
            filename: data.filename || 'document-highlighted.pdf',
            blob,
            stats: data.stats,
          }]);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Highlight PDF error:', err);
      setError(err.message || 'Failed to highlight PDF. Please try again.');
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
    // Retry highlighting if files are already selected
    if (pdfFiles.length > 0 && highlights.length > 0) {
      highlightPDF();
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
    highlightedFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, index);
      }, index * 100);
    });
  };

  // Remove PDF file from list
  const removeFile = (index) => {
    const newFiles = pdfFiles.filter((_, i) => i !== index);
    setPdfFiles(newFiles);
    setHighlightedFiles([]);
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setHighlightedFiles([]);
    setHighlights([]);
    setNewHighlight({ page: 1, text: '', x: undefined, y: undefined, width: 150, height: 20, color: { r: 1, g: 1, b: 0 } });
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
                            setNewHighlight(prev => ({ ...prev, page: newPage }));
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
                                setNewHighlight(prev => ({ ...prev, page }));
                                setTimeout(() => {
                                  previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }
                            }}
                            className="w-16 text-center rounded-lg border-2 border-slate-300 px-2 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none bg-white"
                          />
                          {highlights.filter(h => h.page === currentPage).length > 0 && (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold">
                              {highlights.filter(h => h.page === currentPage).length}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            setNewHighlight(prev => ({ ...prev, page: newPage }));
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
                {totalPages > 0 && highlights.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">📋 Comments by Page:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                        const pageComments = highlights.filter(h => h.page === pageNum);
                        const hasComments = pageComments.length > 0;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              setNewHighlight(prev => ({ ...prev, page: pageNum }));
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
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        style={{ 
                          cursor: isDraggingHighlight ? 'grabbing' : 'move',
                          display: 'block', 
                          margin: '0 auto', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                        className="block mx-auto bg-white"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                        💡 Click anywhere on PDF to set comment position
                      </div>
                      {highlights.filter(h => h.page === currentPage).length > 0 && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          💬 {highlights.filter(h => h.page === currentPage).length} comment{highlights.filter(h => h.page === currentPage).length !== 1 ? 's' : ''} on this page
                        </div>
                      )}
                      {newHighlight.x !== undefined && newHighlight.y !== undefined && newHighlight.page === currentPage && (
                        <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          ✓ Position set: ({Math.round(newHighlight.x)}, {Math.round(newHighlight.y)})
                        </div>
                      )}
                      {highlights.filter(h => h.page === currentPage).length > 0 && (
                        <div className="absolute bottom-3 right-3 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          💡 Double-click yellow markers to edit
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <span>💡 Tip: Click on the PDF to set exact comment position</span>
                      {highlights.length > 0 && (
                        <span className="font-semibold text-emerald-600">
                          {highlights.length} total comment{highlights.length !== 1 ? 's' : ''} across {new Set(highlights.map(h => h.page)).size} page{new Set(highlights.map(h => h.page)).size !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Highlights Input Form */}
            {pdfFiles.length > 0 && (
              <div className="mb-6 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5" data-highlight-form>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-900">Add New Highlight</h3>
                  {highlights.length > 0 && (
                    <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {highlights.length} highlight{highlights.length !== 1 ? 's' : ''} added
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
                      value={newHighlight.page || ''}
                      onChange={(e) => {
                        const page = parseInt(e.target.value) || 1;
                        setNewHighlight({ ...newHighlight, page });
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
                      Highlight Color
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewHighlight({ ...newHighlight, color: { r: 1, g: 1, b: 0 } })}
                        className={`flex-1 h-10 rounded-lg border-2 ${newHighlight.color?.r === 1 && newHighlight.color?.g === 1 && newHighlight.color?.b === 0 ? 'border-blue-500' : 'border-slate-200'} bg-yellow-300`}
                        title="Yellow"
                      />
                      <button
                        type="button"
                        onClick={() => setNewHighlight({ ...newHighlight, color: { r: 1, g: 0.5, b: 0.5 } })}
                        className={`flex-1 h-10 rounded-lg border-2 ${newHighlight.color?.r === 1 && newHighlight.color?.g === 0.5 && newHighlight.color?.b === 0.5 ? 'border-blue-500' : 'border-slate-200'} bg-red-300`}
                        title="Red"
                      />
                      <button
                        type="button"
                        onClick={() => setNewHighlight({ ...newHighlight, color: { r: 0.5, g: 0.8, b: 1 } })}
                        className={`flex-1 h-10 rounded-lg border-2 ${newHighlight.color?.r === 0.5 && newHighlight.color?.g === 0.8 && newHighlight.color?.b === 1 ? 'border-blue-500' : 'border-slate-200'} bg-blue-300`}
                        title="Blue"
                      />
                      <button
                        type="button"
                        onClick={() => setNewHighlight({ ...newHighlight, color: { r: 0.5, g: 1, b: 0.5 } })}
                        className={`flex-1 h-10 rounded-lg border-2 ${newHighlight.color?.r === 0.5 && newHighlight.color?.g === 1 && newHighlight.color?.b === 0.5 ? 'border-blue-500' : 'border-slate-200'} bg-green-300`}
                        title="Green"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Text to Highlight (optional)
                  </label>
                  <textarea
                    value={newHighlight.text || ''}
                    onChange={(e) => setNewHighlight({ ...newHighlight, text: e.target.value })}
                    className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none min-h-[80px]"
                    placeholder="Enter text to highlight (optional)..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      X Position (optional)
                    </label>
                    <input
                      type="number"
                      value={newHighlight.x !== undefined ? newHighlight.x : ''}
                      onChange={(e) => setNewHighlight({ ...newHighlight, x: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Click on PDF to set"
                    />
                    <p className="text-xs text-slate-500 mt-1">Drag highlight on PDF or enter manually</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Y Position (optional)
                    </label>
                    <input
                      type="number"
                      value={newHighlight.y !== undefined ? newHighlight.y : ''}
                      onChange={(e) => setNewHighlight({ ...newHighlight, y: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Auto-set to top-right"
                    />
                    <p className="text-xs text-slate-500 mt-1">Drag highlight on PDF or enter manually</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Width (optional)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="500"
                      value={newHighlight.width || 150}
                      onChange={(e) => setNewHighlight({ ...newHighlight, width: e.target.value ? parseFloat(e.target.value) : 150 })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Height (optional)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={newHighlight.height || 20}
                      onChange={(e) => setNewHighlight({ ...newHighlight, height: e.target.value ? parseFloat(e.target.value) : 20 })}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addHighlight}
                    className="flex-1 md:flex-none rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:shadow-md transition-all"
                  >
                    + Add Highlight
                  </button>
                  {newHighlight.x !== undefined && newHighlight.y !== undefined && (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ Position set from preview
                    </span>
                  )}
                </div>
                
                {/* Comments List - All Comments */}
                {highlights.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-bold text-slate-900">
                        📝 All Comments ({highlights.length})
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
                    {highlights.map((highlight, index) => (
                      <div key={highlight.id} className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 bg-white group hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm shadow-lg">
                            {highlight.page}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">Page {highlight.page}</span>
                            <span className="text-xs text-slate-500">•</span>
                            {highlight.color && (
                              <>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-700 font-medium" style={{ color: `rgb(${Math.round((highlight.color.r || 1) * 255)}, ${Math.round((highlight.color.g || 1) * 255)}, ${Math.round((highlight.color.b || 0) * 255)})` }}>
                                  🖍️ Highlight
                                </span>
                              </>
                            )}
                            {highlight.x !== undefined && highlight.y !== undefined && (
                              <>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-emerald-600 font-medium">📍 ({Math.round(highlight.x)}, {Math.round(highlight.y)})</span>
                              </>
                            )}
                          </div>
                          {highlight.text && (
                            <p className="text-sm text-slate-800 mb-2 leading-relaxed">{highlight.text}</p>
                          )}
                          {highlight.width && highlight.height && (
                            <p className="text-xs text-slate-500 mb-2">Size: {Math.round(highlight.width)} × {Math.round(highlight.height)}px</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setCurrentPage(highlight.page);
                                setTimeout(() => {
                                  previewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline bg-blue-50 px-2 py-1 rounded"
                            >
                              📄 Go to Page {highlight.page}
                            </button>
                            <button
                              onClick={() => editHighlight(highlight)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline bg-indigo-50 px-2 py-1 rounded"
                            >
                              ✏️ Edit Highlight
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete this highlight from page ${highlight.page}?`)) {
                                  removeHighlight(highlight.id);
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
                    {highlights.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-800">
                          <strong>💡 Tip:</strong> Click "Edit Highlight" to modify a highlight, or click "Go to Page X" to view it on the PDF preview above.
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
            {pdfFiles.length > 0 && highlights.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={highlightPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `⚡ Highlight ${pdfFiles.length} PDF File${pdfFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">
                    Highlighting PDF{progress.total > 1 && ` (${progress.current}/${progress.total})`}...
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
            {highlightedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    PDF{highlightedFiles.length > 1 ? 's' : ''} with Highlights Ready ({highlightedFiles.length})
                  </label>
                  {highlightedFiles.length > 1 && (
                    <button
                      onClick={downloadAll}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                    >
                      ⬇ Download All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {highlightedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.filename}>{file.filename}</p>
                          <p className="text-xs text-slate-500">PDF with Highlights Added</p>
                          {file.stats && (
                            <p className="text-xs text-emerald-600 mt-1">
                              {file.stats.totalHighlights} highlight{file.stats.totalHighlights !== 1 ? 's' : ''} added
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

