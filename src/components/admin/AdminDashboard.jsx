import React from 'react';
import AdminNavbar from './AdminNavbar/AdminNavbar';
import { Navigate } from 'react-router-dom';
import Userdashboarb from '../user/Auth/Userdashboarb';
import BatchSales from '../user/BatchSales/BatchSales';

function AdminDashboard() {
  
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  console.log(convert);

  if (!convert || convert.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      <AdminNavbar />
      <h1>Welcome admin: {convert.name}</h1>
    </>
  );
}

export default AdminDashboard;
