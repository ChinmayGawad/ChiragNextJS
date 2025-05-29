"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{
        padding: '0.5rem 1.2rem',
        borderRadius: 8,
        border: '1px solid #ccc',
        background: theme === 'dark' ? '#222' : '#fff',
        color: theme === 'dark' ? '#fff' : '#222',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        transition: 'all 0.2s',
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

ThemeProvider.ThemeSwitcher = ThemeSwitcher; 