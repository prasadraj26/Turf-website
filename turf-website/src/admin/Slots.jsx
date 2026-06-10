import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Slots = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    teamName: '',
    price: 0,
    duration: 60,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(data);
      }
    );
    return () => unsubscribe();
  }, []);

  const allSlots = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, '0')}:00`
  );

  const getSlotPrice = (slot) => {
    const hour = parseInt(slot.split(':')[0]);
    // Simple pricing logic (you can expand this)
    if (hour >= 6 && hour < 18) {
      return 600; // Day time
    } else {
      return 800; // Night time with lights
    }
  };

  const getBookedSlotsForDate = (date) => {
    return bookings
      .filter(
        booking =>
          booking.date === date &&
          booking.bookingStatus === 'confirmed'
      )
      .flatMap((booking) => {
        if (Array.isArray(booking.timeSlots)) {
          return booking.timeSlots;
        }

        if (typeof booking.timeSlots === "string") {
          return [booking.timeSlots];
        }

        if (booking.timeSlot) {
          return [booking.timeSlot];
        }

        return [];
      });
  };

  const bookedSlots = getBookedSlotsForDate(selectedDate);
  console.log("Bookings:", bookings);
  console.log("Selected Date:", selectedDate);
  console.log("Booked Slots:", bookedSlots);
  const pendingSlots = bookings
    .filter(booking => booking.date === selectedDate && booking.bookingStatus === 'pending')
    .flatMap(booking => booking.timeSlots || [booking.timeSlot]);

  const isSlotAvailable = (slot) => {
    return !bookedSlots.includes(slot);
  };

  const handleSlotClick = (slot) => {
    if (!isSlotAvailable(slot)) {
      alert('This slot is already booked!');
      return;
    }

    if (isMultiSelect) {
      setSelectedSlots(prev => 
        prev.includes(slot) 
          ? prev.filter(s => s !== slot)
          : [...prev, slot]
      );
    } else {
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const handleBulkBooking = () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one slot');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot && selectedSlots.length === 0) {
      alert('Please select a slot');
      return;
    }

    if (!bookingForm.customerName || !bookingForm.customerPhone) {
      alert('Please enter customer name and phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const timeSlots = selectedSlots.length > 0 ? selectedSlots : [selectedSlot];
      const totalPrice = timeSlots.length * getSlotPrice(timeSlots[0]);

      const bookingData = {
        customerName: bookingForm.customerName,
        customerPhone: bookingForm.customerPhone,
        teamName: bookingForm.teamName || 'Individual',
        date: selectedDate,
        timeSlots: timeSlots,
        bookingStatus: 'confirmed',
        bookingType: 'admin',
        price: totalPrice,
        duration: bookingForm.duration * timeSlots.length,
        notes: bookingForm.notes,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      alert(`Successfully booked ${timeSlots.length} slot(s) for ${bookingForm.customerName}`);
      
      // Reset form
      setShowBookingModal(false);
      setSelectedSlot(null);
      setSelectedSlots([]);
      setBookingForm({
        customerName: '',
        customerPhone: '',
        teamName: '',
        price: 0,
        duration: 60,
        notes: ''
      });
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('Failed to book slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId, timeSlot) => {
    if (window.confirm(`Are you sure you want to cancel this booking for ${timeSlot}?`)) {
      try {
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking.timeSlots && booking.timeSlots.length > 1) {
          // Remove single slot from multi-slot booking
          const updatedTimeSlots = booking.timeSlots.filter(slot => slot !== timeSlot);
          
          if (updatedTimeSlots.length === 0) {
            await deleteDoc(doc(db, 'bookings', bookingId));
          } else {
            await updateDoc(doc(db, 'bookings', bookingId), {
              timeSlots: updatedTimeSlots,
              price: updatedTimeSlots.length * (booking.price / booking.timeSlots.length)
            });
          }
        } else {
          await deleteDoc(doc(db, 'bookings', bookingId));
        }
        
        alert(`Booking cancelled for ${timeSlot}`);
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const getBookingsForDate = () => {
    return bookings.filter(booking => booking.date === selectedDate);
  };

  const getSlotStatus = (slot) => {
    if (bookedSlots.includes(slot)) return 'booked';
    if (pendingSlots.includes(slot)) return 'pending';
    if (selectedSlots.includes(slot)) return 'selected';
    return 'available';
  };

  return (
    <div className="dashboard-section glass">
      <div className="section-header">
        <h3>Slot Management</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isMultiSelect}
              onChange={(e) => {
                setIsMultiSelect(e.target.checked);
                setSelectedSlots([]);
              }}
            />
            Multi-Select Mode
          </label>
          {isMultiSelect && selectedSlots.length > 0 && (
            <button
              onClick={handleBulkBooking}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Book {selectedSlots.length} Slot(s)
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlots([]);
            setSelectedSlot(null);
          }}
          className="form-input"
          style={{ maxWidth: '200px' }}
        />
      </div>

      {/* Slots Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px', color: 'var(--theme-text)' }}>
          Time Slots - {selectedDate}
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          {allSlots.map(slot => {
            const status = getSlotStatus(slot);
            const price = getSlotPrice(slot);
            
            let backgroundColor;
            let textColor = '#fff';
            let cursor = 'pointer';
            
            switch(status) {
              case 'booked':
                backgroundColor = '#ef4444';
                cursor = 'pointer';
                break;
              case 'pending':
                backgroundColor = '#f59e0b';
                cursor = 'not-allowed';
                break;
              case 'selected':
                backgroundColor = '#3b82f6';
                break;
              default:
                backgroundColor = '#22c55e';
            }
            
            const booking = getBookingsForDate().find(b => 
              b.timeSlots?.includes(slot) || b.timeSlot === slot
            );
            
            return (
              <div
                key={slot}
                onClick={() => status !== 'pending' && handleSlotClick(slot)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  background: backgroundColor,
                  color: textColor,
                  cursor: cursor,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  border: status === 'selected' ? '2px solid #fff' : 'none'
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{slot}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  ₹{price}
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                  {status === 'booked' ? 'BOOKED' : status === 'selected' ? 'SELECTED' : 'AVAILABLE'}
                </div>
                {status === 'booked' && booking && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelBooking(booking.id, slot);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#dc2626',
                      border: '2px solid white',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'flex',
        gap: '24px',
        padding: '16px',
        background: 'var(--theme-card-bg)',
        borderRadius: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)' }}>Total Slots</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--theme-text)' }}>{allSlots.length}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)' }}>Booked</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{bookedSlots.length}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)' }}>Available</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{allSlots.length - bookedSlots.length}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)' }}>Revenue (Today)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--theme-primary)' }}>
            ₹{getBookingsForDate().reduce((sum, b) => sum + (b.price || 0), 0)}
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      <div>
        <h4 style={{ marginBottom: '16px', color: 'var(--theme-text)' }}>Today's Bookings</h4>
        {getBookingsForDate().length === 0 ? (
          <p style={{ color: 'var(--theme-text-secondary)', textAlign: 'center', padding: '40px' }}>
            No bookings for this date
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Time</th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Phone</th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Team</th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getBookingsForDate().map(booking => (
                  <React.Fragment key={booking.id}>
                    {(booking.timeSlots || [booking.timeSlot]).map(slot => (
                      <tr key={`${booking.id}-${slot}`}>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>{slot}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>{booking.customerName}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>{booking.customerPhone}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>{booking.teamName || '-'}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>₹{booking.price / (booking.timeSlots?.length || 1)}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--theme-border)' }}>
                          <button
                            onClick={() => handleCancelBooking(booking.id, slot)}
                            style={{
                              padding: '4px 12px',
                              background: '#ef4444',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'var(--theme-card-bg)',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            border: '1px solid var(--theme-border)'
          }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--theme-text)' }}>
              Book Slot{selectedSlots.length > 1 ? 's' : ''}
            </h3>
            
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--theme-hover)', borderRadius: '8px' }}>
              <strong>Selected {selectedSlots.length > 1 ? 'Slots' : 'Slot'}:</strong>
              <div style={{ marginTop: '8px' }}>
                {(selectedSlots.length > 0 ? selectedSlots : [selectedSlot]).map(slot => (
                  <span key={slot} style={{
                    display: 'inline-block',
                    background: 'var(--theme-primary)',
                    color: 'var(--theme-button-text)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    margin: '4px',
                    fontSize: '14px'
                  }}>
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Customer Name *</label>
              <input
                type="text"
                className="form-input"
                value={bookingForm.customerName}
                onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                placeholder="Enter customer name"
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={bookingForm.customerPhone}
                onChange={(e) => setBookingForm({...bookingForm, customerPhone: e.target.value})}
                placeholder="Enter phone number"
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Team Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={bookingForm.teamName}
                onChange={(e) => setBookingForm({...bookingForm, teamName: e.target.value})}
                placeholder="Enter team name"
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Notes (Optional)</label>
              <textarea
                className="form-input"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                placeholder="Any special requests..."
                rows="3"
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--theme-hover)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Total Amount:</span>
                <strong style={{ color: 'var(--theme-primary)', fontSize: '1.2rem' }}>
                  ₹{(selectedSlots.length > 0 ? selectedSlots.length : 1) * getSlotPrice(selectedSlot || selectedSlots[0])}
                </strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
                Duration: {(selectedSlots.length > 0 ? selectedSlots.length : 1)} hour(s)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedSlot(null);
                  setSelectedSlots([]);
                }}
                style={{
                  padding: '10px 20px',
                  background: 'var(--theme-input-bg)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--theme-text)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  color: 'var(--theme-button-text)',
                  fontWeight: 'bold',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;