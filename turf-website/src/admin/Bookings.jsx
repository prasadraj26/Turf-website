import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Plus, X, Trash2 } from 'lucide-react';
import '../pages/AdminDashboardModal.css';

const Bookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    sportType: 'cricket',
    date: '',
    timeSlots: '',
    price: ''
  });

  useEffect(() => {
    // Fetch all bookings instead of just 5
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      setAllBookings(bookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOfflineBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const timeSlotsArray = formData.timeSlots.split(',').map(s => s.trim());
      
      await addDoc(collection(db, 'bookings'), {
        userName: formData.userName,
        sportType: formData.sportType,
        date: formData.date,
        timeSlots: timeSlotsArray,
        price: Number(formData.price),
        bookingStatus: 'confirmed',
        type: 'offline',
        createdAt: serverTimestamp()
      });
      
      setShowModal(false);
      setFormData({ userName: '', sportType: 'cricket', date: '', timeSlots: '', price: '' });
      alert("Offline booking added successfully!");
    } catch (error) {
      console.error("Error adding offline booking:", error);
      alert("Failed to add booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateDoc(doc(db, 'bookings', id), {
          bookingStatus: 'cancelled'
        });
        alert("Booking cancelled successfully.");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-section glass">
      <div className="section-header">
        <h3>Manage All Bookings</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Offline Booking
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User / Team</th>
              <th>Type</th>
              <th>Date</th>
              <th>Slots</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center">Loading...</td></tr>
            ) : allBookings.length > 0 ? (
              allBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="font-medium">
                    {booking.userName || booking.teamName}
                    {booking.type === 'offline' && <span style={{fontSize: '0.7rem', marginLeft: '8px', color: '#f59e0b'}}>(Offline)</span>}
                  </td>
                  <td className="capitalize">{booking.sportType || 'Turf'}</td>
                  <td>{booking.date}</td>
                  <td>{booking.timeSlots?.join(', ') || '-'}</td>
                  <td>₹{booking.price}</td>
                  <td>
                    <span className={`status-badge ${booking.bookingStatus}`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td>
                    {booking.bookingStatus !== 'cancelled' && (
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ borderColor: '#ef4444', color: '#ef4444', padding: '4px 8px' }}
                        onClick={() => handleCancelBooking(booking.id)}
                        title="Cancel Booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Offline Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Offline Booking</h3>
              <button className="close-btn-modal" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleOfflineBookingSubmit} className="modal-form">
              <div className="form-group">
                <label>Team/User Name</label>
                <input type="text" name="userName" value={formData.userName} onChange={handleInputChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Sport Type</label>
                <select name="sportType" value={formData.sportType} onChange={handleInputChange} className="form-input">
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="badminton">Badminton</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date (YYYY-MM-DD)</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Time Slots (comma separated, e.g. 18:00, 19:00)</label>
                <input type="text" name="timeSlots" value={formData.timeSlots} onChange={handleInputChange} required className="form-input" placeholder="18:00, 19:00" />
              </div>
              <div className="form-group">
                <label>Total Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="form-input" />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting} style={{marginTop: '16px'}}>
                {isSubmitting ? 'Saving...' : 'Confirm Offline Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
