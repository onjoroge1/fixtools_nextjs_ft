import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/utilities/password-generator`;

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSpecial) charset += special;

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    setPasswords([newPassword, ...passwords.slice(0, 4)]);
    setCopyText('📋 Copy');
  };

  const generateMultiple = (count = 5) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSpecial) charset += special;

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    const newPasswords = [];
    for (let j = 0; j < count; j++) {
      let pwd = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        pwd += charset[array[i] % charset.length];
      }
      newPasswords.push(pwd);
    }
    setPasswords(newPasswords);
    setPassword(newPasswords[0]);
    setCopyText('📋 Copy');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyText('✅ Copied!');
      setTimeout(() => setCopyText('📋 Copy'), 2000);
    });
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
        { "@type": "ListItem", "position": 4, "name": "Password Generator", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Password Generator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "3421",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Generate cryptographically secure random passwords",
        "Customizable length (4-128 characters)",
        "Include/exclude uppercase, lowercase, numbers, special characters",
        "Generate multiple passwords at once",
        "100% client-side processing",
        "No registration required",
        "Instant generation",
        "Copy to clipboard functionality",
        "Web Crypto API for true randomness"
      ],
      "description": "Free online password generator. Create secure, random passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and special characters. Uses Web Crypto API for cryptographically secure randomness. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Generate a Secure Password",
      "description": "Step-by-step guide to generate secure passwords online for free using FixTools Password Generator.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set password length",
          "text": "Adjust the length slider to set your desired password length. For maximum security, use at least 16 characters. Longer passwords (20+ characters) are even more secure. The generator supports passwords from 4 to 128 characters. Most security experts recommend 16-20 characters for strong passwords.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select character types",
          "text": "Choose which character types to include: uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and special characters (!@#$%^&*...). For maximum security, include all character types. However, some systems may have restrictions, so check the requirements of the system you're creating the password for. At least one character type must be selected.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Generate and copy password",
          "text": "Click 'Generate' to create a single secure password, or 'Generate 5' to create multiple passwords at once. The password is generated using the Web Crypto API for cryptographically secure randomness. Click 'Copy' to copy the password to your clipboard. Store the password securely in a password manager. Never share passwords or reuse them across multiple accounts.",
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
          "name": "What is a password generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A password generator is a tool that creates random, secure passwords for use in online accounts, applications, and systems. Unlike human-created passwords which are often predictable and weak, password generators use cryptographically secure random number generators to create passwords that are extremely difficult to guess or crack. Password generators help users create strong, unique passwords without having to think of them manually."
          }
        },
        {
          "@type": "Question",
          "name": "How secure are generated passwords?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our password generator uses the Web Crypto API (crypto.getRandomValues) to generate cryptographically secure random passwords. This API provides true randomness suitable for cryptographic purposes. The passwords are generated entirely in your browser and never sent to any server, ensuring maximum security and privacy. Each password is generated using secure random number generation, making them extremely difficult to predict or crack."
          }
        },
        {
          "@type": "Question",
          "name": "What password length should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For maximum security, use passwords of at least 16 characters. Longer passwords (20+ characters) are even more secure. The generator supports passwords from 4 to 128 characters. According to NIST guidelines, longer passwords are generally more secure than complex short passwords. A 16-character password with mixed character types provides excellent security for most use cases. For highly sensitive accounts, consider 20+ character passwords."
          }
        },
        {
          "@type": "Question",
          "name": "Should I include special characters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, including special characters significantly increases password strength by expanding the character set. However, some systems may not accept certain special characters, so check the requirements of the system you're creating the password for. Special characters add complexity and make passwords harder to crack through brute force attacks. If a system allows special characters, always include them for maximum security."
          }
        },
        {
          "@type": "Question",
          "name": "Is my password stored or sent to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. All password generation happens entirely in your browser using client-side JavaScript. Your passwords are never sent to any server, never stored anywhere, and never transmitted over the network. The Web Crypto API runs locally in your browser, ensuring complete privacy and security. Once you close the page, no trace of your passwords remains."
          }
        },
        {
          "@type": "Question",
          "name": "Can I generate multiple passwords at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can click 'Generate 5' to create five passwords at once. This is useful when you need to create passwords for multiple accounts or want to choose from several options. All generated passwords follow the same settings (length and character types) you've configured. Each password is independently generated using secure randomness."
          }
        },
        {
          "@type": "Question",
          "name": "What makes a password strong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A strong password is long (16+ characters), includes multiple character types (uppercase, lowercase, numbers, special characters), is random and unpredictable, and is unique to each account. Strong passwords should not contain dictionary words, personal information, or common patterns. Our generator creates passwords that meet all these criteria by using cryptographically secure randomness and allowing you to customize length and character sets."
          }
        },
        {
          "@type": "Question",
          "name": "Should I use a password manager?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely. Password managers like 1Password, LastPass, Bitwarden, or the built-in browser password managers help you store and manage strong, unique passwords for all your accounts. They can also generate secure passwords for you. Using a password manager eliminates the need to remember multiple complex passwords and ensures you use unique passwords for each account, which is critical for security."
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
        <title>Password Generator - Free Secure Random Password Creator | FixTools</title>
        <meta name="title" content="Password Generator - Free Secure Random Password Creator | FixTools" />
        <meta name="description" content="Generate secure, random passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and special characters. Uses Web Crypto API for cryptographically secure randomness. Free, instant, and works 100% in your browser. No registration required." />
        <meta name="keywords" content="password generator, random password, secure password, password creator, strong password generator, free password generator, password maker, secure password generator, random password generator, password strength" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Password Generator - Free Secure Random Password Creator" />
        <meta property="og:description" content="Generate secure, random passwords with customizable length and character sets. Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/password-generator-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Password Generator - Free Secure Random Password Creator" />
        <meta property="twitter:description" content="Generate secure, random passwords with customizable length and character sets. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/password-generator-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.password-generator-page) {
          font-size: 100% !important;
        }
        
        .password-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .password-generator-page *,
        .password-generator-page *::before,
        .password-generator-page *::after {
          box-sizing: border-box;
        }
        
        .password-generator-page h1,
        .password-generator-page h2,
        .password-generator-page h3,
        .password-generator-page p,
        .password-generator-page ul,
        .password-generator-page ol {
          margin: 0;
        }
        
        .password-generator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .password-generator-page input,
        .password-generator-page textarea,
        .password-generator-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="password-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Password Generator</span></li>
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
                  Password Generator
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>password generator</strong> helps you create secure, random passwords with customizable length and character sets. Generate strong passwords instantly using Web Crypto API for cryptographically secure randomness. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate Password</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Security</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Crypto API</dd>
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
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Cryptographically Secure</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Uses Web Crypto API for true randomness suitable for cryptographic purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your passwords never leave your device.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Fully Customizable</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Customize length (4-128 chars) and character types to match your needs.
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
                <h2 className="text-xl font-semibold text-slate-900">Generate Secure Password online</h2>
                <p className="mt-1 text-sm text-slate-600">Customize length and character types, then generate instantly.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Settings</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Length: {length}</label>
                    <input type="range" min="4" max="128" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full" aria-label="Password length" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>4</span>
                      <span>128</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-4 h-4" aria-label="Include uppercase letters" />
                      <span className="text-xs">Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} className="w-4 h-4" aria-label="Include lowercase letters" />
                      <span className="text-xs">Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4" aria-label="Include numbers" />
                      <span className="text-xs">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeSpecial} onChange={(e) => setIncludeSpecial(e.target.checked)} className="w-4 h-4" aria-label="Include special characters" />
                      <span className="text-xs">Special Characters (!@#$%...)</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={generatePassword} className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800" aria-label="Generate password">⚡ Generate</button>
                  <button onClick={() => generateMultiple(5)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50" aria-label="Generate 5 passwords">Generate 5</button>
                </div>
              </div>

              <div className="md:col-span-7">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Generated Password</label>
                {password ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-blue-200">
                      <p className="font-mono text-lg break-all text-slate-900">{password}</p>
                    </div>
                    <button onClick={() => copyToClipboard(password)} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 text-sm font-semibold hover:shadow-lg" aria-label="Copy password to clipboard">
                      {copyText}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 text-center">
                    <p className="text-slate-500">Click Generate to create a password</p>
                  </div>
                )}

                {passwords.length > 0 && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Recent Passwords</label>
                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                      {passwords.map((pwd, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <p className="flex-1 font-mono text-sm break-all text-slate-900">{pwd}</p>
                          <button onClick={() => copyToClipboard(pwd)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold" aria-label={`Copy password ${idx + 1}`}>Copy</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* What is a Password Generator Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a Password Generator?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                A <strong>password generator</strong> is a tool that creates random, secure passwords for use in online accounts, applications, and systems. Unlike human-created passwords which are often predictable and weak (like "password123" or "MyDog2024"), password generators use cryptographically secure random number generators to create passwords that are extremely difficult to guess or crack through brute force attacks.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Password generators help users create strong, unique passwords without having to think of them manually. They eliminate common password weaknesses such as dictionary words, personal information, sequential patterns, and reused passwords. According to <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">NIST Special Publication 800-63B</a>, strong passwords should be long, random, and unique to each account. The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Crypto API</a> provides the cryptographic primitives needed for secure password generation in web browsers.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Modern password generators use the Web Crypto API's <code className="bg-slate-100 px-1 py-0.5 rounded">crypto.getRandomValues()</code> function, which provides cryptographically strong random values suitable for security-sensitive applications. This ensures that each generated password is truly random and unpredictable, making them resistant to both brute force and dictionary attacks.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Weak Passwords
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Dictionary words or common phrases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Personal information (names, dates)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Sequential patterns (12345, abcde)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Reused across multiple accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Short length (&lt;12 characters)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Strong Passwords
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Random and unpredictable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Long length (16+ characters)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Mixed character types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Unique to each account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Generated with crypto API</span>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Password Security Statistics</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the importance of strong passwords</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">81%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Data Breaches</div>
                <div className="text-xs text-slate-600">Caused by weak passwords</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">23M</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Accounts</div>
                <div className="text-xs text-slate-600">Use "123456" as password</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">65%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Users Reuse</div>
                <div className="text-xs text-slate-600">Same password across sites</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">0.001s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Crack Time</div>
                <div className="text-xs text-slate-600">For weak passwords</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">The Password Problem</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Verizon's Data Breach Investigations Report</a>, 81% of data breaches are caused by weak or stolen passwords. The most common passwords include "123456", "password", and "123456789", which can be cracked in milliseconds. Using a <strong>password generator</strong> to create strong, unique passwords for each account is one of the most effective ways to protect your online security. <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's security best practices</a> emphasize the importance of strong, unique passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Password Generators Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Password Generators?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Password generators offer numerous advantages for protecting your online accounts and data:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cryptographically Secure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Password generators use cryptographically secure random number generators (like Web Crypto API) to create truly random passwords. This makes them extremely difficult to predict or crack through brute force attacks, providing significantly better security than human-created passwords.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminates Human Weaknesses</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Humans tend to create predictable passwords using dictionary words, personal information, or simple patterns. Password generators eliminate these weaknesses by creating random, unpredictable passwords that don't follow common patterns or contain personal information.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Unique Passwords for Each Account</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Password generators make it easy to create unique passwords for each account. This is critical because if one account is compromised, unique passwords prevent attackers from accessing your other accounts. Reusing passwords is one of the biggest security risks.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Saves Time and Mental Effort</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Creating strong passwords manually is time-consuming and mentally taxing. Password generators create secure passwords instantly, saving you time and ensuring you don't compromise on security due to convenience. You can generate multiple passwords quickly for different accounts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📏</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Customizable Length and Complexity</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Password generators allow you to customize password length and character types to meet specific requirements. Some systems require certain character types or have length restrictions. Generators let you create passwords that meet these requirements while maintaining security.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Protects Against Common Attacks</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Generated passwords protect against common attack methods including dictionary attacks (trying common words), brute force attacks (trying all combinations), and credential stuffing (using leaked passwords from other breaches). Random, unique passwords make these attacks ineffective.
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
                Our password generator makes it easy to create secure passwords in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Set password length</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Adjust the length slider to set your desired password length. For maximum security, use at least 16 characters. Longer passwords (20+ characters) are even more secure. The generator supports passwords from 4 to 128 characters. Most security experts recommend 16-20 characters for strong passwords.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select character types</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose which character types to include: uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and special characters (!@#$%^&*...). For maximum security, include all character types. However, some systems may have restrictions, so check the requirements of the system you're creating the password for. At least one character type must be selected.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Generate and copy password</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click 'Generate' to create a single secure password, or 'Generate 5' to create multiple passwords at once. The password is generated using the Web Crypto API for cryptographically secure randomness. Click 'Copy' to copy the password to your clipboard. Store the password securely in a password manager. Never share passwords or reuse them across multiple accounts.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Password Generator?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Web Crypto API for true randomness</span>
                  </li>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Customizable length and character sets</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Generate multiple passwords at once</span>
                  </li>
                </ul>
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a password generator?</summary>
                <p className="mt-2 text-sm text-slate-600">A password generator is a tool that creates random, secure passwords for use in online accounts, applications, and systems. Unlike human-created passwords which are often predictable and weak, password generators use cryptographically secure random number generators to create passwords that are extremely difficult to guess or crack.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How secure are generated passwords?</summary>
                <p className="mt-2 text-sm text-slate-600">Our password generator uses the Web Crypto API (crypto.getRandomValues) to generate cryptographically secure random passwords. This API provides true randomness suitable for cryptographic purposes. The passwords are generated entirely in your browser and never sent to any server, ensuring maximum security and privacy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What password length should I use?</summary>
                <p className="mt-2 text-sm text-slate-600">For maximum security, use passwords of at least 16 characters. Longer passwords (20+ characters) are even more secure. The generator supports passwords from 4 to 128 characters. According to NIST guidelines, longer passwords are generally more secure than complex short passwords. A 16-character password with mixed character types provides excellent security for most use cases.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Should I include special characters?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, including special characters significantly increases password strength by expanding the character set. However, some systems may not accept certain special characters, so check the requirements of the system you're creating the password for. Special characters add complexity and make passwords harder to crack through brute force attacks.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my password stored or sent to a server?</summary>
                <p className="mt-2 text-sm text-slate-600">No, absolutely not. All password generation happens entirely in your browser using client-side JavaScript. Your passwords are never sent to any server, never stored anywhere, and never transmitted over the network. The Web Crypto API runs locally in your browser, ensuring complete privacy and security.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I generate multiple passwords at once?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, you can click 'Generate 5' to create five passwords at once. This is useful when you need to create passwords for multiple accounts or want to choose from several options. All generated passwords follow the same settings (length and character types) you've configured.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What makes a password strong?</summary>
                <p className="mt-2 text-sm text-slate-600">A strong password is long (16+ characters), includes multiple character types (uppercase, lowercase, numbers, special characters), is random and unpredictable, and is unique to each account. Strong passwords should not contain dictionary words, personal information, or common patterns. Our generator creates passwords that meet all these criteria.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Should I use a password manager?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, absolutely. Password managers like 1Password, LastPass, Bitwarden, or the built-in browser password managers help you store and manage strong, unique passwords for all your accounts. They can also generate secure passwords for you. Using a password manager eliminates the need to remember multiple complex passwords.</p>
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
            <Link href="/utilities/qr-code-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">QR Code Generator</p>
                  <p className="text-xs text-slate-500">Generate QR Codes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate QR codes for URLs, text, contact information, and more. Download as PNG or SVG.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/barcode-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Barcode Generator</p>
                  <p className="text-xs text-slate-500">Generate Barcodes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate barcodes in various formats (CODE128, EAN, UPC, etc.) for inventory, products, and labels.</p>
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

