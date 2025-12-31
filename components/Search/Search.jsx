import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Fuse from '../../lib/fuse';
import styles from './Search.module.css';
import * as analytics from '../../lib/analytics';

export default function Search({ tools, isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(tools, {
    keys: ['title', 'desc', 'category'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  });

  // Search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query).slice(0, 8);
    setResults(searchResults.map((result) => result.item));
    setSelectedIndex(0);

    // Track search
    analytics.trackSearch(query, searchResults.length);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].link);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, results, selectedIndex, router, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9 17A8 8 0 109 1a8 8 0 000 16zM18 18l-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            autoComplete="off"
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.results} ref={resultsRef}>
          {query.trim().length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <p className={styles.emptyTitle}>Search for tools</p>
              <p className={styles.emptyDesc}>
                Try "JSON", "formatter", "gradient", or any tool name
              </p>
            </div>
          ) : query.trim().length < 2 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyDesc}>Type at least 2 characters...</p>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>😕</div>
              <p className={styles.emptyTitle}>No tools found</p>
              <p className={styles.emptyDesc}>
                Try different keywords or browse by category
              </p>
            </div>
          ) : (
            results.map((tool, index) => (
              <Link
                key={tool.id}
                href={tool.link}
                className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                onClick={onClose}
              >
                <div className={styles.resultIcon}>🔧</div>
                <div className={styles.resultContent}>
                  <div className={styles.resultTitle}>{tool.title}</div>
                  <div className={styles.resultDesc}>{tool.desc}</div>
                </div>
                <div className={styles.resultCategory}>{tool.category}</div>
              </Link>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.shortcuts}>
            <span className={styles.shortcut}>
              <kbd>↑↓</kbd> Navigate
            </span>
            <span className={styles.shortcut}>
              <kbd>Enter</kbd> Select
            </span>
            <span className={styles.shortcut}>
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
