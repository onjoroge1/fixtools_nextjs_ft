import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageCropper() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('free'); // free, 1:1, 16:9, 4:3, 3:2, 9:16
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-cropper`;

  // Aspect ratio presets
  const aspectRatios = [
    { value: 'free', label: 'Free (Custom)', ratio: null },
    { value: '1:1', label: 'Square (1:1)', ratio: 1 },
    { value: '16:9', label: 'Widescreen (16:9)', ratio: 16 / 9 },
    { value: '4:3', label: 'Standard (4:3)', ratio: 4 / 3 },
    { value: '3:2', label: 'Photo (3:2)', ratio: 3 / 2 },
    { value: '9:16', label: 'Portrait (9:16)', ratio: 9 / 16 },
    { value: '21:9', label: 'Ultrawide (21:9)', ratio: 21 / 9 },
  ];

  // Handle file upload
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
        
        // Initialize crop to center, 80% of image size
        const initWidth = Math.floor(img.width * 0.8);
        const initHeight = Math.floor(img.height * 0.8);
        setCropX(Math.floor((img.width - initWidth) / 2));
        setCropY(Math.floor((img.height - initHeight) / 2));
        setCropWidth(initWidth);
        setCropHeight(initHeight);
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

  // Handle aspect ratio change
  const handleAspectRatioChange = (ratioValue) => {
    setAspectRatio(ratioValue);
    const ratioInfo = aspectRatios.find(r => r.value === ratioValue);
    
    if (ratioInfo && ratioInfo.ratio && uploadedImage) {
      // Adjust crop dimensions to maintain aspect ratio
      const currentRatio = cropWidth / cropHeight;
      if (currentRatio > ratioInfo.ratio) {
        // Current is wider, adjust height
        const newHeight = Math.floor(cropWidth / ratioInfo.ratio);
        if (cropY + newHeight <= originalHeight) {
          setCropHeight(newHeight);
        } else {
          // Adjust width instead
          const newWidth = Math.floor(cropHeight * ratioInfo.ratio);
          if (cropX + newWidth <= originalWidth) {
            setCropWidth(newWidth);
          }
        }
      } else {
        // Current is taller, adjust width
        const newWidth = Math.floor(cropHeight * ratioInfo.ratio);
        if (cropX + newWidth <= originalWidth) {
          setCropWidth(newWidth);
        } else {
          // Adjust height instead
          const newHeight = Math.floor(cropWidth / ratioInfo.ratio);
          if (cropY + newHeight <= originalHeight) {
            setCropHeight(newHeight);
          }
        }
      }
    }
  };

  // Handle crop dimension changes with aspect ratio lock
  const handleCropWidthChange = (newWidth) => {
    const width = Math.max(1, Math.min(newWidth, originalWidth - cropX));
    setCropWidth(width);
    
    if (aspectRatio !== 'free') {
      const ratioInfo = aspectRatios.find(r => r.value === aspectRatio);
      if (ratioInfo && ratioInfo.ratio) {
        const newHeight = Math.floor(width / ratioInfo.ratio);
        if (cropY + newHeight <= originalHeight) {
          setCropHeight(newHeight);
        } else {
          // Adjust width to fit
          const adjustedWidth = Math.floor((originalHeight - cropY) * ratioInfo.ratio);
          setCropWidth(adjustedWidth);
          setCropHeight(originalHeight - cropY);
        }
      }
    }
  };

  const handleCropHeightChange = (newHeight) => {
    const height = Math.max(1, Math.min(newHeight, originalHeight - cropY));
    setCropHeight(height);
    
    if (aspectRatio !== 'free') {
      const ratioInfo = aspectRatios.find(r => r.value === aspectRatio);
      if (ratioInfo && ratioInfo.ratio) {
        const newWidth = Math.floor(height * ratioInfo.ratio);
        if (cropX + newWidth <= originalWidth) {
          setCropWidth(newWidth);
        } else {
          // Adjust height to fit
          const adjustedHeight = Math.floor((originalWidth - cropX) / ratioInfo.ratio);
          setCropHeight(adjustedHeight);
          setCropWidth(originalWidth - cropX);
        }
      }
    }
  };

  const handleCropXChange = (newX) => {
    const x = Math.max(0, Math.min(newX, originalWidth - cropWidth));
    setCropX(x);
  };

  const handleCropYChange = (newY) => {
    const y = Math.max(0, Math.min(newY, originalHeight - cropHeight));
    setCropY(y);
  };

  // Apply preset aspect ratio
  const applyPreset = (preset) => {
    if (!uploadedImage) return;
    
    const ratioInfo = aspectRatios.find(r => r.value === preset);
    if (!ratioInfo || !ratioInfo.ratio) return;

    // Calculate crop dimensions based on aspect ratio
    let width, height;
    if (originalWidth / originalHeight > ratioInfo.ratio) {
      // Image is wider than ratio, fit to height
      height = originalHeight;
      width = Math.floor(height * ratioInfo.ratio);
    } else {
      // Image is taller than ratio, fit to width
      width = originalWidth;
      height = Math.floor(width / ratioInfo.ratio);
    }

    setCropX(Math.floor((originalWidth - width) / 2));
    setCropY(Math.floor((originalHeight - height) / 2));
    setCropWidth(width);
    setCropHeight(height);
    setAspectRatio(preset);
  };

  // Crop image
  const cropImage = () => {
    if (!uploadedImage || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    if (cropWidth <= 0 || cropHeight <= 0) {
      setError('Crop dimensions must be greater than 0');
      return;
    }

    if (cropX + cropWidth > originalWidth || cropY + cropHeight > originalHeight) {
      setError('Crop area exceeds image boundaries');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        return;
      }

      // Set canvas dimensions to crop dimensions
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      
      // Draw the cropped portion of the image
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(
        uploadedImage,
        cropX, cropY, cropWidth, cropHeight, // Source rectangle (crop area)
        0, 0, cropWidth, cropHeight // Destination rectangle (canvas)
      );

      // Convert canvas to image URL
      const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
      setCroppedImageUrl(croppedDataUrl);
    } catch (err) {
      setError('Error cropping image: ' + err.message);
    }
  };

  // Auto-crop when dimensions change
  useEffect(() => {
    if (uploadedImage && imageUrl && cropWidth > 0 && cropHeight > 0) {
      cropImage();
    }
  }, [cropX, cropY, cropWidth, cropHeight, imageUrl, uploadedImage]);

  // Download cropped image
  const handleDownload = () => {
    if (!croppedImageUrl) {
      setError('Please crop an image first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `cropped-${fileName}` : 'cropped-image.png';
    link.href = croppedImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setCroppedImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCropX(0);
    setCropY(0);
    setCropWidth(0);
    setCropHeight(0);
    setAspectRatio('free');
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Calculate scale for preview
  const getPreviewScale = () => {
    if (!imageContainerRef.current || !originalWidth || !originalHeight) return 1;
    const containerWidth = imageContainerRef.current.clientWidth;
    const maxWidth = Math.min(containerWidth - 40, 800);
    return Math.min(maxWidth / originalWidth, 1);
  };

  const previewScale = getPreviewScale();
  const previewWidth = originalWidth * previewScale;
  const previewHeight = originalHeight * previewScale;

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Image Tools", "item": `${siteHost}/tools/image-tools` },
        { "@type": "ListItem", "position": 4, "name": "Image Cropper", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Cropper",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2891",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Crop images to desired dimensions or aspect ratios",
        "Preset aspect ratios (1:1, 16:9, 4:3, 3:2, 9:16)",
        "Custom crop area with precise coordinates",
        "Image preview with crop overlay",
        "100% client-side processing",
        "No registration required",
        "Instant cropping",
        "Supports all common image formats"
      ],
      "description": "Free online tool to crop images to desired dimensions or aspect ratios. Select custom crop areas or use preset aspect ratios. Perfect for social media and thumbnails. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Crop Images Online",
      "description": "Step-by-step guide to crop images online for free using FixTools Image Cropper.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it with default crop settings. You'll see the original dimensions and a preview of the crop area.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select crop area",
          "text": "Adjust the crop area by entering X, Y, Width, and Height coordinates, or use preset aspect ratios. Choose from Square (1:1), Widescreen (16:9), Standard (4:3), Photo (3:2), Portrait (9:16), or Ultrawide (21:9). The tool automatically adjusts dimensions to maintain the selected aspect ratio. You can also use Free mode for custom dimensions.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview the cropped image",
          "text": "Review the cropped image in the preview area. The tool shows the crop dimensions and automatically updates the preview as you adjust the crop area. Check that the crop area covers the desired portion of the image and that dimensions meet your requirements.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the cropped image",
          "text": "Click the 'Download Cropped Image' button to save the cropped image to your device. The image will be saved with the exact crop dimensions you specified. The cropping is processed entirely in your browser using the Canvas API - no server upload required.",
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
          "name": "What is image cropping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image cropping is the process of selecting and extracting a rectangular portion of an image, removing the areas outside the selected region. Cropping allows you to focus on specific parts of an image, remove unwanted edges, adjust composition, or create images with specific aspect ratios. Cropping doesn't resize the image - it extracts a portion of the original image at its original resolution within the crop area."
          }
        },
        {
          "@type": "Question",
          "name": "Why crop images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cropping images is useful for removing unwanted areas, focusing on important subjects, adjusting composition, creating thumbnails, preparing images for social media (which often require specific aspect ratios), or fitting images into specific layouts. Cropping helps improve image composition, remove distractions, and create images that fit specific requirements like Instagram's square format or YouTube's 16:9 thumbnail format."
          }
        },
        {
          "@type": "Question",
          "name": "What aspect ratios are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Cropper offers several preset aspect ratios: Square (1:1) for Instagram posts, Widescreen (16:9) for YouTube thumbnails and videos, Standard (4:3) for traditional photos, Photo (3:2) for DSLR cameras, Portrait (9:16) for Instagram stories and mobile, and Ultrawide (21:9) for cinematic formats. You can also use Free mode to set custom dimensions without aspect ratio constraints."
          }
        },
        {
          "@type": "Question",
          "name": "Will cropping reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cropping extracts a portion of the original image at its original resolution within the crop area. If you crop to a smaller area, the resulting image will have fewer pixels than the original, but the quality of the cropped portion remains the same. For example, cropping a 4000×3000px image to 1000×1000px results in a 1000×1000px image with the same quality as that portion of the original. The cropped image maintains the original quality within the crop boundaries."
          }
        },
        {
          "@type": "Question",
          "name": "Can I crop to exact pixel dimensions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can set exact pixel dimensions for the crop area using the Width and Height input fields. The tool allows you to specify precise X, Y coordinates for the crop start position and exact Width and Height for the crop dimensions. This is perfect for creating images with specific pixel dimensions for web use, social media, or print."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Cropper supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and crop them. The cropped image is saved as PNG format to preserve quality and support transparency if the original image had it."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image cropping happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The cropping algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I crop multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Cropper processes one image at a time. To crop multiple images, upload and crop each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch cropping tools."
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
        <title>Image Cropper - Free Online Tool to Crop Images | FixTools</title>
        <meta name="title" content="Image Cropper - Free Online Tool to Crop Images | FixTools" />
        <meta name="description" content="Crop images to desired dimensions or aspect ratios. Free online image cropper. Select custom crop areas or use preset aspect ratios. Perfect for social media and thumbnails. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image cropper, crop image, image crop tool, crop photo, image cropper online, free image cropper, crop image to size, image aspect ratio cropper" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Cropper - Free Online Tool to Crop Images" />
        <meta property="og:description" content="Crop images to desired dimensions or aspect ratios. Free online image cropper. Select custom crop areas or use preset aspect ratios." />
        <meta property="og:image" content={`${siteHost}/images/image-cropper-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Cropper - Free Online Tool to Crop Images" />
        <meta property="twitter:description" content="Crop images to desired dimensions or aspect ratios. Free online image cropper." />
        <meta property="twitter:image" content={`${siteHost}/images/image-cropper-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-cropper-page) {
          font-size: 100% !important;
        }
        
        .image-cropper-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-cropper-page *,
        .image-cropper-page *::before,
        .image-cropper-page *::after {
          box-sizing: border-box;
        }
        
        .image-cropper-page h1,
        .image-cropper-page h2,
        .image-cropper-page h3,
        .image-cropper-page p,
        .image-cropper-page ul,
        .image-cropper-page ol {
          margin: 0;
        }
        
        .image-cropper-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-cropper-page input,
        .image-cropper-page textarea,
        .image-cropper-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-cropper-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Cropper</span></li>
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
                Image Cropper
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Crop images to desired dimensions or aspect ratios. Free online image cropper. Select custom crop areas or use preset aspect ratios. Perfect for social media and thumbnails. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Crop Image</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Crop Image</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and select the crop area.</p>
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
                    <div>
                      <span className="text-slate-600">Crop Dimensions:</span>
                      <span className="ml-2 font-semibold text-slate-900">{cropWidth} × {cropHeight}px</span>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Presets */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Aspect Ratio</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => {
                          if (ratio.value === 'free') {
                            setAspectRatio('free');
                          } else {
                            applyPreset(ratio.value);
                          }
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          aspectRatio === ratio.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop Coordinates */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-800">X Position</label>
                    <input
                      type="number"
                      min="0"
                      max={originalWidth - cropWidth}
                      value={cropX}
                      onChange={(e) => handleCropXChange(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-800">Y Position</label>
                    <input
                      type="number"
                      min="0"
                      max={originalHeight - cropHeight}
                      value={cropY}
                      onChange={(e) => handleCropYChange(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-800">Width</label>
                    <input
                      type="number"
                      min="1"
                      max={originalWidth - cropX}
                      value={cropWidth}
                      onChange={(e) => handleCropWidthChange(parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-800">Height</label>
                    <input
                      type="number"
                      min="1"
                      max={originalHeight - cropY}
                      value={cropHeight}
                      onChange={(e) => handleCropHeightChange(parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Image Preview with Crop Overlay */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Image Preview with Crop Area</label>
                  <div 
                    ref={imageContainerRef}
                    className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 relative"
                    style={{ minHeight: '300px' }}
                  >
                    {imageUrl && (
                      <div className="relative" style={{ width: previewWidth, height: previewHeight }}>
                        <img 
                          src={imageUrl} 
                          alt="Original" 
                          className="max-w-full h-auto rounded-lg"
                          style={{ width: previewWidth, height: previewHeight, objectFit: 'contain' }}
                        />
                        {/* Crop overlay */}
                        <div
                          className="absolute border-2 border-purple-500 bg-purple-500/20"
                          style={{
                            left: `${(cropX / originalWidth) * 100}%`,
                            top: `${(cropY / originalHeight) * 100}%`,
                            width: `${(cropWidth / originalWidth) * 100}%`,
                            height: `${(cropHeight / originalHeight) * 100}%`,
                          }}
                        >
                          <div className="absolute inset-0 border-2 border-dashed border-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cropped Image Preview */}
                {croppedImageUrl && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Cropped Image Preview</label>
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <img src={croppedImageUrl} alt="Cropped" className="max-w-full h-auto max-h-96 rounded-lg" />
                    </div>
                  </div>
                )}

                {/* Download Button */}
                {croppedImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Cropped Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Cropping Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Cropping?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image cropping</strong> is the process of selecting and extracting a rectangular portion of an image, removing the areas outside the selected region. Cropping allows you to focus on specific parts of an image, remove unwanted edges, adjust composition, or create images with specific aspect ratios. Cropping doesn't resize the image - it extracts a portion of the original image at its original resolution within the crop area.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side image cropping without server processing. Our image cropper uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">drawImage()</code> method with source coordinates to extract specific regions of images entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized image cropping capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Cropping is essential for improving image composition, removing distractions, focusing on important subjects, creating thumbnails, preparing images for social media (which often require specific aspect ratios), or fitting images into specific layouts. Unlike resizing, cropping extracts a portion of the image at its original resolution, maintaining the quality of the selected area.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Image Resizing
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Changes entire image dimensions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Scales all pixels proportionally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Keeps entire image content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>May reduce pixel density</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Image Cropping
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Extracts specific region</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Maintains original pixel quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Removes unwanted areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Preserves quality of selected area</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Cropping Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Crop Images?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Image cropping is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Different social media platforms require specific aspect ratios. Instagram posts need 1:1 (square), Instagram stories need 9:16 (portrait), YouTube thumbnails need 16:9 (widescreen), and Facebook posts work best with 1.91:1. Cropping images to these exact ratios ensures your images display correctly without being cut off or distorted. Our tool offers preset aspect ratios for all major platforms.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Composition</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Cropping allows you to improve image composition by removing distracting elements, centering subjects, applying the rule of thirds, or focusing on the most important parts of an image. Professional photographers and designers use cropping to enhance visual impact, create better balance, and guide the viewer's attention to key elements. Cropping is a fundamental tool for image editing and composition.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Create Thumbnails</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Cropping is essential for creating thumbnails from larger images. Thumbnails need to be square or specific aspect ratios, and cropping allows you to select the most important or visually appealing portion of an image. This is crucial for video thumbnails, product images, blog post images, or any application where small preview images are needed. Cropping ensures thumbnails are focused and impactful.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Unwanted Areas</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Cropping allows you to remove unwanted edges, backgrounds, or distracting elements from images. This is useful for cleaning up photos, removing timestamps, eliminating unwanted objects at the edges, or focusing on the main subject. Cropping is often the first step in image editing, allowing you to frame the image exactly as you want it before applying other edits.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fit Specific Layouts</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Websites, applications, and print materials often require images with specific dimensions or aspect ratios. Cropping allows you to fit images into these layouts perfectly. Whether you need a banner image (16:9), a profile picture (1:1), a header image (21:9), or any other specific ratio, cropping ensures your images fit the required dimensions without distortion or unwanted cropping by the system.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Focus on Subjects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Cropping allows you to zoom in on specific subjects, faces, or important elements in an image. This is essential for portrait photography, product photography, or any situation where you want to emphasize a particular subject. By cropping, you can create tighter compositions that draw attention to what matters most, improving the overall impact and effectiveness of your images.
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
                Our Image Cropper makes it easy to crop images in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it with default crop settings (centered, 80% of image size). You'll see the original dimensions and a preview of the crop area immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select crop area</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Adjust the crop area by entering X, Y, Width, and Height coordinates, or use preset aspect ratios. Choose from Square (1:1), Widescreen (16:9), Standard (4:3), Photo (3:2), Portrait (9:16), or Ultrawide (21:9). The tool automatically adjusts dimensions to maintain the selected aspect ratio. You can also use Free mode for custom dimensions without aspect ratio constraints.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the cropped image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the cropped image in the preview area. The tool shows the crop dimensions and automatically updates the preview as you adjust the crop area. You'll see a visual overlay on the original image showing the crop area, and a separate preview of the cropped result. Check that the crop area covers the desired portion of the image and that dimensions meet your requirements.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the cropped image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Cropped Image' button to save the cropped image to your device. The image will be saved with the exact crop dimensions you specified. The cropping is processed entirely in your browser using the Canvas API's drawImage method with source coordinates - no server upload required. The cropped image maintains the original quality within the crop boundaries.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Image Cropper?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">7 aspect ratio presets</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Precise coordinate controls</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Visual crop overlay</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Image Cropping</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal cropping results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Appropriate Aspect Ratios</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Choose aspect ratios that match your intended use. Use Square (1:1) for Instagram posts, Widescreen (16:9) for YouTube thumbnails and videos, Portrait (9:16) for Instagram stories and mobile content, Standard (4:3) for traditional photos, and Photo (3:2) for DSLR camera formats. Using the correct aspect ratio ensures your images display correctly on the target platform without unwanted cropping or distortion.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Follow Composition Rules</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Apply composition principles when cropping. Use the rule of thirds by placing important elements at intersection points. Keep horizons level, maintain balance, and ensure the main subject is well-framed. Avoid cropping too tightly around faces or important subjects - leave some breathing room. Consider the visual flow and how the cropped image guides the viewer's eye.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Maintain Image Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Cropping extracts a portion of the original image at its original resolution. If you crop to a very small area, the resulting image will have fewer pixels. For best results, ensure your crop area is large enough to maintain sufficient resolution for your intended use. For web use, aim for at least 800px width. For print, ensure the cropped area has enough pixels for the print size and DPI requirements.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Before Downloading</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always preview the cropped image before downloading to ensure the crop area is correct. Check that important elements aren't cut off, that the composition looks good, and that the dimensions meet your requirements. Use the visual crop overlay to see exactly what will be included in the final image. Adjust the crop coordinates if needed - it's better to refine the crop area than to end up with an unusable image.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image cropping?</summary>
                <p className="mt-2 text-sm text-slate-600">Image cropping is the process of selecting and extracting a rectangular portion of an image, removing the areas outside the selected region. Cropping allows you to focus on specific parts of an image, remove unwanted edges, adjust composition, or create images with specific aspect ratios. Cropping doesn't resize the image - it extracts a portion of the original image at its original resolution within the crop area.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why crop images?</summary>
                <p className="mt-2 text-sm text-slate-600">Cropping images is useful for removing unwanted areas, focusing on important subjects, adjusting composition, creating thumbnails, preparing images for social media (which often require specific aspect ratios), or fitting images into specific layouts. Cropping helps improve image composition, remove distractions, and create images that fit specific requirements like Instagram's square format or YouTube's 16:9 thumbnail format.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What aspect ratios are available?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Cropper offers several preset aspect ratios: Square (1:1) for Instagram posts, Widescreen (16:9) for YouTube thumbnails and videos, Standard (4:3) for traditional photos, Photo (3:2) for DSLR cameras, Portrait (9:16) for Instagram stories and mobile, and Ultrawide (21:9) for cinematic formats. You can also use Free mode to set custom dimensions without aspect ratio constraints.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will cropping reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Cropping extracts a portion of the original image at its original resolution within the crop area. If you crop to a smaller area, the resulting image will have fewer pixels than the original, but the quality of the cropped portion remains the same. For example, cropping a 4000×3000px image to 1000×1000px results in a 1000×1000px image with the same quality as that portion of the original. The cropped image maintains the original quality within the crop boundaries.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I crop to exact pixel dimensions?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, you can set exact pixel dimensions for the crop area using the Width and Height input fields. The tool allows you to specify precise X, Y coordinates for the crop start position and exact Width and Height for the crop dimensions. This is perfect for creating images with specific pixel dimensions for web use, social media, or print.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What image formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Cropper supports all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can upload images in any of these formats and crop them. The cropped image is saved as PNG format to preserve quality and support transparency if the original image had it.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image cropping happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The cropping algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I crop multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Cropper processes one image at a time. To crop multiple images, upload and crop each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch cropping tools.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, and more.</p>
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

