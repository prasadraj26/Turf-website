import React from 'react';
import AppRoutes from './routes/AppRoutes';
import MobileBottomNav from './components/MobileBottomNav';

function App() {
  return (
    <div className="app-container">
      <AppRoutes />
      <MobileBottomNav />
    </div>
  );
}

export default App;