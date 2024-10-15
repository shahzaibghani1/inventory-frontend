import React from 'react';
import Navbar from '../../Extra/Navbar';
import { Navigate } from 'react-router-dom';

function Userdashboard() {
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);

  if (!convert || convert.role !== 'user') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Welcome {convert.name}</h2>
      </div>
    </div>
  );
}

export default Userdashboard;
