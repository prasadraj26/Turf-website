import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="text-gradient">TurfSpot</span>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <Link to="/book">Book Slot</Link>
          <a href="#contact">Contact</a>
        </div>
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="mobile-menu-btn" aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;