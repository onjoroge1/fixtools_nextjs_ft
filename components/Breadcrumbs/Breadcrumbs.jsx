import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

/**
 * Breadcrumbs component for navigation and SEO
 * @param {Array} items - Array of breadcrumb items with { name, url }
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={styles.breadcrumbItem}>
              {!isLast ? (
                <>
                  <Link href={item.url} className={styles.breadcrumbLink}>
                    {item.name}
                  </Link>
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


