import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './MobileMenu.css';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { x: '100%', transition: { duration: 0.25, ease: 'easeIn' } },
};

const MobileMenu = ({ isOpen, onClose, navItems, theme, toggleTheme }) => {
  const location = useLocation();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  const handleLinkClick = (item) => {
    onClose();

    if (item.hash && location.pathname === '/') {
      const section = document.getElementById(item.hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mobile-menu-backdrop"
          ref={overlayRef}
          onClick={handleBackdropClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          <motion.aside
            className="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
          >
            <div className="mobile-menu-header">
              <div>
                <div className="mobile-menu-brand">GoTurf</div>
                <p className="mobile-menu-subtitle">Fast booking for premium turf slots.</p>
              </div>
              <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            <div className="mobile-menu-copy">
              <p>Access top turf pages, toggle theme, and book slots in one premium mobile experience.</p>
            </div>

            <nav className="mobile-menu-links" aria-label="Mobile navigation links">
              {navItems.map((item) => {
                const isActive = item.hash
                  ? location.pathname === item.path && location.hash === `#${item.hash}`
                  : location.pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    to={item.hash ? { pathname: item.path, hash: `#${item.hash}` } : item.path}
                    className={`mobile-menu-link ${item.variant === 'cta' ? 'mobile-menu-cta' : ''} ${isActive ? 'active' : ''}`}
                    onClick={() => handleLinkClick(item)}
                  >
                    <span className="mobile-menu-link-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mobile-menu-footer">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <Link to="/admin/login" className="mobile-menu-secondary" onClick={onClose}>
                Admin Login
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
