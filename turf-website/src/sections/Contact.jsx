// Contact.jsx
import { useState } from "react";
import "../styles/Home.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Team Booking",
    date: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("🎉 Booking request sent! Our team will contact you within 2 hours.");
      setFormData({ 
        name: "", email: "", phone: "", 
        service: "Team Booking", date: "", message: "" 
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: "📍", title: "Visit Us", details: "442 Arena Way, Sports City, SC 90210" },
    { icon: "📞", title: "Call Us", details: "+1 (555) 010-TURF\nSupport 24/7" },
    { icon: "✉️", title: "Email", details: "bookings@kineticfield.com" },
    { icon: "⏰", title: "Hours", details: "Monday - Sunday\n06:00 - 00:00" }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="contact-bg-glow"></div>
      
      <div className="container-custom">
        <div className="contact-header">
          <div className="contact-badge">
            <span className="badge-icon">⚡</span>
            RESERVE YOUR SPOT
          </div>
          <h2 className="contact-heading">
            Ready to <span className="gradient-text">Dominate</span> the Field?
          </h2>
          <p className="contact-subheading">
            Secure your slot now and experience the premium difference.
            Limited availability for prime time slots.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Side - Contact Info Cards */}
          <div className="contact-info-side">
            <div className="info-cards">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="info-card">
                  <div className="info-card-icon">{info.icon}</div>
                  <div className="info-card-content">
                    <h4>{info.title}</h4>
                    <p>{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Map Embed */}
            <div className="contact-map">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb2d2a3%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1644262072054!5m2!1sen!2sus"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="contact-form-side">
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Service Type</label>
                  <select name="service" value={formData.service} onChange={handleChange}>
                    <option>Team Booking</option>
                    <option>Tournament</option>
                    <option>Individual Training</option>
                    <option>Corporate Event</option>
                    <option>Birthday Party</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="input-group">
                  <label>Preferred Time (Optional)</label>
                  <select name="time">
                    <option>Any Time</option>
                    <option>06:00 - 09:00</option>
                    <option>09:00 - 12:00</option>
                    <option>12:00 - 15:00</option>
                    <option>15:00 - 18:00</option>
                    <option>18:00 - 21:00</option>
                    <option>21:00 - 00:00</option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label>Special Requests</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific requirements? (coaching, equipment, etc.)"
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="btn-loader"></span>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    SECURE YOUR SLOT
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
              
              <p className="form-note">
                ⚡ Free cancellation up to 2 hours before booking. No hidden fees.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;