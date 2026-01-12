import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      setTheme(storedTheme);
      // Set immediately to prevent flash
      document.documentElement.setAttribute('data-theme', storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      // Set light theme immediately
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

    setMounted(true);
  }, []);

  // Update localStorage and document class when theme changes (only after mount)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Also add class for easier CSS targeting
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Always render children to prevent unmount/remount cycles
  // Theme will be applied via useEffect even if not yet mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


