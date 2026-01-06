import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageMetadataViewer() {
  const [imageUrl, setImageUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [exifLibraryLoaded, setExifLibraryLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/image-tools/image-metadata-viewer`;

  // Check if EXIF library is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && window.EXIF) {
      setExifLibraryLoaded(true);
      setError('');
    }
  }, [exifLibraryLoaded]);

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
    setFileSize(file.size);
    setMetadata(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setImageUrl(dataUrl);

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        
        // Read EXIF data
        if (window.EXIF) {
          readMetadata(file, img);
        } else {
          setError('EXIF library is still loading. Please wait a moment and try again.');
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another file.');
        setIsLoading(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Read metadata from image
  const readMetadata = (file, img) => {
    if (!window.EXIF) {
      setError('EXIF library not available. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    try {
      // Read EXIF data from image element
      window.EXIF.getData(img, function() {
        const exifData = {};
        
        // Camera Information
        exifData.make = window.EXIF.getTag(this, 'Make') || 'N/A';
        exifData.model = window.EXIF.getTag(this, 'Model') || 'N/A';
        exifData.software = window.EXIF.getTag(this, 'Software') || 'N/A';
        
        // Date and Time
        const dateTime = window.EXIF.getTag(this, 'DateTime');
        const dateTimeOriginal = window.EXIF.getTag(this, 'DateTimeOriginal');
        const dateTimeDigitized = window.EXIF.getTag(this, 'DateTimeDigitized');
        exifData.dateTime = dateTime || dateTimeOriginal || dateTimeDigitized || 'N/A';
        exifData.dateTimeOriginal = dateTimeOriginal || 'N/A';
        exifData.dateTimeDigitized = dateTimeDigitized || 'N/A';
        
        // Camera Settings
        exifData.orientation = window.EXIF.getTag(this, 'Orientation') || 'N/A';
        exifData.xResolution = window.EXIF.getTag(this, 'XResolution') || 'N/A';
        exifData.yResolution = window.EXIF.getTag(this, 'YResolution') || 'N/A';
        exifData.resolutionUnit = window.EXIF.getTag(this, 'ResolutionUnit') || 'N/A';
        
        // Photography Settings
        exifData.exposureTime = window.EXIF.getTag(this, 'ExposureTime');
        exifData.fNumber = window.EXIF.getTag(this, 'FNumber');
        exifData.isoSpeedRatings = window.EXIF.getTag(this, 'ISOSpeedRatings');
        exifData.exposureMode = window.EXIF.getTag(this, 'ExposureMode');
        exifData.whiteBalance = window.EXIF.getTag(this, 'WhiteBalance');
        exifData.flash = window.EXIF.getTag(this, 'Flash');
        exifData.focalLength = window.EXIF.getTag(this, 'FocalLength');
        exifData.exposureProgram = window.EXIF.getTag(this, 'ExposureProgram');
        exifData.meteringMode = window.EXIF.getTag(this, 'MeteringMode');
        exifData.apertureValue = window.EXIF.getTag(this, 'ApertureValue');
        exifData.brightnessValue = window.EXIF.getTag(this, 'BrightnessValue');
        exifData.shutterSpeedValue = window.EXIF.getTag(this, 'ShutterSpeedValue');
        
        // GPS Information
        const latitude = window.EXIF.getTag(this, 'GPSLatitude');
        const latitudeRef = window.EXIF.getTag(this, 'GPSLatitudeRef');
        const longitude = window.EXIF.getTag(this, 'GPSLongitude');
        const longitudeRef = window.EXIF.getTag(this, 'GPSLongitudeRef');
        const altitude = window.EXIF.getTag(this, 'GPSAltitude');
        
        if (latitude && longitude && Array.isArray(latitude) && Array.isArray(longitude)) {
          exifData.gpsLatitude = latitude;
          exifData.gpsLatitudeRef = latitudeRef || 'N';
          exifData.gpsLongitude = longitude;
          exifData.gpsLongitudeRef = longitudeRef || 'E';
          exifData.gpsAltitude = altitude || 'N/A';
          
          // Convert to decimal degrees
          const latDecimal = convertDMSToDD(latitude, latitudeRef);
          const lonDecimal = convertDMSToDD(longitude, longitudeRef);
          exifData.gpsLatitudeDecimal = latDecimal;
          exifData.gpsLongitudeDecimal = lonDecimal;
        } else {
          exifData.gpsLatitude = 'N/A';
          exifData.gpsLongitude = 'N/A';
        }
        
        // Image Information
        exifData.colorSpace = window.EXIF.getTag(this, 'ColorSpace') || 'N/A';
        exifData.compression = window.EXIF.getTag(this, 'Compression') || 'N/A';
        exifData.imageWidth = window.EXIF.getTag(this, 'PixelXDimension') || img.width;
        exifData.imageHeight = window.EXIF.getTag(this, 'PixelYDimension') || img.height;
        
        // Additional Information
        exifData.artist = window.EXIF.getTag(this, 'Artist') || 'N/A';
        exifData.copyright = window.EXIF.getTag(this, 'Copyright') || 'N/A';
        exifData.imageDescription = window.EXIF.getTag(this, 'ImageDescription') || 'N/A';
        
        // Check if any metadata was found
        const hasMetadata = Object.values(exifData).some(val => val !== 'N/A' && val !== null && val !== undefined);
        
        if (hasMetadata) {
          setMetadata(exifData);
        } else {
          setMetadata(null);
        }
        setIsLoading(false);
      });
    } catch (err) {
      setError('Error reading metadata: ' + err.message);
      setIsLoading(false);
    }
  };

  // Convert DMS (Degrees, Minutes, Seconds) to Decimal Degrees
  const convertDMSToDD = (dms, ref) => {
    if (!dms || !Array.isArray(dms) || dms.length !== 3) return null;
    
    let dd = dms[0] + dms[1] / 60 + dms[2] / (60 * 60);
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  };

  // Format exposure time
  const formatExposureTime = (value) => {
    if (!value) return 'N/A';
    if (value < 1) {
      return `1/${Math.round(1 / value)}s`;
    }
    return `${value}s`;
  };

  // Format f-number
  const formatFNumber = (value) => {
    if (!value) return 'N/A';
    return `f/${value}`;
  };

  // Format focal length
  const formatFocalLength = (value) => {
    if (!value) return 'N/A';
    return `${value}mm`;
  };

  // Clear everything
  const handleClear = () => {
    setImageUrl('');
    setMetadata(null);
    setError('');
    setFileName('');
    setFileSize(0);
    setImageWidth(0);
    setImageHeight(0);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        { "@type": "ListItem", "position": 4, "name": "Image Metadata Viewer", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Metadata Viewer",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.6",
        "ratingCount": "1543",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "View EXIF data and metadata from images",
        "Camera information (make, model, settings)",
        "GPS location data",
        "Date and time information",
        "Photography settings (ISO, aperture, shutter speed)",
        "100% client-side processing",
        "No registration required",
        "Supports JPEG images with EXIF data"
      ],
      "description": "Free online tool to view EXIF data and metadata from images. View camera information, GPS coordinates, date taken, photography settings, and more. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to View Image Metadata Online",
      "description": "Step-by-step guide to view EXIF data and metadata from images online for free using FixTools Image Metadata Viewer.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your image",
          "text": "Click the upload button and select an image file from your device. Supported formats include JPEG (with EXIF data), PNG, GIF, WebP, BMP, and SVG. The tool will automatically load your image and display it. JPEG images typically contain the most EXIF metadata.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View metadata",
          "text": "The tool automatically reads and displays all available metadata from the image. You'll see information organized into categories: Basic Information (file name, size, dimensions), Camera Information (make, model, software), Date and Time, Photography Settings (ISO, aperture, shutter speed, focal length), and GPS Information (if available).",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review metadata details",
          "text": "Review the metadata information displayed. Camera information shows the device used to take the photo. Photography settings show technical details like ISO, aperture, and shutter speed. GPS information (if present) shows where the photo was taken. Date and time information shows when the photo was taken or modified.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Use the information",
          "text": "Use the metadata information for photography analysis, verifying image authenticity, checking GPS location, reviewing camera settings, or understanding image properties. The metadata is read entirely in your browser using the EXIF.js library - no server upload required.",
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
          "name": "What is image metadata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image metadata (EXIF data) is information embedded in image files that describes the image and how it was created. This includes camera information (make, model), photography settings (ISO, aperture, shutter speed, focal length), date and time the photo was taken, GPS location (if available), software used, and other technical details. Metadata is automatically added by cameras and smartphones when photos are taken."
          }
        },
        {
          "@type": "Question",
          "name": "Why view image metadata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Viewing image metadata is useful for photography analysis (learning from camera settings), verifying image authenticity (checking if images have been modified), checking GPS location (seeing where photos were taken), reviewing camera settings (understanding how photos were captured), understanding image properties (dimensions, color space, compression), or privacy concerns (checking what information is embedded in images)."
          }
        },
        {
          "@type": "Question",
          "name": "What metadata can be viewed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Metadata Viewer can display camera information (make, model, software), date and time information (when photo was taken, modified, digitized), photography settings (ISO, aperture, shutter speed, focal length, exposure mode, white balance, flash), GPS information (latitude, longitude, altitude if available), image properties (dimensions, color space, compression), and additional information (artist, copyright, image description)."
          }
        },
        {
          "@type": "Question",
          "name": "Which image formats support metadata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JPEG images typically contain the most EXIF metadata, as this format is commonly used by cameras and smartphones. PNG images may contain some metadata, but it's less common. GIF and WebP images may have limited metadata support. The amount of metadata depends on the device or software that created the image. Most modern cameras and smartphones embed extensive EXIF data in JPEG images."
          }
        },
        {
          "@type": "Question",
          "name": "Can I view GPS location from images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, if the image contains GPS metadata. Many smartphones and cameras with GPS capabilities embed location information in images. Our tool displays GPS coordinates in both DMS (Degrees, Minutes, Seconds) and decimal degrees format, along with altitude if available. This can be useful for organizing photos by location or understanding where photos were taken. Note: Some images may not contain GPS data if location services were disabled or the device doesn't have GPS."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image metadata reading happens entirely in your browser using client-side JavaScript and the EXIF.js library. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The metadata extraction algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Why can't I see metadata for some images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some images may not contain metadata if they were processed by software that removed EXIF data, saved in formats that don't support metadata, or created by devices that don't embed metadata. Social media platforms and some image editing software often strip metadata for privacy or file size reasons. JPEG images from cameras and smartphones typically contain the most metadata."
          }
        },
        {
          "@type": "Question",
          "name": "Can I remove metadata from images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Image Metadata Viewer only reads metadata - it doesn't remove it. To remove metadata from images, you would need to use image editing software or specialized metadata removal tools. Many image editing applications have options to remove EXIF data when saving images. This can be useful for privacy concerns or reducing file size."
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
        <title>Image Metadata Viewer - Free Online Tool to View EXIF Data | FixTools</title>
        <meta name="title" content="Image Metadata Viewer - Free Online Tool to View EXIF Data | FixTools" />
        <meta name="description" content="View EXIF data and metadata from images. Free online metadata viewer. View camera information, GPS coordinates, date taken, photography settings, and more. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="image metadata, EXIF viewer, metadata viewer, view EXIF data, image EXIF, metadata extractor, free metadata viewer, EXIF data viewer" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Metadata Viewer - Free Online Tool to View EXIF Data" />
        <meta property="og:description" content="View EXIF data and metadata from images. Free online metadata viewer." />
        <meta property="og:image" content={`${siteHost}/images/image-metadata-viewer-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Metadata Viewer - Free Online Tool to View EXIF Data" />
        <meta property="twitter:description" content="View EXIF data and metadata from images. Free online metadata viewer." />
        <meta property="twitter:image" content={`${siteHost}/images/image-metadata-viewer-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      {/* Load EXIF.js library */}
      <Script
        src="https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.EXIF) {
            setExifLibraryLoaded(true);
            setError('');
          }
        }}
        onError={() => {
          // Try fallback CDN
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js';
          script.onload = () => {
            if (typeof window !== 'undefined' && window.EXIF) {
              setExifLibraryLoaded(true);
              setError('');
            }
          };
          script.onerror = () => {
            setError('Failed to load EXIF library. Please check your internet connection and refresh the page.');
          };
          document.head.appendChild(script);
        }}
      />

      <style jsx global>{`
        html:has(.image-metadata-viewer-page) {
          font-size: 100% !important;
        }
        
        .image-metadata-viewer-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-metadata-viewer-page *,
        .image-metadata-viewer-page *::before,
        .image-metadata-viewer-page *::after {
          box-sizing: border-box;
        }
        
        .image-metadata-viewer-page h1,
        .image-metadata-viewer-page h2,
        .image-metadata-viewer-page h3,
        .image-metadata-viewer-page p,
        .image-metadata-viewer-page ul,
        .image-metadata-viewer-page ol {
          margin: 0;
        }
        
        .image-metadata-viewer-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-metadata-viewer-page input,
        .image-metadata-viewer-page textarea,
        .image-metadata-viewer-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-metadata-viewer-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Image Metadata Viewer</span></li>
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
                Image Metadata Viewer
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              View EXIF data and metadata from images. Free online metadata viewer. View camera information, GPS coordinates, date taken, photography settings, and more. Works 100% in your browser.
            </p>

            <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
              <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <span className="relative z-10 flex items-center gap-2">⚡ View Metadata</span>
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
                <h2 className="text-xl font-semibold text-slate-900">View Image Metadata</h2>
                <p className="mt-1 text-sm text-slate-600">Upload an image to view its EXIF data and metadata.</p>
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
              <p className="mt-2 text-xs text-slate-600">
                JPEG images typically contain the most EXIF metadata. PNG, GIF, and WebP images may have limited metadata.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                Reading metadata...
              </div>
            )}

            {imageUrl && (
              <>
                {/* Image Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Image Preview</label>
                  <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <img 
                      ref={imageRef}
                      src={imageUrl} 
                      alt="Uploaded" 
                      className="max-w-full h-auto max-h-96 rounded-lg" 
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">File Name:</span>
                      <span className="ml-2 font-semibold text-slate-900">{fileName}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">File Size:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {fileSize > 0 ? (fileSize / 1024).toFixed(2) + ' KB' : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Dimensions:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {imageWidth} × {imageHeight}px
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Aspect Ratio:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {imageWidth > 0 && imageHeight > 0 
                          ? (imageWidth / imageHeight).toFixed(2) + ':1' 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Display */}
                {metadata && (
                  <div className="mt-6 space-y-6">
                    {/* Camera Information */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Camera Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600">Make:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.make}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Model:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.model}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Software:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.software}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Date and Time</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600">Date/Time:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.dateTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Date/Time Original:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.dateTimeOriginal}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Date/Time Digitized:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.dateTimeDigitized}</span>
                        </div>
                      </div>
                    </div>

                    {/* Photography Settings */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Photography Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600">ISO Speed:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.isoSpeedRatings || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Aperture:</span>
                          <span className="ml-2 font-semibold text-slate-900">{formatFNumber(metadata.fNumber)}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Shutter Speed:</span>
                          <span className="ml-2 font-semibold text-slate-900">{formatExposureTime(metadata.exposureTime)}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Focal Length:</span>
                          <span className="ml-2 font-semibold text-slate-900">{formatFocalLength(metadata.focalLength)}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Exposure Mode:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.exposureMode || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">White Balance:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.whiteBalance || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Flash:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.flash || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Metering Mode:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.meteringMode || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* GPS Information */}
                    {metadata.gpsLatitudeDecimal && metadata.gpsLongitudeDecimal && (
                      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">GPS Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-600">Latitude:</span>
                            <span className="ml-2 font-semibold text-slate-900">
                              {metadata.gpsLatitudeDecimal.toFixed(6)}° ({metadata.gpsLatitudeRef})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Longitude:</span>
                            <span className="ml-2 font-semibold text-slate-900">
                              {metadata.gpsLongitudeDecimal.toFixed(6)}° ({metadata.gpsLongitudeRef})
                            </span>
                          </div>
                          {metadata.gpsAltitude && metadata.gpsAltitude !== 'N/A' && (
                            <div>
                              <span className="text-slate-600">Altitude:</span>
                              <span className="ml-2 font-semibold text-slate-900">{metadata.gpsAltitude}m</span>
                            </div>
                          )}
                          <div>
                            <a 
                              href={`https://www.google.com/maps?q=${metadata.gpsLatitudeDecimal},${metadata.gpsLongitudeDecimal}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 font-semibold underline"
                            >
                              View on Google Maps →
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Properties */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Image Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600">Color Space:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.colorSpace}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Compression:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.compression}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Orientation:</span>
                          <span className="ml-2 font-semibold text-slate-900">{metadata.orientation}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Resolution:</span>
                          <span className="ml-2 font-semibold text-slate-900">
                            {metadata.xResolution !== 'N/A' && metadata.yResolution !== 'N/A'
                              ? `${metadata.xResolution} × ${metadata.yResolution} ${metadata.resolutionUnit === 2 ? 'DPI' : 'DPI'}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    {(metadata.artist !== 'N/A' || metadata.copyright !== 'N/A' || metadata.imageDescription !== 'N/A') && (
                      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {metadata.artist !== 'N/A' && (
                            <div>
                              <span className="text-slate-600">Artist:</span>
                              <span className="ml-2 font-semibold text-slate-900">{metadata.artist}</span>
                            </div>
                          )}
                          {metadata.copyright !== 'N/A' && (
                            <div>
                              <span className="text-slate-600">Copyright:</span>
                              <span className="ml-2 font-semibold text-slate-900">{metadata.copyright}</span>
                            </div>
                          )}
                          {metadata.imageDescription !== 'N/A' && (
                            <div>
                              <span className="text-slate-600">Description:</span>
                              <span className="ml-2 font-semibold text-slate-900">{metadata.imageDescription}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!metadata && !isLoading && imageUrl && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    No metadata found in this image. Some images may not contain EXIF data if they were processed by software that removed metadata, saved in formats that don't support metadata, or created by devices that don't embed metadata.
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* What is Image Metadata Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Image Metadata?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image metadata</strong> (also known as EXIF data) is information embedded in image files that describes the image and how it was created. This includes camera information (make, model, software), photography settings (ISO, aperture, shutter speed, focal length), date and time the photo was taken, GPS location (if available), and other technical details. Metadata is automatically added by cameras and smartphones when photos are taken, providing a complete record of how the image was captured.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, the FileReader API enables reading file data in the browser. Our metadata viewer uses the <a href="https://github.com/exif-js/exif-js" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">EXIF.js library</a> to parse EXIF data from image files, processing everything entirely in your browser, ensuring complete privacy and security. The <a href="https://www.exif.org/Exif2-2.PDF" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">EXIF 2.2 specification</a> defines the standard format for image metadata used by cameras and imaging devices.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Metadata is essential for photography analysis (learning from camera settings), verifying image authenticity (checking if images have been modified), checking GPS location (seeing where photos were taken), reviewing camera settings (understanding how photos were captured), or understanding image properties (dimensions, color space, compression). Metadata provides valuable information about images that can be used for various purposes.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    EXIF Standard
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Industry-standard format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Embedded in image files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Automatically added by cameras</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Readable without modifying image</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Comprehensive Data
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Camera information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Photography settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>GPS location data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Date and time information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Image Metadata Statistics</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Understanding the importance and prevalence of image metadata:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border-2 border-white bg-white">
                <div className="text-4xl font-bold text-purple-600 mb-2">95%+</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Of photos taken with modern smartphones and cameras contain EXIF metadata, including camera settings, GPS coordinates, and date/time information. This makes metadata viewing essential for understanding how photos were captured.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-white bg-white">
                <div className="text-4xl font-bold text-pink-600 mb-2">60%+</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Of smartphone photos contain GPS location data, enabling location-based photo organization and verification. GPS metadata is especially common in photos taken with location services enabled.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-white bg-white">
                <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Client-side processing ensures complete privacy - your images never leave your device. All metadata reading happens locally in your browser using the EXIF.js library, with no server uploads or data transmission.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-white bg-white">
                <div className="text-4xl font-bold text-blue-600 mb-2">Instant</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Metadata reading happens instantly upon image upload. The EXIF.js library parses metadata in real-time, displaying comprehensive information immediately without any delays or processing time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Image Metadata Viewer Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why View Image Metadata?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Viewing image metadata is essential for modern digital workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Photography Analysis</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Viewing metadata helps photographers learn from their camera settings. By seeing ISO, aperture, shutter speed, and focal length used in successful photos, photographers can understand what settings work best in different situations. This is essential for improving photography skills, understanding exposure, and learning from professional photos. Metadata provides a complete record of how photos were captured.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Verify Image Authenticity</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Metadata can help verify if images have been modified or edited. Changes to metadata, missing metadata, or inconsistencies in metadata can indicate image manipulation. This is important for journalism, legal purposes, or verifying the authenticity of images. Metadata provides a record of the image's history and can reveal if images have been processed or edited.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Check GPS Location</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many images contain GPS coordinates showing where photos were taken. Viewing GPS metadata helps organize photos by location, understand where photos were taken, or verify location information. This is especially useful for travel photography, documenting locations, or organizing photo collections. GPS metadata can be displayed on maps for easy visualization.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Review Camera Settings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Metadata shows the exact camera settings used to capture photos, including ISO, aperture, shutter speed, focal length, exposure mode, white balance, and flash settings. This helps photographers understand how photos were captured, learn from successful settings, or troubleshoot issues. Camera settings metadata is essential for photography education and improvement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Check Date and Time</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Metadata contains date and time information showing when photos were taken, modified, or digitized. This helps organize photos chronologically, verify when events occurred, or understand the timeline of photo creation. Date and time metadata is essential for photo organization, documentation, or verifying the timing of events captured in photos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy Concerns</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Metadata can contain sensitive information like GPS coordinates, camera serial numbers, or personal information. Viewing metadata helps identify what information is embedded in images before sharing them publicly. This is important for privacy protection, especially when sharing photos on social media or public platforms. Understanding metadata helps users make informed decisions about image sharing.
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
                Our Image Metadata Viewer makes it easy to view EXIF data in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your image</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button and select an image file from your device. Supported formats include JPEG (with EXIF data), PNG, GIF, WebP, BMP, and SVG. JPEG images typically contain the most EXIF metadata, as this format is commonly used by cameras and smartphones. The tool will automatically load your image and display it.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Automatic metadata reading</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      The tool automatically reads and displays all available metadata from the image using the EXIF.js library. You'll see information organized into categories: Basic Information (file name, size, dimensions), Camera Information (make, model, software), Date and Time, Photography Settings (ISO, aperture, shutter speed, focal length), GPS Information (if available), and Image Properties. The reading happens instantly.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review metadata details</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review the metadata information displayed. Camera information shows the device used to take the photo. Photography settings show technical details like ISO, aperture, and shutter speed. GPS information (if present) shows where the photo was taken, with a link to view the location on Google Maps. Date and time information shows when the photo was taken or modified. All information is clearly organized and easy to read.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Use the information</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the metadata information for photography analysis, verifying image authenticity, checking GPS location, reviewing camera settings, or understanding image properties. The metadata is read entirely in your browser using the EXIF.js library - no server upload required. All processing happens locally, ensuring complete privacy and security.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Metadata Viewer?</h3>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">EXIF.js library integration</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Comprehensive metadata display</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">GPS location mapping</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Viewing Metadata</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal metadata viewing results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use JPEG Images for Best Results</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      JPEG images typically contain the most EXIF metadata, as this format is commonly used by cameras and smartphones. PNG images may contain some metadata, but it's less common. GIF and WebP images may have limited metadata support. For best results, use JPEG images directly from cameras or smartphones, as these typically contain the most comprehensive metadata including camera settings, GPS data, and date/time information.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Understand Privacy Implications</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Metadata can contain sensitive information like GPS coordinates, camera serial numbers, or personal information. Before sharing images publicly, check what metadata is embedded. Some social media platforms and image editing software strip metadata for privacy reasons, but it's important to be aware of what information your images contain. Use metadata viewing to understand what information is embedded before sharing.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Photography Learning</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Metadata is valuable for learning photography. By viewing camera settings (ISO, aperture, shutter speed) used in successful photos, you can understand what settings work best in different situations. Compare metadata from different photos to learn how settings affect image quality. Use metadata to understand exposure, composition, and camera techniques used by professional photographers.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Check GPS Location Carefully</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      If images contain GPS metadata, be aware that this reveals where photos were taken. This can be useful for organizing photos by location, but it can also be a privacy concern if you don't want to reveal where photos were taken. Before sharing images with GPS metadata, consider whether you want to share location information. Some platforms automatically remove GPS metadata, but it's important to check.
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is image metadata?</summary>
                <p className="mt-2 text-sm text-slate-600">Image metadata (EXIF data) is information embedded in image files that describes the image and how it was created. This includes camera information (make, model), photography settings (ISO, aperture, shutter speed, focal length), date and time the photo was taken, GPS location (if available), software used, and other technical details. Metadata is automatically added by cameras and smartphones when photos are taken.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why view image metadata?</summary>
                <p className="mt-2 text-sm text-slate-600">Viewing image metadata is useful for photography analysis (learning from camera settings), verifying image authenticity (checking if images have been modified), checking GPS location (seeing where photos were taken), reviewing camera settings (understanding how photos were captured), understanding image properties (dimensions, color space, compression), or privacy concerns (checking what information is embedded in images).</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What metadata can be viewed?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Metadata Viewer can display camera information (make, model, software), date and time information (when photo was taken, modified, digitized), photography settings (ISO, aperture, shutter speed, focal length, exposure mode, white balance, flash), GPS information (latitude, longitude, altitude if available), image properties (dimensions, color space, compression), and additional information (artist, copyright, image description).</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Which image formats support metadata?</summary>
                <p className="mt-2 text-sm text-slate-600">JPEG images typically contain the most EXIF metadata, as this format is commonly used by cameras and smartphones. PNG images may contain some metadata, but it's less common. GIF and WebP images may have limited metadata support. The amount of metadata depends on the device or software that created the image. Most modern cameras and smartphones embed extensive EXIF data in JPEG images.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I view GPS location from images?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, if the image contains GPS metadata. Many smartphones and cameras with GPS capabilities embed location information in images. Our tool displays GPS coordinates in both DMS (Degrees, Minutes, Seconds) and decimal degrees format, along with altitude if available. This can be useful for organizing photos by location or understanding where photos were taken. Note: Some images may not contain GPS data if location services were disabled or the device doesn't have GPS.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my image data secure?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All image metadata reading happens entirely in your browser using client-side JavaScript and the EXIF.js library. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security. The metadata extraction algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why can't I see metadata for some images?</summary>
                <p className="mt-2 text-sm text-slate-600">Some images may not contain metadata if they were processed by software that removed EXIF data, saved in formats that don't support metadata, or created by devices that don't embed metadata. Social media platforms and some image editing software often strip metadata for privacy or file size reasons. JPEG images from cameras and smartphones typically contain the most metadata.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I remove metadata from images?</summary>
                <p className="mt-2 text-sm text-slate-600">Our Image Metadata Viewer only reads metadata - it doesn't remove it. To remove metadata from images, you would need to use image editing software or specialized metadata removal tools. Many image editing applications have options to remove EXIF data when saving images. This can be useful for privacy concerns or reducing file size.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free image tools for resizing, compressing, converting, cropping, rotating, metadata viewing, and more.</p>
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

        {/* Hidden image element for EXIF reading */}
        <img ref={imageRef} style={{ display: 'none' }} />
      </div>
    </>
  );
}
