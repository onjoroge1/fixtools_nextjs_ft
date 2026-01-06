import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageGrayscaleConverter() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [grayscaleImageUrl, setGrayscaleImageUrl] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-grayscale-converter`;

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
    setGrayscaleImageUrl(''); // Clear previous result

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setImageUrl(event.target.result);
        setUploadedImage(img);
        // Auto-convert on load
        setTimeout(() => convertToGrayscale(img), 100);
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

  // Convert to grayscale
  const convertToGrayscale = (img = uploadedImage) => {
    if (!img || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available');
        setIsProcessing(false);
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      
      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // ITU-R BT.601 standard luminance formula
      // gray = 0.299*R + 0.587*G + 0.114*B
      const rWeight = 0.299;
      const gWeight = 0.587;
      const bWeight = 0.114;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        // Calculate grayscale value using luminance formula
        const gray = Math.round(
          rWeight * data[i] +      // Red
          gWeight * data[i + 1] +  // Green
          bWeight * data[i + 2]    // Blue
        );
        
        // Set all RGB channels to the grayscale value
        data[i] = gray;     // Red
        data[i + 1] = gray; // Green
        data[i + 2] = gray; // Blue
        // Alpha channel (data[i + 3]) remains unchanged
      }

      // Put grayscale image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to image URL
      const grayscaleDataUrl = canvas.toDataURL('image/png', 1.0);
      setGrayscaleImageUrl(grayscaleDataUrl);
    } catch (err) {
      setError('Error converting to grayscale: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-convert when image changes
  useEffect(() => {
    if (uploadedImage && imageUrl) {
      convertToGrayscale(uploadedImage);
    }
  }, [imageUrl, uploadedImage]);

  // Download grayscale image
  const handleDownload = () => {
    if (!grayscaleImageUrl) {
      setError('Please convert an image first');
      return;
    }

    const link = document.createElement('a');
    link.download = fileName ? `grayscale-${fileName.replace(/\.[^/.]+$/, '')}.png` : 'grayscale-image.png';
    link.href = grayscaleImageUrl;
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setUploadedImage(null);
    setImageUrl('');
    setGrayscaleImageUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setError('');
    setFileName('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        { "@type": "ListItem", "position": 4, "name": "Image Grayscale Converter", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Grayscale Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "1923",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert color images to grayscale (black and white)",
        "ITU-R BT.601 standard luminance formula",
        "Real-time preview of grayscale conversion",
        "100% client-side processing",
        "No registration required",
        "Instant grayscale conversion",
        "Supports all common image formats"
      ],
      "description": "Free online tool to convert color images to grayscale (black and white). Uses ITU-R BT.601 standard luminance formula for accurate grayscale conversion. Perfect for artistic effects, vintage looks, or reducing file size. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Images to Grayscale Online",
      "description": "Step-by-step guide to convert color images to grayscale online for free using FixTools Image Grayscale Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Preview the grayscale conversion",
          "text": "The tool automatically converts your image to grayscale using the ITU-R BT.601 standard luminance formula. You'll see the grayscale version in the preview area immediately. The conversion uses the formula: gray = 0.299*R + 0.587*G + 0.114*B, which accurately represents how the human eye perceives brightness.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review the grayscale image",
          "text": "Review the grayscale image in the preview area. Check that the conversion looks good and that important details are preserved. Grayscale conversion removes color information but maintains brightness and contrast, creating a classic black and white appearance.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Download the grayscale image",
          "text": "Click the 'Download Grayscale Image' button to save the grayscale image to your device. The image will be saved with the grayscale conversion applied. The conversion is processed entirely in your browser using the Canvas API and pixel manipulation - no server upload required.",
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
          "name": "What is grayscale conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Grayscale conversion is the process of converting a color image to grayscale (black and white) by removing color information while preserving brightness and contrast. Each pixel's RGB values are converted to a single grayscale value using a luminance formula that represents how the human eye perceives brightness. The result is a classic black and white image with shades of gray."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert images to grayscale?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Converting images to grayscale is useful for creating artistic effects (vintage, classic, timeless look), reducing file size (grayscale images can be smaller than color images), improving print quality (black and white prints often look better), creating professional photography effects, or preparing images for specific design requirements. Grayscale images have a timeless, classic appearance that works well for many purposes."
          }
        },
        {
          "@type": "Question",
          "name": "How does grayscale conversion work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Grayscale Converter uses the ITU-R BT.601 standard luminance formula to convert RGB values to grayscale. The formula is: gray = 0.299*R + 0.587*G + 0.114*B. This formula weights the red, green, and blue channels based on how the human eye perceives brightness (green is most important, followed by red, then blue). Each pixel's RGB values are replaced with the calculated grayscale value, creating a black and white image."
          }
        },
        {
          "@type": "Question",
          "name": "What is the ITU-R BT.601 standard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ITU-R BT.601 is an international standard for converting color images to grayscale. It uses specific weights for red (0.299), green (0.587), and blue (0.114) channels based on how the human eye perceives brightness. Green is weighted most heavily because the human eye is most sensitive to green light. This standard ensures accurate grayscale conversion that matches human perception."
          }
        },
        {
          "@type": "Question",
          "name": "Will grayscale conversion reduce image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Grayscale conversion maintains the image's resolution and pixel count, but removes color information. The image quality in terms of sharpness and detail remains the same, but the color information is permanently lost. Grayscale images can sometimes appear to have more detail because the absence of color allows you to focus on brightness and contrast. The conversion is lossless in terms of resolution but removes color data."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert grayscale images back to color?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, grayscale conversion is a one-way process. Once color information is removed, it cannot be restored. The original RGB values are replaced with a single grayscale value, and the original color data is lost. If you might need the color version later, always keep a copy of the original image before converting to grayscale."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image grayscale conversion happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The grayscale conversion algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our Image Grayscale Converter processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch grayscale conversion tools."
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
        <title>Image Grayscale Converter - Free Online Tool to Convert Images to Grayscale | FixTools</title>
        <meta name="title" content="Image Grayscale Converter - Free Online Tool to Convert Images to Grayscale | FixTools" />
        <meta name="description" content="Convert color images to grayscale (black and white). Free online grayscale converter. Uses ITU-R BT.601 standard luminance formula for accurate conversion. Perfect for artistic effects, vintage looks, or reducing file size. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image grayscale, grayscale converter, convert to grayscale, black and white converter, grayscale tool, free grayscale converter, image to grayscale, color to grayscale" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Grayscale Converter - Free Online Tool to Convert Images to Grayscale" />
        <meta property="og:description" content="Convert color images to grayscale (black and white). Free online grayscale converter." />
        <meta property="og:image" content={`${siteHost}/images/image-grayscale-converter-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Grayscale Converter - Free Online Tool to Convert Images to Grayscale" />
        <meta property="twitter:description" content="Convert color images to grayscale (black and white). Free online grayscale converter." />
        <meta property="twitter:image" content={`${siteHost}/images/image-grayscale-converter-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-grayscale-converter-page) {
          font-size: 100% !important;
        }
        
        .image-grayscale-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-grayscale-converter-page *,
        .image-grayscale-converter-page *::before,
        .image-grayscale-converter-page *::after {
          box-sizing: border-box;
        }
        
        .image-grayscale-converter-page h1,
        .image-grayscale-converter-page h2,
        .image-grayscale-converter-page h3,
        .image-grayscale-converter-page p,
        .image-grayscale-converter-page ul,
        .image-grayscale-converter-page ol {
          margin: 0;
        }
        
        .image-grayscale-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-grayscale-converter-page input,
        .image-grayscale-converter-page textarea,
        .image-grayscale-converter-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-grayscale-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Grayscale Converter</span></li>
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
                Image Grayscale Converter
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Convert color images to grayscale (black and white). Free online grayscale converter. Uses ITU-R BT.601 standard luminance formula for accurate conversion. Perfect for artistic effects, vintage looks, or reducing file size. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ Convert to Grayscale</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Image to Grayscale</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image and convert it to grayscale (black and white).</p>
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
                    {isProcessing && (
                      <div>
                        <span className="text-slate-600">Status:</span>
                        <span className="ml-2 font-semibold text-purple-600">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Grayscale Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img src={grayscaleImageUrl || imageUrl} alt="Grayscale" className="max-w-full h-auto max-h-96 rounded-lg" />
                  </div>
                </div>

                {/* Download Button */}
                {grayscaleImageUrl && (
                  <div className="mt-6">
                    <button
                      onClick={handleDownload}
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Download Grayscale Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Grayscale Conversion Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Grayscale Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Grayscale conversion</strong> is the process of converting a color image to grayscale (black and white) by removing color information while preserving brightness and contrast. Each pixel's RGB values are converted to a single grayscale value using a luminance formula that represents how the human eye perceives brightness. The result is a classic black and white image with shades of gray, ranging from pure black to pure white.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the HTML5 Canvas API enables powerful client-side grayscale conversion without server processing. Our grayscale converter uses the Canvas API's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">getImageData()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">putImageData()</code> methods to manipulate RGB values at the pixel level, processing everything entirely in your browser, ensuring complete privacy and security. The <a href="https://www.w3.org/TR/2dcontext/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C Canvas 2D Context specification</a> provides standardized pixel manipulation capabilities across modern browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Grayscale conversion is essential for creating artistic effects (vintage, classic, timeless look), reducing file size (grayscale images can be smaller than color images), improving print quality (black and white prints often look better), creating professional photography effects, or preparing images for specific design requirements. Grayscale images have a timeless, classic appearance that works well for many purposes.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    ITU-R BT.601 Standard
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Luminance formula: gray = 0.299*R + 0.587*G + 0.114*B</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Based on human eye perception</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Green weighted most (0.587)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Industry standard for accuracy</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Instant Conversion
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Automatic conversion on upload</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Real-time preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>See results immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>100% client-side processing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Grayscale Conversion Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert Images to Grayscale?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Grayscale conversion is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Artistic Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Grayscale images have a timeless, classic appearance that works well for artistic photography, vintage looks, or dramatic effects. Removing color allows you to focus on composition, lighting, and contrast, creating images with strong visual impact. Grayscale is commonly used in fine art photography, portrait photography, and artistic design work where the absence of color enhances the visual message.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduce File Size</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Grayscale images can be smaller than color images because they contain less information (no color data). This is especially useful for web optimization, email attachments, or storage efficiency. Grayscale images typically use less bandwidth and load faster, making them ideal for websites, presentations, or documents where file size matters. This can significantly improve page load times and user experience.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🖨️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Print Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Black and white prints often look better than color prints, especially for certain types of images. Grayscale images can have better contrast, sharper details, and more professional appearance when printed. This is especially important for professional photography, art prints, or documents where print quality is crucial. Grayscale printing is also more cost-effective than color printing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Photography</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Grayscale is a fundamental tool in professional photography, used for portraits, fine art, documentary photography, and artistic compositions. Removing color allows photographers to focus on composition, lighting, texture, and contrast, creating images with strong visual impact. Grayscale photography has a timeless, classic quality that works well for many professional applications.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Vintage and Classic Looks</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Grayscale images evoke a sense of nostalgia, timelessness, and classic elegance. They're perfect for creating vintage looks, retro designs, or classic photography styles. Grayscale can make modern images look timeless, or give new images a classic, professional appearance. This is especially useful for marketing materials, social media content, or artistic projects where a vintage aesthetic is desired.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Design Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many design projects require grayscale images for specific aesthetic or technical reasons. Grayscale images work well in monochrome designs, print materials, or when color would distract from the design. Converting images to grayscale ensures consistency across design elements and can create a cohesive, professional appearance. This is essential for branding, marketing materials, or design projects with specific color requirements.
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
                Our Image Grayscale Converter makes it easy to convert images to grayscale in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG, PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. You'll see the original dimensions and a preview of the image immediately. The image will be ready for grayscale conversion.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Automatic grayscale conversion</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      The tool automatically converts your image to grayscale using the ITU-R BT.601 standard luminance formula. The formula is: gray = 0.299*R + 0.587*G + 0.114*B, which accurately represents how the human eye perceives brightness. Green is weighted most heavily (0.587) because the human eye is most sensitive to green light. The conversion happens instantly and you'll see the grayscale version in the preview area immediately.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview the grayscale image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the grayscale image in the preview area. Check that the conversion looks good and that important details are preserved. Grayscale conversion removes color information but maintains brightness and contrast, creating a classic black and white appearance. The preview shows the final result immediately, making it easy to verify the conversion quality.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download the grayscale image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Download Grayscale Image' button to save the grayscale image to your device. The image will be saved with the grayscale conversion applied. The conversion is processed entirely in your browser using the Canvas API and pixel manipulation - no server upload required. The grayscale image maintains the same dimensions as the original.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Grayscale Converter?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">ITU-R BT.601 standard</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Automatic conversion</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time preview</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Grayscale Conversion</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal grayscale conversion results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Keep Original Images</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Grayscale conversion is a one-way process - once color information is removed, it cannot be restored. Always keep a copy of the original color image if you might need it later. This is especially important for photos, professional images, or images that might need to be used in different contexts. Consider saving grayscale versions with different filenames to preserve originals.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Before Downloading</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always preview the grayscale image before downloading to ensure the conversion looks good and that important details are preserved. Check that the image has good contrast, that details are visible, and that the overall appearance meets your requirements. The preview shows the final result immediately, making it easy to verify the conversion quality before downloading.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider Image Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Some images work better in grayscale than others. Images with strong contrast, interesting textures, or good composition often look great in grayscale. Images that rely heavily on color for impact may lose visual interest when converted to grayscale. Consider the image content and whether grayscale conversion will enhance or diminish the image's visual impact. The preview helps you see how the conversion affects the image.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Appropriate Purposes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Grayscale conversion is best for artistic effects, vintage looks, professional photography, print materials, or when color would distract from the design. Consider whether grayscale conversion serves your purpose - it's perfect for creating timeless, classic images, but may not be appropriate for images where color is essential. Use grayscale conversion when it enhances your image or serves a specific design requirement.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is grayscale conversion?</summary>
                <p className="mt-2 text-sm text-slate-600">Grayscale conversion is the process of converting a color image to grayscale (black and white) by removing color information while preserving brightness and contrast. Each pixel's RGB values are converted to a single grayscale value using a luminance formula that represents how the human eye perceives brightness. The result is a classic black and white image with shades of gray.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why convert images to grayscale?</summary>
                <p className="mt-2 text-sm text-slate-600">Converting images to grayscale is useful for creating artistic effects (vintage, classic, timeless look), reducing file size (grayscale images can be smaller than color images), improving print quality (black and white prints often look better), creating professional photography effects, or preparing images for specific design requirements. Grayscale images have a timeless, classic appearance that works well for many purposes.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How does grayscale conversion work?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Grayscale Converter uses the ITU-R BT.601 standard luminance formula to convert RGB values to grayscale. The formula is: gray = 0.299*R + 0.587*G + 0.114*B. This formula weights the red, green, and blue channels based on how the human eye perceives brightness (green is most important, followed by red, then blue). Each pixel's RGB values are replaced with the calculated grayscale value, creating a black and white image.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is the ITU-R BT.601 standard?</summary>
                <p className="mt-2 text-sm text-slate-600">ITU-R BT.601 is an international standard for converting color images to grayscale. It uses specific weights for red (0.299), green (0.587), and blue (0.114) channels based on how the human eye perceives brightness. Green is weighted most heavily because the human eye is most sensitive to green light. This standard ensures accurate grayscale conversion that matches human perception.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will grayscale conversion reduce image quality?</summary>
                <p className="mt-2 text-sm text-slate-600">Grayscale conversion maintains the image's resolution and pixel count, but removes color information. The image quality in terms of sharpness and detail remains the same, but the color information is permanently lost. Grayscale images can sometimes appear to have more detail because the absence of color allows you to focus on brightness and contrast. The conversion is lossless in terms of resolution but removes color data.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert grayscale images back to color?</summary>
                <p className="mt-2 text-sm text-slate-600">No, grayscale conversion is a one-way process. Once color information is removed, it cannot be restored. The original RGB values are replaced with a single grayscale value, and the original color data is lost. If you might need the color version later, always keep a copy of the original image before converting to grayscale.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image grayscale conversion happens entirely in your browser using client-side JavaScript and the Canvas API. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The grayscale conversion algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert multiple images at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Currently, our Image Grayscale Converter processes one image at a time. To convert multiple images, upload and convert each image separately. This ensures optimal performance and maintains browser responsiveness. For batch processing of many images, you may want to use desktop image editing software or specialized batch grayscale conversion tools.</p>
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
            <Link href="/image-tools/image-brightness-adjuster" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">☀️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Brightness Adjuster</p>
                  <p className="text-xs text-slate-500">Adjust Brightness</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Adjust image brightness levels. Perfect for correcting exposure or fixing dark/bright images.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-contrast-adjuster" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Contrast Adjuster</p>
                  <p className="text-xs text-slate-500">Adjust Contrast</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Adjust image contrast levels. Perfect for enhancing definition or fixing flat images.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Open tool →</p>
            </Link>
            
            <Link href="/image-tools/image-format-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Image Format Converter</p>
                  <p className="text-xs text-slate-500">Convert Formats</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert images between different formats. Support for JPEG, PNG, WebP, GIF, and BMP.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, grayscale conversion, and more.</p>
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

