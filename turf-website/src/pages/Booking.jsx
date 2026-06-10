import React, { useState, useMemo, useEffect, useRef } from "react";
import Navbar from '../components/Navbar';
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore';
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
  defaultBookSlot: "10",
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
  }
};

const getDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getShortDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const getShortMonthName = (year, month, day) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
};

const formatSlotLabel = (time24) => {
  const [hours] = time24.split(':');
  const hour = parseInt(hours, 10);
  const nextHour = (hour + 1) % 24;
  const startAmpm = hour >= 12 ? 'PM' : 'AM';
  const endAmpm = nextHour >= 12 ? 'PM' : 'AM';
  const startH = hour % 12 || 12;
  const endH = nextHour % 12 || 12;
  if (startAmpm === endAmpm) {
    return `${startH} to ${endH} ${endAmpm}`;
  }
  return `${startH} ${startAmpm} to ${endH} ${endAmpm}`;
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
  const date = new Date(dateTimeStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const timeMinutes = timeToMinutes(timeStr);

  const specialRules = pricingData.pricingRules.Special.filter(r => r.date === dateTimeStr);
  for (const rule of specialRules) {
    if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) return parseInt(rule.price, 10);
  }

  const dayRules = pricingData.pricingRules[dayName];
  if (dayRules) {
    for (const rule of dayRules) {
      if (isTimeInRule(timeMinutes, rule.start_time, rule.end_time)) return parseInt(rule.price, 10);
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
  return isLightTime
    ? parseInt(pricingData.defaultPrice, 10)
    : parseInt(pricingData.defaultPriceNoLight, 10);
};

const getSlotStatus = (dateTimeStr, timeStr, selectedSlotsList, firestoreBookings = []) => {
  const slotKey = `${dateTimeStr}|${timeStr}`;
  if (selectedSlotsList.includes(slotKey)) return 'selected';

  const isBookedInFirestore = firestoreBookings.some(
    b => b.date === dateTimeStr && b.timeSlots && b.timeSlots.includes(timeStr) && b.bookingStatus === 'confirmed'
  );
  if (isBookedInFirestore) return 'confirmed';

  return 'available';
};

const buildDateStrip = (totalDays = 30) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
    });
  }
  return dates;
};

