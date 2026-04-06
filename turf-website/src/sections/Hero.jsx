import { Link } from "react-router-dom";
import "../styles/Home.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDetVVPIsU_s0TQBEvXIlb30AeOvDqlwDhXFa9FT-H0X7d_LQrEsJWkZTsUthWCRu1mlJAgqZOEGXvacrjIGnLOUr3eaZ_d3FcEeAs-ARsurDlydTF8Q3A8sm0c74NYQlHdNSPjDzVi61K_SlG8Fm0STSiTQiYuQEeEe2NzznfeyGRUmBoa_1_auuDhYPnWdWm8-sv-6mu3HorZ0brOm5UVktJ960knxOEA7LzPBuTrmt7IYhfJ6pDkS5GoVVUlu0LNbMywgTAeKg"
          alt="Professional turf field"
          className="hero-bg-img"
        />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">The Future of Performance</span>
          <h1 className="hero-title">
            BEYOND THE<br />
            <span className="hero-title-accent">WHITE LINES.</span>
          </h1>
          <p className="hero-description">
            Experience the peak of athletic engineering. Our carbon-neutral,
            professional-grade turf brings the stadium atmosphere to your everyday game.
          </p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn-primary">
              BOOK YOUR FIELD
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <button className="btn-secondary">
              VIRTUAL TOUR
            </button>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-icon">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <div className="hero-stat-label">Shock Absorption</div>
            <div className="hero-stat-value">98% RATING</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;