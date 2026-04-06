import { Link, useLocation } from "react-router-dom";
import "../styles/MobileBottomNav.css";

function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "HOME", icon: "home", hash: null },
    { path: "/", label: "GALLERY", icon: "grid_view", hash: "gallery" },
    { path: "/booking", label: "BOOK", icon: "event_available", hash: null },
    { path: "/", label: "CONTACT", icon: "contact_support", hash: "contact" },
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
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          onClick={(e) => handleClick(e, item)}
          className={`mobile-nav-item ${isActive(item) ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default MobileBottomNav;