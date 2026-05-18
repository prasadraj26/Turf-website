// Gallery.jsx
import { useState, useEffect } from "react";
import "../styles/Home.css";

function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const galleryImages = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpIcPGlbUapdy0EdjoTQAGVRB3baqEYdz0ICwTdLjHm29-n0OrWYXYGNR7nyVJBzqqZYNdxnd0Ef9adRHpkVpgraggppU5-hi9sHiWI236kWRLy3okWAC7WRfx1rR8cJT5w11yMxLheCDtLawgoklxiTPFl_w4n6CnZp8u8qyfXBhlkntNmFBB2iYtARX5b7ncuPf_FpEC-PQ3ql-VZP77g0XfdOVTmIplccooMnBJl2ykCaVxsGOpqRJ3N5I5dvs3T-9XUushzw",
      alt: "Premium turf surface",
      title: "Pro-Grade Surface",
      category: "Turf"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7ZHGnlSg3LdVBGxNA3Ai9UJeT2jXGEQPFDVXvG3a71AYLsjnbyHGhMcbhrpsd2XAIZ7EijpKYjktGoc76sQwRBp_N1FU2WZNS-kg1EG1PRHV6UQqwBuIHz-O8-nTdgnB69qHa7hMVsVYVA2SLhrQcX7V0dhGoszulncSct8tHgOXYlIz2fnJRoouQac7ByIF-ReIDefZgawCHmybStolqK2fYd3R5UdydlgA2uR4xToivcTD8_UDAROZSfts-A66X1Ni4PY5OQ",
      alt: "Night game action",
      title: "Floodlit Nights",
      category: "Action"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA38QLigVUADPSLw02yRDMWRB7RDJjVBIi_gkHHbKr2gaCb4SUV4eB0zWyel9TNF1e3HRYbyJWQuFWE5pBGjgRhXSaSOebEbdHgVXrVkid1D07YZNM2KqtPtP9gh1a5ia17QSWMoNlJ71d8S0U0czfrNKJUXcGYqrrL9xJ3X2x1dlwyfvJ6M8dpvFGkyAKYhsW429GhWpdoRNNjyniVJrvdLKj7rrRBIklPyy2hozN519lYFtpTR-0_eDo31UuELbvwl18I2r03g",
      alt: "Players in motion",
      title: "Elite Training",
      category: "Action"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, galleryImages.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container-custom">
        <div className="gallery-header">
          <div className="gallery-badge">
            <span className="badge-icon">📸</span>
            MOMENTS OF GLORY
          </div>
          <h2 className="gallery-heading">
            Capturing <span className="gradient-text">Greatness</span>
          </h2>
          <p className="gallery-subheading">
            Witness the energy, passion, and elite performance at Kinetic Field
          </p>
        </div>

        <div className="gallery-showcase">
          {/* Main Image */}
          <div className="gallery-main-container">
            <div className="gallery-main">
              <img 
                src={galleryImages[currentIndex].url} 
                alt={galleryImages[currentIndex].alt}
              />
              <div className="gallery-main-overlay">
                <div className="gallery-image-caption">
                  <span className="caption-category">{galleryImages[currentIndex].category}</span>
                  <h3 className="caption-title">{galleryImages[currentIndex].title}</h3>
                </div>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button className="gallery-arrow prev" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="gallery-arrow next" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            
            {/* Auto-play Indicator */}
            <div className="gallery-auto-play">
              <button 
                className={`auto-play-btn ${isAutoPlaying ? 'active' : ''}`}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="gallery-thumbnails-container">
            <div className="gallery-thumbnails">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`gallery-thumb ${idx === currentIndex ? "active" : ""}`}
                >
                  <img src={img.url} alt={img.alt} />
                  {idx === currentIndex && <span className="thumb-active-indicator"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="gallery-stats">
          <div className="stat-item">
            <span className="stat-number">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="stat-total">/{galleryImages.length}</span>
          </div>
          <div className="stat-progress">
            <div 
              className="stat-progress-bar" 
              style={{ width: `${((currentIndex + 1) / galleryImages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;