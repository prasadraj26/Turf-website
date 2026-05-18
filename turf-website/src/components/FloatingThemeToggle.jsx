// src/components/FloatingThemeToggle.jsx
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

function FloatingThemeToggle() {
  const { themes, currentTheme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.keys(themes);

  return (
    <div className="floating-theme-toggle">
      <button 
        className="floating-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="toggle-icon">🎨</span>
      </button>

      {isOpen && (
        <div className="floating-theme-options">
          {themeList.map((themeKey) => (
            <button
              key={themeKey}
              className={`floating-theme-option ${currentTheme === themeKey ? 'active' : ''}`}
              onClick={() => {
                changeTheme(themeKey);
                setIsOpen(false);
              }}
              style={{ background: themes[themeKey].primary }}
            >
              <span>{themes[themeKey].icon}</span>
              <span>{themes[themeKey].name}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .floating-theme-toggle {
          position: fixed;
          bottom: 100px;
          right: 20px;
          z-index: 1000;
        }

        .floating-toggle-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--theme-primary);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 1.5rem;
        }

        .floating-toggle-btn:hover {
          transform: scale(1.1);
        }

        .floating-theme-options {
          position: absolute;
          bottom: 70px;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-theme-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 40px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .floating-theme-option:hover {
          transform: translateX(-5px);
        }

        .floating-theme-option.active {
          box-shadow: 0 0 0 2px white, 0 0 0 4px var(--theme-primary);
        }
      `}</style>
    </div>
  );
}

export default FloatingThemeToggle;