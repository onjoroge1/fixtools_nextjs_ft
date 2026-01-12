import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import ThemeToggle from '@/components/ThemeToggle';
import Data from '@/dbTools';
import Fuse from '../lib/fuse';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function Home() {
  const canonicalUrl = `${siteHost}/`;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Use refs for frequently changing values to keep handleKeyDown stable
  const searchQueryRef = useRef('');
  const searchResultsRef = useRef([]);
  const selectedIndexRef = useRef(0);
  const isSearchFocusedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    searchQueryRef.current = searchQuery;
    searchResultsRef.current = searchResults;
    selectedIndexRef.current = selectedIndex;
    isSearchFocusedRef.current = isSearchFocused;
  }, [searchQuery, searchResults, selectedIndex, isSearchFocused]);

  // Configure Fuse.js for fuzzy search - memoized to prevent recreation on every render
  const fuse = useMemo(() => new Fuse(Data, {
    keys: ['title', 'desc', 'category'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  }), []);

  // Search function
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(searchQuery).slice(0, 8);
    setSearchResults(results.map((result) => result.item));
    setSelectedIndex(0);
  }, [searchQuery, fuse]);

  // Keyboard navigation - stable callback using refs to prevent re-registration
  const handleKeyDown = useCallback(
    (e) => {
      if (!isSearchFocusedRef.current) {
        // Global keyboard shortcut (Cmd/Ctrl + K)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          inputRef.current?.focus();
          setIsSearchFocused(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResultsRef.current.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResultsRef.current[selectedIndexRef.current]) {
            router.push(searchResultsRef.current[selectedIndexRef.current].link);
            setSearchQuery('');
            setSearchResults([]);
            setIsSearchFocused(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSearchQuery('');
          setSearchResults([]);
          setIsSearchFocused(false);
          inputRef.current?.blur();
          break;
      }
    },
    [router] // Only router needs to be in dependencies now
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && searchResults.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex, searchResults]);

  // Structured Data for Google Sitelinks
  const structuredData = {
    // Website Schema
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FixTools",
      "url": siteHost,
      "description": "Free online developer tools to fix, convert, and optimize files. 60+ tools for JSON, HTML, CSS, SEO, images, and more.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteHost}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "FixTools — Free Developer Tools, Learning Resources & Games",
      "description": "Free online tools, interactive tutorials, and educational resources. 60+ developer tools, learning guides, back-to-school resources, and fun games.",
      "url": siteHost,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 4,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Tools",
            "url": `${siteHost}/tools`,
            "description": "60+ free developer tools. Format, validate, convert, and optimize code instantly."
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Learn",
            "url": `${siteHost}/learn`,
            "description": "Free interactive tutorials for JSON, HTML, CSS, and programming languages."
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Back to School",
            "url": `${siteHost}/back-to-school`,
            "description": "Essential tools for students and educators. Writing, reading, and study aids."
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Games",
            "url": `${siteHost}/games`,
            "description": "Free online games and puzzles. Word games, brain teasers, and interactive challenges."
          }
        ]
      }
    },
    // Organization Schema
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FixTools",
      "url": siteHost,
      "logo": `${siteHost}/fixtools-logos/fixtools-logos_black.svg`,
      "description": "Free online developer tools and educational resources",
      "sameAs": []
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>FixTools — Free tools to fix, convert, and optimize files</title>
        <meta name="title" content="FixTools — Free tools to fix, convert, and optimize files" />
        <meta name="description" content="Fix, convert, and optimize files in seconds — 100% free. Search 60+ tools across Developer, SEO, CSS, and more." />
        <meta name="keywords" content="developer tools, online tools, JSON formatter, HTML formatter, CSS generator, free tools, no signup" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="FixTools — Free tools to fix, convert, and optimize files" />
        <meta property="og:description" content="Fix, convert, and optimize files in seconds — 100% free. Search 60+ tools across Developer, SEO, CSS, and more." />
        <meta property="og:image" content={`${siteHost}/programming_tools.jpg`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="FixTools — Free tools to fix, convert, and optimize files" />
        <meta property="twitter:description" content="Fix, convert, and optimize files in seconds — 100% free." />
        <meta property="twitter:image" content={`${siteHost}/programming_tools.jpg`} />
        
        {/* Structured Data for Google Sitelinks */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.website) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }} />
      </Head>

      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            <Image 
              src="/fixtools-logos/fixtools-logos_black.svg" 
              alt="FixTools logo" 
              width={150} 
              height={48}
              priority
            />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <Link href="/tools">Tools</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/back-to-school">Back to School</Link>
            <Link href="/games">Games</Link>
            <Link href="/tools/json">JSON</Link>
            <Link href="/tools/html">HTML</Link>
            <Link href="/tools/css">CSS</Link>
            <Link href="/tools">All tools</Link>
          </nav>

          <div className="nav-cta">
            <ThemeToggle />
            <Link href="/tools" className="btn primary">
              View All Tools
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Fix, convert, and optimize files in seconds — 100% free.</h1>
            <p>No sign-ups. No watermarks. Just fast tools that work. Search, click, and get results instantly.</p>

            <div className="search-card" role="search" aria-label="Search tools">
              <div className={`search-row ${isSearchFocused ? 'focused' : ''}`}>
                <span aria-hidden="true">🔎</span>
                <input
                  ref={inputRef}
                  id="toolSearch"
                  type="text"
                  placeholder="Search 60+ free tools (e.g., HTML minifier, sitemap generator)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // Delay to allow click events on results
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="clear-search-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Inline Search Results */}
              {isSearchFocused && searchQuery.trim().length >= 2 && (
                <div className="search-results" ref={resultsRef}>
                  {searchResults.length === 0 ? (
                    <div className="search-empty">
                      <p>No tools found. Try different keywords.</p>
                    </div>
                  ) : (
                    searchResults.map((tool, index) => (
                      <Link
                        key={tool.id}
                        href={tool.link}
                        className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setIsSearchFocused(false);
                        }}
                      >
                        <div className="result-icon">🔧</div>
                        <div className="result-content">
                          <div className="result-title">{tool.title}</div>
                          <div className="result-desc">{tool.desc}</div>
                        </div>
                        <div className="result-category">{tool.category}</div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {!isSearchFocused && (
                <>
                  <div className="popular-pills" aria-label="Popular tools">
                    <Link href="/html/html-minify" className="pill">
                      <Image src="/sparkle.svg" alt="" width={18} height={18} />
                      <span>HTML Minifier</span>
                    </Link>
                    <Link href="/json/json-formatter" className="pill">
                      <Image src="/sparkle.svg" alt="" width={18} height={18} />
                      <span>JSON Formatter</span>
                    </Link>
                    <Link href="/image-tools/image-compressor" className="pill">
                      <Image src="/sparkle.svg" alt="" width={18} height={18} />
                      <span>Image Compressor</span>
                    </Link>
                    <Link href="/tools/pdf-merger" className="pill">
                      <Image src="/sparkle.svg" alt="" width={18} height={18} />
                      <span>PDF Merger</span>
                    </Link>
                    <Link href="/css-tool/gradient" className="pill">
                      <Image src="/sparkle.svg" alt="" width={18} height={18} />
                      <span>CSS Gradient</span>
                    </Link>
                  </div>

                  <div className="sub-badges" aria-label="Trust points">
                    <span className="pill">✅ No sign-ups</span>
                    <span className="pill">🔒 Privacy-first</span>
                    <span className="pill">⚡ Fast results</span>
                    <span className="pill">🌍 Built for everyone</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hero-illus" aria-hidden="true">
            <Image src="/hero-left.svg" alt="" width={280} height={220} />
            <Image src="/hero-right.svg" alt="" width={280} height={220} />
          </div>
        </div>
      </section>

      {/* Main Categories Section - Compact Card Grid */}
      <section className="explore-section" style={{ background: 'linear-gradient(to bottom, #fbfbfc, #ffffff)', padding: '60px 0' }}>
        <div className="container">
          <div className="explore-header">
            <h2 className="explore-title">
              <span className="sparkle-icon">✨</span>
              Explore FixTools
              <span className="sparkle-icon">✨</span>
            </h2>
            <p className="explore-subtitle">Discover powerful tools, interactive learning, and fun games — all 100% free</p>
          </div>

          {/* Compact Card Grid - 2x2 Layout */}
          <div className="explore-grid">
            {/* Tools Card */}
            <Link href="/tools" className="explore-card tools-card" aria-label="Browse 60+ free developer tools">
              <div className="explore-card-icon">
                <span>🔧</span>
              </div>
              <h3 className="explore-card-title">Tools</h3>
              <p className="explore-card-desc">60+ free developer tools. Format, validate, convert, and optimize code instantly.</p>
              <div className="explore-card-features">
                <span className="feature-tag">⚡ Instant</span>
                <span className="feature-tag">🔒 Private</span>
                <span className="feature-tag">100% Free</span>
              </div>
              <div className="explore-card-arrow">→</div>
            </Link>

            {/* Learn Card */}
            <Link href="/learn" className="explore-card learn-card" aria-label="Free interactive tutorials and learning resources">
              <div className="explore-card-icon">
                <span>📚</span>
              </div>
              <h3 className="explore-card-title">Learn</h3>
              <p className="explore-card-desc">Interactive tutorials for JSON, HTML, CSS, and programming languages.</p>
              <div className="explore-card-features">
                <span className="feature-tag">🎯 Interactive</span>
                <span className="feature-tag">📖 Step-by-Step</span>
                <span className="feature-tag">Free Forever</span>
              </div>
              <div className="explore-card-arrow">→</div>
            </Link>

            {/* Back to School Card */}
            <Link href="/back-to-school" className="explore-card school-card" aria-label="Essential tools for students and educators">
              <div className="explore-card-icon">
                <span>🎓</span>
              </div>
              <h3 className="explore-card-title">Back to School</h3>
              <p className="explore-card-desc">Essential tools for students and educators. Writing, reading, and study aids.</p>
              <div className="explore-card-features">
                <span className="feature-tag">✏️ Writing</span>
                <span className="feature-tag">📝 Study Tools</span>
                <span className="feature-tag">For Everyone</span>
              </div>
              <div className="explore-card-arrow">→</div>
            </Link>

            {/* Games Card */}
            <Link href="/games" className="explore-card games-card" aria-label="Free online games and puzzles">
              <div className="explore-card-icon">
                <span>🎮</span>
              </div>
              <h3 className="explore-card-title">Games</h3>
              <p className="explore-card-desc">Free online games and puzzles. Word games, brain teasers, and interactive challenges.</p>
              <div className="explore-card-features">
                <span className="feature-tag">🧩 Puzzles</span>
                <span className="feature-tag">🎯 Word Games</span>
                <span className="feature-tag">Instant Play</span>
              </div>
              <div className="explore-card-arrow">→</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            <Image src="/sparkle.svg" alt="" width={20} height={20} /> Popular free tools
          </h2>

          <div className="grid-3">
            <article className="card">
              <div className="top">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Image src="/dev.svg" width={44} height={44} alt="Developer Tools icon" />
                  <div>
                    <h3>Developer Tools</h3>
                    <p>Format, minify, validate, and debug code quickly.</p>
                  </div>
                </div>
                <span className="badge blue">Fast</span>
              </div>

              <div className="mini-list">
                <Link href="/html/html-minify" className="mini-item">
                  <span>HTML Minifier</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/html/html-formatter" className="mini-item">
                  <span>HTML Formatter</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/json/json-formatter" className="mini-item">
                  <span>JSON Formatter</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/json/json-validator" className="mini-item">
                  <span>JSON Validator</span>
                  <span className="arrow">→</span>
                </Link>
              </div>

              <Link
                href="/tools"
                className="btn"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>View all tools</span>
                <span>→</span>
              </Link>
            </article>

            <article className="card">
              <div className="top">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Image src="/dev.svg" width={44} height={44} alt="JSON Tools icon" />
                  <div>
                    <h3>JSON Tools</h3>
                    <p>Format, validate, convert, and analyze JSON data instantly.</p>
                  </div>
                </div>
                <span className="badge blue">JSON</span>
              </div>

              <div className="mini-list">
                <Link href="/json/json-formatter" className="mini-item">
                  <span>JSON Formatter</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/json/json-validator" className="mini-item">
                  <span>JSON Validator</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/json/json-to-xml" className="mini-item">
                  <span>JSON to XML</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/json/json-to-csv" className="mini-item">
                  <span>JSON to CSV</span>
                  <span className="arrow">→</span>
                </Link>
              </div>

              <Link
                href="/tools/json"
                className="btn"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>View all tools</span>
                <span>→</span>
              </Link>
            </article>

            <article className="card">
              <div className="top">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Image src="/seo.svg" width={44} height={44} alt="SEO Tools icon" />
                  <div>
                    <h3>SEO Tools</h3>
                    <p>Improve crawlability, speed, and rankings.</p>
                  </div>
                </div>
                <span className="badge amber">SEO</span>
              </div>

              <div className="mini-list">
                <Link href="/seo-tools/site-map-generator" className="mini-item">
                  <span>Sitemap Generator</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/seo-tools/robots-txt" className="mini-item">
                  <span>Robots.txt Generator</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/seo-tools/meta-tags" className="mini-item">
                  <span>Meta Tag Generator</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/seo-tools/open-graph" className="mini-item">
                  <span>Open Graph Generator</span>
                  <span className="arrow">→</span>
                </Link>
              </div>

              <Link
                href="/tools/seo-tools"
                className="btn"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>View all tools</span>
                <span>→</span>
              </Link>
            </article>

            <article className="card">
              <div className="top">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Image src="/css.svg" width={44} height={44} alt="CSS Tools icon" />
                  <div>
                    <h3>CSS Tools</h3>
                    <p>Build UI styles faster with visual generators.</p>
                  </div>
                </div>
                <span className="badge purple">Fun</span>
              </div>

              <div className="mini-list">
                <Link href="/css-tool/gradient" className="mini-item">
                  <span>CSS Gradient</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/css-tool/box-shadow" className="mini-item">
                  <span>Box Shadow</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/css-tool/border-radius-gen" className="mini-item">
                  <span>Border Radius</span>
                  <span className="arrow">→</span>
                </Link>
                <Link href="/css-tool/minify-css" className="mini-item">
                  <span>CSS Minifier</span>
                  <span className="arrow">→</span>
                </Link>
              </div>

              <Link
                href="/tools/css"
                className="btn"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>View all tools</span>
                <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why FixTools?</h2>

          <div className="two-col">
            <Link href="/html/html-minify" className="tool-row">
              <div className="left">
                <div className="tool-ico">⚡</div>
                <div>
                  <h4>HTML Minifier</h4>
                  <p>Minify HTML and reduce page size.</p>
                </div>
              </div>
              <div className="right">
                <span className="badge blue">Fast</span>
                <span>→</span>
              </div>
            </Link>

            <Link href="/privacy" className="tool-row">
              <div className="left">
                <div className="tool-ico">🔒</div>
                <div>
                  <h4>Privacy-first</h4>
                  <p>We don&apos;t store your input or files.</p>
                </div>
              </div>
              <div className="right">
                <span className="badge cyan">Trusted</span>
                <span>→</span>
              </div>
            </Link>

            <Link href="/css-tool/gradient" className="tool-row">
              <div className="left">
                <div className="tool-ico">🎨</div>
                <div>
                  <h4>CSS Gradient</h4>
                  <p>Create beautiful gradients and copy CSS.</p>
                </div>
              </div>
              <div className="right">
                <span className="badge purple">Fun</span>
                <span>→</span>
              </div>
            </Link>

            <Link href="/seo-tools/site-map-generator" className="tool-row">
              <div className="left">
                <div className="tool-ico">🧭</div>
                <div>
                  <h4>Sitemap Generator</h4>
                  <p>Generate XML sitemaps for SEO.</p>
                </div>
              </div>
              <div className="right">
                <span className="badge amber">SEO</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq">
            <h2>Frequently Asked Questions</h2>

            <details>
              <summary>Is FixTools free to use?</summary>
              <p>
                Yes. FixTools is free to use with no sign-up required. You can run tools as often as you want.
              </p>
            </details>

            <details>
              <summary>Do you store my input or files?</summary>
              <p>
                No. FixTools is designed to be privacy-first. Your input is processed and you stay in control.
              </p>
            </details>

            <details>
              <summary>Will these tools break my website?</summary>
              <p>
                Tools preserve meaning while removing unnecessary characters (like whitespace/comments). Always test
                your pipeline before production deploys.
              </p>
            </details>

            <details>
              <summary>How do I find the right tool?</summary>
              <p>
                Use the search bar to locate tools by keyword (e.g., HTML, JSON, SEO). Category pages make discovery
                easy.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand" style={{ gap: '10px' }}>
              <Image 
                src="/fixtools-logos/fixtools-logos_black.svg" 
                alt="FixTools logo" 
                width={150} 
                height={48}
                priority
              />
            </div>
            <p style={{ margin: '10px 0 0', maxWidth: '46ch' }}>
              60+ free tools for developers, creators, and marketers. No sign-up required.
            </p>
            <p style={{ margin: '10px 0 0' }}>
              © {new Date().getFullYear()} FixTools. All rights reserved.
            </p>
          </div>

          <div>
            <h5>Categories</h5>
            <Link href="/tools/json">JSON Tools</Link>
            <Link href="/tools/html">HTML Tools</Link>
            <Link href="/tools/css">CSS Tools</Link>
            <Link href="/tools/image-tools">Image Tools</Link>
            <Link href="/tools/utilities">Utility Tools</Link>
            <Link href="/tools/pdf">PDF Tools</Link>
            <Link href="/tools/seo-tools">SEO Tools</Link>
            <Link href="/tools/conversion-tools">Converters</Link>
            <Link href="/tools/ai-tools">AI Tools</Link>
            <Link href="/tools/text-tools">Text Tools</Link>
          </div>

          <div>
            <h5>Popular tools</h5>
            <Link href="/json/json-formatter">JSON Formatter</Link>
            <Link href="/html/html-formatter">HTML Formatter</Link>
            <Link href="/css-tool/gradient">CSS Gradient</Link>
            <Link href="/css-tool/box-shadow">Box Shadow</Link>
          </div>

          <div>
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --bg: #fbfbfc;
          --card: #ffffff;
          --text: #0f172a;
          --muted: #475569;
          --border: #e2e8f0;
          --blue: #2563eb;
          --purple: #7c3aed;
          --cyan: #06b6d4;
          --amber: #f59e0b;
          --shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
          --shadow2: 0 6px 16px rgba(15, 23, 42, 0.08);
          --radius: 18px;
        }

        * {
          box-sizing: border-box;
        }
        html,
        body {
          margin: 0;
          padding: 0;
        }
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji',
            'Segoe UI Emoji';
          background: var(--bg);
          color: var(--text);
          line-height: 1.35;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
        .container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 18px;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          gap: 12px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand img {
          width: auto;
          height: 48px;
        }
        .nav-links {
          display: none;
          gap: 18px;
          color: var(--muted);
          font-size: 14px;
        }
        .nav-links a:hover {
          color: var(--text);
        }
        .nav-cta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 14px;
          padding: 10px 14px;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid var(--border);
          background: #fff;
        }
        .btn:hover {
          background: #f8fafc;
        }
        .btn.primary {
          border: 0;
          background: linear-gradient(90deg, var(--blue), var(--purple));
          color: #fff;
          box-shadow: var(--shadow2);
        }
        .btn.primary:hover {
          filter: brightness(0.98);
        }

        @media (min-width: 860px) {
          .nav-links {
            display: flex;
          }
        }

        /* Hero */
        .hero {
          position: relative;
          padding: 48px 0 26px;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-items: center;
        }
        .hero h1 {
          font-size: clamp(34px, 5vw, 54px);
          letter-spacing: -0.02em;
          margin: 0 0 10px;
          font-weight: 900;
        }
        .hero p {
          margin: 0 0 18px;
          color: var(--muted);
          font-size: 17px;
          max-width: 62ch;
        }
        .hero .sub-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
          color: var(--muted);
          font-size: 14px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
          background: #fff;
          padding: 8px 10px;
          border-radius: 999px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
        }
        .pill img {
          width: 18px;
          height: 18px;
        }

        .hero-illus {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          justify-items: stretch;
          align-items: stretch;
        }
        .hero-illus img {
          width: 100%;
          height: auto;
          border-radius: 26px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          background: #fff;
        }

        .search-card {
          margin-top: 18px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--radius);
          padding: 14px;
          box-shadow: var(--shadow);
          position: relative;
        }
        .search-row {
          display: flex;
          gap: 10px;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 10px 12px;
          background: #fff;
          transition: all 0.2s;
        }
        .search-row.focused {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .search-row input {
          border: 0;
          outline: 0;
          flex: 1;
          font-size: 15px;
          background: transparent;
        }
        .clear-search-btn {
          border: 0;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 18px;
          line-height: 1;
          transition: all 0.2s;
        }
        .clear-search-btn:hover {
          background: #f1f5f9;
          color: var(--text);
        }
        .search-results {
          margin-top: 12px;
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: #fff;
          box-shadow: var(--shadow2);
        }
        .search-results::-webkit-scrollbar {
          width: 8px;
        }
        .search-results::-webkit-scrollbar-track {
          background: transparent;
        }
        .search-results::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
        }
        .search-result-item:last-child {
          border-bottom: 0;
        }
        .search-result-item:hover,
        .search-result-item.selected {
          background: #f8fafc;
        }
        .search-result-item.selected {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05));
          border-left: 3px solid var(--blue);
        }
        .result-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .result-content {
          flex: 1;
          min-width: 0;
        }
        .result-title {
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
          margin-bottom: 4px;
        }
        .result-desc {
          font-size: 13px;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .result-category {
          font-size: 12px;
          color: var(--muted);
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 8px;
          white-space: nowrap;
          font-weight: 500;
        }
        .search-empty {
          padding: 24px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }
        .popular-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .section {
          padding: 28px 0;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 14px;
          font-size: 22px;
          letter-spacing: -0.01em;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 860px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
          .grid-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 22px;
          box-shadow: var(--shadow);
          padding: 16px;
        }
        .card:hover {
          box-shadow: var(--shadow2);
        }
        .card .top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .card h3 {
          margin: 8px 0 6px;
          font-size: 18px;
        }
        .card p {
          margin: 0 0 12px;
          color: var(--muted);
          font-size: 14px;
        }
        .card .mini-list {
          display: grid;
          gap: 10px;
          margin: 10px 0 14px;
        }
        .mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
        }
        .mini-item span {
          font-size: 14px;
          color: var(--text);
          font-weight: 650;
        }
        .mini-item small {
          color: var(--muted);
        }
        .mini-item .arrow {
          color: #94a3b8;
        }

        .badge {
          font-size: 12px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #fff;
        }
        .badge.blue {
          border-color: #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .badge.purple {
          border-color: #ddd6fe;
          background: #f5f3ff;
          color: #6d28d9;
        }
        .badge.amber {
          border-color: #fde68a;
          background: #fffbeb;
          color: #b45309;
        }
        .badge.cyan {
          border-color: #a5f3fc;
          background: #ecfeff;
          color: #0e7490;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 860px) {
          .two-col {
            grid-template-columns: 1fr 1fr;
          }
        }

        .tool-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: #fff;
        }
        .tool-row:hover {
          background: #f8fafc;
        }
        .tool-row .left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tool-ico {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff, #f5f3ff);
        }
        .tool-row h4 {
          margin: 0;
          font-size: 15px;
        }
        .tool-row p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
        }
        .tool-row .right {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
        }

        /* FAQ */
        .faq {
          background: #0b1220;
          color: #e2e8f0;
          border-radius: 26px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .faq h2 {
          margin: 0 0 14px;
          color: #fff;
        }
        .faq details {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 16px;
          padding: 14px 14px;
          margin: 10px 0;
        }
        .faq summary {
          cursor: pointer;
          font-weight: 750;
        }
        .faq p {
          margin: 10px 0 0;
          color: #cbd5e1;
        }

        /* Footer */
        .footer {
          padding: 34px 0 44px;
          color: var(--muted);
          font-size: 14px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }
        @media (min-width: 860px) {
          .footer-grid {
            grid-template-columns: 1.2fr 1fr 1fr 1fr;
          }
        }
        .footer h5 {
          margin: 0 0 10px;
          color: var(--text);
        }
        .footer a {
          display: block;
          padding: 6px 0;
        }
        .footer a:hover {
          color: var(--text);
        }

        /* Enhanced Explore Section */
        .explore-section {
          position: relative;
          overflow: hidden;
        }
        .explore-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .explore-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 900;
          margin: 0 0 12px;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .sparkle-icon {
          font-size: 32px;
          animation: sparkle 2s ease-in-out infinite;
        }
        .sparkle-icon:nth-child(2) {
          animation-delay: 0.5s;
        }
        .explore-subtitle {
          font-size: 18px;
          color: var(--muted);
          margin: 0;
        }

        /* Compact Card Grid */
        .explore-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .explore-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .explore-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 32px;
          border-radius: 24px;
          border: 2px solid transparent;
          background: #fff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }
        .explore-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: opacity 0.3s;
        }
        .explore-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          z-index: 1;
          transition: all 0.3s;
        }
        .explore-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }
        .explore-card:hover::after {
          height: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .explore-card:hover .explore-card-arrow {
          transform: translateX(6px);
        }
        
        /* Tools Card - Blue */
        .tools-card::before {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%);
          opacity: 0;
        }
        .tools-card:hover::before {
          opacity: 1;
        }
        .tools-card::after {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        .tools-card:hover {
          border-color: rgba(37, 99, 235, 0.2);
        }
        .tools-card .explore-card-icon {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 2px solid rgba(37, 99, 235, 0.2);
        }
        .tools-card .explore-card-title {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tools-card .feature-tag {
          background: rgba(37, 99, 235, 0.1);
          color: #1e40af;
        }
        
        /* Learn Card - Green */
        .learn-card::before {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%);
          opacity: 0;
        }
        .learn-card:hover::before {
          opacity: 1;
        }
        .learn-card::after {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .learn-card:hover {
          border-color: rgba(16, 185, 129, 0.2);
        }
        .learn-card .explore-card-icon {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 2px solid rgba(16, 185, 129, 0.2);
        }
        .learn-card .explore-card-title {
          background: linear-gradient(135deg, #047857 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .learn-card .feature-tag {
          background: rgba(16, 185, 129, 0.1);
          color: #047857;
        }
        
        /* School Card - Orange */
        .school-card::before {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.04) 100%);
          opacity: 0;
        }
        .school-card:hover::before {
          opacity: 1;
        }
        .school-card::after {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        }
        .school-card:hover {
          border-color: rgba(249, 115, 22, 0.2);
        }
        .school-card .explore-card-icon {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border: 2px solid rgba(249, 115, 22, 0.2);
        }
        .school-card .explore-card-title {
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .school-card .feature-tag {
          background: rgba(249, 115, 22, 0.1);
          color: #c2410c;
        }
        
        /* Games Card - Purple */
        .games-card::before {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(147, 51, 234, 0.04) 100%);
          opacity: 0;
        }
        .games-card:hover::before {
          opacity: 1;
        }
        .games-card::after {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        }
        .games-card:hover {
          border-color: rgba(168, 85, 247, 0.2);
        }
        .games-card .explore-card-icon {
          background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
          border: 2px solid rgba(168, 85, 247, 0.2);
        }
        .games-card .explore-card-title {
          background: linear-gradient(135deg, #6b21a8 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .games-card .feature-tag {
          background: rgba(168, 85, 247, 0.1);
          color: #6b21a8;
        }

        .explore-card-icon {
          position: relative;
          z-index: 1;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          margin-bottom: 20px;
          font-size: 36px;
          transition: transform 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .explore-card:hover .explore-card-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .explore-card-title {
          position: relative;
          z-index: 1;
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .explore-card-desc {
          position: relative;
          z-index: 1;
          font-size: 15px;
          color: var(--muted);
          margin: 0 0 20px;
          line-height: 1.6;
        }
        .explore-card-features {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .feature-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        .explore-card-arrow {
          position: relative;
          z-index: 1;
          margin-top: auto;
          font-size: 24px;
          font-weight: 700;
          color: var(--muted);
          transition: transform 0.3s, color 0.3s;
        }
        .explore-card:hover .explore-card-arrow {
          color: var(--text);
        }

        /* Animations */
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
