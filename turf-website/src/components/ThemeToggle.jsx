import React from 'react';
import { Moon, Sun } from 'lucide-react';
import './Navbar.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button className="theme-switcher mobile-theme-switcher" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <>
          <Moon size={18} />
          <span>Neon Mode</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
