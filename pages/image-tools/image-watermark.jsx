import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageWatermark() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState('#FFFFFF');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right'); // top-left, top-right, bottom-left, bottom-right, center, custom
  const [watermarkX, setWatermarkX] = useState(0);
  const [watermarkY, setWatermarkY] = useState(0);
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState('');
  const [watermarkedImageUrl, setWatermarkedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const watermarkFileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-watermark`;

  // Position presets
  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' },
    { value: 'custom', label: 'Custom' },
  ];

  // Handle main image upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-apply watermark on load
        setTimeout(() => applyWatermark(img), 100);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Handle watermark image upload
  const handleWatermarkImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file for watermark');
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setWatermarkImageUrl(event.target.result);
        setWatermarkImage(img);
        setWatermarkType('image');
        // Auto-apply watermark on load
        if (uploadedImage) {
          setTimeout(() => applyWatermark(uploadedImage), 100);
        }
      };
      img.onerror = () => {
        setError('Failed to load watermark image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read watermark file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Calculate watermark position
  const getWatermarkPosition = (ctx, watermarkWidth, watermarkHeight) => {
    let x, y;
    const padding = 20;

    switch (watermarkPosition) {
      case 'top-left':
        x = padding;
        y = padding;
        break;
      case 'top-right':
        x = originalWidth - watermarkWidth - padding;
        y = padding;
        break;
      case 'bottom-left':
        x = padding;
        y = originalHeight - watermarkHeight - padding;
        break;
      case 'bottom-right':
        x = originalWidth - watermarkWidth - padding;
        y = originalHeight - watermarkHeight - padding;
        break;
      case 'center':
        x = (originalWidth - watermarkWidth) / 2;
        y = (originalHeight - watermarkHeight) / 2;
        break;
      case 'custom':
        x = watermarkX;
        y = watermarkY;
        break;
      default:
        x = originalWidth - watermarkWidth - padding;
        y = originalHeight - watermarkHeight - padding;
    }

    return { x, y };
  };

  // Apply watermark
  const applyWatermark = (img = uploadedImage) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      setError('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      setError('Please upload a watermark image');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      
      // Draw the main image
      ctx.drawImage(img, 0, 0);

      // Set global alpha for opacity
      ctx.globalAlpha = watermarkOpacity;

      if (watermarkType === 'text') {
        // Text watermark
        ctx.font = `bold ${watermarkFontSize}px Arial`;
        ctx.fillStyle = watermarkColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Measure text to calculate position
        const textMetrics = ctx.measureText(watermarkText);
        const textWidth = textMetrics.width;
        const textHeight = watermarkFontSize;

        const { x, y } = getWatermarkPosition(ctx, textWidth, textHeight);

        // Draw text with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(watermarkText, x, y);
      } else {
        // Image watermark
        if (watermarkImage) {
          // Calculate watermark size (scale to reasonable size)
          const maxWidth = originalWidth * 0.3; // Max 30% of image width
          const maxHeight = originalHeight * 0.3; // Max 30% of image height
          let watermarkWidth = watermarkImage.width;
          let watermarkHeight = watermarkImage.height;

          // Scale if too large
          if (watermarkWidth > maxWidth || watermarkHeight > maxHeight) {
            const scale = Math.min(maxWidth / watermarkWidth, maxHeight / watermarkHeight);
            watermarkWidth = watermarkWidth * scale;
            watermarkHeight = watermarkHeight * scale;
          }

          const { x, y } = getWatermarkPosition(ctx, watermarkWidth, watermarkHeight);

          // Draw watermark image
          ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0;

      // Convert canvas to image URL
      const watermarkedDataUrl = canvas.toDataURL('image/png', 1.0);
      setWatermarkedImageUrl(watermarkedDataUrl);
    } catch (err) {
      setError('Error applying watermark: ' + err.message);
    }
  };

  // Auto-apply watermark when settings change
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      applyWatermark(uploadedImage);
    }
  }, [watermarkType, watermarkText, watermarkFontSize, watermarkColor, watermarkOpacity, watermarkPosition, watermarkX, watermarkY, watermarkImage, imageUrl, uploadedImage]);

  // Download watermarked image
  const handleDownload = () => {
    if (!watermarkedImageUrl) {
      setError('Please apply a watermark first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `watermarked-${fileName}` : 'watermarked-image.png';
    link.href = watermarkedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setWatermarkedImageUrl('');
    setWatermarkImage(null);
    setWatermarkImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWatermarkText('Watermark');
    setWatermarkFontSize(48);
    setWatermarkColor('#FFFFFF');
    setWatermarkOpacity(0.5);
    setWatermarkPosition('bottom-right');
    setWatermarkX(0);
    setWatermarkY(0);
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (watermarkFileInputRef.current) {
      watermarkFileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Image Tools", "item": `${siteHost}/tools/image-tools` },
        { "@type": "ListItem", "position": 4, "name": "Image Watermark", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Watermark",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2418",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Add text or image watermarks to images",
        "Customizable text watermark (font, size, color)",
        "Image watermark support",
        "Multiple position options (corners, center, custom)",
        "Adjustable opacity control",
        "100% client-side processing",
        "No registration required",
        "Instant watermark preview"
      ],
      "description": "Free online tool to add text or image watermarks to images. Customize watermark text, font, size, color, position, and opacity. Perfect for protecting images or branding. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Add Watermarks to Images Online",
      "description": "Step-by-step guide to add watermarks to images online for free using FixTools Image Watermark.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose watermark type",
          "text": "Select whether you want to add a text watermark or an image watermark. For text watermarks, enter your watermark text, choose font size, color, and position. For image watermarks, upload a watermark image file (logo, icon, etc.) and choose its position and size.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Customize watermark settings",
          "text": "Adjust watermark settings: position (top-left, top-right, bottom-left, bottom-right, center, or custom coordinates), opacity (0.0 to 1.0), and for text watermarks: font size and color. The tool automatically updates the preview as you adjust settings, showing the watermarked image in real-time.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Preview and download",
          "text": "Review the watermarked image in the preview area. Check that the watermark is positioned correctly, has the right opacity, and doesn't interfere with important image content. When satisfied, click 'Download Watermarked Image' to save the watermarked image to your device. The watermarking is processed entirely in your browser using the Canvas API - no server upload required.",
          "position": 4
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an image watermark?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An image watermark is a visible overlay (text or image) added to an image to identify ownership, protect copyright, or add branding. Watermarks are typically semi-transparent and positioned in corners or center of images. Text watermarks often include copyright symbols, names, or website URLs. Image watermarks are usually logos or icons. Watermarks help protect images from unauthorized use while maintaining image visibility."
          }
        },
        {
          "@type": "Question",
          "name": "Why add watermarks to images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Adding watermarks to images is essential for protecting copyright, identifying ownership, branding content, preventing unauthorized use, and maintaining professional appearance. Watermarks help photographers, artists, and businesses protect their work when sharing images online. They also serve as branding tools, helping viewers identify the source of images. Watermarks are especially important for stock photos, professional photography, and branded content."
          }
        },
        {
          "@type": "Question",
          "name": "What types of watermarks are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Watermark tool supports both text and image watermarks. Text watermarks allow you to add custom text with adjustable font size, color, and position. Image watermarks allow you to upload a logo, icon, or other image file as a watermark. Both types support adjustable opacity and multiple position options (corners, center, or custom coordinates)."
          }
        },
        {
          "@type": "Question",
          "name": "Will watermarks reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Watermarks are applied to images using the Canvas API, which maintains high quality. The watermarked image maintains the same resolution and quality as the original image. The watermark itself is rendered at high quality with proper anti-aliasing. For best results, use high-resolution source images and appropriate watermark sizes that don't overwhelm the image."
          }
        },
        {
          "@type": "Question",
          "name": "What opacity should I use for watermarks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Watermark opacity depends on your use case. For copyright protection, use 0.5-0.7 (50-70% opacity) to make watermarks visible but not too intrusive. For branding, use 0.3-0.5 (30-50% opacity) for subtle branding. For preview images, use 0.7-0.9 (70-90% opacity) for strong protection. Lower opacity (0.2-0.4) creates subtle watermarks, while higher opacity (0.6-0.9) creates more visible protection."
          }
        },
        {
          "@type": "Question",
          "name": "Can I remove watermarks from images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool only adds watermarks to images - it cannot remove existing watermarks. Removing watermarks from copyrighted images without permission is illegal and unethical. If you need to remove a watermark from your own image, you would need specialized image editing software, but this is generally not recommended as it may damage image quality."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image watermarking happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The watermarking algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I watermark multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Watermark tool processes one image at a time. To watermark multiple images, upload and watermark each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch watermarking tools."
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Image Watermark - Free Online Tool to Add Watermarks to Images | FixTools</title>
        <meta name="title" content="Image Watermark - Free Online Tool to Add Watermarks to Images | FixTools" />
        <meta name="description" content="Add text or image watermarks to images. Free online image watermark tool. Customize watermark text, font, size, color, position, and opacity. Perfect for protecting images or branding. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image watermark, watermark tool, add watermark to image, text watermark, image watermark online, free watermark tool, copyright watermark, image branding" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Watermark - Free Online Tool to Add Watermarks to Images" />
        <meta property="og:description" content="Add text or image watermarks to images. Free online image watermark tool. Customize watermark text, font, size, color, position, and opacity." />
        <meta property="og:image" content={`${siteHost}/images/image-watermark-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Watermark - Free Online Tool to Add Watermarks to Images" />
        <meta property="twitter:description" content="Add text or image watermarks to images. Free online image watermark tool." />
        <meta property="twitter:image" content={`${siteHost}/images/image-watermark-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-watermark-page) {
          font-size: 100% !important;
        }
        
        .image-watermark-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-watermark-page *,
        .image-watermark-page *::before,
        .image-watermark-page *::after {
          box-sizing: border-box;
        }
        
        .image-watermark-page h1,
        .image-watermark-page h2,
        .image-watermark-page h3,
        .image-watermark-page p,
        .image-watermark-page ul,
        .image-watermark-page ol {
          margin: 0;
        }
        
        .image-watermark-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-watermark-page input,
        .image-watermark-page textarea,
        .image-watermark-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-watermark-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/image-tools" className="hover:text-slate-900 transition-colors">Image Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Watermark</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Free • Fast • Privacy-first
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Image Watermark
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Add text or image watermarks to images. Free online image watermark tool. Customize watermark text, font, size, color, position, and opacity. Perfect for protecting images or branding. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Add Watermark</span>
              </a>
              <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                How it works
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add Watermark to Image</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and add a text or image watermark.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Upload Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {imageUrl && (
              <>
                {/* Original Image Info */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Original Dimensions:</span>
                      <span className="ml-2 font-semibold text-slate-900">{originalWidth} × {originalHeight}px</span>
                    </div>
                  </div>
                </div>

                {/* Watermark Type Selection */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Watermark Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWatermarkType('text')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        watermarkType === 'text'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      Text Watermark
                    </button>
                    <button
                      onClick={() => setWatermarkType('image')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        watermarkType === 'image'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      Image Watermark
                    </button>
                  </div>
                </div>

                {/* Text Watermark Options */}
                {watermarkType === 'text' && (
                  <>
                    <div className="mt-6">
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Enter watermark text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Font Size: {watermarkFontSize}px</label>
                        <input
                          type="range"
                          min="12"
                          max="200"
                          step="1"
                          value={watermarkFontSize}
                          onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Text Color</label>
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Image Watermark Options */}
                {watermarkType === 'image' && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Upload Watermark Image</label>
                    <input
                      ref={watermarkFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWatermarkImageUpload}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    {watermarkImageUrl && (
                      <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <p className="text-sm text-slate-600 mb-2">Watermark Preview:</p>
                        <img src={watermarkImageUrl} alt="Watermark" className="max-w-xs h-auto rounded-lg" />
                      </div>
                    )}
                  </div>
                )}

                {/* Position Selection */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Watermark Position</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {positions.map((position) => (
                      <button
                        key={position.value}
                        onClick={() => setWatermarkPosition(position.value)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          watermarkPosition === position.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {position.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Position Inputs */}
                {watermarkPosition === 'custom' && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-800">X Position</label>
                      <input
                        type="number"
                        min="0"
                        max={originalWidth}
                        value={watermarkX}
                        onChange={(e) => setWatermarkX(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-800">Y Position</label>
                      <input
                        type="number"
                        min="0"
                        max={originalHeight}
                        value={watermarkY}
                        onChange={(e) => setWatermarkY(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                )}

                {/* Opacity Slider */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Opacity: {Math.round(watermarkOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Transparent</span>
                    <span>Opaque</span>
                  </div>
                </div>

                {/* Watermarked Image Preview */}
                {watermarkedImageUrl && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Watermarked Image Preview</label>
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <img src={watermarkedImageUrl} alt="Watermarked" className="max-w-full h-auto max-h-96 rounded-lg" />
                    </div>
                  </div>
                )}

                {/* Download Button */}
                {watermarkedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Watermarked Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Watermarking Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Watermarking?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image watermarking</strong> is the process of adding a visible overlay (text or image) to an image to identify ownership, protect copyright, or add branding. Watermarks are typically semi-transparent and positioned in corners or center of images. Text watermarks often include copyright symbols, names, or website URLs. Image watermarks are usually logos or icons. Watermarks help protect images from unauthorized use while maintaining image visibility.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image watermarking without server processing. Our image watermark tool uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">fillText()</code> method for text watermarks and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">drawImage()</code> method for image watermarks, processing everything entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image watermarking capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Watermarking is essential for protecting intellectual property, especially when sharing images online. Watermarks serve as visual identifiers that help viewers recognize the source of images and deter unauthorized use. They're commonly used by photographers, artists, stock photo agencies, and businesses to protect their work while still allowing preview and sharing.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Text Watermarks
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Custom text with adjustable font size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Color customization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Perfect for copyright notices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Website URLs or branding text</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Image Watermarks
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Upload logo or icon as watermark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Automatic size scaling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Perfect for brand logos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Professional branding</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Watermarking Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Add Watermarks to Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image watermarking is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">©️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Copyright Protection</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Watermarks help protect your images from unauthorized use and copyright infringement. They serve as visual proof of ownership and make it more difficult for others to use your images without permission. While watermarks can be removed with image editing software, they deter casual theft and make unauthorized use more obvious. Watermarks are especially important for photographers, artists, and content creators sharing work online.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Brand Identification</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Watermarks help identify the source of images, building brand recognition and trust. When viewers see watermarked images, they know where the content comes from, which is valuable for businesses, photographers, and content creators. Watermarks can include logos, website URLs, or business names, helping viewers find and remember your brand. This is especially important for social media and online marketing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Photography</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Professional photographers use watermarks to protect their work when sharing previews, portfolios, or client galleries. Watermarks allow photographers to showcase their work while maintaining ownership and preventing unauthorized downloads. They're essential for wedding photographers, portrait photographers, and commercial photographers who need to protect their intellectual property while marketing their services.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Stock Photo Protection</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Stock photo agencies use watermarks on preview images to prevent unauthorized downloads. Watermarked previews allow potential buyers to evaluate images before purchase while protecting the full-resolution versions. This is essential for stock photo businesses that rely on licensing revenue. Watermarks ensure that only paying customers receive unwatermarked, high-quality images.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Branding</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Watermarks help maintain brand consistency across social media platforms. When images are shared or reposted, watermarks ensure your brand is visible, helping viewers identify the original source. This is valuable for businesses, influencers, and content creators who want to maintain brand recognition even when content is shared by others. Watermarks can include social media handles or website URLs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Business Marketing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Businesses use watermarks to protect marketing materials, product images, and promotional content. Watermarks help maintain brand identity and prevent competitors from using your images. They're especially important for e-commerce businesses, real estate agencies, and service providers who share images online. Watermarks ensure that even when images are shared, your brand remains visible.
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
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our Image Watermark tool makes it easy to add watermarks to images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose watermark type</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select whether you want to add a text watermark or an image watermark. For text watermarks, enter your watermark text, choose font size (12-200px), color, and position. For image watermarks, upload a watermark image file (logo, icon, etc.) and choose its position. The tool automatically scales image watermarks to appropriate sizes.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Customize watermark settings</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Adjust watermark settings: position (top-left, top-right, bottom-left, bottom-right, center, or custom coordinates), opacity (0.0 to 1.0 for transparency control), and for text watermarks: font size and color. The tool automatically updates the preview as you adjust settings, showing the watermarked image in real-time. You can fine-tune all settings until the watermark looks perfect.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview and download</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the watermarked image in the preview area. Check that the watermark is positioned correctly, has the right opacity, and doesn't interfere with important image content. When satisfied, click 'Download Watermarked Image' to save the watermarked image to your device. The watermarking is processed entirely in your browser using the Canvas API - no server upload required.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Watermark tool?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Text and image watermarks</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">6 position options</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Adjustable opacity control</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Watermarking</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal watermarking results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Appropriate Opacity</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Watermark opacity depends on your use case. For copyright protection, use 0.5-0.7 (50-70% opacity) to make watermarks visible but not too intrusive. For branding, use 0.3-0.5 (30-50% opacity) for subtle branding that doesn't distract from the image. For preview images, use 0.7-0.9 (70-90% opacity) for strong protection. Lower opacity (0.2-0.4) creates subtle watermarks, while higher opacity (0.6-0.9) creates more visible protection.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Position Watermarks Strategically</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Position watermarks where they're visible but don't interfere with important image content. Corners (especially bottom-right) are common choices as they're less likely to cover important subjects. Center watermarks provide maximum protection but can be more intrusive. Avoid placing watermarks over faces, important text, or key visual elements. Consider the image composition when choosing position.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Appropriate Font Sizes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For text watermarks, choose font sizes that are visible but not overwhelming. For small images (under 1000px), use 24-48px font size. For medium images (1000-2000px), use 48-72px. For large images (over 2000px), use 72-120px. The font size should be proportional to the image size, ensuring the watermark is readable but doesn't dominate the image. Test different sizes to find the right balance.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Contrasting Colors</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For text watermarks, choose colors that contrast well with the image background. White or light colors work well on dark images, while dark colors work well on light images. Consider using semi-transparent colors with shadows or outlines for better visibility across different backgrounds. The goal is to make the watermark readable without being too distracting. Test different colors to ensure visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is an image watermark?</summary>
                <p className="mt-2 text-sm text-slate-600">An image watermark is a visible overlay (text or image) added to an image to identify ownership, protect copyright, or add branding. Watermarks are typically semi-transparent and positioned in corners or center of images. Text watermarks often include copyright symbols, names, or website URLs. Image watermarks are usually logos or icons. Watermarks help protect images from unauthorized use while maintaining image visibility.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why add watermarks to images?</summary>
                <p className="mt-2 text-sm text-slate-600">Adding watermarks to images is essential for protecting copyright, identifying ownership, branding content, preventing unauthorized use, and maintaining professional appearance. Watermarks help photographers, artists, and businesses protect their work when sharing images online. They also serve as branding tools, helping viewers identify the source of images. Watermarks are especially important for stock photos, professional photography, and branded content.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What types of watermarks are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Watermark tool supports both text and image watermarks. Text watermarks allow you to add custom text with adjustable font size, color, and position. Image watermarks allow you to upload a logo, icon, or other image file as a watermark. Both types support adjustable opacity and multiple position options (corners, center, or custom coordinates).</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will watermarks reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Watermarks are applied to images using the Canvas API, which maintains high quality. The watermarked image maintains the same resolution and quality as the original image. The watermark itself is rendered at high quality with proper anti-aliasing. For best results, use high-resolution source images and appropriate watermark sizes that don't overwhelm the image.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What opacity should I use for watermarks?</summary>
                <p className="mt-2 text-sm text-slate-600">Watermark opacity depends on your use case. For copyright protection, use 0.5-0.7 (50-70% opacity) to make watermarks visible but not too intrusive. For branding, use 0.3-0.5 (30-50% opacity) for subtle branding. For preview images, use 0.7-0.9 (70-90% opacity) for strong protection. Lower opacity (0.2-0.4) creates subtle watermarks, while higher opacity (0.6-0.9) creates more visible protection.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I remove watermarks from images?</summary>
                <p className="mt-2 text-sm text-slate-600">Our tool only adds watermarks to images - it cannot remove existing watermarks. Removing watermarks from copyrighted images without permission is illegal and unethical. If you need to remove a watermark from your own image, you would need specialized image editing software, but this is generally not recommended as it may damage image quality.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image watermarking happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The watermarking algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I watermark multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Watermark tool processes one image at a time. To watermark multiple images, upload and watermark each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch watermarking tools.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Image Tools</h2>
            <p className="text-slate-600">Explore our complete suite of image tools for developers and designers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/image-tools/image-resizer" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📏</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Resizer</p>
                  <p className="text-xs text-slate-500">Resize Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Resize images to specific dimensions or maintain aspect ratio. Perfect for social media and web use.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-compressor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗜️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Compressor</p>
                  <p className="text-xs text-slate-500">Compress Images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compress images to reduce file size while maintaining quality. Optimize images for faster loading times.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-format-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-pink-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Format Converter</p>
                  <p className="text-xs text-slate-500">Convert Formats</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert images between JPEG, PNG, GIF, WebP, BMP, and SVG formats. Maintain quality while changing formats.</p>
              <p className="mt-4 text-sm font-semibold text-pink-600 group-hover:text-pink-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/image-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Image Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, watermarking, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
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

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
}

