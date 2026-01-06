import Link from 'next/link';
import Image from 'next/image';
import styles from './ToolCard.module.css';

export default function ToolCard({
  tool,
  isPopular = false,
  showCategory = true,
}) {
  const getCategorySlug = (category) => {
    const map = {
      'AI Tools': 'ai-tools',
      'Conversion Tools': 'conversion-tools',
      'JSON Tools': 'json-tools',
      'HTML Tools': 'html-tools',
      'CSS Tools': 'css-tools',
      'SEO Tools': 'seo-tools',
      'Text Tools': 'text-tools',
    };
    return map[category] || 'tools';
  };

  const getIconForCategory = (category) => {
    const icons = {
      'AI Tools': '🤖',
      'Conversion Tools': '🔄',
      'JSON Tools': '📋',
      'HTML Tools': '🌐',
      'CSS Tools': '🎨',
      'SEO Tools': '📊',
      'Text Tools': '📝',
    };
    return icons[category] || '🔧';
  };

  return (
    <Link
      href={tool.link}
      className={styles.card}
      data-category={getCategorySlug(tool.category)}
    >
      {isPopular && <span className={styles.badge}>Popular</span>}

      <div className={styles.icon}>
        {tool.image ? (
          <Image src={tool.image} alt={tool.title} width={32} height={32} />
        ) : (
          <span>{getIconForCategory(tool.category)}</span>
        )}
      </div>

      <h3 className={styles.title}>{tool.title}</h3>
      <p className={styles.desc}>{tool.desc}</p>

      {showCategory && (
        <div className={styles.footer}>
          <span className={styles.category}>{tool.category}</span>
          <svg
            className={styles.arrow}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </Link>
  );
}

