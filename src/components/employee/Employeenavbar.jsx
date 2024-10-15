import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Employeenavbar = () => {
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
          <Link to="/employee" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
        </li>
        <li>
          <Link to="/employeeProducts" style={{ textDecoration: 'none', color: '#333' }}>Products</Link>
        </li>
        <li>
          <Link to="/employeeBatches" style={{ textDecoration: 'none', color: '#333' }}>Product Batch</Link>
        </li>
        <li>
          <Link to="/employeeBatchSales" style={{ textDecoration: 'none', color: '#333' }}>Batch Sales</Link>
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

export default Employeenavbar;
