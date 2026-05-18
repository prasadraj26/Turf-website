import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Booking from '../pages/Booking';
import Login from '../pages/Login';
import AdminLayout from '../admin/AdminLayout';
import Overview from '../admin/Overview';
import Bookings from '../admin/Bookings';
import Slots from '../admin/Slots';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/book" element={<Booking />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="slots" element={<Slots />} />
        <Route path="analytics" element={<div className="glass p-6">Analytics coming soon</div>} />
        <Route path="settings" element={<div className="glass p-6">Settings coming soon</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
