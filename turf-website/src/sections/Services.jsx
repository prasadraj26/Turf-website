// Services.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Home.css";

function Services() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 1,
      icon: "⚽",
      title: "FOOTBALL TURF",
      description: "FIFA-approved 5th generation turf with optimal ball roll and shock absorption. Perfect for 5-a-side, 7-a-side, and full pitch matches.",
      features: ["Floodlights", "Scoreboard", "Changing Rooms"],
      price: "₹1,200",
      period: "/hour",
      popular: true,
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      icon: "🏏",
      title: "CRICKET TURF",
      description: "Professional cricket pitch with artificial grass, bowling machine compatibility, and proper bounce characteristics.",
      features: ["Bowling Machine", "Practice Nets", "LED Scoreboard"],
      price: "₹1,500",
      period: "/hour",
      popular: false,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop"
    },
  
  ];

  return (
    <section className="services-section" id="services">
      <div className="container-custom">
        <div className="services-header">
          <div className="services-label">
            <span className="label-dot"></span>
            WHAT WE OFFER
          </div>
          <h2 className="services-title">
            Premium <span className="gradient-text">Sports Infrastructure</span>
          </h2>
          <p className="services-subtitle">
            Choose from our world-class facilities designed for peak performance
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`service-card-modern ${service.popular ? "popular" : ""}`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.popular && (
                <div className="service-popular-tag">
                  <span>🔥 MOST POPULAR</span>
                </div>
              )}
              
              <div className="service-card-image">
                <img src={service.image} alt={service.title} />
                <div className="service-card-icon">{service.icon}</div>
              </div>
              
              <div className="service-card-content">
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-description">{service.description}</p>
                
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="service-card-footer">
                  <div className="service-price">
                    <span className="price-amount">{service.price}</span>
                    <span className="price-period">{service.period}</span>
                  </div>
                  <Link to="/booking" className="service-book-btn">
                    Book Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Hover Gradient Effect */}
              <div className={`service-hover-glow ${hoveredCard === service.id ? 'active' : ''}`}></div>
            </div>
          ))}
        </div>
        
        {/* CTA Banner */}
        <div className="services-cta">
          <div className="cta-content">
            <span className="cta-badge">⚡ LIMITED TIME OFFER</span>
            <h3>Book 3+ Hours & Get 10% OFF</h3>
            <p>Plus free equipment rental and complimentary refreshments</p>
          </div>
          <Link to="/booking" className="cta-button">
            CLAIM OFFER
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;