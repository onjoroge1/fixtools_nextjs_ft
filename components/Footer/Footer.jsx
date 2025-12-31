import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const footerLinks = {
    categories: [
      { name: 'AI Tools', href: '/categories/ai-tools' },
      { name: 'JSON Tools', href: '/categories/json-tools' },
      { name: 'HTML Tools', href: '/categories/html-tools' },
      { name: 'CSS Tools', href: '/categories/css-tools' },
      { name: 'Converters', href: '/categories/conversion-tools' },
      { name: 'SEO Tools', href: '/categories/seo-tools' },
    ],
    popular: [
      { name: 'JSON Formatter', href: '/json/json-formatter' },
      { name: 'HTML Formatter', href: '/html/html-formatter' },
      { name: 'CSS Gradient', href: '/css-tool/gradient' },
      { name: 'Chat with AI', href: '/aitools/qa' },
      { name: 'Box Shadow', href: '/css-tool/box-shadow' },
      { name: 'Sitemap Generator', href: '/seo-tools/site-map-generator' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Top Section */}
        <div className={styles.footerTop}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/fixtools-logos/fixtools-logos_black.svg"
                alt="Fixtools logo"
                width={140}
                height={48}
                priority
              />
            </Link>
            <p className={styles.brandTagline}>
              60+ free developer tools. No signup required. Built with ❤️ for
              developers worldwide.
            </p>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <Image
                  src="/twitterIcon.svg"
                  alt="Twitter"
                  width={20}
                  height={20}
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Image
                  src="/linkedinIcon.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Image
                  src="/facebookIcon.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <Image
                  src="/youtubeIcon.svg"
                  alt="YouTube"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Categories</h3>
            <ul className={styles.linkList}>
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Popular Tools</h3>
            <ul className={styles.linkList}>
              {footerLinks.popular.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Company</h3>
            <ul className={styles.linkList}>
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Fixtools. All rights reserved.
          </p>
          <div className={styles.footerMeta}>
            <span className={styles.metaItem}>Made with 💙 for developers</span>
            <span className={styles.separator}>•</span>
            <span className={styles.metaItem}>100% Free Forever</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
