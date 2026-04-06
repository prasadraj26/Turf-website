import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuickBookButton from "./components/QuickBookButton";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <Footer />
        <QuickBookButton />
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;