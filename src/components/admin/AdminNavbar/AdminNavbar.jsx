import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);

  if (!convert || convert.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  const handleLogout = () => {
    // Clear local storage and navigate to login page
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: '#fff', color: '#333', padding: '10px 20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <li>
          <Link to="/adminUser" style={{ textDecoration: 'none', color: '#333' }}>Admin User Dashboard</Link>
        </li>
        <li>
          <Link to="/adminCompany" style={{ textDecoration: 'none', color: '#333' }}>Admin Company</Link>
        </li>
        <li>
          <Link to="/adminProduct" style={{ textDecoration: 'none', color: '#333' }}>Admin Product</Link>
        </li>
        <li>
          <Link to="/adminProductBatch" style={{ textDecoration: 'none', color: '#333' }}>Admin Product Batch</Link>
        </li>
        <li>
          <Link to="/adminBatchSale" style={{ textDecoration: 'none', color: '#333' }}>Batch Sale</Link>
        </li>
        <li>
          <button onClick={handleLogout} style={{ border: 'none', backgroundColor: 'transparent', color: '#333', cursor: 'pointer' }}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
