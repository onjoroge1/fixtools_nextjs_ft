import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ToolChips.module.css';
import { useTheme } from '@/contexts/ThemeContext';

export default function ToolChips({ tools, scrollable = true }) {
  const containerRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const { theme } = useTheme();

  // Check scroll position to show/hide fade effects
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scrollable) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Initial check
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollable, tools]);

  return (
    <div className={`${styles.toolChipsWrapper} ${theme === 'dark' ? styles.dark : ''}`}>
      {showLeftFade && <div className={`${styles.fade} ${styles.fadeLeft}`}></div>}
      {showRightFade && <div className={`${styles.fade} ${styles.fadeRight}`}></div>}
      
      <div 
        ref={containerRef}
        className={`${styles.toolChips} ${scrollable ? styles.scrollable : ''}`}
      >
        {tools.map((tool, index) => (
          <Link 
            key={`${tool.href}-${index}`}
            href={tool.href}
            className={styles.chip}
          >
            {tool.icon && <span className={styles.chipIcon}>{tool.icon}</span>}
            <span className={styles.chipText}>{tool.name}</span>
            {tool.badge && <span className={styles.chipBadge}>{tool.badge}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}


