import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from './HeroSearch.module.css';
import { useTheme } from '@/contexts/ThemeContext';

export default function HeroSearch({ 
  placeholder = "Search 60+ free tools...",
  onSearch,
  autoFocus = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        // Default: trigger the global search modal
        const searchBtn = document.querySelector('[data-search-trigger]');
        if (searchBtn) {
          searchBtn.click();
        }
      }
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form 
      className={`${styles.heroSearch} ${isFocused ? styles.focused : ''} ${theme === 'dark' ? styles.dark : ''}`}
      onSubmit={handleSearch}
    >
      <div className={styles.searchIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Search tools"
      />

      <button 
        type="submit" 
        className={styles.searchButton}
        disabled={!searchTerm.trim()}
      >
        Search
      </button>

      <div className={styles.kbdHint}>
        <kbd>⌘K</kbd>
      </div>
    </form>
  );
}



