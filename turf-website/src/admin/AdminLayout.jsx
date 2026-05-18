import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import '../pages/AdminDashboard.css'; // Reuse existing styles

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="admin-main">
        <header className="admin-header glass">
          <button className="menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h2>Admin Portal</h2>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
