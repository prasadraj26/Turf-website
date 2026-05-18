// About.jsx
import { useState, useEffect } from "react";
import "../styles/Home.css";

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    const section = document.querySelector('.about-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const facilities = [
    { icon: "sports_score", name: "Flood Lights", desc: "Professional LED lighting" },
    { icon: "local_parking", name: "Parking", desc: "100+ vehicle capacity" },
    { icon: "wash", name: "Washrooms", desc: "Premium changing rooms" },
    { icon: "water_drop", name: "Drinking Water", desc: "Filtered RO system" },
    { icon: "event_seat", name: "Seating Area", desc: "Spectator gallery" },
    { icon: "fitness_center", name: "Equipment", desc: "Training gear available" }
  ];

  return (
    <section className="about-section" id="about">
      <div className="container-custom">
        <div className="about-grid">
          {/* Left Side - Image with Floating Elements */}
          <div className="about-left">
            <div className="about-image-stack">
              <div className="about-image-main">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB15jC-dZeh42M7fRgweTclm4mnOMABoh3S8cymz2S7VNfwq4YIMhScosPrU1hVTxvnc-L8-yIRzLWBVw3B4zmG11QGdKApzUmf_OD9J8jdoyEY7x9ItFe6_OLehPNR5-OHsU7mjhGG7os03ie8sszo22jpGDJtBUwDgnRfSdwvJ0C8U41CLSgpdv1xnv03j4j5B7TMlTTcikAmioJs7qRgGSmWV_aI7lSivFRbTp38pcC0x6woVm-UNx4_w5XB0uXME2GGNRw0uw"
                  alt="Athletes on premium turf"
                />
                <div className="about-image-overlay"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="about-float-card">
                <div className="float-card-icon">🏆</div>
                <div className="float-card-content">
                  <span className="float-number">98%</span>
                  <span className="float-label">Player Satisfaction</span>
                </div>
              </div>
              
              {/* Second Float Card */}
              <div className="about-float-card second">
                <div className="float-card-icon">⚡</div>
                <div className="float-card-content">
                  <span className="float-number">5000+</span>
                  <span className="float-label">Matches Hosted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`about-right ${isVisible ? 'fade-in' : ''}`}>
            <div className="about-badge">
              <span className="badge-dot"></span>
              THE KINETIC ADVANTAGE
            </div>
            
            <h2 className="about-title">
              Where Champions<br />
              <span className="gradient-text">Train & Conquer</span>
            </h2>
            
            <p className="about-description">
              Kinetic Field isn't just a turf—it's a performance ecosystem. Engineered with 
              FIFA-certified materials and maintained to international standards, we provide 
              the perfect surface for athletes to push their limits.
            </p>
            
            <div className="about-features-grid">
              <div className="about-feature-card">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h4>Precision Engineered</h4>
                  <p>Professional-grade surface with optimal ball roll</p>
                </div>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">🛡️</div>
                <div className="feature-text">
                  <h4>Injury Prevention</h4>
                  <p>Advanced shock absorption technology</p>
                </div>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">🌿</div>
                <div className="feature-text">
                  <h4>Eco-Friendly</h4>
                  <p>Sustainable materials & water conservation</p>
                </div>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">📡</div>
                <div className="feature-text">
                  <h4>24/7 Monitoring</h4>
                  <p>Real-time surface quality tracking</p>
                </div>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="about-facilities">
              <h3 className="facilities-title">World-Class Facilities</h3>
              <div className="facilities-grid">
                {facilities.map((facility, idx) => (
                  <div key={idx} className="facility-item">
                    <span className="material-symbols-outlined">{facility.icon}</span>
                    <div>
                      <strong>{facility.name}</strong>
                      <span>{facility.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;