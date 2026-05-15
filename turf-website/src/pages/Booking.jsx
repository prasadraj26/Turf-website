// Booking.jsx
import { useState, useMemo } from "react";
import "../styles/Booking.css";

// Prcing rules from the JSON data
const pricingData = {
  interval: "60",
  defaultPrice: "800",
  defaultPriceNoLight: "600",
  defaultLightOnTime: "18",
  defaultLightOffTime: "6",
  defaultWeek: "4",
  defaultBookSlot: "3",
  defaultBookSlotMessage: "You have already selected maximum number of allowed slots. Please call 9585323234 to book more slots.",
  defaultBookbtnText: "Continue to booking",
  pendingMessage: "This slot is blocked by someone but not paid. Please call 9585323234 to check the availability.",
  isUserLoggedIn: false,
  selectedSlots: [],
  pricingRules: {
    Sunday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "580" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "690" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "690" }
    ],
    Monday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "480" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "640" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "640" }
    ],
    Tuesday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "480" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "640" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "640" }
    ],
    Wednesday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "480" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "640" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "640" }
    ],
    Thursday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "480" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "640" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "640" }
    ],
    Friday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "580" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "690" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "690" }
    ],
    Saturday: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "580" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "690" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "690" }
    ],
    Special: [
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "580", date: "2024-12-31" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "690", date: "2024-12-31" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "690", date: "2024-12-31" },
      { category: "normal", start_time: "06:00", end_time: "17:00", price: "580", date: "2025-01-01" },
      { category: "normal", start_time: "18:00", end_time: "23:59", price: "690", date: "2025-01-01" },
      { category: "normal", start_time: "00:00", end_time: "05:00", price: "690", date: "2025-01-01" }
    ]
  },
  booked: [
    { date_time: "2026-05-15", start_time: "17:00", end_time: "17:00", category: "pending", price: "580" },
    { date_time: "2026-05-15", start_time: "18:00", end_time: "18:00", category: "pending", price: "690" },
    { date_time: "2026-05-15", start_time: "19:00", end_time: "19:00", category: "pending", price: "690" },
    { date_time: "2026-05-15", start_time: "20:00", end_time: "20:00", category: "pending", price: "690" },
    { date_time: "2026-05-16", start_time: "19:00", end_time: "19:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-16", start_time: "20:00", end_time: "20:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-16", start_time: "21:00", end_time: "21:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-16", start_time: "22:00", end_time: "22:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-16", start_time: "23:00", end_time: "23:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-17", start_time: "00:00", end_time: "00:00", category: "pending", price: "690" },
    { date_time: "2026-05-17", start_time: "01:00", end_time: "01:00", category: "pending", price: "690" },
    { date_time: "2026-05-17", start_time: "15:00", end_time: "15:00", category: "pending", price: "580" },
    { date_time: "2026-05-17", start_time: "16:00", end_time: "16:00", category: "pending", price: "580" },
    { date_time: "2026-05-17", start_time: "19:00", end_time: "19:00", category: "pending", price: "690" },
    { date_time: "2026-05-17", start_time: "20:00", end_time: "20:00", category: "pending", price: "690" },
    { date_time: "2026-05-17", start_time: "21:00", end_time: "21:00", category: "pending", price: "690" }
  ]
};

// Helper to get day name from date
const getDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Helper to format time for display
const formatTimeDisplay = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper to parse time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// Helper to check if a time slot is within a pricing rule
const isTimeInRule = (timeMinutes, ruleStart, ruleEnd) => {
  const startMin = timeToMinutes(ruleStart);
  let endMin = timeToMinutes(ruleEnd);
  
  // Handle overnight rules (e.g., 18:00 to 05:00 next day)
  if (endMin <= startMin) {
    endMin += 24 * 60;
    const adjustedTime = timeMinutes < startMin ? timeMinutes + 24 * 60 : timeMinutes;
    return adjustedTime >= startMin && adjustedTime <= endMin;
  }
  
  return timeMinutes >= startMin && timeMinutes <= endMin;
};

