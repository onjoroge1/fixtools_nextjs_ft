import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import CustomHead from '@/components/CustomHead';
import Footer from '@/components/Footer/Footer';
import styles from '../styles/HomePage.module.css';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

const categories = [
  {
    title: 'AI Tools',
    icon: '🤖',
    color: '#8b5cf6',
    href: '/categories/ai-tools',
    description: 'Chat, summarize, and generate content with AI',
    toolCount: '12+ tools',
  },
  {
    title: 'JSON Utilities',
    icon: '📋',
    color: '#3b82f6',
    href: '/categories/json-tools',
    description: 'Format, validate, and transform JSON',
    toolCount: '8+ tools',
  },
  {
    title: 'HTML Helpers',
    icon: '🌐',
    color: '#10b981',
    href: '/categories/html-tools',
    description: 'Generate and clean HTML snippets',
    toolCount: '15+ tools',
  },
  {
    title: 'CSS Helpers',
    icon: '🎨',
    color: '#f59e0b',
    href: '/categories/css-tools',
    description: 'Create gradients and CSS effects',
    toolCount: '20+ tools',
  },
  {
    title: 'Converters',
    icon: '🔄',
    color: '#ec4899',
    href: '/categories/conversion-tools',
    description: 'Unit, currency, and timezone conversions',
    toolCount: '6+ tools',
  },
  {
    title: 'SEO Tools',
    icon: '📈',
    color: '#06b6d4',
    href: '/categories/seo-tools',
    description: 'Sitemaps and SEO analysis',
    toolCount: '4+ tools',
  },
];

const popularTools = [
  { title: 'JSON Formatter', href: '/json/json-formatter', icon: '📋' },
  { title: 'HTML Formatter', href: '/html/html-formatter', icon: '🌐' },
  { title: 'CSS Gradient', href: '/css-tool/gradient', icon: '🎨' },
  { title: 'Chat with AI', href: '/aitools/qa', icon: '🤖' },
  {
    title: 'Currency Converter',
    href: '/conversiontools/currencyConversion',
    icon: '💱',
  },
  {
    title: 'Sitemap Generator',
    href: '/seo-tools/site-map-generator',
    icon: '📈',
  },
];

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'All tools load instantly with no setup required',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Everything processes locally in your browser',
  },
  {
    icon: '🎯',
    title: 'No Signup',
    description: 'Use any tool immediately, no account needed',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Easy on the eyes with automatic theme switching',
  },
];

export default function Home() {
  const canonicalUrl = `${siteHost}/`;

  return (
    <>
      <CustomHead
        title="Free Online Developer Tools - Fixtools"
        metaDescription="60+ free developer tools for formatting, conversion, and AI. JSON formatter, HTML/CSS generators, currency converter, and more. No signup required."
        keywords="developer tools, online tools, JSON formatter, HTML formatter, CSS generator, AI tools, code formatter, free tools, no signup"
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Free online developer tools"
        ogUrl={canonicalUrl}
      />

      <Header />

      {/* Hero Section */}
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Free Tools for Developers
              <span className={styles.titleAccent}> Made Simple</span>
            </h1>
            <p className={styles.heroDescription}>
              60+ powerful tools for formatting, conversion, and AI. All free,
              no signup required. Everything processes securely in your browser.
            </p>
            <div className={styles.heroButtons}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  const searchBtn = document.querySelector('.search-trigger');
                  if (searchBtn) searchBtn.click();
                }}
              >
                🔍 Search Tools
                <span className={styles.buttonKbd}>⌘K</span>
              </button>
              <Link
                href="/categories/ai-tools"
                className={styles.secondaryButton}
              >
                Try AI Tools →
              </Link>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>60+</div>
                <div className={styles.statLabel}>Free Tools</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Private</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Signup Needed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className={styles.categoriesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <p className={styles.sectionSubtitle}>
              Choose your tool category or search for something specific
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className={styles.categoryCard}
                style={{ '--card-color': category.color }}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
                <div className={styles.categoryMeta}>
                  <span className={styles.toolCount}>{category.toolCount}</span>
                  <span className={styles.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Tools */}
        <section className={styles.popularSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Tools</h2>
            <p className={styles.sectionSubtitle}>
              Most used by developers worldwide
            </p>
          </div>

          <div className={styles.popularGrid}>
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={styles.popularCard}
              >
                <span className={styles.popularIcon}>{tool.icon}</span>
                <span className={styles.popularTitle}>{tool.title}</span>
                <span className={styles.popularArrow}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Fixtools?</h2>
            <p className={styles.sectionSubtitle}>
              Built for developers who value speed and privacy
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to fix your code?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of developers using Fixtools every day
            </p>
            <button
              className={styles.ctaButton}
              onClick={() => {
                const searchBtn = document.querySelector('.search-trigger');
                if (searchBtn) searchBtn.click();
              }}
            >
              Get Started - It's Free
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
