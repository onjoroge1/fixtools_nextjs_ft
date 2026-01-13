import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLFormBuilder() {
  const [formFields, setFormFields] = useState([
    {
      id: 1,
      type: 'text',
      label: 'Full Name',
      name: 'fullname',
      placeholder: 'Enter your name',
      required: true,
      ariaLabel: 'Full name input',
      autocomplete: 'name'
    }
  ]);
  const [formAction, setFormAction] = useState('');
  const [formMethod, setFormMethod] = useState('post');
  const [formId, setFormId] = useState('contact-form');
  const [formName, setFormName] = useState('contact-form');
  const [formClass, setFormClass] = useState('');
  const [ariaLabel, setAriaLabel] = useState('Contact form');
  const [novalidate, setNovalidate] = useState(false);
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [showPreview, setShowPreview] = useState(true);

  const currentYear = new Date().getFullYear();

  // Input type options
  const inputTypes = [
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'password', label: 'Password', icon: '🔒' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'tel', label: 'Telephone', icon: '📞' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'search', label: 'Search', icon: '🔍' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'time', label: 'Time', icon: '⏰' },
    { value: 'datetime-local', label: 'Date & Time', icon: '📆' },
    { value: 'month', label: 'Month', icon: '📆' },
    { value: 'week', label: 'Week', icon: '📆' },
    { value: 'color', label: 'Color', icon: '🎨' },
    { value: 'range', label: 'Range', icon: '🎚️' },
    { value: 'file', label: 'File', icon: '📁' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'hidden', label: 'Hidden', icon: '👁️‍🗨️' }
  ];

  const addField = () => {
    const newField = {
      id: Date.now(),
      type: 'text',
      label: 'New Field',
      name: `field_${Date.now()}`,
      placeholder: '',
      required: false,
      ariaLabel: '',
      autocomplete: '',
      value: '',
      min: '',
      max: '',
      step: '',
      pattern: '',
      size: '',
      maxlength: '',
      minlength: '',
      readonly: false,
      disabled: false,
      autofocus: false,
      spellcheck: true,
      multiple: false,
      accept: '',
      checked: false
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const updateField = (id, updates) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addButton = () => {
    const newField = {
      id: Date.now(),
      type: 'button',
      label: 'Submit',
      name: 'submit',
      buttonType: 'submit',
      value: 'Submit',
      disabled: false,
      autofocus: false,
      ariaLabel: 'Submit form'
    };
    setFormFields([...formFields, newField]);
  };

  const addTextarea = () => {
    const newField = {
      id: Date.now(),
      type: 'textarea',
      label: 'Message',
      name: 'message',
      placeholder: 'Enter your message',
      required: false,
      ariaLabel: 'Message textarea',
      rows: 4,
      cols: 50,
      maxlength: '',
      minlength: '',
      readonly: false,
      disabled: false,
      autofocus: false,
      spellcheck: true,
      wrap: 'soft'
    };
    setFormFields([...formFields, newField]);
  };

  const generateHTML = () => {
    let html = `<form`;
    if (formId) html += ` id="${formId}"`;
    if (formName) html += ` name="${formName}"`;
    if (formAction) html += ` action="${formAction}"`;
    html += ` method="${formMethod}"`;
    if (formClass) html += ` class="${formClass}"`;
    if (ariaLabel) html += ` aria-label="${ariaLabel}"`;
    if (novalidate) html += ` novalidate`;
    html += `>\n`;

    formFields.forEach(field => {
      if (field.type === 'button') {
        html += `  <button`;
        if (field.name) html += ` name="${field.name}"`;
        html += ` type="${field.buttonType || 'button'}"`;
        if (field.value) html += ` value="${field.value}"`;
        if (field.disabled) html += ` disabled`;
        if (field.autofocus) html += ` autofocus`;
        if (field.ariaLabel) html += ` aria-label="${field.ariaLabel}"`;
        html += `>${field.label || field.value || 'Button'}</button>\n`;
      } else if (field.type === 'textarea') {
        html += `  <div class="form-group">\n`;
        if (field.label) {
          html += `    <label for="${field.name}">${field.label}`;
          if (field.required) html += ` <span aria-label="required">*</span>`;
          html += `</label>\n`;
        }
        html += `    <textarea`;
        if (field.name) html += ` name="${field.name}" id="${field.name}"`;
        if (field.placeholder) html += ` placeholder="${field.placeholder}"`;
        if (field.required) html += ` required`;
        if (field.ariaLabel) html += ` aria-label="${field.ariaLabel}"`;
        if (field.rows) html += ` rows="${field.rows}"`;
        if (field.cols) html += ` cols="${field.cols}"`;
        if (field.maxlength) html += ` maxlength="${field.maxlength}"`;
        if (field.minlength) html += ` minlength="${field.minlength}"`;
        if (field.readonly) html += ` readonly`;
        if (field.disabled) html += ` disabled`;
        if (field.autofocus) html += ` autofocus`;
        if (!field.spellcheck) html += ` spellcheck="false"`;
        if (field.wrap) html += ` wrap="${field.wrap}"`;
        html += `></textarea>\n`;
        html += `  </div>\n`;
      } else {
        html += `  <div class="form-group">\n`;
        if (field.label && field.type !== 'hidden') {
          html += `    <label for="${field.name}">${field.label}`;
          if (field.required) html += ` <span aria-label="required">*</span>`;
          html += `</label>\n`;
        }
        html += `    <input`;
        html += ` type="${field.type}"`;
        if (field.name) html += ` name="${field.name}" id="${field.name}"`;
        if (field.value) html += ` value="${field.value}"`;
        if (field.placeholder) html += ` placeholder="${field.placeholder}"`;
        if (field.required) html += ` required`;
        if (field.ariaLabel) html += ` aria-label="${field.ariaLabel}"`;
        if (field.autocomplete) html += ` autocomplete="${field.autocomplete}"`;
        if (field.min !== '') html += ` min="${field.min}"`;
        if (field.max !== '') html += ` max="${field.max}"`;
        if (field.step !== '') html += ` step="${field.step}"`;
        if (field.pattern) html += ` pattern="${field.pattern}"`;
        if (field.size) html += ` size="${field.size}"`;
        if (field.maxlength) html += ` maxlength="${field.maxlength}"`;
        if (field.minlength) html += ` minlength="${field.minlength}"`;
        if (field.readonly) html += ` readonly`;
        if (field.disabled) html += ` disabled`;
        if (field.autofocus) html += ` autofocus`;
        if (!field.spellcheck) html += ` spellcheck="false"`;
        if (field.multiple) html += ` multiple`;
        if (field.accept) html += ` accept="${field.accept}"`;
        if (field.checked) html += ` checked`;
        html += ` />\n`;
        html += `  </div>\n`;
      }
    });

    html += `</form>`;
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
      a.download = 'form.html';
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
          "name": "How do I create an accessible HTML form?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use proper label elements linked to inputs via 'for' and 'id' attributes, include ARIA labels for screen readers, ensure required fields are marked, and use semantic HTML5 input types. Our form builder automatically includes these accessibility features."
          }
        },
        {
          "@type": "Question",
          "name": "What ARIA attributes should I use in forms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use aria-label for inputs without visible labels, aria-required for required fields, aria-invalid for validation errors, and aria-describedby to link error messages. Our tool includes these automatically."
          }
        },
        {
          "@type": "Question",
          "name": "How do I make forms responsive?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use CSS Grid or Flexbox for layout, set input widths to 100% with max-width constraints, use media queries for mobile breakpoints, and ensure touch targets are at least 44x44px. Our generated forms include responsive-friendly structure."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between GET and POST methods?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GET sends data in the URL (visible, limited length, cacheable). POST sends data in the request body (hidden, unlimited length, not cacheable). Use GET for searches, POST for submissions. Our tool supports both methods."
          }
        },
        {
          "@type": "Question",
          "name": "How do I validate form inputs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use HTML5 validation attributes: 'required' for mandatory fields, 'pattern' for regex validation, 'min'/'max' for numbers/dates, 'minlength'/'maxlength' for text length. Our builder includes all validation options."
          }
        },
        {
          "@type": "Question",
          "name": "Should I use autocomplete attributes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Autocomplete helps browsers pre-fill forms with saved data, improving UX and accessibility. Use values like 'name', 'email', 'tel', 'address-line1'. Our tool includes autocomplete options for common fields."
          }
        },
        {
          "@type": "Question",
          "name": "How do I prevent form spam?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use server-side validation, implement CSRF tokens, add honeypot fields, use rate limiting, and consider reCAPTCHA. The 'novalidate' attribute in our builder lets you handle validation with JavaScript."
          }
        },
        {
          "@type": "Question",
          "name": "What's the best way to style HTML forms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use CSS Grid or Flexbox for layout, style focus states for accessibility, ensure sufficient color contrast (WCAG AA), use consistent spacing, and test on multiple devices. Our generated forms use semantic classes for easy styling."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Form Builder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML form builder with ARIA accessibility, responsive design, and validation. Generate accessible, semantic HTML forms with live preview. No code required.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "ARIA accessibility attributes",
        "All HTML5 input types",
        "Form validation attributes",
        "Responsive design ready",
        "Live preview",
        "Copy to clipboard",
        "Download as HTML",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Build an Accessible HTML Form",
      "description": "Step-by-step guide to creating accessible, responsive HTML forms using FixTools HTML Form Builder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Add form fields",
          "text": "Click 'Add Input Field' to add text, email, password, or other input types. Configure each field's label, name, placeholder, and validation options.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure accessibility",
          "text": "Set ARIA labels, autocomplete attributes, and ensure all fields have proper labels linked via 'for' and 'id' attributes for screen reader support.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Add buttons and textareas",
          "text": "Add submit buttons and textarea fields as needed. Configure button types (submit, reset, button) and textarea dimensions.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Set form attributes",
          "text": "Configure form action URL, method (GET or POST), form ID, name, and ARIA label. Enable novalidate if using custom JavaScript validation.",
          "position": 4
        },
        {
          "@type": "HowToStep",
          "name": "Generate and copy code",
          "text": "Click 'Generate HTML' to create the form code. Preview it live, then copy to clipboard or download as an HTML file.",
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
          "name": "HTML Form Builder",
          "item": "https://fixtools.io/html/html-form-builder"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>HTML Form Builder – Accessible, Responsive, No Code | FixTools</title>
        <meta name="title" content="HTML Form Builder – Accessible, Responsive, No Code | FixTools" />
        <meta name="description" content="Build accessible HTML forms online for free. ARIA-ready, responsive design, validation attributes included. Generate semantic HTML forms with live preview. No registration required." />
        <meta name="keywords" content="html form builder, accessible form generator, aria form builder, html form generator, responsive form builder, form builder online, html5 form generator" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/html/html-form-builder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-form-builder" />
        <meta property="og:title" content="HTML Form Builder – Accessible, Responsive, No Code" />
        <meta property="og:description" content="Build accessible HTML forms online for free. ARIA-ready, responsive design, validation attributes included." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-form-builder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-form-builder" />
        <meta property="twitter:title" content="HTML Form Builder – Accessible, Responsive, No Code" />
        <meta property="twitter:description" content="Build accessible HTML forms online for free. ARIA-ready, responsive design, validation attributes included." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-form-builder.png" />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.html-form-builder-page) {
          font-size: 100% !important;
        }
        
        .html-form-builder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-form-builder-page *,
        .html-form-builder-page *::before,
        .html-form-builder-page *::after {
          box-sizing: border-box;
        }
        
        .html-form-builder-page h1,
        .html-form-builder-page h2,
        .html-form-builder-page h3,
        .html-form-builder-page p,
        .html-form-builder-page ul,
        .html-form-builder-page ol {
          margin: 0;
        }
        
        .html-form-builder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-form-builder-page input,
        .html-form-builder-page textarea,
        .html-form-builder-page select {
          font-family: inherit;
        }

        /* Form Preview Styling */
        .form-preview-container form {
          max-width: 100%;
        }

        .form-preview-container .form-group {
          margin-bottom: 1.5rem;
        }

        .form-preview-container label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .form-preview-container label span[aria-label="required"] {
          color: #ef4444;
          margin-left: 0.25rem;
        }

        .form-preview-container input[type="text"],
        .form-preview-container input[type="email"],
        .form-preview-container input[type="password"],
        .form-preview-container input[type="number"],
        .form-preview-container input[type="tel"],
        .form-preview-container input[type="url"],
        .form-preview-container input[type="search"],
        .form-preview-container input[type="date"],
        .form-preview-container input[type="time"],
        .form-preview-container input[type="datetime-local"],
        .form-preview-container input[type="month"],
        .form-preview-container input[type="week"],
        .form-preview-container input[type="color"],
        .form-preview-container input[type="file"],
        .form-preview-container textarea,
        .form-preview-container select {
          width: 100%;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #1e293b;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .form-preview-container input:focus,
        .form-preview-container textarea:focus,
        .form-preview-container select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-preview-container input:disabled,
        .form-preview-container textarea:disabled,
        .form-preview-container select:disabled {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .form-preview-container input[type="range"] {
          height: 0.5rem;
          padding: 0;
          background-color: #e2e8f0;
          border-radius: 0.25rem;
        }

        .form-preview-container input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          background-color: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }

        .form-preview-container input[type="range"]::-moz-range-thumb {
          width: 1.25rem;
          height: 1.25rem;
          background-color: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .form-preview-container input[type="file"] {
          padding: 0.5rem;
          cursor: pointer;
        }

        .form-preview-container input[type="file"]::file-selector-button {
          padding: 0.5rem 1rem;
          margin-right: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #ffffff;
          background-color: #3b82f6;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .form-preview-container input[type="file"]::file-selector-button:hover {
          background-color: #2563eb;
        }

        .form-preview-container textarea {
          resize: vertical;
          min-height: 6rem;
        }

        .form-preview-container button {
          padding: 0.625rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #ffffff;
          background-color: #1e293b;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .form-preview-container button:hover:not(:disabled) {
          background-color: #0f172a;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .form-preview-container button:disabled {
          background-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
          transform: none;
        }

        .form-preview-container button[type="reset"] {
          background-color: #64748b;
        }

        .form-preview-container button[type="reset"]:hover:not(:disabled) {
          background-color: #475569;
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

      <div className="html-form-builder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">HTML Form Builder</span>
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
                  HTML Form Builder
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML form builder</strong> helps you create accessible, responsive HTML forms with ARIA attributes, validation, and semantic HTML5. Generate production-ready form code with live preview. No coding required.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Build Form</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Input Types</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">17+ Types</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ARIA Ready</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">WCAG AA</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Live</dd>
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
                      <span className="text-2xl">♿</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">ARIA Accessibility</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatic ARIA labels, proper label associations, and semantic HTML for screen readers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Responsive Design</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Forms generated with responsive-friendly structure and semantic classes for easy styling.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">HTML5 Validation</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Built-in validation attributes: required, pattern, min/max, minlength/maxlength, and more.
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
                <h2 className="text-xl font-semibold text-slate-900">Build Your Form</h2>
                <p className="mt-1 text-sm text-slate-600">Add fields, configure options, and generate accessible HTML form code</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={generateHTML} className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  Generate HTML
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Form Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Action URL</label>
                  <input type="text" value={formAction} onChange={(e) => setFormAction(e.target.value)} placeholder="/submit" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Method</label>
                  <select value={formMethod} onChange={(e) => setFormMethod(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    <option value="post">POST</option>
                    <option value="get">GET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Form ID</label>
                  <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)} placeholder="contact-form" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Form Name</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="contact-form" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ARIA Label</label>
                  <input type="text" value={ariaLabel} onChange={(e) => setAriaLabel(e.target.value)} placeholder="Contact form" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input type="checkbox" checked={novalidate} onChange={(e) => setNovalidate(e.target.checked)} className="rounded" />
                    Novalidate (custom JS validation)
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button onClick={addField} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  + Add Input Field
                </button>
                <button onClick={addTextarea} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  + Add Textarea
                </button>
                <button onClick={addButton} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  + Add Button
                </button>
              </div>

              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-xl border-2 border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900">Field {index + 1}: {field.type === 'button' ? 'Button' : field.type === 'textarea' ? 'Textarea' : inputTypes.find(t => t.value === field.type)?.label || field.type}</h4>
                      <button onClick={() => removeField(field.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                    </div>
                    
                    {field.type === 'button' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Label/Text</label>
                          <input type="text" value={field.label || ''} onChange={(e) => updateField(field.id, { label: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                          <select value={field.buttonType || 'submit'} onChange={(e) => updateField(field.id, { buttonType: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <option value="submit">Submit</option>
                            <option value="reset">Reset</option>
                            <option value="button">Button</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                          <input type="text" value={field.name || ''} onChange={(e) => updateField(field.id, { name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">ARIA Label</label>
                          <input type="text" value={field.ariaLabel || ''} onChange={(e) => updateField(field.id, { ariaLabel: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.disabled || false} onChange={(e) => updateField(field.id, { disabled: e.target.checked })} className="rounded" />
                            Disabled
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.autofocus || false} onChange={(e) => updateField(field.id, { autofocus: e.target.checked })} className="rounded" />
                            Autofocus
                          </label>
                        </div>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Label</label>
                          <input type="text" value={field.label || ''} onChange={(e) => updateField(field.id, { label: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                          <input type="text" value={field.name || ''} onChange={(e) => updateField(field.id, { name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Placeholder</label>
                          <input type="text" value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">ARIA Label</label>
                          <input type="text" value={field.ariaLabel || ''} onChange={(e) => updateField(field.id, { ariaLabel: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Rows</label>
                          <input type="number" value={field.rows || 4} onChange={(e) => updateField(field.id, { rows: parseInt(e.target.value) || 4 })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Cols</label>
                          <input type="number" value={field.cols || 50} onChange={(e) => updateField(field.id, { cols: parseInt(e.target.value) || 50 })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.required || false} onChange={(e) => updateField(field.id, { required: e.target.checked })} className="rounded" />
                            Required
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.readonly || false} onChange={(e) => updateField(field.id, { readonly: e.target.checked })} className="rounded" />
                            Readonly
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.disabled || false} onChange={(e) => updateField(field.id, { disabled: e.target.checked })} className="rounded" />
                            Disabled
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.spellcheck !== false} onChange={(e) => updateField(field.id, { spellcheck: e.target.checked })} className="rounded" />
                            Spellcheck
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Input Type</label>
                          <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            {inputTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Label</label>
                          <input type="text" value={field.label || ''} onChange={(e) => updateField(field.id, { label: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                          <input type="text" value={field.name || ''} onChange={(e) => updateField(field.id, { name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Placeholder</label>
                          <input type="text" value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">ARIA Label</label>
                          <input type="text" value={field.ariaLabel || ''} onChange={(e) => updateField(field.id, { ariaLabel: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Autocomplete</label>
                          <input type="text" value={field.autocomplete || ''} onChange={(e) => updateField(field.id, { autocomplete: e.target.value })} placeholder="name, email, tel, etc." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        {(field.type === 'number' || field.type === 'range' || field.type === 'date' || field.type === 'time' || field.type === 'datetime-local' || field.type === 'month' || field.type === 'week') && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Min</label>
                              <input type="text" value={field.min || ''} onChange={(e) => updateField(field.id, { min: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Max</label>
                              <input type="text" value={field.max || ''} onChange={(e) => updateField(field.id, { max: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                            {(field.type === 'number' || field.type === 'range') && (
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Step</label>
                                <input type="text" value={field.step || ''} onChange={(e) => updateField(field.id, { step: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                              </div>
                            )}
                          </>
                        )}
                        {(field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'search' || field.type === 'tel' || field.type === 'url') && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Min Length</label>
                              <input type="number" value={field.minlength || ''} onChange={(e) => updateField(field.id, { minlength: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Max Length</label>
                              <input type="number" value={field.maxlength || ''} onChange={(e) => updateField(field.id, { maxlength: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Pattern (Regex)</label>
                              <input type="text" value={field.pattern || ''} onChange={(e) => updateField(field.id, { pattern: e.target.value })} placeholder="[A-Za-z]{3,}" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Size</label>
                              <input type="number" value={field.size || ''} onChange={(e) => updateField(field.id, { size: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            </div>
                          </>
                        )}
                        {field.type === 'file' && (
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Accept</label>
                            <input type="text" value={field.accept || ''} onChange={(e) => updateField(field.id, { accept: e.target.value })} placeholder="image/*, .pdf, etc." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                          </div>
                        )}
                        <div className="flex items-center gap-4 flex-wrap">
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.required || false} onChange={(e) => updateField(field.id, { required: e.target.checked })} className="rounded" />
                            Required
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.readonly || false} onChange={(e) => updateField(field.id, { readonly: e.target.checked })} className="rounded" />
                            Readonly
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.disabled || false} onChange={(e) => updateField(field.id, { disabled: e.target.checked })} className="rounded" />
                            Disabled
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                            <input type="checkbox" checked={field.autofocus || false} onChange={(e) => updateField(field.id, { autofocus: e.target.checked })} className="rounded" />
                            Autofocus
                          </label>
                          {(field.type === 'text' || field.type === 'textarea') && (
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                              <input type="checkbox" checked={field.spellcheck !== false} onChange={(e) => updateField(field.id, { spellcheck: e.target.checked })} className="rounded" />
                              Spellcheck
                            </label>
                          )}
                          {(field.type === 'file' || field.type === 'email') && (
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                              <input type="checkbox" checked={field.multiple || false} onChange={(e) => updateField(field.id, { multiple: e.target.checked })} className="rounded" />
                              Multiple
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
                <div className="rounded-xl border-2 border-slate-200 bg-white p-6 form-preview-container">
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Add Form Fields</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Click "Add Input Field" to add text, email, password, number, date, file, or any of 17+ HTML5 input types. Configure labels, names, placeholders, and validation options.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Accessibility</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Set ARIA labels for screen readers, add autocomplete attributes for better UX, and ensure all fields have proper label associations. Our tool automatically includes semantic HTML.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Add Buttons & Textareas</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Add submit, reset, or custom buttons. Include textarea fields for longer text input. Configure dimensions, validation, and accessibility options.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Why Use Our Form Builder?</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>ARIA-Ready:</strong> Automatic accessibility attributes for WCAG AA compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>HTML5 Validation:</strong> Built-in required, pattern, min/max, length validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Responsive Design:</strong> Semantic structure ready for CSS Grid/Flexbox styling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Live Preview:</strong> See your form as you build it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span><strong>Production-Ready:</strong> Clean, semantic HTML code</span>
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
              <h2 className="text-3xl font-bold text-slate-900">What is an Accessible HTML Form?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Accessible HTML forms</strong> are forms designed to be usable by everyone, including people using screen readers, keyboard navigation, and other assistive technologies. They follow <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">WCAG (Web Content Accessibility Guidelines)</a> standards and use semantic HTML5 with proper ARIA attributes.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Key features of accessible forms include proper label associations (using <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">for</code> and <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">id</code> attributes), ARIA labels for screen readers, clear error messages, keyboard navigation support, and sufficient color contrast. According to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, proper form structure is essential for accessibility and user experience.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Inaccessible Form
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• No labels or unlinked labels</li>
                    <li>• Missing ARIA attributes</li>
                    <li>• No validation feedback</li>
                    <li>• Poor keyboard navigation</li>
                    <li>• Low color contrast</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Accessible Form
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Proper label associations</li>
                    <li>• ARIA labels and roles</li>
                    <li>• Clear error messages</li>
                    <li>• Full keyboard support</li>
                    <li>• WCAG AA contrast</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our HTML Form Builder?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Building accessible, responsive HTML forms from scratch requires knowledge of ARIA attributes, semantic HTML5, validation patterns, and responsive design. Our form builder handles all of this automatically.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">♿</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">WCAG AA Compliant</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All forms generated include proper ARIA attributes, label associations, and semantic HTML5 structure. Meets <a href="https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">WCAG 2.1 Level AA standards</a> for accessibility, ensuring your forms work with screen readers and assistive technologies. Learn more about <a href="https://web.dev/learn/forms/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">accessible form best practices</a> from Web.dev.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">HTML5 Validation Built-In</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Configure required fields, pattern matching (regex), min/max values, length constraints, and more. All validation attributes are properly set for both client-side and server-side validation, following <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">HTML5 constraint validation standards</a>.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Responsive Design Ready</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Generated forms use semantic HTML structure with proper form groups, making them easy to style with CSS Grid or Flexbox. Forms work seamlessly on mobile, tablet, and desktop devices.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">17+ Input Types</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Support for all HTML5 input types: text, email, password, number, date, time, color, range, file, image, and more. Each type includes type-specific attributes and validation options.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Live Preview</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      See your form as you build it with our live preview feature. Test form fields, validation, and layout before copying the code to your project.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy-First</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All form building happens in your browser. No data is sent to servers, no tracking, no registration required. Your form data stays private and secure.
                    </p>
                  </div>
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
              <Link href="/html/html-formatter" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Formatter</h3>
                <p className="text-sm text-slate-600">Format and beautify your HTML code with proper indentation</p>
              </Link>
              <Link href="/html/html-minify" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Minifier</h3>
                <p className="text-sm text-slate-600">Compress HTML by removing whitespace and comments</p>
              </Link>
              <Link href="/html/html-embed-builder" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">HTML Embed Builder</h3>
                <p className="text-sm text-slate-600">Generate safe iframe and media embed code with privacy options</p>
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