function Booking() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  });
  const [selectedSlotsList, setSelectedSlotsList] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [firestoreBookings, setFirestoreBookings] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    customerName: '',
    customerPhone: '',
    teamName: '',
    email: ''
  });
  const dateStripRef = useRef(null);

  const dateStrip = useMemo(() => buildDateStrip(30), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookings = [];
      snapshot.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));
      setFirestoreBookings(bookings);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (dateStripRef.current) {
      const todayEl = dateStripRef.current.querySelector('.date-strip-item.active');
      if (todayEl) todayEl.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }, []);

  const getDateString = ({ year, month, day }) =>
    `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const isSlotTimePast = (timeStr) => {
    const selDate = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
    const nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    if (selDate > nowDate) return false;
    if (selDate < nowDate) return true;
    const slotHour = parseInt(timeStr.split(':')[0], 10);
    return slotHour <= new Date().getHours();
  };

  const groupedSlots = {
    "Early Morning": allTimeSlots.slice(0, 6),
    "Morning": allTimeSlots.slice(6, 12),
    "Afternoon": allTimeSlots.slice(12, 18),
    "Evening": allTimeSlots.slice(18, 24),
  };

  const getSlotStatusForDisplay = (timeStr) => {
    const dateTimeStr = getDateString(selectedDate);
    if (isSlotTimePast(timeStr)) return 'timeup';
    return getSlotStatus(dateTimeStr, timeStr, selectedSlotsList, firestoreBookings);
  };

  const getSlotPriceForDisplay = (timeStr) => {
    const dateTimeStr = getDateString(selectedDate);
    return getPriceForSlot(dateTimeStr, timeStr);
  };

  const handleSlotSelect = (slot) => {
    const dateTimeStr = getDateString(selectedDate);
    const status = getSlotStatusForDisplay(slot);

    if (status === 'timeup') return;
    if (status === 'confirmed') {
      alert("This slot is already confirmed and booked. Please choose another slot.");
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

  const getTotalSelectedPrice = () =>
    selectedSlotsList.reduce((total, slotKey) => {
      const [dateStr, timeStr] = slotKey.split('|');
      return total + getPriceForSlot(dateStr, timeStr);
    }, 0);

  const handleProceedToBooking = () => {
    if (selectedSlotsList.length === 0) {
      alert("Please select at least one time slot");
      return;
    }
    setShowUserForm(true);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!userDetails.customerName || !userDetails.customerPhone) {
      alert("Please enter your name and phone number");
      return;
    }

    setIsBooking(true);

    try {
      const timeSlots = selectedSlotsList.map(slotKey => {
        const [_, timeStr] = slotKey.split('|');
        return timeStr;
      });

      const totalPrice = getTotalSelectedPrice();
      const dateTimeStr = getDateString(selectedDate);

      const bookingData = {
        customerName: userDetails.customerName,
        customerPhone: userDetails.customerPhone,
        teamName: userDetails.teamName || 'Individual',
        email: userDetails.email || '',
        date: dateTimeStr,
        timeSlots: timeSlots,
        bookingStatus: 'confirmed',
        bookingType: 'online',
        price: totalPrice,
        duration: 60 * timeSlots.length,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        notes: `Booked online on ${new Date().toLocaleString()}`
      };

      console.log('Saving booking to Firebase:', bookingData);
      
      await addDoc(collection(db, 'bookings'), bookingData);

      alert(
        `🎉 Booking Confirmed! 🎉\n\n` +
        `Customer: ${userDetails.customerName}\n` +
        `Phone: ${userDetails.customerPhone}\n` +
        `Date: ${dateTimeStr}\n` +
        `Slots: ${timeSlots.join(', ')}\n` +
        `Total Amount: ₹${totalPrice}\n\n` +
        `Thank you for booking with us!`
      );
      
      // Reset form
      setSelectedSlotsList([]);
      setShowUserForm(false);
      setUserDetails({
        customerName: '',
        customerPhone: '',
        teamName: '',
        email: ''
      });
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking. Please try again. Error: ' + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const isDateSelected = (d) =>
    d.year === selectedDate.year &&
    d.month === selectedDate.month &&
    d.day === selectedDate.day;

  const isDateToday = (d) => {
    return d.year === today.getFullYear() &&
      d.month === today.getMonth() &&
      d.day === today.getDate();
  };

  const renderSlotMeta = (status, price) => {
    if (status === 'timeup') return <span className="slot-meta timeup-label">Time Up</span>;
    if (status === 'confirmed') return <span className="slot-meta booked-label">Booked</span>;
    if (status === 'selected') return <span className="slot-meta selected-label">₹{price} ✓</span>;
    
    const defaultP = parseInt(pricingData.defaultPrice, 10);
    if (price < defaultP) {
      return (
        <span className="slot-meta price-label">
          <s className="old-price">₹{defaultP}</s>
          <span className="new-price"> ₹{price}</span>
        </span>
      );
    }
    return <span className="slot-meta price-label"><span className="new-price">₹{price}</span></span>;
  };

  return (
    <div className="booking-page-wrapper">
      <Navbar />

      <main className="booking-page-main">
        <div className="booking-container-inner">

          <h1 className="booking-main-title">Book Your Slot</h1>

          {/* Date Strip */}
          <div className="date-strip-wrapper">
            <button className="strip-nav" onClick={() => {
              if (dateStripRef.current) dateStripRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            }}>{'<'}</button>

            <div className="date-strip" ref={dateStripRef}>
              {dateStrip.map((d, i) => (
                <button
                  key={i}
                  className={`date-strip-item ${isDateSelected(d) ? 'active' : ''} ${isDateToday(d) ? 'today' : ''}`}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedSlotsList([]);
                  }}
                >
                  <span className="strip-day-num">{d.day}</span>
                  <span className="strip-day-name">{getShortDayName(d.year, d.month, d.day)}</span>
                  <span className="strip-month">{getShortMonthName(d.year, d.month, d.day)}</span>
                </button>
              ))}
            </div>

            <button className="strip-nav" onClick={() => {
              if (dateStripRef.current) dateStripRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            }}>{'>'}</button>
          </div>

          {/* Slot Groups */}
          <div className="slots-section">
            {Object.entries(groupedSlots).map(([sessionName, slots]) => {
              const slotsWithMeta = slots.map(slot => ({
                time: slot,
                status: getSlotStatusForDisplay(slot),
                price: getSlotPriceForDisplay(slot),
              }));

              const allUnavailable = slotsWithMeta.every(
                s => s.status === 'timeup' || s.status === 'confirmed'
              );

              return (
                <div key={sessionName} className="slot-group">
                  <h3 className="slot-group-title">{sessionName}</h3>

                  {allUnavailable ? (
                    <p className="no-slots-msg">No Slots Available - Time Up/Booked.</p>
                  ) : (
                    <div className="slots-grid-new">
                      {slotsWithMeta.map(({ time, status, price }) => (
                        <div key={time} className="slot-cell">
                          {renderSlotMeta(status, price)}
                          <button
                            className={`slot-btn-new ${status}`}
                            onClick={() => handleSlotSelect(time)}
                            disabled={status === 'timeup' || status === 'confirmed'}
                          >
                            {formatSlotLabel(time)}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Bar */}
          <div className={`booking-summary-bar ${selectedSlotsList.length > 0 ? 'active' : ''}`}>
            <div className="summary-bar-content">
              <div className="summary-info">
                <div className="summary-details">
                  {selectedSlotsList.length > 0 ? (
                    <>
                      <span className="summary-date">{selectedSlotsList.length} slot(s) selected</span>
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
                  onClick={handleProceedToBooking}
                  className={`book-now-btn ${selectedSlotsList.length === 0 ? 'disabled' : ''}`}
                  disabled={selectedSlotsList.length === 0 || isBooking}
                >
                  {pricingData.defaultBookbtnText}
                </button>
              </div>
            </div>
          </div>

          {/* User Details Modal */}
          {showUserForm && (
            <div className="modal-overlay">
              <div className="user-form-modal">
                <h2>Complete Your Booking</h2>
                <form onSubmit={handleUserFormSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={userDetails.customerName}
                      onChange={(e) => setUserDetails({...userDetails, customerName: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={userDetails.customerPhone}
                      onChange={(e) => setUserDetails({...userDetails, customerPhone: e.target.value})}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Team Name (Optional)</label>
                    <input
                      type="text"
                      value={userDetails.teamName}
                      onChange={(e) => setUserDetails({...userDetails, teamName: e.target.value})}
                      placeholder="Enter your team name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email (Optional)</label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="booking-summary-modal">
                    <h4>Booking Summary</h4>
                    <p><strong>Date:</strong> {getDateString(selectedDate)}</p>
                    <p><strong>Slots:</strong> {selectedSlotsList.map(s => s.split('|')[1]).join(', ')}</p>
                    <p><strong>Total Amount:</strong> ₹{getTotalSelectedPrice()}</p>
                  </div>
                  
                  <div className="modal-buttons">
                    <button type="button" onClick={() => setShowUserForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" disabled={isBooking} className="confirm-booking-btn">
                      {isBooking ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Booking;