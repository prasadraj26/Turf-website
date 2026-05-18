import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const Overview = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      setRecentBookings(bookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="widgets-grid">
        <div className="widget-card glass">
          <div className="widget-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <Calendar size={24} />
          </div>
          <div className="widget-info">
            <h3>Total Bookings</h3>
            <p className="widget-value">{recentBookings.length}</p>
            <p className="widget-trend positive"><TrendingUp size={16} /> Live Data</p>
          </div>
        </div>

        <div className="widget-card glass">
          <div className="widget-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div className="widget-info">
            <h3>Revenue</h3>
            <p className="widget-value">₹{recentBookings.reduce((acc, curr) => acc + (curr.price || 0), 0)}</p>
            <p className="widget-trend positive"><TrendingUp size={16} /> Live Data</p>
          </div>
        </div>

        <div className="widget-card glass">
          <div className="widget-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Users size={24} />
          </div>
          <div className="widget-info">
            <h3>Offline Bookings</h3>
            <p className="widget-value">{recentBookings.filter(b => b.type === 'offline').length}</p>
            <p className="widget-trend neutral">Stable</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section glass" style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <h3>Recent Bookings</h3>
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              ) : recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
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
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center">No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Overview;
