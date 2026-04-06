import { useState } from "react";
import "../styles/Home.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Team Booking",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Booking request sent! We'll contact you shortly.");
    setFormData({ name: "", email: "", service: "Team Booking", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container-custom">
        <div className="contact-grid">
          <div className="contact-content">
            <h2 className="contact-title">
              READY TO<br />TAKE THE FIELD?
            </h2>
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4>STADIUM HQ</h4>
                  <p>442 Arena Way, Performance District<br />Sports City, SC 90210</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h4>BOOKING DESK</h4>
                  <p>+1 (555) 010-TURF<br />Monday - Sunday: 06:00 - 00:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Cristiano R."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="player@kinetic.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>SERVICE TYPE</label>
                <select name="service" value={formData.service} onChange={handleChange}>
                  <option>Team Booking</option>
                  <option>Tournament</option>
                  <option>Individual Skills</option>
                </select>
              </div>
              <div className="form-group">
                <label>MESSAGE</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your training requirements..."
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                SEND TRANSMISSION
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;