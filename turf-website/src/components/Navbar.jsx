import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "HOME", hash: null },
    { path: "/", label: "GALLERY", hash: "gallery" },
    { path: "/booking", label: "BOOK", hash: null },
    { path: "/", label: "CONTACT", hash: "contact" },
  ];

  const isActive = (link) => {
    if (link.path === "/" && link.hash) {
      return location.pathname === "/";
    }
    return location.pathname === link.path;
  };

  const handleNavClick = (e, link) => {
    if (link.path === "/" && link.hash && location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(link.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="material-symbols-outlined">sports_soccer</span>
            <span>KINETIC FIELD</span>
          </Link>

          <nav className="navbar-desktop">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`nav-link ${isActive(link) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button className="navbar-signin">SIGN IN</button>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={(e) => {
                handleNavClick(e, link);
                setIsMobileMenuOpen(false);
              }}
              className="mobile-menu-link"
            >
              {link.label}
            </Link>
          ))}
          <button className="mobile-menu-signin">SIGN IN</button>
        </div>
      )}
    </>
  );
}

export default Navbar;