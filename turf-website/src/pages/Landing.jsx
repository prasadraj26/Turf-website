import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Phone, Mail, Clock, Trophy, Users, Star } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="text-gradient">Book Your Turf Instantly</h1>
          <p>Experience the best sports turf in the city. Play anytime, anywhere.</p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary">Book Now</Link>
            <a href="#services" className="btn btn-outline">Explore Turf</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2 className="text-gradient">Why Choose TurfSpot?</h2>
            <p>We provide a premium, state-of-the-art sports environment designed for athletes of all levels. From FIFA-approved football turfs to professional badminton courts, our facilities guarantee a world-class playing experience.</p>
            <ul className="features-list">
              <li><Trophy className="feature-icon" /> Premium Quality Artificial Grass</li>
              <li><Users className="feature-icon" /> Spacious Playing Areas</li>
              <li><Star className="feature-icon" /> Excellent Lighting & Ventilation</li>
            </ul>
          </div>
          <div className="about-stats glass">
            <div className="stat-item">
              <h3>3+</h3>
              <p>Sports</p>
            </div>
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Happy Athletes</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Open Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>Our Facilities</h2>
        <div className="services-grid">
          <div className="service-card glass">
            <h3>Cricket Turf</h3>
            <p>Premium artificial grass for an authentic cricketing experience.</p>
            <Link to="/book" className="btn btn-outline card-btn">Book Cricket</Link>
          </div>
          <div className="service-card glass">
            <h3>Football Turf</h3>
            <p>FIFA standard turf for 5v5 and 7v7 matches.</p>
            <Link to="/book" className="btn btn-outline card-btn">Book Football</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section glass">
        <h2>Contact Us</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-item">
              <MapPin className="contact-icon" />
              <div>
                <h4>Address</h4>
                <p>123 Sports Avenue, Cityville</p>
              </div>
            </div>
            <div className="info-item">
              <Phone className="contact-icon" />
              <div>
                <h4>Phone</h4>
                <p>+1 234 567 8900</p>
              </div>
            </div>
            <div className="info-item">
              <Mail className="contact-icon" />
              <div>
                <h4>Email</h4>
                <p>hello@turfspot.com</p>
              </div>
            </div>
            <div className="info-item">
              <Clock className="contact-icon" />
              <div>
                <h4>Hours</h4>
                <p>Mon-Sun: 6:00 AM - 12:00 AM</p>
              </div>
            </div>
          </div>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" className="form-input" />
            <input type="email" placeholder="Your Email" className="form-input" />
            <textarea placeholder="Your Message" rows="4" className="form-input"></textarea>
            <button type="button" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 TurfSpot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