// Get price for a specific date and time
const getPriceForSlot = (dateTimeStr, timeStr) => {
  // Check if slot is in booked list (to get exact price if pending/confirmed)
  const bookedSlot = pricingData.booked.find(
    b => b.date_time === dateTimeStr && b.start_time === timeStr
  );
  if (bookedSlot) {
    return parseInt(bookedSlot.price, 10);
  }
  
  const date = new Date(dateTimeStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const timeMinutes = timeToMinutes(timeStr);
  
  // Check special dates first
  const dateStr = dateTimeStr;
  const specialRules = pricingData.pricingRules.Special.filter(
    rule => rule.date === dateStr
  );
  
  for (const rule of specialRules) {
    if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) {
      return parseInt(rule.price, 10);
    }
  }
  
  // Check day-specific rules
  const dayRules = pricingData.pricingRules[dayName];
  if (dayRules) {
    for (const rule of dayRules) {
      if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) {
        return parseInt(rule.price, 10);
      }
    }
  }
  
  // Check light rules: if time >= light on time OR < light off time, use light price
  const lightOnMinutes = timeToMinutes(pricingData.defaultLightOnTime);
  const lightOffMinutes = timeToMinutes(pricingData.defaultLightOffTime);
  let isLightTime = false;
  
  if (lightOffMinutes <= lightOnMinutes) {
    // Overnight light hours (e.g., 18:00 to 06:00 next day)
    isLightTime = timeMinutes >= lightOnMinutes || timeMinutes < lightOffMinutes;
  } else {
    isLightTime = timeMinutes >= lightOnMinutes && timeMinutes < lightOffMinutes;
  }
  
  if (isLightTime) {
    return parseInt(pricingData.defaultPrice, 10);
  }
  return parseInt(pricingData.defaultPriceNoLight, 10);
};

// Get slot status (available, pending, confirmed, selected)
const getSlotStatus = (dateTimeStr, timeStr, selectedSlotKey) => {
  const slotKey = `${dateTimeStr}|${timeStr}`;
  if (selectedSlotKey === slotKey) return 'selected';
  
  const bookedSlot = pricingData.booked.find(
    b => b.date_time === dateTimeStr && b.start_time === timeStr
  );
  if (bookedSlot) {
    return bookedSlot.category; // 'pending' or 'confirmed'
  }
  return 'available';
};

// Check if a slot is bookable (not confirmed, and not pending for user)
const isSlotBookable = (status) => {
  return status === 'available' || status === 'selected';
};

