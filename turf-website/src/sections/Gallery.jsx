import { useState } from "react";
import "../styles/Home.css";

function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpIcPGlbUapdy0EdjoTQAGVRB3baqEYdz0ICwTdLjHm29-n0OrWYXYGNR7nyVJBzqqZYNdxnd0Ef9adRHpkVpgraggppU5-hi9sHiWI236kWRLy3okWAC7WRfx1rR8cJT5w11yMxLheCDtLawgoklxiTPFl_w4n6CnZp8u8qyfXBhlkntNmFBB2iYtARX5b7ncuPf_FpEC-PQ3ql-VZP77g0XfdOVTmIplccooMnBJl2ykCaVxsGOpqRJ3N5I5dvs3T-9XUushzw",
      alt: "Turf surface detail"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7ZHGnlSg3LdVBGxNA3Ai9UJeT2jXGEQPFDVXvG3a71AYLsjnbyHGhMcbhrpsd2XAIZ7EijpKYjktGoc76sQwRBp_N1FU2WZNS-kg1EG1PRHV6UQqwBuIHz-O8-nTdgnB69qHa7hMVsVYVA2SLhrQcX7V0dhGoszulncSct8tHgOXYlIz2fnJRoouQac7ByIF-ReIDefZgawCHmybStolqK2fYd3R5UdydlgA2uR4xToivcTD8_UDAROZSfts-A66X1Ni4PY5OQ",
      alt: "Night play"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA38QLigVUADPSLw02yRDMWRB7RDJjVBIi_gkHHbKr2gaCb4SUV4eB0zWyel9TNF1e3HRYbyJWQuFWE5pBGjgRhXSaSOebEbdHgVXrVkid1D07YZNM2KqtPtP9gh1a5ia17QSWMoNlJ71d8S0U0czfrNKJUXcGYqrrL9xJ3X2x1dlwyfvJ6M8dpvFGkyAKYhsW429GhWpdoRNNjyniVJrvdLKj7rrRBIklPyy2hozN519lYFtpTR-0_eDo31UuELbvwl18I2r03g",
      alt: "Player movement"
    }
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container-custom">
        <div className="gallery-grid">
          <div className="gallery-content">
            <h2 className="gallery-title">
              VISUALIZING THE<br />
              <span className="gallery-title-accent">VICTORY.</span>
            </h2>
            <p className="gallery-description">
              Step inside our state-of-the-art facility. From the morning dew to the floodlit nights,
              see the arena in action.
            </p>
            <div className="gallery-controls">
              <button onClick={prevImage} className="gallery-nav">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button onClick={nextImage} className="gallery-nav">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="gallery-images">
            <div className="gallery-main">
              <img src={galleryImages[currentIndex].url} alt={galleryImages[currentIndex].alt} />
            </div>
            <div className="gallery-thumbnails">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`gallery-thumb ${idx === currentIndex ? "active" : ""}`}
                >
                  <img src={img.url} alt={img.alt} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;