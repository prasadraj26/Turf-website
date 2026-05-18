// Hero.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Home.css";

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-section">
      {/* Parallax Background */}
      <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDetVVPIsU_s0TQBEvXIlb30AeOvDqlwDhXFa9FT-H0X7d_LQrEsJWkZTsUthWCRu1mlJAgqZOEGXvacrjIGnLOUr3eaZ_d3FcEeAs-ARsurDlydTF8Q3A8sm0c74NYQlHdNSPjDzVi61K_SlG8Fm0STSiTQiYuQEeEe2NzznfeyGRUmBoa_1_auuDhYPnWdWm8-sv-6mu3HorZ0brOm5UVktJ960knxOEA7LzPBuTrmt7IYhfJ6pDkS5GoVVUlu0LNbMywgTAeKg"
          alt="Professional turf field"
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Animated Gradient Border */}
      <div className="hero-gradient-border"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge-container">
            <span className="hero-badge-pulse"></span>
            <span className="hero-badge">🏆 India's Premier Turf Facility</span>
          </div>
          
          <h1 className="hero-title">
            Book Your<br />
            <span className="hero-title-accent">Victory Slot</span>
          </h1>
          
          <div className="hero-tags">
            <span className="hero-tag">⚽ Football</span>
            <span className="hero-tag">🏏 Cricket</span>
            <span className="hero-tag">🏸 Badminton</span>
          </div>
          
          <p className="hero-description">
            Experience professional-grade turfs with floodlights, changing rooms, 
            and premium amenities. Book your slot in seconds and dominate the game.
          </p>
          
          <div className="hero-buttons">
            <Link to="/booking" className="btn-primary">
              BOOK NOW
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#contact" className="btn-secondary">
              CONTACT US
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="hero-stats-container">
          <div className="hero-stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <div className="stat-value">500+</div>
              <div className="stat-label">Monthly Bookings</div>
            </div>
          </div>
          <div className="hero-stat-card">
            <div className="stat-icon">⭐</div>
            <div>
              <div className="stat-value">4.9</div>
              <div className="stat-label">Rating (2k+ Reviews)</div>
            </div>
          </div>
          <div className="hero-stat-card">
            <div className="stat-icon">🕐</div>
            <div>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Booking Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;