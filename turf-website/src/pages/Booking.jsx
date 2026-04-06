import { useState } from "react";
import "../styles/Booking.css";

function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSport, setSelectedSport] = useState("Football");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const timeSlots = {
    morning: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM"],
    afternoon: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"],
    evening: ["06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
  };

  const slotPrices = {
    "06:00 AM": 35, "07:00 AM": 35, "08:00 AM": 45, "09:00 AM": 45,
    "12:00 PM": 50, "01:00 PM": 50, "02:00 PM": 50, "03:00 PM": 45,
    "06:00 PM": 55, "07:00 PM": 55, "08:00 PM": 60, "09:00 PM": 60
  };

  const handleDateSelect = (day) => {
    if (day && day >= currentDate.getDate()) {
      setSelectedDate(day);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select both date and time slot");
      return;
    }
    alert(`Booking confirmed for ${selectedSlot} on ${selectedDate}!\nTotal: $${slotPrices[selectedSlot]}`);
  };

  const getSlotPrice = (slot) => {
    return slotPrices[slot] || 45;
  };

  return (
    <main className="booking-page">
      <div className="booking-container">
        {/* Hero Section */}
        <div className="booking-hero">
          <div className="booking-hero-content">
            <span className="booking-badge">Reservation Portal</span>
            <h1 className="booking-title">
              SECURE YOUR <br /> <span className="booking-title-accent">DOMINANCE.</span>
            </h1>
            <p className="booking-description">
              Select your preferred time on our elite FIFA-standard turf. Designed for
              high-performance athletes and casual enthusiasts alike.
            </p>
          </div>
          <div className="booking-hero-image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC87lFrCCnydQoO_ePrdvnGClqyrdUzJocN7mA2bZaohIbl7b0RyzIjxs9XcESFygDqO52uvd0RSb3qms5hwsjsdsRxnZOkZSIZu4zs7ovFXevl4EP3CcUnntAVY1wEGgHO4FUtl5j2DgErNwjHVTNB05852peoiIkkb5Yc_gGun6PlaQLiqRHdSon9Zqfc1VRwrawdtNqP8I8zyC6hKVtH5QU2-0ePYqVSOE0N9UI-H4TtycVecrcg0kBhEZFmLf7QWaUr34vCDw"
              alt="Stadium turf"
            />
            <div className="booking-hero-stats">
              <span className="stats-number">98% RATED</span>
              <span className="stats-label">Premium Surface Experience</span>
            </div>
          </div>
        </div>

        {/* Booking Interface */}
        <div className="booking-interface">
          {/* Left Column - Date Selection */}
          <div className="booking-left">
            <div className="date-card">
              <div className="date-card-header">
                <span className="material-symbols-outlined">calendar_month</span>
                <h2>Select Date</h2>
              </div>
              <div className="calendar-weekdays">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-days">
                {daysArray.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDateSelect(day)}
                    className={`calendar-day ${!day ? "empty" : ""} 
                      ${selectedDate === day ? "selected" : ""}
                      ${day && day < currentDate.getDate() ? "disabled" : ""}`}
                    disabled={!day || day < currentDate.getDate()}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="tip-card">
              <p className="tip-title">PRO TIP</p>
              <p className="tip-text">
                Early morning sessions (6AM - 8AM) include a complimentary hydration pack.
              </p>
            </div>
          </div>

          {/* Right Column - Slot Selection */}
          <div className="booking-right">
            <div className="slots-card">
              <div className="slots-header">
                <div>
                  <h2>Available Slots</h2>
                  <p>Showing availability for {selectedDate ? `Oct ${selectedDate}` : "selected date"}</p>
                </div>
                <div className="slot-legend">
                  <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>

              {/* Morning Slots */}
              <div className="slot-group">
                <div className="slot-group-header">
                  <span className="material-symbols-outlined">wb_sunny</span>
                  <span>Morning Sessions</span>
                </div>
                <div className="slots-grid">
                  {timeSlots.morning.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="slot-group">
                <div className="slot-group-header">
                  <span className="material-symbols-outlined">light_mode</span>
                  <span>Afternoon Sessions</span>
                </div>
                <div className="slots-grid">
                  {timeSlots.afternoon.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                      disabled={slot === "01:00 PM"}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="slot-group">
                <div className="slot-group-header">
                  <span className="material-symbols-outlined">dark_mode</span>
                  <span>Evening Sessions</span>
                </div>
                <div className="slots-grid">
                  {timeSlots.evening.map(slot => (
                    <button
                      key={slot}
                      onClick={() => handleSlotSelect(slot)}
                      className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-badge">Selected Slot</div>
                <div className="summary-datetime">
                  <h3>{selectedDate ? `TUE, OCT ${selectedDate}` : "No Date Selected"}</h3>
                  {selectedSlot && <span>@ {selectedSlot}</span>}
                </div>
                <div className="summary-details">
                  <span>
                    <span className="material-symbols-outlined">timer</span> 60 Min Session
                  </span>
                  <span>
                    <span className="material-symbols-outlined">location_on</span> Kinetic Pitch A
                  </span>
                </div>
              </div>
              <div className="summary-pricing">
                <p className="price-label">Total Investment</p>
                <p className="price-value">
                  ${selectedSlot ? getSlotPrice(selectedSlot) : "0"}.00
                </p>
                <button onClick={handleBooking} className="confirm-btn">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Booking;