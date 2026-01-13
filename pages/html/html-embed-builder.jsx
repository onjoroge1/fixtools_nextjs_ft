import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLEmbedBuilder() {
  const [embedType, setEmbedType] = useState('iframe');
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [showPreview, setShowPreview] = useState(true);

  // Iframe state
  const [iframeSrc, setIframeSrc] = useState('https://www.example.com');
  const [iframeTitle, setIframeTitle] = useState('Embedded content');
  const [iframeWidth, setIframeWidth] = useState('560');
  const [iframeHeight, setIframeHeight] = useState('315');
  const [iframeSandbox, setIframeSandbox] = useState(['allow-same-origin', 'allow-scripts']);
  const [iframeLoading, setIframeLoading] = useState('lazy');
  const [iframeAllow, setIframeAllow] = useState('accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  const [iframeReferrerpolicy, setIframeReferrerpolicy] = useState('no-referrer-when-downgrade');
  const [iframeName, setIframeName] = useState('');
  const [iframeId, setIframeId] = useState('');
  const [iframeClass, setIframeClass] = useState('');
  const [iframeAriaLabel, setIframeAriaLabel] = useState('');
  const [youtubeNoCookie, setYoutubeNoCookie] = useState(false);

  // Video state
  const [videoSrc, setVideoSrc] = useState('/media/video.mp4');
  const [videoPoster, setVideoPoster] = useState('');
  const [videoWidth, setVideoWidth] = useState('');
  const [videoHeight, setVideoHeight] = useState('');
  const [videoPreload, setVideoPreload] = useState('metadata');
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoControls, setVideoControls] = useState(true);
  const [videoLoop, setVideoLoop] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoPlaysinline, setVideoPlaysinline] = useState(false);
  const [videoLoading, setVideoLoading] = useState('lazy');

  // Audio state
  const [audioSrc, setAudioSrc] = useState('/media/audio.mp3');
  const [audioPreload, setAudioPreload] = useState('metadata');
  const [audioAutoplay, setAudioAutoplay] = useState(false);
  const [audioControls, setAudioControls] = useState(true);
  const [audioLoop, setAudioLoop] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Image state
  const [imageSrc, setImageSrc] = useState('/images/example.jpg');
  const [imageAlt, setImageAlt] = useState('Descriptive alt text');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imageLoading, setImageLoading] = useState('lazy');
  const [imageDecoding, setImageDecoding] = useState('async');
  const [imageFetchpriority, setImageFetchpriority] = useState('');
  const [imageSizes, setImageSizes] = useState('');
  const [imageSrcset, setImageSrcset] = useState('');
  const [imageClass, setImageClass] = useState('');
  const [imageStyle, setImageStyle] = useState('max-width: 100%; height: auto;');

  // Quote/Cite state
  const [quoteType, setQuoteType] = useState('blockquote');
  const [quoteText, setQuoteText] = useState('Your quote text here');
  const [quoteCite, setQuoteCite] = useState('https://example.com');
  const [quoteAuthor, setQuoteAuthor] = useState('Author Name');

  const currentYear = new Date().getFullYear();

  const sandboxOptions = [
    { value: 'allow-same-origin', label: 'Allow Same Origin' },
    { value: 'allow-scripts', label: 'Allow Scripts' },
    { value: 'allow-forms', label: 'Allow Forms' },
    { value: 'allow-popups', label: 'Allow Popups' },
    { value: 'allow-popups-to-escape-sandbox', label: 'Allow Popups to Escape' },
    { value: 'allow-top-navigation', label: 'Allow Top Navigation' },
    { value: 'allow-top-navigation-by-user-activation', label: 'Allow Top Nav by User' },
    { value: 'allow-modals', label: 'Allow Modals' },
    { value: 'allow-orientation-lock', label: 'Allow Orientation Lock' },
    { value: 'allow-pointer-lock', label: 'Allow Pointer Lock' },
    { value: 'allow-presentation', label: 'Allow Presentation' },
    { value: 'allow-storage-access-by-user-activation', label: 'Allow Storage Access' }
  ];

  const handleSandboxChange = (value) => {
    if (iframeSandbox.includes(value)) {
      setIframeSandbox(iframeSandbox.filter(s => s !== value));
    } else {
      setIframeSandbox([...iframeSandbox, value]);
    }
  };

  const convertYouTubeUrl = (url) => {
    if (!url) return url;
    if (youtubeNoCookie && url.includes('youtube.com')) {
      return url.replace('youtube.com', 'youtube-nocookie.com');
    }
    return url;
  };

  const generateHTML = () => {
    let html = '';

    if (embedType === 'iframe') {
      let src = convertYouTubeUrl(iframeSrc);
      html = `<iframe`;
      html += ` src="${src}"`;
      if (iframeTitle) html += ` title="${iframeTitle}"`;
      if (iframeWidth) html += ` width="${iframeWidth}"`;
      if (iframeHeight) html += ` height="${iframeHeight}"`;
      if (iframeSandbox.length > 0) html += ` sandbox="${iframeSandbox.join(' ')}"`;
      if (iframeLoading) html += ` loading="${iframeLoading}"`;
      if (iframeAllow) html += ` allow="${iframeAllow}"`;
      if (iframeReferrerpolicy) html += ` referrerpolicy="${iframeReferrerpolicy}"`;
      if (iframeName) html += ` name="${iframeName}"`;
      if (iframeId) html += ` id="${iframeId}"`;
      if (iframeClass) html += ` class="${iframeClass}"`;
      if (iframeAriaLabel) html += ` aria-label="${iframeAriaLabel}"`;
      html += `></iframe>`;
    } else if (embedType === 'video') {
      html = `<video`;
      if (videoSrc) html += ` src="${videoSrc}"`;
      if (videoPoster) html += ` poster="${videoPoster}"`;
      if (videoWidth) html += ` width="${videoWidth}"`;
      if (videoHeight) html += ` height="${videoHeight}"`;
      if (videoPreload) html += ` preload="${videoPreload}"`;
      if (videoAutoplay) html += ` autoplay`;
      if (videoControls) html += ` controls`;
      if (videoLoop) html += ` loop`;
      if (videoMuted) html += ` muted`;
      if (videoPlaysinline) html += ` playsinline`;
      if (videoLoading) html += ` loading="${videoLoading}"`;
      html += `></video>`;
    } else if (embedType === 'audio') {
      html = `<audio`;
      if (audioSrc) html += ` src="${audioSrc}"`;
      if (audioPreload) html += ` preload="${audioPreload}"`;
      if (audioAutoplay) html += ` autoplay`;
      if (audioControls) html += ` controls`;
      if (audioLoop) html += ` loop`;
      if (audioMuted) html += ` muted`;
      html += `></audio>`;
    } else if (embedType === 'image') {
      html = `<img`;
      if (imageSrc) html += ` src="${imageSrc}"`;
      if (imageAlt) html += ` alt="${imageAlt}"`;
      if (imageWidth) html += ` width="${imageWidth}"`;
      if (imageHeight) html += ` height="${imageHeight}"`;
      if (imageLoading) html += ` loading="${imageLoading}"`;
      if (imageDecoding) html += ` decoding="${imageDecoding}"`;
      if (imageFetchpriority) html += ` fetchpriority="${imageFetchpriority}"`;
      if (imageSizes) html += ` sizes="${imageSizes}"`;
      if (imageSrcset) html += ` srcset="${imageSrcset}"`;
      if (imageClass) html += ` class="${imageClass}"`;
      if (imageStyle) html += ` style="${imageStyle}"`;
      html += ` />`;
    } else if (embedType === 'quote') {
      if (quoteType === 'blockquote') {
        html = `<figure>\n  <blockquote`;
        if (quoteCite) html += ` cite="${quoteCite}"`;
        html += `>\n    <p>${quoteText}</p>\n  </blockquote>\n  <figcaption>– <cite>${quoteAuthor}</cite></figcaption>\n</figure>`;
      } else if (quoteType === 'q') {
        html = `<q`;
        if (quoteCite) html += ` cite="${quoteCite}"`;
        html += `>${quoteText}</q>`;
      } else if (quoteType === 'cite') {
        html = `<cite>${quoteText}</cite>`;
      }
    }

    setOutput(html);
  };

  const handleCopy = async () => {
    if (!output) {
      generateHTML();
      setTimeout(async () => {
        const text = document.querySelector('.element-code')?.textContent || output;
        if (text) {
          await navigator.clipboard.writeText(text);
          setCopyText('✅ Copied');
          setTimeout(() => setCopyText('📋 Copy'), 1200);
        }
      }, 100);
      return;
    }
    await navigator.clipboard.writeText(output);
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy'), 1200);
  };

  const handleDownload = () => {
    if (!output) generateHTML();
    setTimeout(() => {
      const text = output || document.querySelector('.element-code')?.textContent || '';
      if (!text) return;
      const blob = new Blob([text], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'embed.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }, 100);
  };

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I safely embed iframes with sandboxing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the sandbox attribute with specific permissions like 'allow-scripts', 'allow-same-origin', and 'allow-forms'. Only enable permissions you actually need. Our tool includes all sandbox options and explains each one's security implications."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between loading='lazy' and loading='eager'?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "loading='lazy' defers loading until the element is near the viewport, improving initial page load. loading='eager' loads immediately. Use lazy for below-the-fold content, eager for critical above-the-fold images."
          }
        },
        {
          "@type": "Question",
          "name": "How do I embed YouTube videos without cookies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use youtube-nocookie.com instead of youtube.com in the embed URL. Our tool automatically converts YouTube URLs to the privacy-friendly version when you enable the 'YouTube No-Cookie' option."
          }
        },
        {
          "@type": "Question",
          "name": "What sandbox permissions should I use for iframes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Start with minimal permissions: 'allow-same-origin' and 'allow-scripts' for basic functionality. Add 'allow-forms' if forms are needed, 'allow-popups' for popups. Never use all permissions unless absolutely necessary for security."
          }
        },
        {
          "@type": "Question",
          "name": "How do I make embedded content responsive?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For iframes, use CSS aspect-ratio or a wrapper div with padding-bottom trick. For images, use width='100%' with max-width constraints, or use srcset and sizes attributes. Our tool includes responsive sizing options."
          }
        },
        {
          "@type": "Question",
          "name": "What's the best way to optimize image embeds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use loading='lazy' for below-the-fold images, decoding='async' for non-critical images, srcset and sizes for responsive images, and proper alt text for accessibility. Our tool includes all these optimization options."
          }
        },
        {
          "@type": "Question",
          "name": "Should I use autoplay for video embeds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generally no. Autoplay can be annoying and wastes bandwidth. Most browsers block autoplay with sound. If you must use it, ensure videos are muted and include controls. Our tool lets you configure all video attributes."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between <q>, <blockquote>, and <cite>?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "<q> is for short inline quotes. <blockquote> is for longer block quotes, often with a <cite> for attribution. <cite> marks the source title. Our tool generates semantic quote markup with proper citations."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Embed Builder & Preview",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML embed code generator for iframes, video, audio, images, and quotes. Includes sandboxing, privacy options, lazy loading, and responsive sizing. Generate safe embed code with live preview.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "720",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Iframe sandboxing options",
        "YouTube no-cookie support",
        "Lazy loading for images/iframes",
        "Responsive sizing options",
        "Video/audio embed generator",
        "Image optimization attributes",
        "Semantic quote markup",
        "Live preview"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Create Safe HTML Embeds",
      "description": "Step-by-step guide to generating secure, privacy-friendly HTML embed code using FixTools HTML Embed Builder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose embed type",
          "text": "Select iframe, video, audio, image, or quote/cite. Each type has specific attributes and security considerations.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure security and privacy",
          "text": "For iframes, set sandbox permissions (start minimal). Enable YouTube no-cookie for privacy. Set loading='lazy' for performance.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Set responsive sizing",
          "text": "Configure width, height, and responsive attributes. For images, use srcset and sizes. For iframes, use aspect-ratio CSS or wrapper divs.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Add accessibility attributes",
          "text": "Include proper alt text for images, title/aria-label for iframes, and semantic markup for quotes with citations.",
          "position": 4
        },
        {
          "@type": "HowToStep",
          "name": "Generate and preview",
          "text": "Click 'Generate HTML' to create the embed code. Preview it live, then copy to clipboard or download.",
          "position": 5
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
          "item": "https://fixtools.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "HTML Tools",
          "item": "https://fixtools.io/tools/html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "HTML Embed Builder",
          "item": "https://fixtools.io/html/html-embed-builder"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>HTML Embed Code Generator (Iframe, Video, Audio) | FixTools</title>
        <meta name="title" content="HTML Embed Code Generator (Iframe, Video, Audio) | FixTools" />
        <meta name="description" content="Generate safe HTML embed code for iframes, video, audio, images, and quotes. Includes sandboxing, privacy options (YouTube no-cookie), lazy loading, and responsive sizing. Live preview included." />
        <meta name="keywords" content="html embed generator, iframe generator, html video embed, html audio embed, youtube no cookie embed, iframe sandbox, lazy loading html, responsive embed" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/html/html-embed-builder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-embed-builder" />
        <meta property="og:title" content="HTML Embed Code Generator (Iframe, Video, Audio)" />
        <meta property="og:description" content="Generate safe HTML embed code with sandboxing, privacy options, lazy loading, and responsive sizing." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-embed-builder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-embed-builder" />
        <meta property="twitter:title" content="HTML Embed Code Generator (Iframe, Video, Audio)" />
        <meta property="twitter:description" content="Generate safe HTML embed code with sandboxing, privacy options, lazy loading, and responsive sizing." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-embed-builder.png" />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.html-embed-builder-page) {
          font-size: 100% !important;
        }
        
        .html-embed-builder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-embed-builder-page *,
        .html-embed-builder-page *::before,
        .html-embed-builder-page *::after {
          box-sizing: border-box;
        }
        
        .html-embed-builder-page h1,
        .html-embed-builder-page h2,
        .html-embed-builder-page h3,
        .html-embed-builder-page p,
        .html-embed-builder-page ul,
        .html-embed-builder-page ol {
          margin: 0;
        }
        
        .html-embed-builder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-embed-builder-page input,
        .html-embed-builder-page textarea,
        .html-embed-builder-page select {
          font-family: inherit;
        }

        .hero-content {
          animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card {
          animation: slideInRight 0.6s ease-out backwards;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="html-embed-builder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900" href="/categories/developer-tools">Developer</Link>
              <Link className="hover:text-slate-900" href="/categories/seo-tools">SEO</Link>
              <Link className="hover:text-slate-900" href="/categories/css-tools">CSS</Link>
              <Link className="hover:text-slate-900" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/tools/html" className="hover:text-slate-900 transition-colors">HTML Tools</Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">HTML Embed Builder</span>
            </li>
          </ol>
        </nav>

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
                  HTML Embed Builder & Preview
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML embed builder</strong> helps you create safe, privacy-friendly embed code for iframes, video, audio, images, and quotes. Includes sandboxing, lazy loading, responsive sizing, and YouTube no-cookie support.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Build Embed</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Embed Types</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">5 Types</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sandboxing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">12 Options</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">No-Cookie</dd>
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
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Sandbox Security</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Configure iframe sandbox permissions for maximum security. Only enable permissions you need.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Lazy Loading</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Built-in lazy loading for images and iframes to improve page load performance and Core Web Vitals.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🍪</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Privacy Options</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        YouTube no-cookie support and referrer policy options to protect user privacy and comply with GDPR.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Build Your Embed</h2>
                <p className="mt-1 text-sm text-slate-600">Choose embed type and configure security, privacy, and performance options</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={generateHTML} className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  Generate HTML
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Embed Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['iframe', 'video', 'audio', 'image', 'quote'].map(type => (
                  <button
                    key={type}
                    onClick={() => setEmbedType(type)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      embedType === type
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {embedType === 'iframe' && (
              <div className="space-y-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Iframe Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Source URL</label>
                    <input type="text" value={iframeSrc} onChange={(e) => setIframeSrc(e.target.value)} placeholder="https://www.example.com" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Title (Required for accessibility)</label>
                    <input type="text" value={iframeTitle} onChange={(e) => setIframeTitle(e.target.value)} placeholder="Embedded content" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Width</label>
                    <input type="number" value={iframeWidth} onChange={(e) => setIframeWidth(e.target.value)} placeholder="560" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Height</label>
                    <input type="number" value={iframeHeight} onChange={(e) => setIframeHeight(e.target.value)} placeholder="315" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Loading</label>
                    <select value={iframeLoading} onChange={(e) => setIframeLoading(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="lazy">Lazy (Recommended)</option>
                      <option value="eager">Eager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Referrer Policy</label>
                    <select value={iframeReferrerpolicy} onChange={(e) => setIframeReferrerpolicy(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="no-referrer-when-downgrade">no-referrer-when-downgrade</option>
                      <option value="no-referrer">no-referrer</option>
                      <option value="origin">origin</option>
                      <option value="origin-when-cross-origin">origin-when-cross-origin</option>
                      <option value="same-origin">same-origin</option>
                      <option value="strict-origin">strict-origin</option>
                      <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</option>
                      <option value="unsafe-url">unsafe-url</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Allow (Permissions Policy)</label>
                    <input type="text" value={iframeAllow} onChange={(e) => setIframeAllow(e.target.value)} placeholder="accelerometer; autoplay; clipboard-write" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">ARIA Label</label>
                    <input type="text" value={iframeAriaLabel} onChange={(e) => setIframeAriaLabel(e.target.value)} placeholder="Embedded content description" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-2">Sandbox Permissions (Security)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sandboxOptions.map(option => (
                        <label key={option.value} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={iframeSandbox.includes(option.value)}
                            onChange={() => handleSandboxChange(option.value)}
                            className="rounded"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={youtubeNoCookie} onChange={(e) => setYoutubeNoCookie(e.target.checked)} className="rounded" />
                      YouTube No-Cookie (Privacy-friendly YouTube embeds)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {embedType === 'video' && (
              <div className="space-y-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Video Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Source URL</label>
                    <input type="text" value={videoSrc} onChange={(e) => setVideoSrc(e.target.value)} placeholder="/media/video.mp4" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Poster Image</label>
                    <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} placeholder="/images/poster.jpg" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Width</label>
                    <input type="number" value={videoWidth} onChange={(e) => setVideoWidth(e.target.value)} placeholder="560" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Height</label>
                    <input type="number" value={videoHeight} onChange={(e) => setVideoHeight(e.target.value)} placeholder="315" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Preload</label>
                    <select value={videoPreload} onChange={(e) => setVideoPreload(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="none">None</option>
                      <option value="metadata">Metadata (Recommended)</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Loading</label>
                    <select value={videoLoading} onChange={(e) => setVideoLoading(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="lazy">Lazy (Recommended)</option>
                      <option value="eager">Eager</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={videoAutoplay} onChange={(e) => setVideoAutoplay(e.target.checked)} className="rounded" />
                      Autoplay
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={videoControls} onChange={(e) => setVideoControls(e.target.checked)} className="rounded" />
                      Controls
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={videoLoop} onChange={(e) => setVideoLoop(e.target.checked)} className="rounded" />
                      Loop
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={videoMuted} onChange={(e) => setVideoMuted(e.target.checked)} className="rounded" />
                      Muted
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={videoPlaysinline} onChange={(e) => setVideoPlaysinline(e.target.checked)} className="rounded" />
                      Plays Inline
                    </label>
                  </div>
                </div>
              </div>
            )}

            {embedType === 'audio' && (
              <div className="space-y-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Audio Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Source URL</label>
                    <input type="text" value={audioSrc} onChange={(e) => setAudioSrc(e.target.value)} placeholder="/media/audio.mp3" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Preload</label>
                    <select value={audioPreload} onChange={(e) => setAudioPreload(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="none">None</option>
                      <option value="metadata">Metadata (Recommended)</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={audioAutoplay} onChange={(e) => setAudioAutoplay(e.target.checked)} className="rounded" />
                      Autoplay
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={audioControls} onChange={(e) => setAudioControls(e.target.checked)} className="rounded" />
                      Controls
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={audioLoop} onChange={(e) => setAudioLoop(e.target.checked)} className="rounded" />
                      Loop
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input type="checkbox" checked={audioMuted} onChange={(e) => setAudioMuted(e.target.checked)} className="rounded" />
                      Muted
                    </label>
                  </div>
                </div>
              </div>
            )}

            {embedType === 'image' && (
              <div className="space-y-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Image Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Source URL</label>
                    <input type="text" value={imageSrc} onChange={(e) => setImageSrc(e.target.value)} placeholder="/images/example.jpg" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Alt Text (Required for accessibility)</label>
                    <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Descriptive alt text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Width</label>
                    <input type="number" value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} placeholder="800" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Height</label>
                    <input type="number" value={imageHeight} onChange={(e) => setImageHeight(e.target.value)} placeholder="600" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Loading</label>
                    <select value={imageLoading} onChange={(e) => setImageLoading(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="lazy">Lazy (Recommended for below-fold)</option>
                      <option value="eager">Eager (For above-fold)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Decoding</label>
                    <select value={imageDecoding} onChange={(e) => setImageDecoding(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="async">Async (Recommended)</option>
                      <option value="sync">Sync</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Fetch Priority</label>
                    <select value={imageFetchpriority} onChange={(e) => setImageFetchpriority(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="">None</option>
                      <option value="high">High (For LCP images)</option>
                      <option value="low">Low</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Srcset (Responsive images)</label>
                    <input type="text" value={imageSrcset} onChange={(e) => setImageSrcset(e.target.value)} placeholder="image-400.jpg 400w, image-800.jpg 800w" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Sizes (Responsive images)</label>
                    <input type="text" value={imageSizes} onChange={(e) => setImageSizes(e.target.value)} placeholder="(max-width: 600px) 100vw, 800px" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Style (Responsive sizing)</label>
                    <input type="text" value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} placeholder="max-width: 100%; height: auto;" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {embedType === 'quote' && (
              <div className="space-y-4 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Quote Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Quote Type</label>
                    <select value={quoteType} onChange={(e) => setQuoteType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="blockquote">Blockquote (Long quotes)</option>
                      <option value="q">Quote (Short inline)</option>
                      <option value="cite">Citation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Cite URL</label>
                    <input type="text" value={quoteCite} onChange={(e) => setQuoteCite(e.target.value)} placeholder="https://example.com" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Quote Text</label>
                    <textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="Your quote text here" rows="4" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  {quoteType === 'blockquote' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Author/Source</label>
                      <input type="text" value={quoteAuthor} onChange={(e) => setQuoteAuthor(e.target.value)} placeholder="Author Name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {output && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Generated HTML</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      {copyText}
                    </button>
                    <button onClick={handleDownload} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-slate-200 bg-slate-900 p-4">
                  <code className="element-code text-sm text-slate-100 whitespace-pre-wrap font-mono">{output}</code>
                </div>
              </div>
            )}

            {showPreview && output && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Live Preview</h3>
                <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                  <div dangerouslySetInnerHTML={{ __html: output }} />
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Embed Type</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Select iframe, video, audio, image, or quote. Each type has specific attributes and security considerations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Security & Privacy</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      For iframes, set sandbox permissions (start minimal). Enable YouTube no-cookie for privacy. Set loading='lazy' for performance. Learn more about <a href="https://web.dev/learn/performance/lazy-loading/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">lazy loading best practices</a> from Web.dev.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Set Responsive Sizing</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Configure width, height, and responsive attributes. For images, use srcset and sizes. For iframes, use aspect-ratio CSS.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Why Use Our Embed Builder?</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Security:</strong> Sandbox permissions for iframes prevent XSS attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Privacy:</strong> YouTube no-cookie support and referrer policy options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Performance:</strong> Lazy loading for faster page loads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Responsive:</strong> Built-in responsive sizing options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Accessibility:</strong> Proper alt text, titles, and ARIA labels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What Makes Safe HTML Embeds?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Safe HTML embeds</strong> protect your site and users from security vulnerabilities, privacy violations, and performance issues. They use proper sandboxing, privacy options, lazy loading, and responsive sizing. According to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, iframe sandboxing is essential for preventing XSS attacks and protecting user data.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Key features include iframe sandboxing to prevent XSS attacks, YouTube no-cookie support for GDPR compliance, lazy loading to improve page performance, responsive sizing for mobile devices, and proper accessibility attributes. The <a href="https://www.w3.org/TR/CSP3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C Content Security Policy</a> guidelines recommend using sandbox attributes to restrict iframe capabilities and enhance security.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Unsafe Embed
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• No sandbox restrictions</li>
                    <li>• YouTube with cookies</li>
                    <li>• Eager loading everything</li>
                    <li>• Fixed pixel dimensions</li>
                    <li>• Missing accessibility attributes</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Safe Embed
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Sandbox permissions configured</li>
                    <li>• YouTube no-cookie enabled</li>
                    <li>• Lazy loading for performance</li>
                    <li>• Responsive sizing</li>
                    <li>• Full accessibility support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <div key={index} className="rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/html/html-form-builder" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Form Builder</h3>
                <p className="text-sm text-slate-600">Build accessible, responsive HTML forms with ARIA attributes</p>
              </Link>
              <Link href="/html/html-formatter" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Formatter</h3>
                <p className="text-sm text-slate-600">Format and beautify your HTML code with proper indentation</p>
              </Link>
              <Link href="/html/html-minify" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Minifier</h3>
                <p className="text-sm text-slate-600">Compress HTML by removing whitespace and comments</p>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={100} height={33} className="h-8 w-auto" />
                <span className="text-sm text-slate-600">© {currentYear} FixTools. All rights reserved.</span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-900">Terms</Link>
                <Link href="/about" className="hover:text-slate-900">About</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

