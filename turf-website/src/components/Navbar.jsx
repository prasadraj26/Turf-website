import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import './Navbar.css';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/', label: 'Gallery', icon: '📸', hash: 'gallery' },
    { path: '/book', label: 'Book Slot', icon: '⚽', variant: 'cta' },
    { path: '/', label: 'Contact', icon: '📞', hash: 'contact' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">⛳</span>
            <div className="brand-text">
              <span className="brand-name">GoTurf</span>
              <span className="brand-tagline">Premium turf bookings</span>
            </div>
          </Link>

          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/#gallery">Gallery</Link>
            <Link to="/book" className="cta-link">Book Slot</Link>
            <Link to="/#contact">Contact</Link>
          </div>

          <div className="navbar-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </>
  );
};

export default Navbar;