import "../styles/Home.css";

function Services() {
  const services = [
    {
      icon: "groups",
      title: "TEAM BOOKINGS",
      description: "Professional training slots for local clubs and academies with access to high-intensity equipment.",
      price: "$120",
      period: "/hr",
      popular: false
    },
    {
      icon: "stars",
      title: "PREMIUM TOURNAMENTS",
      description: "Full-day facility rental including locker rooms, scoreboard access, and on-site physical therapist.",
      price: "$850",
      period: "/day",
      popular: true
    },
    {
      icon: "fitness_center",
      title: "INDIVIDUAL DRILLS",
      description: "Quarter-field access for individual skill building or private 1-on-1 coaching sessions.",
      price: "$45",
      period: "/hr",
      popular: false
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="container-custom">
        <div className="services-header">
          <div>
            <span className="section-badge">Our Arena</span>
            <h2 className="section-title">ELITE SERVICES</h2>
          </div>
          <button className="services-view-all">
            VIEW FULL PRICING
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card ${service.popular ? "popular" : ""}`}>
              {service.popular && (
                <div className="service-popular-badge">POPULAR</div>
              )}
              <div className={`service-icon ${service.popular ? "popular-icon" : ""}`}>
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-price">
                {service.price}
                <span className="service-period">{service.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;