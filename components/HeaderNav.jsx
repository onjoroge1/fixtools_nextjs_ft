import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Search from './Search';
import ThemeToggle from './ThemeToggle';
import Data from '../dbTools';

export default function HeaderNav() {
  const [closetoggle, setclosetoggle] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggerHandler = () => {
    setclosetoggle(!closetoggle);
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="header">
        <div className="header-logo">
          <Link href="/">
            <Image
              src="/fixtools-logos/fixtools-logos_black.svg"
              alt="Fixtools logo"
              width={150}
              height={48}
              priority
            />
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 17A8 8 0 109 1a8 8 0 000 16zM18 18l-4-4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Search tools...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <Search
        tools={Data}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
