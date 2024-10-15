import React from 'react';
import { Navigate } from 'react-router-dom';
import Vendornavbar from './Vendornavbar';

function Vendordashboard() {
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);

  if (!convert || convert.role !== 'vendor') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      <Vendornavbar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Welcome {convert.name}</h2>
      </div>
    </div>
  );
}

export default Vendordashboard;
