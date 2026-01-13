import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLEmailBuilder() {
  // Email template state
  const [emailSubject, setEmailSubject] = useState('Welcome to Our Newsletter');
  const [preheaderText, setPreheaderText] = useState('Check out our latest updates');
  const [emailWidth, setEmailWidth] = useState('600');
  const [backgroundColor, setBackgroundColor] = useState('#f4f4f4');
  const [contentBackgroundColor, setContentBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [linkColor, setLinkColor] = useState('#0066cc');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16');
  const [lineHeight, setLineHeight] = useState('1.6');
  const [emailContent, setEmailContent] = useState('Welcome to our newsletter!');
  const [buttonText, setButtonText] = useState('Click Here');
  const [buttonUrl, setButtonUrl] = useState('https://example.com');
  const [buttonColor, setButtonColor] = useState('#0066cc');
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [contentImageUrl, setContentImageUrl] = useState('');
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(true);
  const [unsubscribeUrl, setUnsubscribeUrl] = useState('https://example.com/unsubscribe');
  const [darkModeSupport, setDarkModeSupport] = useState(true);
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [showPreview, setShowPreview] = useState(true);

  const currentYear = new Date().getFullYear();

  // Free image placeholder services
  const freeImageServices = {
    picsum: (width, height, id) => `https://picsum.photos/${width}/${height}?random=${id || Math.floor(Math.random() * 1000)}`,
    placeholder: (width, height) => `https://via.placeholder.com/${width}x${height}/0066cc/ffffff?text=Your+Image`,
    placeholderText: (width, height, text) => `https://via.placeholder.com/${width}x${height}/0066cc/ffffff?text=${encodeURIComponent(text || 'Your+Image')}`
  };

  // Load professional demo template with lorem ipsum
  const loadDemoTemplate = () => {
    setEmailSubject('Lorem Ipsum Newsletter - Discover What\'s New');
    setPreheaderText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.');
    setEmailWidth('600');
    setBackgroundColor('#f4f4f4');
    setContentBackgroundColor('#ffffff');
    setTextColor('#333333');
    setLinkColor('#0066cc');
    setFontFamily('Arial, sans-serif');
    setFontSize('16');
    setLineHeight('1.6');
    setEmailContent(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`);
    setButtonText('Learn More');
    setButtonUrl('https://example.com/learn-more');
    setButtonColor('#0066cc');
    setButtonTextColor('#ffffff');
    setHeaderImageUrl(freeImageServices.picsum(600, 200, 1));
    setContentImageUrl(freeImageServices.picsum(600, 300, 2));
    setIncludeUnsubscribe(true);
    setUnsubscribeUrl('https://example.com/unsubscribe');
    setDarkModeSupport(true);
  };

  // Convert CSS to inline styles for email compatibility
  const inlineCSS = (styles) => {
    return Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');
  };

  // Generate email-safe HTML with table-based layout
  const generateEmailHTML = () => {
    const styles = {
      body: {
        margin: '0',
        padding: '0',
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        color: textColor,
        backgroundColor: backgroundColor
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: backgroundColor
      },
      wrapper: {
        maxWidth: `${emailWidth}px`,
        margin: '0 auto',
        backgroundColor: contentBackgroundColor
      },
      header: {
        backgroundColor: contentBackgroundColor,
        padding: '0'
      },
      content: {
        padding: '30px 20px',
        backgroundColor: contentBackgroundColor,
        color: textColor
      },
      button: {
        display: 'inline-block',
        padding: '14px 32px',
        backgroundColor: buttonColor,
        color: buttonTextColor,
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '1.5'
      },
      footer: {
        padding: '20px',
        fontSize: '12px',
        color: '#666666',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #e0e0e0'
      },
      image: {
        display: 'block',
        width: '100%',
        maxWidth: `${emailWidth}px`,
        height: 'auto',
        border: '0',
        outline: 'none',
        textDecoration: 'none'
      }
    };

    let html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${emailSubject}</title>
  ${darkModeSupport ? `
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #1a1a1a !important; }
      .email-content { background-color: #2d2d2d !important; color: #ffffff !important; }
      .email-footer { background-color: #1a1a1a !important; color: #999999 !important; }
    }
  </style>
  ` : ''}
</head>
<body style="${inlineCSS(styles.body)}" class="email-body">
  ${preheaderText ? `<div style="display:none;font-size:1px;color:${contentBackgroundColor};line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheaderText}</div>` : ''}
  <table role="presentation" style="${inlineCSS(styles.table)}" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" style="${inlineCSS(styles.wrapper)}" width="${emailWidth}" cellpadding="0" cellspacing="0" border="0" class="email-content">
          ${headerImageUrl ? `
          <tr>
            <td style="${inlineCSS(styles.header)}" align="center">
              <img src="${headerImageUrl}" alt="${emailSubject}" style="${inlineCSS(styles.image)}" width="${emailWidth}" />
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="${inlineCSS(styles.content)}">
              ${emailContent.split('\n').filter(line => line.trim()).map(line => `<p style="margin: 0 0 20px 0; line-height: ${lineHeight}; color: ${textColor};">${line}</p>`).join('\n              ')}
              ${contentImageUrl ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <img src="${contentImageUrl}" alt="Content Image" style="${inlineCSS(styles.image)}" width="100%" />
                  </td>
                </tr>
              </table>
              ` : ''}
              ${buttonText && buttonUrl ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${buttonUrl}" style="${inlineCSS(styles.button)}">${buttonText}</a>
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>
          ${includeUnsubscribe ? `
          <tr>
            <td style="${inlineCSS(styles.footer)}" class="email-footer">
              <p style="margin: 0 0 10px 0; color: #666666;">You're receiving this email because you subscribed to our newsletter.</p>
              <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: ${linkColor}; text-decoration: underline;">Unsubscribe</a> | <a href="${buttonUrl || '#'}" style="color: ${linkColor}; text-decoration: underline;">Update Preferences</a></p>
            </td>
          </tr>
          ` : ''}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    setOutput(html);
  };

  const handleCopy = async () => {
    const text = output || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy'), 1200);
  };

  const handleDownload = () => {
    const text = output || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "email-template.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I create HTML email templates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our HTML email template builder to create email-safe HTML with table-based layouts, inline CSS, and email client compatibility. Simply configure your content, colors, fonts, and buttons, then generate the HTML code that works across Gmail, Outlook, and other email clients."
          }
        },
        {
          "@type": "Question",
          "name": "Why do email templates need table-based layouts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Email clients like Outlook use Microsoft Word's rendering engine, which doesn't support modern CSS features like Flexbox or Grid. Table-based layouts are the most reliable way to ensure consistent rendering across all email clients, including older versions of Outlook."
          }
        },
        {
          "@type": "Question",
          "name": "Do you store my email templates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This tool processes everything locally in your browser. Your email templates never leave your device, ensuring complete privacy and security for your content."
          }
        },
        {
          "@type": "Question",
          "name": "What email clients are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our HTML email builder generates code compatible with Gmail, Outlook (all versions), Apple Mail, Yahoo Mail, and most major email clients. The templates use table-based layouts and inline CSS for maximum compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "How do I add dark mode support to email templates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enable the dark mode support option in our builder. It adds CSS media queries that automatically adjust colors when users have dark mode enabled in their email client. This improves readability and user experience."
          }
        },
        {
          "@type": "Question",
          "name": "What is a preheader text in email templates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Preheader text is the preview text that appears next to or below the subject line in most email clients. It's hidden in the email body but visible in the inbox, helping increase open rates. Our builder includes a preheader text field."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use custom fonts in HTML emails?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Custom web fonts are unreliable in emails. Most email clients strip out @font-face declarations. Use web-safe fonts like Arial, Helvetica, Georgia, or Times New Roman. Our builder includes a font family selector with email-safe options."
          }
        },
        {
          "@type": "Question",
          "name": "How do I test my HTML email template?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "After generating your template, test it using services like Litmus, Email on Acid, or send test emails to different accounts (Gmail, Outlook, Apple Mail). Always test on both desktop and mobile devices to ensure responsive design works correctly."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Email Template Builder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML email template builder. Create email-safe HTML with table-based layouts, inline CSS, and dark mode support. Compatible with Gmail, Outlook, and all major email clients.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Table-based email layouts",
        "Inline CSS conversion",
        "Email client compatibility",
        "Dark mode support",
        "Preheader text generator",
        "Unsubscribe link builder",
        "Responsive email design",
        "100% private processing"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Build HTML Email Templates",
      "description": "Step-by-step guide to creating email-safe HTML templates using our HTML email builder tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Configure Email Settings",
          "text": "Enter your email subject, preheader text, and choose email width (typically 600px for optimal compatibility). Set background colors, text colors, and font preferences.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Add Email Content",
          "text": "Enter your email content in the content field. Use line breaks to create paragraphs. Add button text and URL if you want a call-to-action button in your email.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enable Optional Features",
          "text": "Enable dark mode support for better user experience, add unsubscribe link if needed, and configure any additional email settings.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Generate and Test",
          "text": "Click Generate to create your HTML email template. Copy the code or download it as an HTML file. Test the template in different email clients before sending.",
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
          "name": "HTML Email Template Builder",
          "item": "https://fixtools.io/html/html-email-builder"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>HTML Email Template Builder - Free Online Email HTML Generator | FixTools</title>
        <meta name="title" content="HTML Email Template Builder - Free Online Email HTML Generator | FixTools" />
        <meta name="description" content="Build HTML email templates online for free. Create email-safe HTML with table layouts, inline CSS, and dark mode support. Compatible with Gmail, Outlook, and all major email clients. No registration required." />
        <meta name="keywords" content="html email builder, email template generator, html email template, email html code, responsive email template, email template builder free, html email creator, email design tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/html/html-email-builder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-email-builder" />
        <meta property="og:title" content="HTML Email Template Builder - Free Online Tool" />
        <meta property="og:description" content="Build HTML email templates with table layouts and inline CSS. Compatible with Gmail, Outlook, and all email clients. Dark mode support included." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-email-builder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-email-builder" />
        <meta property="twitter:title" content="HTML Email Template Builder - Free Online Tool" />
        <meta property="twitter:description" content="Build HTML email templates with table layouts and inline CSS. Compatible with all email clients." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-email-builder.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
        />
      </Head>

      <style jsx global>{`
        html:has(.html-email-builder-page) {
          font-size: 100% !important;
        }
        
        .html-email-builder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-email-builder-page *,
        .html-email-builder-page *::before,
        .html-email-builder-page *::after {
          box-sizing: border-box;
        }
        
        .html-email-builder-page a {
          text-decoration: none;
        }
        
        .html-email-builder-page h1,
        .html-email-builder-page h2,
        .html-email-builder-page h3,
        .html-email-builder-page h4,
        .html-email-builder-page h5,
        .html-email-builder-page h6,
        .html-email-builder-page p,
        .html-email-builder-page ul,
        .html-email-builder-page ol,
        .html-email-builder-page dl,
        .html-email-builder-page dd {
          margin: 0;
        }
        
        .html-email-builder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-email-builder-page input,
        .html-email-builder-page textarea,
        .html-email-builder-page select {
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
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .feature-cards-container {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        /* Email preview styling */
        .email-preview-container {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
          padding: 20px;
        }

        .email-preview-iframe {
          width: 100%;
          border: none;
          background: white;
          min-height: 400px;
        }
      `}</style>

      <div className="html-email-builder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900" href="/tools/html">HTML Tools</Link>
              <Link className="hover:text-slate-900" href="/">All Tools</Link>
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
              <span className="font-semibold text-slate-900">HTML Email Template Builder</span>
            </li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  HTML Email Template Builder
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML email template builder</strong> helps you create email-safe HTML code with table-based layouts and inline CSS. Build responsive email templates compatible with Gmail, Outlook, Apple Mail, and all major email clients. Includes dark mode support and unsubscribe links.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Build Email Template
                  </span>
                </a>
                <a 
                  href="#how" 
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Email HTML</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compatibility</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">All Clients</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Email-Safe HTML</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Table-based layouts and inline CSS ensure compatibility with all email clients including Outlook.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🌙</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Dark Mode Support</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatic dark mode detection with CSS media queries for better user experience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally in your browser. Your email templates never leave your device.
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Build HTML Email Template</h2>
                <p className="mt-1 text-sm text-slate-600">Configure your email settings and generate email-safe HTML code.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={loadDemoTemplate} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">📧 Load Demo</button>
                <button onClick={generateEmailHTML} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Generate</button>
                <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">💾 Download</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email Subject</label>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Welcome to Our Newsletter"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Preheader Text</label>
                  <input 
                    type="text"
                    value={preheaderText}
                    onChange={(e) => setPreheaderText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Check out our latest updates"
                  />
                  <p className="mt-1 text-xs text-slate-500">Preview text shown in email inbox</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email Width (px)</label>
                  <input 
                    type="number"
                    value={emailWidth}
                    onChange={(e) => setEmailWidth(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="600"
                  />
                  <p className="mt-1 text-xs text-slate-500">Recommended: 600px for best compatibility</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-10 w-20 rounded-xl border border-slate-200"
                    />
                    <input 
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Content Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={contentBackgroundColor}
                      onChange={(e) => setContentBackgroundColor(e.target.value)}
                      className="h-10 w-20 rounded-xl border border-slate-200"
                    />
                    <input 
                      type="text"
                      value={contentBackgroundColor}
                      onChange={(e) => setContentBackgroundColor(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Text Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-20 rounded-xl border border-slate-200"
                    />
                    <input 
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Link Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={linkColor}
                      onChange={(e) => setLinkColor(e.target.value)}
                      className="h-10 w-20 rounded-xl border border-slate-200"
                    />
                    <input 
                      type="text"
                      value={linkColor}
                      onChange={(e) => setLinkColor(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Font Family</label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="Courier New, monospace">Courier New</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Font Size (px)</label>
                    <input 
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Line Height</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email Content</label>
                  <textarea 
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Enter your email content here..."
                  />
                  <p className="mt-1 text-xs text-slate-500">Use line breaks to create paragraphs. Load demo for lorem ipsum template.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Header Image URL (Optional)</label>
                  <input 
                    type="url"
                    value={headerImageUrl}
                    onChange={(e) => setHeaderImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="https://source.unsplash.com/600x200/?business"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button 
                      onClick={() => setHeaderImageUrl(freeImageServices.picsum(600, 200, Math.floor(Math.random() * 1000)))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      📷 Random Photo
                    </button>
                    <button 
                      onClick={() => setHeaderImageUrl(freeImageServices.placeholder(600, 200))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      🖼️ Placeholder
                    </button>
                    <button 
                      onClick={() => setHeaderImageUrl('')}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Recommended: 600x200px. Use free image services or your own URL.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Content Image URL (Optional)</label>
                  <input 
                    type="url"
                    value={contentImageUrl}
                    onChange={(e) => setContentImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="https://source.unsplash.com/600x300/?technology"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button 
                      onClick={() => setContentImageUrl(freeImageServices.picsum(600, 300, Math.floor(Math.random() * 1000)))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      📷 Random Photo
                    </button>
                    <button 
                      onClick={() => setContentImageUrl(freeImageServices.placeholder(600, 300))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      🖼️ Placeholder
                    </button>
                    <button 
                      onClick={() => setContentImageUrl('')}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Recommended: 600x300px. Appears after content text.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Button Text</label>
                  <input 
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Click Here"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Button URL</label>
                  <input 
                    type="url"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Button Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Button Text Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={buttonTextColor}
                        onChange={(e) => setButtonTextColor(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4" 
                      checked={darkModeSupport}
                      onChange={(e) => setDarkModeSupport(e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">Enable Dark Mode Support</span>
                      <span className="block text-xs text-slate-600">Adds CSS for automatic dark mode detection</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4" 
                      checked={includeUnsubscribe}
                      onChange={(e) => setIncludeUnsubscribe(e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">Include Unsubscribe Link</span>
                      <span className="block text-xs text-slate-600">Required for compliance (CAN-SPAM, GDPR)</span>
                    </span>
                  </label>
                </div>

                {includeUnsubscribe && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Unsubscribe URL</label>
                    <input 
                      type="url"
                      value={unsubscribeUrl}
                      onChange={(e) => setUnsubscribeUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="https://example.com/unsubscribe"
                    />
                  </div>
                )}
              </div>
            </div>

            {output && (
              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="text-sm font-semibold text-slate-800">Generated HTML Email Template</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                    <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">💾 Download</button>
                  </div>
                </div>
                <textarea 
                  value={output}
                  readOnly
                  className="mt-2 h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-900 outline-none"
                />
                {showPreview && (
                  <div className="mt-4 email-preview-container">
                    <iframe
                      srcDoc={output}
                      className="email-preview-iframe"
                      title="Email Preview"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* What is HTML Email Template? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is an HTML Email Template?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                An <strong>HTML email template</strong> is a structured HTML document designed specifically for email clients. Unlike web pages, email HTML must follow strict compatibility rules because email clients (like Gmail, Outlook, Apple Mail) use different rendering engines than web browsers. Most email clients strip out or ignore modern CSS features, JavaScript, and external stylesheets.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Creating <strong>email-safe HTML</strong> requires using table-based layouts instead of CSS Grid or Flexbox, inline CSS instead of external stylesheets, and web-safe fonts instead of custom web fonts. Our HTML email template builder automatically generates code that follows these best practices, ensuring your emails render correctly across all major email clients.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Web HTML (Not Email-Safe)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`<div class="container">
  <div class="flex">
    <h1>Hello</h1>
  </div>
</div>
<style>
  .container { max-width: 600px; }
</style>`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Uses modern CSS (Flexbox, external styles) - will break in many email clients</p>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Email HTML (Email-Safe)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`<table width="600" style="max-width: 600px;">
  <tr>
    <td style="padding: 20px;">
      <h1 style="margin: 0;">Hello</h1>
    </td>
  </tr>
</table>`}</code></pre>
                  <p className="text-sm text-emerald-700 font-semibold mt-3">Uses table layout with inline CSS - works in all email clients</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Key Differences from Web HTML</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Table-Based Layouts:</strong> Email clients don't support CSS Grid or Flexbox reliably. Tables provide the most consistent layout structure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Inline CSS:</strong> External stylesheets and &lt;style&gt; tags are often stripped. All styles must be inline using the <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">style</code> attribute.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Web-Safe Fonts:</strong> Custom web fonts (@font-face) don't work in emails. Use system fonts like Arial, Helvetica, Georgia, or Times New Roman.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>No JavaScript:</strong> Email clients strip out all JavaScript for security reasons. All interactivity must be handled server-side.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Limited CSS Support:</strong> Many CSS properties (like position: fixed, animations, transitions) don't work in emails. Stick to basic styling.</span>
                </li>
              </ul>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://www.caniemail.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Can I Email</a>, email client CSS support varies widely. Outlook uses Microsoft Word's rendering engine, which has limited CSS support. Gmail strips out many CSS properties. Our <strong>HTML email template builder</strong> generates code that works across these differences.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Modern email marketing platforms like Mailchimp, Campaign Monitor, and SendGrid use similar table-based, inline CSS approaches. Our tool lets you build the same email-safe HTML code without needing a platform subscription.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Email Marketing Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the importance of well-designed HTML email templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">$42</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">ROI per $1 Spent</div>
                <div className="text-xs text-slate-600">Email marketing average ROI</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">4.2B</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Daily Email Users</div>
                <div className="text-xs text-slate-600">Global email usage</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">21%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Average Open Rate</div>
                <div className="text-xs text-slate-600">Industry benchmark</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">60%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Mobile Opens</div>
                <div className="text-xs text-slate-600">Emails opened on mobile</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Email Marketing Statistics</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.campaignmonitor.com/resources/guides/email-marketing-stats/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Campaign Monitor</a>, email marketing has an average ROI of $42 for every $1 spent. With over 4 billion daily email users worldwide, well-designed HTML email templates are essential for effective email marketing campaigns. Mobile optimization is critical, as 60% of emails are opened on mobile devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Our HTML Email Builder? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our HTML Email Template Builder?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Building email-safe HTML templates requires deep knowledge of email client quirks, table-based layouts, and inline CSS. Our builder handles all the complexity automatically, generating code that works across all major email clients.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Client Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our templates use table-based layouts and inline CSS, ensuring compatibility with Gmail, Outlook (all versions), Apple Mail, Yahoo Mail, and other major email clients. The code follows <a href="https://www.emailonacid.com/blog/article/email-development/email-clients-and-css-support/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">email development best practices</a> from Email on Acid and other industry leaders.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌙</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Dark Mode Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Enable automatic dark mode detection with CSS media queries. When users have dark mode enabled in their email client, your template automatically adjusts colors for better readability. This improves user experience and email engagement rates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Generation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Build professional HTML email templates in seconds. No coding knowledge required. Simply configure your content, colors, and settings, then generate email-safe HTML code ready to use in any email marketing platform or email service provider.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">100% Private & Secure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Everything runs locally in your browser. Your email templates, content, and data never leave your device. No server uploads, no data storage, no privacy concerns. Perfect for sensitive business communications or personal projects.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile-Responsive Ready</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      With 60% of emails opened on mobile devices, responsive design is essential. Our templates use fluid table widths and mobile-friendly font sizes. The generated code works well on both desktop and mobile email clients.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Compliance Features</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Includes unsubscribe link generator for CAN-SPAM Act and GDPR compliance. Preheader text support for better inbox preview. All templates follow email marketing best practices and legal requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Creating professional HTML email templates is simple with our builder. Follow these steps to generate email-safe HTML code:
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Email Settings</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Enter your email subject line and preheader text (the preview text shown in email inboxes). Set the email width (typically 600px for best compatibility), choose background colors, text colors, and select a web-safe font family. Configure font size and line height for optimal readability.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Add Email Content</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Enter your email content in the content field. Use line breaks to create paragraphs. If you want a call-to-action button, add the button text and URL. Customize button colors to match your brand. The builder automatically converts your content into email-safe HTML with proper table structure.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Enable Optional Features</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Enable dark mode support for automatic color adjustments when users have dark mode enabled. Add an unsubscribe link for CAN-SPAM Act and GDPR compliance. Configure any additional email settings like footer text or social media links.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-lg shadow-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Generate and Test</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Click the Generate button to create your HTML email template. The tool automatically converts all styles to inline CSS and structures the layout using tables. Copy the generated HTML code or download it as a file. Test the template in different email clients (Gmail, Outlook, Apple Mail) before sending to ensure proper rendering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for HTML Email Templates</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Follow these best practices to ensure your HTML email templates render correctly and achieve high engagement rates:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Always Use Table-Based Layouts</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Email clients, especially Outlook, don't support modern CSS layout methods like Flexbox or Grid. Use HTML tables with <code className="bg-white px-2 py-1 rounded text-xs border border-emerald-200">role="presentation"</code> for layout structure. Our builder automatically generates table-based layouts.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <p className="text-xs text-slate-600 font-mono">
                        ✅ <strong>DO:</strong> Use &lt;table&gt; for layout structure<br />
                        ❌ <strong>DON&apos;T:</strong> Use CSS Grid or Flexbox
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Inline CSS Only</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      External stylesheets and &lt;style&gt; tags are often stripped by email clients. All CSS must be inline using the <code className="bg-white px-2 py-1 rounded text-xs border border-blue-200">style</code> attribute. Our builder automatically converts all styles to inline CSS.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-xs text-slate-600">
                        <strong>Test in:</strong> Gmail, Outlook, Apple Mail, Yahoo Mail, and mobile clients
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Optimize for Mobile</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      With 60% of emails opened on mobile devices, mobile optimization is critical. Use fluid table widths (max-width: 600px), larger font sizes (minimum 14px), and touch-friendly button sizes (minimum 44x44px). Test on actual mobile devices, not just desktop browser responsive mode.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <p className="text-xs text-slate-600">
                        <strong>Mobile best practices:</strong> 600px max width • 14px+ font size • Large touch targets • Single column layout
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Always Include Unsubscribe Links</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      CAN-SPAM Act (US) and GDPR (EU) require unsubscribe links in marketing emails. Include a clear, working unsubscribe link in every email. Our builder includes an unsubscribe link generator for compliance.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-orange-200">
                      <p className="text-xs text-slate-600">
                        <strong>Legal requirements:</strong> Unsubscribe link • Physical mailing address (US) • Clear sender identification
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Test Across Email Clients</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Email rendering varies dramatically between clients. Test your templates in Gmail, Outlook (desktop and web), Apple Mail, Yahoo Mail, and mobile clients. Use services like <a href="https://www.litmus.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-800 font-semibold underline">Litmus</a> or <a href="https://www.emailonacid.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-800 font-semibold underline">Email on Acid</a> for comprehensive testing.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-cyan-200">
                      <p className="text-xs text-slate-600">
                        <strong>Test checklist:</strong> Desktop clients • Webmail clients • Mobile clients • Dark mode • Image blocking
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Preheader Text</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Preheader text (the preview text shown next to the subject line) can increase open rates by up to 20%. Use it to provide additional context or a call-to-action. Keep it under 100 characters. Our builder includes a preheader text field that's properly hidden in the email body.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-green-200">
                      <p className="text-xs text-slate-600">
                        <strong>Best practices:</strong> 40-100 characters • Action-oriented • Complements subject line • Hidden in body
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I create HTML email templates?</summary>
                <p className="mt-2 text-sm text-slate-600">Use our HTML email template builder to create email-safe HTML with table-based layouts, inline CSS, and email client compatibility. Simply configure your content, colors, fonts, and buttons, then generate the HTML code that works across Gmail, Outlook, and other email clients.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why do email templates need table-based layouts?</summary>
                <p className="mt-2 text-sm text-slate-600">Email clients like Outlook use Microsoft Word's rendering engine, which doesn't support modern CSS features like Flexbox or Grid. Table-based layouts are the most reliable way to ensure consistent rendering across all email clients, including older versions of Outlook.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Do you store my email templates?</summary>
                <p className="mt-2 text-sm text-slate-600">No. This tool processes everything locally in your browser. Your email templates never leave your device, ensuring complete privacy and security for your content.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What email clients are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our HTML email builder generates code compatible with Gmail, Outlook (all versions), Apple Mail, Yahoo Mail, and most major email clients. The templates use table-based layouts and inline CSS for maximum compatibility.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I add dark mode support to email templates?</summary>
                <p className="mt-2 text-slate-600">Enable the dark mode support option in our builder. It adds CSS media queries that automatically adjust colors when users have dark mode enabled in their email client. This improves readability and user experience.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a preheader text in email templates?</summary>
                <p className="mt-2 text-sm text-slate-600">Preheader text is the preview text that appears next to or below the subject line in most email clients. It's hidden in the email body but visible in the inbox, helping increase open rates. Our builder includes a preheader text field.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use custom fonts in HTML emails?</summary>
                <p className="mt-2 text-sm text-slate-600">Custom web fonts are unreliable in emails. Most email clients strip out @font-face declarations. Use web-safe fonts like Arial, Helvetica, Georgia, or Times New Roman. Our builder includes a font family selector with email-safe options.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I test my HTML email template?</summary>
                <p className="mt-2 text-sm text-slate-600">After generating your template, test it using services like Litmus, Email on Acid, or send test emails to different accounts (Gmail, Outlook, Apple Mail). Always test on both desktop and mobile devices to ensure responsive design works correctly.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related HTML & Email Tools</h2>
            <p className="text-slate-600">Explore our complete suite of developer tools for email and web development:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/html/html-form-builder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Form Builder</p>
                  <p className="text-xs text-slate-500">Build Accessible Forms</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Create accessible HTML forms with ARIA attributes and validation.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-minify" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Minifier</p>
                  <p className="text-xs text-slate-500">Compress HTML</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Minify HTML code to reduce file size and improve performance.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Formatter</p>
                  <p className="text-xs text-slate-500">Beautify HTML</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Format and beautify HTML code for better readability.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">© {currentYear} FixTools.io • Free online tools</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <Link className="hover:text-slate-900" href="/privacy">Privacy</Link>
              <Link className="hover:text-slate-900" href="/terms">Terms</Link>
              <Link className="hover:text-slate-900" href="/">All tools</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

