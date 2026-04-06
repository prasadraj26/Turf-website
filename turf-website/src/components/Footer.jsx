import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">KINETIC FIELD</div>
        <nav className="footer-nav">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Play</a>
          <a href="#">Membership</a>
        </nav>
        <div className="footer-divider"></div>
        <p className="footer-copyright">
          © 2024 THE KINETIC FIELD. PREMIUM TURF EXPERIENCE.
        </p>
      </div>
    </footer>
  );
}

export default Footer;