import { Link, useLocation } from 'react-router-dom';
import { Home, ImageIcon, Phone } from 'lucide-react';
import '../styles/MobileBottomNav.css';

function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home, hash: null },
    { path: '/', label: 'Gallery', icon: ImageIcon, hash: 'gallery' },
    { path: '/book', label: 'Book', icon: '⚽', hash: null },
    { path: '/', label: 'Contact', icon: Phone, hash: 'contact' },
  ];

  const isActive = (item) => {
    if (item.path === "/" && item.hash) {
      return location.pathname === "/";
    }
    return location.pathname === item.path;
  };

  const handleClick = (e, item) => {
    if (item.path === "/" && item.hash && location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(item.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={index}
            to={item.hash ? { pathname: item.path, hash: `#${item.hash}` } : item.path}
            onClick={(e) => handleClick(e, item)}
            className={`mobile-nav-item ${isActive(item) ? 'active' : ''}`}
          >
            {typeof Icon === 'string' ? <span className="mobile-nav-icon-text">{Icon}</span> : <Icon size={20} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;