function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotsList, setSelectedSlotsList] = useState([]);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + currentMonthOffset;
  const currentDay = today.getDate();

  // Get days in month
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Get first day of month (0 = Sunday, adjust for Monday first)
  const firstDayIndex = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [currentYear, currentMonth]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [firstDayIndex, daysInMonth]);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate time slots from 00:00 to 23:00 with 60 min interval
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      slots.push(`${hourStr}:00`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Group slots by session
  const groupedSlots = {
    "Late Night (12AM - 5AM)": allTimeSlots.slice(0, 6),
    "Early Morning (6AM - 11AM)": allTimeSlots.slice(6, 12),
    "Afternoon (12PM - 5PM)": allTimeSlots.slice(12, 18),
    "Evening & Night (6PM - 11PM)": allTimeSlots.slice(18, 24),
  };

  const handleDateSelect = (day) => {
    if (day && day >= currentDay) {
      setSelectedDate(day);
      setSelectedSlot(null);
    }
  };

  const getDateString = (day) => {
    return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const getDayNameForDate = (day) => {
    return getDayName(currentYear, currentMonth, day);
  };

  const getSlotPriceForDisplay = (timeStr) => {
    if (!selectedDate) return null;
    const dateTimeStr = getDateString(selectedDate);
    return getPriceForSlot(dateTimeStr, timeStr);
  };

  const getSlotStatusForDisplay = (timeStr) => {
    if (!selectedDate) return 'available';
    const dateTimeStr = getDateString(selectedDate);
    const selectedKey = selectedSlot ? `${dateTimeStr}|${selectedSlot}` : null;
    return getSlotStatus(dateTimeStr, timeStr, selectedKey);
  };

  const handleSlotSelect = (slot) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }
    
    const dateTimeStr = getDateString(selectedDate);
    const status = getSlotStatusForDisplay(slot);
    
    if (status === 'confirmed') {
      alert("This slot is already confirmed and booked. Please choose another slot.");
      return;
    }
    
    if (status === 'pending') {
      alert(pricingData.pendingMessage);
      return;
    }
    
    // Check maximum slots limit
    if (selectedSlotsList.length >= parseInt(pricingData.defaultBookSlot, 10) && selectedSlot !== slot) {
      alert(pricingData.defaultBookSlotMessage);
      return;
    }
    
    setSelectedSlot(slot);
    
    // Update selected slots list
    const slotKey = `${dateTimeStr}|${slot}`;
    if (selectedSlot === slot) {
      // Deselect
      setSelectedSlot(null);
      setSelectedSlotsList(prev => prev.filter(s => s !== slotKey));
    } else {
      // Select new slot
      setSelectedSlot(slot);
      if (!selectedSlotsList.includes(slotKey)) {
        setSelectedSlotsList(prev => [...prev, slotKey]);
      }
    }
  };

  const handleBooking = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    
    const dateTimeStr = getDateString(selectedDate);
    const price = getSlotPriceForDisplay(selectedSlot);
    const formattedTime = formatTimeDisplay(selectedSlot);
    const dayName = getDayNameForDate(selectedDate);
    
    alert(
      `Booking Details:\n` +
      `${dayName}, ${monthNames[currentMonth]} ${selectedDate}, ${currentYear}\n` +
      `Time: ${formattedTime}\n` +
      `Total: ₹${price}\n\n` +
      `Proceed to payment?`
    );
  };

  const formatSelectedDateDisplay = () => {
    if (!selectedDate) return "No Date Selected";
    return `${getDayNameForDate(selectedDate).toUpperCase()}, ${monthNames[currentMonth].toUpperCase().slice(0, 3)} ${selectedDate}`;
  };

  const getSelectedSlotPrice = () => {
    if (!selectedSlot || !selectedDate) return 0;
    return getSlotPriceForDisplay(selectedSlot);
  };

  const goToPreviousMonth = () => {
    setCurrentMonthOffset(prev => prev - 1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedSlotsList([]);
  };

  const goToNextMonth = () => {
    setCurrentMonthOffset(prev => prev + 1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedSlotsList([]);
  };

  const isDateInPast = (day) => {
    if (currentMonthOffset !== 0) return false;
    return day < currentDay;
  };

  const isDateSelectable = (day) => {
    if (!day) return false;
    if (currentMonthOffset < 0) return false;
    if (currentMonthOffset === 0 && day < currentDay) return false;
    return true;
  };

  // Get slot button style based on status
  const getSlotButtonClass = (status) => {
    switch (status) {
      case 'selected':
        return 'slot-btn selected';
      case 'confirmed':
        return 'slot-btn confirmed';
      case 'pending':
        return 'slot-btn pending';
      default:
        return 'slot-btn';
    }
  };

  const getSlotButtonText = (timeStr, status) => {
    const formattedTime = formatTimeDisplay(timeStr);
    if (status === 'confirmed') return `${formattedTime} (Booked)`;
    if (status === 'pending') return `${formattedTime} (Pending)`;
    return formattedTime;
  };

  const getSlotPriceClass = (status) => {
    if (status === 'confirmed') return 'slot-price confirmed-price';
    if (status === 'pending') return 'slot-price pending-price';
    return 'slot-price';
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
              alt="Professional football stadium turf at dusk"
            />
            <div className="booking-hero-stats">
              <p className="stats-number">98% RATED</p>
              <p className="stats-label">Premium Surface Experience</p>
            </div>
          </div>
        </div>

        {/* Booking Interface */}
        <div className="booking-interface">
          {/* Left Column - Date Selection */}
          <div className="booking-left">
            <div className="date-card">
              <div className="date-card-header">
                <button onClick={goToPreviousMonth} className="month-nav-btn" aria-label="Previous month">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h2>
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button onClick={goToNextMonth} className="month-nav-btn" aria-label="Next month">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="calendar-weekdays">
                {weekdays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-days">
                {calendarDays.map((day, idx) => {
                  const isSelectable = day && isDateSelectable(day);
                  const isSelected = day === selectedDate;
                  const isPast = day && isDateInPast(day);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => isSelectable && handleDateSelect(day)}
                      className={`calendar-day ${!day ? "empty" : ""} ${
                        isSelected ? "selected" : ""
                      } ${isPast || !isSelectable ? "disabled" : ""}`}
                      disabled={!isSelectable}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="tip-card">
              <p className="tip-title">PRICING INFO</p>
              <p className="tip-text">
                • Morning slots (6AM - 5PM): Lower rates<br />
                • Evening slots (6PM - 5AM): Higher rates (floodlights)<br />
                • Weekend rates are higher than weekdays<br />
                • Special event days have premium pricing
              </p>
            </div>
          </div>

          {/* Right Column - Slot Selection */}
          <div className="booking-right">
            <div className="slots-card">
              <div className="slots-header">
                <div>
                  <h2>Available Slots</h2>
                  <p>
                    Showing availability for{" "}
                    {selectedDate ? `${getDayNameForDate(selectedDate)}, ${monthNames[currentMonth]} ${selectedDate}` : "selected date"}
                  </p>
                </div>
                <div className="slot-legend">
                  <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>AVAILABLE</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>SELECTED</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color pending"></div>
                    <span>PENDING</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color confirmed"></div>
                    <span>BOOKED</span>
                  </div>
                </div>
              </div>

              {!selectedDate ? (
                <div className="no-date-warning">
                  <span className="material-symbols-outlined">event_note</span>
                  <p>Please select a date to view available time slots</p>
                </div>
              ) : (
                Object.entries(groupedSlots).map(([sessionName, slots]) => {
                  // Filter slots that have at least one available or pending/confirmed
                  const slotsWithStatus = slots.map(slot => ({
                    time: slot,
                    status: getSlotStatusForDisplay(slot),
                    price: getSlotPriceForDisplay(slot)
                  }));
                  
                  return (
                    <div key={sessionName} className="slot-group">
                      <div className="slot-group-header">
                        <span className="material-symbols-outlined">
                          {sessionName.includes("Morning") ? "wb_sunny" : 
                           sessionName.includes("Afternoon") ? "light_mode" : 
                           sessionName.includes("Night") ? "nights_stay" : "dark_mode"}
                        </span>
                        <span>{sessionName}</span>
                      </div>
                      <div className="slots-grid">
                        {slotsWithStatus.map(({ time, status, price }) => (
                          <div key={time} className="slot-item">
                            <p className={getSlotPriceClass(status)}>
                              ₹{price}
                            </p>
                            <button
                              onClick={() => handleSlotSelect(time)}
                              className={getSlotButtonClass(status)}
                              disabled={status === 'confirmed' || status === 'pending'}
                            >
                              {getSlotButtonText(time, status)}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Booking Summary */}
            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-badge">
                  <span className="material-symbols-outlined">check_circle</span>
                  {selectedSlotsList.length > 0 ? `${selectedSlotsList.length} Slot${selectedSlotsList.length > 1 ? 's' : ''} Selected` : "Selected Slot"}
                </div>
                <div className="summary-datetime">
                  <h3>{formatSelectedDateDisplay()}</h3>
                  {selectedSlot && <span>@ {formatTimeDisplay(selectedSlot)}</span>}
                  {!selectedSlot && selectedDate && <span className="summary-placeholder">No slot selected</span>}
                  {!selectedDate && <span className="summary-placeholder">Select a date first</span>}
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
                  ₹{getSelectedSlotPrice()}
                </p>
                <button 
                  onClick={handleBooking} 
                  className="confirm-btn"
                  disabled={!selectedDate || !selectedSlot}
                >
                  {pricingData.defaultBookbtnText}
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