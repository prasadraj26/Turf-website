import Hero from "../sections/Hero";
import About from "../sections/About";
import Services from "../sections/Services";
import Gallery from "../sections/Gallery";
import Contact from "../sections/Contact";

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
    </main>
  );
}

export default Home;