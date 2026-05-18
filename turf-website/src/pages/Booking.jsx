import React, { useState, useMemo, useEffect } from "react";
import Navbar from '../components/Navbar';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import "./Booking.css";

// Pricing rules from the JSON data
const pricingData = {
  interval: "60",
  defaultPrice: "800",
  defaultPriceNoLight: "600",
  defaultLightOnTime: "18",
  defaultLightOffTime: "6",
  defaultWeek: "4",
  defaultBookSlot: "10", // Increased to allow multiple slots as requested
  defaultBookSlotMessage: "You have already selected maximum number of allowed slots.",
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
    { date_time: "2026-05-16", start_time: "19:00", end_time: "19:00", category: "confirmed", price: "690" },
    { date_time: "2026-05-16", start_time: "20:00", end_time: "20:00", category: "confirmed", price: "690" }
  ]
};

const getDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const formatTimeDisplay = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

const isTimeInRule = (timeMinutes, ruleStart, ruleEnd) => {
  const startMin = timeToMinutes(ruleStart);
  let endMin = timeToMinutes(ruleEnd);
  
  if (endMin <= startMin) {
    endMin += 24 * 60;
    const adjustedTime = timeMinutes < startMin ? timeMinutes + 24 * 60 : timeMinutes;
    return adjustedTime >= startMin && adjustedTime <= endMin;
  }
  
  return timeMinutes >= startMin && timeMinutes <= endMin;
};

const getPriceForSlot = (dateTimeStr, timeStr) => {
  const bookedSlot = pricingData.booked.find(
    b => b.date_time === dateTimeStr && b.start_time === timeStr
  );
  if (bookedSlot) {
    return parseInt(bookedSlot.price, 10);
  }
  
  const date = new Date(dateTimeStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const timeMinutes = timeToMinutes(timeStr);
  
  const specialRules = pricingData.pricingRules.Special.filter(
    rule => rule.date === dateTimeStr
  );
  
  for (const rule of specialRules) {
    if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) {
      return parseInt(rule.price, 10);
    }
  }
  
  const dayRules = pricingData.pricingRules[dayName];
  if (dayRules) {
    for (const rule of dayRules) {
      if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) {
        return parseInt(rule.price, 10);
      }
    }
  }
  
  const lightOnMinutes = timeToMinutes(pricingData.defaultLightOnTime);
  const lightOffMinutes = timeToMinutes(pricingData.defaultLightOffTime);
  let isLightTime = false;
  
  if (lightOffMinutes <= lightOnMinutes) {
    isLightTime = timeMinutes >= lightOnMinutes || timeMinutes < lightOffMinutes;
  } else {
    isLightTime = timeMinutes >= lightOnMinutes && timeMinutes < lightOffMinutes;
  }
  
  if (isLightTime) {
    return parseInt(pricingData.defaultPrice, 10);
  }
  return parseInt(pricingData.defaultPriceNoLight, 10);
};

const getSlotStatus = (dateTimeStr, timeStr, selectedSlotsList, firestoreBookings = []) => {
  const slotKey = `${dateTimeStr}|${timeStr}`;
  if (selectedSlotsList.includes(slotKey)) return 'selected';
  
  const isBookedInFirestore = firestoreBookings.some(
    b => b.date === dateTimeStr && b.timeSlots && b.timeSlots.includes(timeStr)
  );
  if (isBookedInFirestore) {
    const fbBooking = firestoreBookings.find(b => b.date === dateTimeStr && b.timeSlots && b.timeSlots.includes(timeStr));
    return fbBooking.bookingStatus || 'confirmed';
  }

  const bookedSlot = pricingData.booked.find(
    b => b.date_time === dateTimeStr && b.start_time === timeStr
  );
  if (bookedSlot) {
    return bookedSlot.category;
  }
  return 'available';
};

