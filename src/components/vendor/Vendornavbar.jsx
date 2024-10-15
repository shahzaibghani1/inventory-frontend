import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Vendornavbar = () => {
  const navigate = useNavigate();
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);

  const handleLogout = () => {
    // Clear local storage and navigate to login page
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: '#fff', color: '#333', padding: '10px 20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <li>
          <Link to="/vendor" style={{ textDecoration: 'none', color: '#333' }}>Vendor Dashboard</Link>
        </li>
        <li>
          <Link to="/vendorBatchSales" style={{ textDecoration: 'none', color: '#333' }}>Batch Sales</Link>
        </li>
        <li>
          {convert ? (
            <button onClick={handleLogout} style={{ border: 'none', backgroundColor: 'transparent', color: '#333', cursor: 'pointer' }}>Logout</button>
          ) : (
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Vendornavbar;
