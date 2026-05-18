import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Image as ImageIcon, 
  BarChart, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`admin-sidebar glass ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="text-gradient">TurfAdmin</h2>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {currentUser?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <p className="user-name">Admin</p>
          <p className="user-email">{currentUser?.email}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/admin/bookings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={20} /> Bookings
        </NavLink>
        <NavLink to="/admin/slots" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Clock size={20} /> Slots
        </NavLink>
        <NavLink to="/admin/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart size={20} /> Analytics
        </NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
        </button>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
