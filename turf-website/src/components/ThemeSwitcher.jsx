// src/components/ThemeSwitcher.jsx
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

function ThemeSwitcher() {
  const { currentTheme, themes, changeTheme, isThemeMenuOpen, setIsThemeMenuOpen } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="theme-switcher">
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        aria-label="Change theme"
      >
        <span className="theme-icon">{themes[currentTheme]?.icon || '🌙'}</span>
        <span className="theme-name">{themes[currentTheme]?.name || 'Dark'}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ transform: isThemeMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {isThemeMenuOpen && (
        <div className="theme-menu">
          <div className="theme-menu-header">
            <span>🎨 Choose Theme</span>
          </div>
          <div className="theme-options">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                onClick={() => changeTheme(key)}
              >
                <span className="theme-option-icon">{theme.icon}</span>
                <div className="theme-option-info">
                  <span className="theme-option-name">{theme.name}</span>
                  <div className="theme-preview">
                    <div className="preview-color" style={{ background: theme.primary }}></div>
                    <div className="preview-color" style={{ background: theme.accent }}></div>
                    <div className="preview-color" style={{ background: theme.background }}></div>
                  </div>
                </div>
                {currentTheme === key && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .theme-switcher {
          position: relative;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid var(--theme-border, rgba(255,255,255,0.1));
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--theme-text, white);
        }

        .theme-toggle-btn:hover {
          background: var(--theme-primary, #00ff88);
          color: var(--theme-button-text, #0a0a0a);
          transform: translateY(-2px);
        }

        .theme-icon {
          font-size: 1.2rem;
        }

        .theme-name {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .theme-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 280px;
          background: var(--theme-card-bg, rgba(30,30,45,0.95));
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid var(--theme-border, rgba(255,255,255,0.1));
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          z-index: 1000;
          animation: slideDown 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .theme-menu-header {
          padding: 1rem;
          border-bottom: 1px solid var(--theme-border, rgba(255,255,255,0.1));
          font-weight: 600;
          color: var(--theme-text, white);
        }

        .theme-options {
          max-height: 320px;
          overflow-y: auto;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          color: var(--theme-text, white);
        }

        .theme-option:hover {
          background: var(--theme-primary, rgba(0,255,136,0.1));
        }

        .theme-option.active {
          background: var(--theme-primary, rgba(0,255,136,0.15));
          border-left: 3px solid var(--theme-primary, #00ff88);
        }

        .theme-option-icon {
          font-size: 1.5rem;
        }

        .theme-option-info {
          flex: 1;
        }

        .theme-option-name {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .theme-preview {
          display: flex;
          gap: 4px;
        }

        .preview-color {
          width: 20px;
          height: 4px;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .theme-name {
            display: none;
          }
          
          .theme-toggle-btn {
            padding: 0.5rem;
          }
          
          .theme-menu {
            position: fixed;
            top: auto;
            bottom: 80px;
            right: 20px;
            left: auto;
            width: calc(100vw - 40px);
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default ThemeSwitcher;