function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotsList, setSelectedSlotsList] = useState([]);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [firestoreBookings, setFirestoreBookings] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookings = [];
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      setFirestoreBookings(bookings);
    });
    return () => unsubscribe();
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + currentMonthOffset;
  const currentDay = today.getDate();

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [currentYear, currentMonth]);

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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      slots.push(`${hourStr}:00`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const groupedSlots = {
    "Late Night": allTimeSlots.slice(0, 6),
    "Early Morning": allTimeSlots.slice(6, 12),
    "Afternoon": allTimeSlots.slice(12, 18),
    "Evening": allTimeSlots.slice(18, 24),
  };

  const handleDateSelect = (day) => {
    if (day && day >= currentDay) {
      setSelectedDate(day);
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
    return getSlotStatus(dateTimeStr, timeStr, selectedSlotsList, firestoreBookings);
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
    
    const slotKey = `${dateTimeStr}|${slot}`;
    
    if (selectedSlotsList.includes(slotKey)) {
      setSelectedSlotsList(prev => prev.filter(s => s !== slotKey));
    } else {
      if (selectedSlotsList.length >= parseInt(pricingData.defaultBookSlot, 10)) {
        alert(pricingData.defaultBookSlotMessage);
        return;
      }
      setSelectedSlotsList(prev => [...prev, slotKey]);
    }
  };

  const getTotalSelectedPrice = () => {
    return selectedSlotsList.reduce((total, slotKey) => {
      const [dateStr, timeStr] = slotKey.split('|');
      return total + getPriceForSlot(dateStr, timeStr);
    }, 0);
  };

  const handleBooking = async () => {
    if (selectedSlotsList.length === 0) {
      alert("Please select at least one time slot");
      return;
    }
    
    setIsBooking(true);
    
    const price = getTotalSelectedPrice();
    const formattedSlots = selectedSlotsList.map(s => {
      const [d, t] = s.split('|');
      return `${d} at ${formatTimeDisplay(t)}`;
    }).join('\n');
    
    setTimeout(() => {
      alert(
        `🎉 Booking Summary 🎉\n\n` +
        `📅 Slots:\n${formattedSlots}\n\n` +
        `💰 Total Amount: ₹${price}\n` +
        `⏱ Total Duration: ${selectedSlotsList.length * 60} Minutes\n\n` +
        `Proceed to payment?`
      );
      setIsBooking(false);
      // Reset after success
      setSelectedSlotsList([]);
    }, 800);
  };

  const goToPreviousMonth = () => {
    setCurrentMonthOffset(prev => prev - 1);
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonthOffset(prev => prev + 1);
    setSelectedDate(null);
  };

  const isDateSelectable = (day) => {
    if (!day) return false;
    if (currentMonthOffset < 0) return false;
    if (currentMonthOffset === 0 && day < currentDay) return false;
    return true;
  };

  const getSlotButtonClass = (status, isHovered) => {
    if (status === 'selected') return 'slot-btn selected';
    if (status === 'confirmed') return 'slot-btn confirmed';
    if (status === 'pending') return 'slot-btn pending';
    if (isHovered) return 'slot-btn hovered';
    return 'slot-btn';
  };

  return (
    <div className="booking-page-wrapper">
      <Navbar />
      <div className="booking-bg-gradient"></div>
      
      <main className="booking-page-main">
        <div className="booking-container-inner">
          {/* Hero Section */}
          <div className="booking-hero glass">
            <div className="booking-hero-badge">
              <span className="hero-badge-icon">⚡</span>
              <span>RESERVE YOUR SPOT</span>
            </div>
            <h1 className="booking-hero-title">
              Book Your <span className="text-gradient">Victory</span> Slot
            </h1>
            <p className="booking-hero-subtitle">
              Premium turf grounds with floodlights. Choose your preferred time and dominate the game.
            </p>
          </div>

          {/* Main Booking Interface */}
          <div className="booking-interface">
            {/* Left Column - Calendar */}
            <div className="booking-left glass">
              <div className="calendar-card">
                <div className="calendar-header">
                  <button onClick={goToPreviousMonth} className="month-nav">
                    {'<'}
                  </button>
                  <h3>{monthNames[currentMonth]} <span>{currentYear}</span></h3>
                  <button onClick={goToNextMonth} className="month-nav">
                    {'>'}
                  </button>
                </div>
                
                <div className="calendar-weekdays">
                  {weekdays.map((day, idx) => (
                    <span key={idx} className="weekday">{day}</span>
                  ))}
                </div>
                
                <div className="calendar-days">
                  {calendarDays.map((day, idx) => {
                    const isSelectable = day && isDateSelectable(day);
                    const isSelected = day === selectedDate;
                    const isToday = day === currentDay && currentMonthOffset === 0;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => isSelectable && handleDateSelect(day)}
                        className={`calendar-day ${!day ? "empty" : ""} 
                          ${isSelected ? "selected" : ""} 
                          ${isToday ? "today" : ""}
                          ${!isSelectable && day ? "disabled" : ""}`}
                        disabled={!isSelectable}
                      >
                        {day}
                        {isSelected && <span className="selected-dot"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Time Slots */}
            <div className="booking-right glass">
              {!selectedDate ? (
                <div className="slots-placeholder">
                  <h4>Select a Date First</h4>
                  <p>Choose your preferred date from the calendar to view available time slots</p>
                </div>
              ) : (
                <>
                  <div className="selected-date-header">
                    <span className="selected-date-day">{getDayNameForDate(selectedDate)}</span>
                    <span className="selected-date-full">
                      {monthNames[currentMonth]} {selectedDate}, {currentYear}
                    </span>
                  </div>
                  
                  <div className="slots-container">
                    {Object.entries(groupedSlots).map(([sessionName, slots]) => {
                      const slotsWithStatus = slots.map(slot => ({
                        time: slot,
                        status: getSlotStatusForDisplay(slot),
                        price: getSlotPriceForDisplay(slot)
                      }));
                      
                      const hasAvailable = slotsWithStatus.some(s => s.status === 'available' || s.status === 'selected');
                      
                      if (!hasAvailable) return null;
                      
                      return (
                        <div key={sessionName} className="slot-group">
                          <div className="slot-group-title">
                            <span>{sessionName}</span>
                          </div>
                          <div className="slots-grid-old">
                            {slotsWithStatus.map(({ time, status, price }) => (
                              <div 
                                key={time} 
                                className="slot-item"
                                onMouseEnter={() => setHoveredSlot(time)}
                                onMouseLeave={() => setHoveredSlot(null)}
                              >
                                <button
                                  onClick={() => handleSlotSelect(time)}
                                  className={getSlotButtonClass(status, hoveredSlot === time)}
                                  disabled={status === 'confirmed' || status === 'pending'}
                                >
                                  <span className="slot-time">{formatTimeDisplay(time)}</span>
                                  {status === 'confirmed' && <span className="slot-badge booked">Booked</span>}
                                  {status === 'pending' && <span className="slot-badge pending">Pending</span>}
                                  {status === 'selected' && <span className="slot-badge selected">Selected</span>}
                                  {status === 'available' && <span className="slot-price-tag">₹{price}</span>}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Booking Summary Bar - Sticky */}
          <div className={`booking-summary-bar glass ${selectedSlotsList.length > 0 ? 'active' : ''}`}>
            <div className="summary-bar-content">
              <div className="summary-info">
                <div className="summary-details">
                  {selectedSlotsList.length > 0 ? (
                    <>
                      <span className="summary-date">
                        {selectedSlotsList.length} slot(s) selected
                      </span>
                      <span className="summary-time">Total Duration: {selectedSlotsList.length * 60} mins</span>
                    </>
                  ) : (
                    <span className="summary-placeholder">No slot selected</span>
                  )}
                </div>
              </div>
              <div className="summary-action">
                <div className="summary-price">
                  <span className="price-label">Total: </span>
                  <span className="price-amount">₹{getTotalSelectedPrice()}</span>
                </div>
                <button 
                  onClick={handleBooking} 
                  className={`btn btn-primary book-now-btn ${selectedSlotsList.length === 0 ? 'disabled' : ''}`}
                  disabled={selectedSlotsList.length === 0 || isBooking}
                >
                  {isBooking ? 'Processing...' : pricingData.defaultBookbtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Booking;