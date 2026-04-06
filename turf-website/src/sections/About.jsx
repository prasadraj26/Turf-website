import "../styles/Home.css";

function About() {
  return (
    <section className="about-section">
      <div className="container-custom">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <div className="about-image">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB15jC-dZeh42M7fRgweTclm4mnOMABoh3S8cymz2S7VNfwq4YIMhScosPrU1hVTxvnc-L8-yIRzLWBVw3B4zmG11QGdKApzUmf_OD9J8jdoyEY7x9ItFe6_OLehPNR5-OHsU7mjhGG7os03ie8sszo22jpGDJtBUwDgnRfSdwvJ0C8U41CLSgpdv1xnv03j4j5B7TMlTTcikAmioJs7qRgGSmWV_aI7lSivFRbTp38pcC0x6woVm-UNx4_w5XB0uXME2GGNRw0uw"
                alt="Athletes on turf"
              />
            </div>
            <div className="about-stats-card">
              <span className="about-stats-number">15+</span>
              <span className="about-stats-label">Years of Engineering Excellence</span>
            </div>
          </div>

          <div className="about-content">
            <h2 className="about-title">
              WHERE LEGENDS <span className="about-title-accent">ACCELERATE.</span>
            </h2>
            <div className="about-text">
              <p>
                At Kinetic Field, we don't just provide a surface; we provide a performance canvas.
                Our proprietary 5th-generation fiber technology mimics the exact resistance and
                grip of natural grass, minus the unpredictability.
              </p>
              <p>
                Designed for elite athletes and weekend warriors alike, our arena integrates
                biometric lighting and professional-grade drainage to ensure your play is never
                compromised by the elements.
              </p>
            </div>
            <div className="about-features">
              <div className="about-feature">
                <span className="material-symbols-outlined">verified</span>
                <h4>FIFA Preferred</h4>
                <p>Meets global standards for ball roll and bounce.</p>
              </div>
              <div className="about-feature">
                <span className="material-symbols-outlined">eco</span>
                <h4>Eco-Engineered</h4>
                <p>100% recyclable infill and base systems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;