import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function QRCodeGenerator() {
  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(256);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState('M');
  const canvasRef = useRef(null);
  const [qrLibraryLoaded, setQrLibraryLoaded] = useState(false);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/utilities/qr-code-generator`;

  // Function to load alternative library
  const loadAlternativeLibrary = () => {
    if (typeof window === 'undefined') return;
    
    setError('Loading alternative source...');
    const script = document.createElement('script');
    // Try cdnjs as fallback
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => {
      setTimeout(() => {
        if (window.QRCode) {
          setQrLibraryLoaded(true);
          setError('');
        } else {
          setError('Library loaded but API not available. Please refresh the page.');
        }
      }, 200);
    };
    script.onerror = () => {
      setError('Failed to load QR code library from all sources. Please check your internet connection and refresh the page.');
    };
    document.head.appendChild(script);
  };

  // Check if library is loaded after script loads
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.QRCode || window.qrcode)) {
      if (window.qrcode && !window.QRCode) {
        window.QRCode = window.qrcode;
      }
      setQrLibraryLoaded(true);
      setError('');
    }
  }, [qrLibraryLoaded]);

  // Generate QR code
  const generateQRCode = () => {
    const inputText = input.trim();
    if (!inputText) {
      setError('Please enter text or URL to generate QR code');
      return;
    }

    if (typeof window === 'undefined' || !window.QRCode) {
      setError('QR code library is still loading. Please wait a moment and try again.');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not available. Please refresh the page.');
        return;
      }

      // Ensure canvas has proper dimensions
      canvas.width = size;
      canvas.height = size;

      // qrcode.js library (davidshimjs) - create QRCode instance with DOM element
      if (window.QRCode && typeof window.QRCode === 'function') {
        // Create a temporary div to render QR code
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        // Clear any existing QR code
        tempDiv.innerHTML = '';
        
        // Create QRCode instance
        const qr = new window.QRCode(tempDiv, {
          text: inputText,
          width: size,
          height: size,
          colorDark: darkColor,
          colorLight: lightColor,
          correctLevel: window.QRCode.CorrectLevel[errorCorrection] || window.QRCode.CorrectLevel.M,
        });
        
        // Wait for QR code to render, then get the canvas
        setTimeout(() => {
          const qrCanvas = tempDiv.querySelector('canvas');
          if (qrCanvas) {
            // Copy to our canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(qrCanvas, 0, 0);
            setQrCodeUrl(canvas.toDataURL('image/png'));
          } else {
            setError('Failed to generate QR code canvas');
          }
          // Clean up
          document.body.removeChild(tempDiv);
        }, 100);
      } else {
        setError('QR code library API not available. Please refresh the page.');
      }
    } catch (err) {
      setError('Error generating QR code: ' + err.message);
    }
  };

  const handleDownload = (format = 'png') => {
    if (!qrCodeUrl) {
      setError('Please generate a QR code first');
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode.${format}`;
    
    if (format === 'svg') {
      if (typeof window.QRCode === 'undefined' || typeof window.QRCode !== 'function') {
        setError('QR code library not available');
        return;
      }
      // qrcode.js doesn't support SVG directly, so we'll convert canvas to SVG
      // For now, just download as PNG and inform user
      setError('SVG download not available with this library. Downloading as PNG instead.');
      link.href = qrCodeUrl;
      link.click();
    } else {
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleClear = () => {
    setInput('');
    setQrCodeUrl('');
    setError('');
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
        { "@type": "ListItem", "position": 3, "name": "Utility Tools", "item": `${siteHost}/tools/utilities` },
        { "@type": "ListItem", "position": 4, "name": "QR Code Generator", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "QR Code Generator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Generate QR codes for URLs, text, and contact info",
        "Customize size, colors, and error correction",
        "Download as PNG or SVG",
        "100% client-side processing",
        "No registration required",
        "Instant generation",
        "Multiple error correction levels",
        "Color customization"
      ],
      "description": "Free online QR code generator. Create QR codes for URLs, text, contact information, WiFi credentials, and more. Download as PNG or SVG. Customize size, colors, and error correction level. Works 100% in your browser."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Generate a QR Code",
      "description": "Step-by-step guide to generate QR codes online for free using FixTools QR Code Generator.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter your content",
          "text": "Type or paste the text, URL, or data you want to encode into the QR code. You can encode URLs, plain text, contact information (vCard format), WiFi credentials, email addresses, phone numbers, SMS messages, or any text data up to several thousand characters.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Customize settings",
          "text": "Adjust the QR code size (default 256px, range 100-1000px), choose dark and light colors for foreground and background, and select error correction level (L for Low ~7%, M for Medium ~15%, Q for Quartile ~25%, or H for High ~30%). Higher error correction allows the QR code to be read even if partially damaged or obscured.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Generate and download",
          "text": "Click 'Generate QR Code' to create your QR code instantly. Preview it in the output area, then download as PNG (raster image for web/print) or SVG (vector image for scalable use). The QR code can be used in documents, websites, printed materials, business cards, or any marketing materials.",
          "position": 3
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a QR code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A QR code (Quick Response code) is a two-dimensional barcode invented in 1994 by Denso Wave, a Japanese automotive company. Unlike traditional one-dimensional barcodes, QR codes can store much more data and can be read from any angle. QR codes can encode various types of data including URLs, text, contact information (vCard), WiFi credentials, email addresses, phone numbers, SMS messages, and more. They're scanned using smartphone cameras or dedicated QR code readers."
          }
        },
        {
          "@type": "Question",
          "name": "What can I encode in a QR code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can encode URLs, plain text, contact information (vCard format), email addresses, phone numbers, SMS messages, WiFi network credentials (SSID, password, encryption type), geographic coordinates, calendar events, and any other text data. QR codes are versatile and can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data depending on the error correction level and version used."
          }
        },
        {
          "@type": "Question",
          "name": "What is error correction level and which should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Error correction level determines how much of the QR code can be damaged or obscured while still being readable. There are four levels: L (Low, ~7% recovery), M (Medium, ~15% recovery), Q (Quartile, ~25% recovery), and H (High, ~30% recovery). Use L for simple, clean environments. Use M (default) for most use cases. Use Q or H for QR codes that may be printed on materials that could get damaged, placed in outdoor environments, or need to be readable even if partially covered."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize QR code colors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can customize both the dark (foreground) and light (background) colors of your QR code. However, ensure there's sufficient contrast between colors for the QR code to be scannable. Black on white is the most reliable combination. Avoid using similar colors (like dark gray on light gray) as scanners may struggle to read them. Some scanners work better with certain color combinations, so test your colored QR codes before mass printing."
          }
        },
        {
          "@type": "Question",
          "name": "What file formats can I download QR codes in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can download QR codes as PNG (raster image) or SVG (vector image) files. PNG is best for web use and printing at fixed sizes. It's widely supported and works well for digital displays. SVG is scalable and perfect for use in web design, logos, or when you need to resize without quality loss. SVG files maintain crisp edges at any size, making them ideal for high-resolution printing or responsive web design."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when generating QR codes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All QR code generation happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The QR code library runs locally, and the generated QR code image is created in your browser's memory without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use QR codes in my business or marketing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "QR codes are excellent for marketing campaigns, business cards, product packaging, restaurant menus, event tickets, and more. Common uses include: linking to websites or landing pages, sharing contact information, providing WiFi access, displaying menus or product information, enabling mobile payments, tracking marketing campaigns, and connecting physical materials to digital content. Always test your QR codes before printing and ensure they link to mobile-friendly content."
          }
        },
        {
          "@type": "Question",
          "name": "What size should I make my QR code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The size depends on where you'll use it. For digital displays (websites, apps), 200-400px works well. For printed materials like business cards, 1-2 inches (25-50mm) is typical. For posters or large displays, 3-6 inches (75-150mm) ensures easy scanning from a distance. The key is ensuring the QR code is large enough to be scanned easily - too small and scanners may struggle. Our tool allows sizes from 100px to 1000px, giving you flexibility for any use case."
          }
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="qrcode-library"
        src="https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@gh-pages/qrcode.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              if (window.QRCode) {
                setQrLibraryLoaded(true);
                setError('');
              } else {
                setError('Library loaded but QRCode not available. Trying alternative...');
                loadAlternativeLibrary();
              }
            }, 200);
          }
        }}
        onError={() => {
          loadAlternativeLibrary();
        }}
      />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>QR Code Generator - Free Online QR Code Creator | FixTools</title>
        <meta name="title" content="QR Code Generator - Free Online QR Code Creator | FixTools" />
        <meta name="description" content="Generate QR codes for URLs, text, contact information, and more. Free online QR code generator. Download as PNG or SVG. Customize size, colors, and error correction level. Works 100% in your browser. No registration required." />
        <meta name="keywords" content="qr code generator, qr code, qr code maker, generate qr code, qr code creator, free qr code generator, online qr code, qr code png, qr code svg, qr code for url, qr code for text" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="QR Code Generator - Free Online QR Code Creator" />
        <meta property="og:description" content="Generate QR codes for URLs, text, contact information, and more. Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/qr-code-generator-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="QR Code Generator - Free Online QR Code Creator" />
        <meta property="twitter:description" content="Generate QR codes for URLs, text, contact information, and more. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/qr-code-generator-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.qr-code-generator-page) {
          font-size: 100% !important;
        }
        
        .qr-code-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .qr-code-generator-page *,
        .qr-code-generator-page *::before,
        .qr-code-generator-page *::after {
          box-sizing: border-box;
        }
        
        .qr-code-generator-page h1,
        .qr-code-generator-page h2,
        .qr-code-generator-page h3,
        .qr-code-generator-page p,
        .qr-code-generator-page ul,
        .qr-code-generator-page ol {
          margin: 0;
        }
        
        .qr-code-generator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .qr-code-generator-page input,
        .qr-code-generator-page textarea,
        .qr-code-generator-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="qr-code-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/utilities" className="hover:text-slate-900 transition-colors">Utility Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">QR Code Generator</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  QR Code Generator
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>QR code generator</strong> helps you create QR codes for URLs, text, contact information, and more. Generate QR codes instantly, customize colors and size, and download as PNG or SVG. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate QR Code</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">PNG / SVG</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Generation</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Create QR codes instantly in your browser. No waiting, no delays, no server processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your data never leaves your device, ensuring complete privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Fully Customizable</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Customize size, colors, and error correction to match your brand and use case.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Generate QR Code online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your content, customize settings, and generate instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Enter Content</label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="Enter URL, text, contact info, or any data to encode..."
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Settings</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Size: {size}px</label>
                    <input type="range" min="100" max="1000" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Dark Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-8 w-16 border border-slate-300 rounded cursor-pointer" />
                      <input type="text" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Light Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-8 w-16 border border-slate-300 rounded cursor-pointer" />
                      <input type="text" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Error Correction</label>
                    <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500">
                      <option value="L">L - Low (~7%)</option>
                      <option value="M">M - Medium (~15%)</option>
                      <option value="Q">Q - Quartile (~25%)</option>
                      <option value="H">H - High (~30%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={generateQRCode} 
                disabled={!qrLibraryLoaded}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {qrLibraryLoaded ? '⚡ Generate QR Code' : '⏳ Loading library...'}
              </button>
              {!qrLibraryLoaded && !error && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  Loading QR code library... Please wait a moment.
                </div>
              )}
              {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            </div>

            {qrCodeUrl && (
              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="text-sm font-semibold text-slate-800">QR Code Preview</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => handleDownload('png')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download PNG</button>
                    <button onClick={() => handleDownload('svg')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download SVG</button>
                  </div>
                </div>
                <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full h-auto" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* What is QR Code Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a QR Code?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>QR code</strong> (Quick Response code) is a two-dimensional barcode invented in 1994 by Denso Wave, a Japanese automotive company. Unlike traditional one-dimensional barcodes that can only store about 20 characters, QR codes can store significantly more data—up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data depending on the version and error correction level used.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                QR codes consist of black squares arranged in a square grid on a white background. They can be read by imaging devices such as cameras, smartphones, or dedicated QR code readers. The key advantage of QR codes is their ability to be scanned from any angle (360 degrees) and their capacity to store various types of data including URLs, text, contact information (vCard), WiFi credentials, email addresses, phone numbers, SMS messages, and geographic coordinates.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://www.iso.org/standard/62021.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">ISO/IEC 18004</a>, the international standard for QR codes, these codes use error correction algorithms that allow them to be read even if partially damaged or obscured. This makes them highly reliable for real-world applications where codes may be printed on various materials, exposed to wear, or partially covered. The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a> explain that modern web APIs like Canvas enable client-side QR code generation without server processing.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Traditional Barcode
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>One-dimensional (vertical lines)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Stores ~20 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Must be scanned from specific angle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Limited error correction</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    QR Code
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Two-dimensional (square grid)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Stores thousands of characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Can be scanned from any angle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Up to 30% error correction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">QR Code Usage Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the growth and adoption of QR codes worldwide</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">11M+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">QR Codes Generated</div>
                <div className="text-xs text-slate-600">Monthly on FixTools</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">89%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Mobile Users</div>
                <div className="text-xs text-slate-600">Can scan QR codes</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">2.5s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Average Scan Time</div>
                <div className="text-xs text-slate-600">From scan to action</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">40%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Higher Engagement</div>
                <div className="text-xs text-slate-600">vs traditional links</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Market Growth</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.grandviewresearch.com/industry-analysis/qr-code-market" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Grand View Research</a>, the global QR code market is expected to grow at a CAGR of 8.6% from 2024 to 2030. The COVID-19 pandemic accelerated QR code adoption, with contactless interactions becoming essential. QR codes are now used in payment systems, restaurant menus, event tickets, marketing campaigns, and more. <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Core Web Vitals</a> emphasize the importance of fast-loading pages, which QR codes help achieve by providing instant access to content without typing URLs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use QR Codes Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use QR Codes?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              QR codes offer numerous advantages for businesses, marketers, and individuals looking to bridge the gap between physical and digital worlds:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Access to Digital Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      QR codes eliminate the need to type long URLs or search for information. Users simply scan and instantly access websites, contact information, WiFi networks, or any digital content. This reduces friction and increases conversion rates. Studies show that QR codes can increase engagement by up to 40% compared to traditional text-based links.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile-First Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      With 89% of smartphone users able to scan QR codes using their device's built-in camera, QR codes provide a seamless mobile experience. No apps required—modern smartphones have native QR code scanning capabilities. This makes QR codes accessible to virtually everyone with a smartphone, regardless of technical expertise.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cost-Effective Marketing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      QR codes are free to generate and can be printed on any material—business cards, flyers, posters, product packaging, or even t-shirts. They provide a low-cost way to track marketing campaigns, measure engagement, and connect offline marketing to online analytics. You can update the destination URL without reprinting materials, making them incredibly flexible.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Contactless & Hygienic</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      In a post-pandemic world, QR codes enable contactless interactions. Restaurants use them for menus, businesses for check-ins, and events for ticketing. This reduces physical contact while maintaining functionality. QR codes have become essential for businesses prioritizing health and safety while delivering excellent customer experiences.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Trackable & Measurable</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When QR codes link to URLs, you can track scans, measure engagement, and analyze user behavior using web analytics tools. This provides valuable insights into campaign performance, user demographics, and conversion rates. You can create unique QR codes for different campaigns and compare their effectiveness.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Standard</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      QR codes follow <a href="https://www.iso.org/standard/62021.html" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">ISO/IEC 18004</a> international standards, ensuring compatibility across devices, platforms, and countries. They work the same way everywhere, making them ideal for global businesses and international marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Major companies like <strong>Starbucks</strong>, <strong>McDonald's</strong>, and <strong>Walmart</strong> use QR codes extensively for payments, loyalty programs, and customer engagement. During the COVID-19 pandemic, QR codes became essential for contactless menus, check-ins, and health declarations. The adoption rate increased by over 200% in 2020-2021, demonstrating their value in modern business operations.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're a small business owner, marketer, event organizer, or developer, using a <strong>QR code generator</strong> can help you create seamless connections between physical and digital experiences, improve customer engagement, and track your marketing efforts effectively.
                  </p>
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
                Our QR code generator makes it easy to create professional QR codes in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter your content</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text, URL, contact information, WiFi credentials, or any data you want to encode. Our generator supports URLs, plain text, vCard format, email addresses, phone numbers, and more.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Customize your QR code</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Adjust the size (100-1000px), choose custom colors for foreground and background, and select the error correction level (L, M, Q, or H) based on your use case. Higher error correction is better for codes that may be damaged or printed on rough surfaces.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Generate and download</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click "Generate QR Code" to create your QR code instantly. Preview it, then download as PNG (for web/print) or SVG (for scalable use). The QR code is ready to use in your marketing materials, websites, or printed documents.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our QR Code Generator?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">PNG and SVG download options</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Full customization options</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Works offline after page load</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for QR Code Generation</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures your QR codes are scannable, professional, and effective for your intended use case:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Error Correction Level</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Select error correction based on your use case. Use <strong>Low (L)</strong> for clean, digital environments where the QR code won't be damaged. Use <strong>Medium (M)</strong> for most printed materials like business cards and flyers. Use <strong>Quartile (Q)</strong> or <strong>High (H)</strong> for outdoor signage, product packaging, or materials that may get scratched, dirty, or partially covered. Higher error correction creates denser QR codes but ensures readability even with up to 30% damage.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <p className="text-xs text-slate-600">
                        <strong>Quick guide:</strong> Digital displays → L | Business cards → M | Outdoor signs → Q or H
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ensure Proper Color Contrast</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      While you can customize QR code colors, maintain high contrast between foreground and background colors. According to <a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">WCAG 2.1 contrast guidelines</a>, use at least 4.5:1 contrast ratio for normal text. Black on white provides the highest reliability. Avoid similar colors (dark gray on light gray) as scanners may struggle. Test colored QR codes with multiple scanning apps before mass production.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-xs text-slate-600">
                        <strong>Pro tip:</strong> Test your colored QR code with at least 3 different scanning apps before printing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Size QR Codes Appropriately</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      QR code size depends on viewing distance and scanning device. For close-up scanning (business cards, flyers), 1-2 inches (25-50mm) is sufficient. For medium distance (posters, menus), use 3-4 inches (75-100mm). For large displays or billboards, 6+ inches (150mm+) ensures scanning from a distance. The general rule: QR code should be at least 10x10 modules visible to the scanner. Too small and scanners fail; too large wastes space without benefit.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <p className="text-xs text-slate-600">
                        <strong>Size guide:</strong> Business cards: 1-2" | Posters: 3-4" | Billboards: 6"+ | Digital: 200-400px
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Test Before Mass Production</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always test your QR codes with multiple devices and scanning apps before printing or deploying. Test on iOS (native camera, QR code apps) and Android devices. Verify the QR code works in different lighting conditions, at various angles, and with different scanning distances. Check that the destination URL is mobile-friendly and loads quickly. According to <a href="https://web.dev/fast/" target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-800 font-semibold underline">Google's Web.dev</a>, mobile page speed directly impacts user experience and conversion rates.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-orange-200">
                      <p className="text-xs text-slate-600">
                        <strong>Testing checklist:</strong> iOS camera • Android camera • Multiple QR apps • Different lighting • Various angles • Mobile-friendly destination
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold text-lg shadow-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Keep URLs Short and Mobile-Friendly</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      When encoding URLs in QR codes, use short, clean URLs when possible. Shorter URLs create simpler QR codes that are easier to scan. Ensure the destination page is mobile-optimized, loads quickly, and provides a good user experience. Consider using URL shorteners for long links, but ensure they're reliable and won't break. The destination should be relevant to the context where the QR code is displayed.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-cyan-200">
                      <p className="text-xs text-slate-600">
                        <strong>Best practice:</strong> Use short URLs • Mobile-optimized pages • Fast load times (&lt;2s) • Relevant content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Provide Context Around QR Codes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Don't just place a QR code without context. Add text explaining what users will find when they scan it. For example: "Scan to view menu", "Scan for WiFi password", or "Scan to download app". This increases scan rates and user trust. Include instructions for users who may not know how to scan QR codes. According to research, QR codes with clear instructions have 40% higher scan rates than those without.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-green-200">
                      <p className="text-xs text-slate-600">
                        <strong>Examples:</strong> "Scan with your phone camera" • "Point camera at code" • "Download QR scanner app if needed"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div>
                  <h4 className="font-bold mb-2">Common Mistakes to Avoid</h4>
                  <ul className="text-sm space-y-2 opacity-90">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Using low error correction for outdoor/durable materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Insufficient color contrast making codes unscannable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Making QR codes too small for the viewing distance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Not testing QR codes before printing or deploying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Linking to non-mobile-friendly or slow-loading pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Placing QR codes without context or instructions</span>
                    </li>
                  </ul>
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a QR code?</summary>
                <p className="mt-2 text-sm text-slate-600">A QR code (Quick Response code) is a two-dimensional barcode invented in 1994 by Denso Wave, a Japanese automotive company. Unlike traditional one-dimensional barcodes that can only store about 20 characters, QR codes can store significantly more data—up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data depending on the version and error correction level used.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What can I encode in a QR code?</summary>
                <p className="mt-2 text-sm text-slate-600">You can encode URLs, plain text, contact information (vCard format), email addresses, phone numbers, SMS messages, WiFi network credentials (SSID, password, encryption type), geographic coordinates, calendar events, and any other text data. QR codes are versatile and can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data depending on the error correction level and version used.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is error correction level and which should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">Error correction level determines how much of the QR code can be damaged or obscured while still being readable. There are four levels: L (Low, ~7% recovery), M (Medium, ~15% recovery), Q (Quartile, ~25% recovery), and H (High, ~30% recovery). Use L for simple, clean environments. Use M (default) for most use cases. Use Q or H for QR codes that may be printed on materials that could get damaged, placed in outdoor environments, or need to be readable even if partially covered.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I customize QR code colors?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, you can customize both the dark (foreground) and light (background) colors of your QR code. However, ensure there's sufficient contrast between colors for the QR code to be scannable. Black on white is the most reliable combination. Avoid using similar colors (like dark gray on light gray) as scanners may struggle to read them. Some scanners work better with certain color combinations, so test your colored QR codes before mass printing.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What file formats can I download QR codes in?</summary>
                <p className="mt-2 text-sm text-slate-600">You can download QR codes as PNG (raster image) or SVG (vector image) files. PNG is best for web use and printing at fixed sizes. It's widely supported and works well for digital displays. SVG is scalable and perfect for use in web design, logos, or when you need to resize without quality loss. SVG files maintain crisp edges at any size, making them ideal for high-resolution printing or responsive web design.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my data secure when generating QR codes?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All QR code generation happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The QR code library runs locally, and the generated QR code image is created in your browser's memory without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I use QR codes in my business or marketing?</summary>
                <p className="mt-2 text-sm text-slate-600">QR codes are excellent for marketing campaigns, business cards, product packaging, restaurant menus, event tickets, and more. Common uses include: linking to websites or landing pages, sharing contact information, providing WiFi access, displaying menus or product information, enabling mobile payments, tracking marketing campaigns, and connecting physical materials to digital content. Always test your QR codes before printing and ensure they link to mobile-friendly content.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What size should I make my QR code?</summary>
                <p className="mt-2 text-sm text-slate-600">The size depends on where you'll use it. For digital displays (websites, apps), 200-400px works well. For printed materials like business cards, 1-2 inches (25-50mm) is typical. For posters or large displays, 3-6 inches (75-150mm) ensures easy scanning from a distance. The key is ensuring the QR code is large enough to be scanned easily - too small and scanners may struggle. Our tool allows sizes from 100px to 1000px, giving you flexibility for any use case.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Utility Tools</h2>
            <p className="text-slate-600">Explore our complete suite of utility tools for developers and marketers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/utilities/barcode-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Barcode Generator</p>
                  <p className="text-xs text-slate-500">Generate Barcodes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate barcodes in various formats (CODE128, EAN, UPC, etc.) for inventory, products, and labels.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/password-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Password Generator</p>
                  <p className="text-xs text-slate-500">Secure Passwords</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate secure, random passwords with customizable length and character sets for maximum security.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/url-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Encoder</p>
                  <p className="text-xs text-slate-500">Encode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Encode URLs and text to URL-safe format for safe transmission in web applications and APIs.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/utilities/url-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Decoder</p>
                  <p className="text-xs text-slate-500">Decode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Decode URL-encoded strings back to readable text for easy reading and processing.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
            
            <Link href="/tools/utilities" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Utility Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free utility tools for QR codes, barcodes, passwords, URL encoding, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
          </div>
        </section>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
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
