import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Employeenavbar from '../Employeenavbar';
import axios from 'axios';

function Employeedashboard() {
    const [company, setCompany] = useState([]);
    const data = localStorage.getItem("userData");
    const convert = JSON.parse(data);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const convert = JSON.parse(data);
    const token = convert.token;
    const headers = {
      Authorization: `${token}`,
    };
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/vi/employee/getcompany`,
          { headers }
        );
        console.log(response.data.msg.data[0])
        setCompany(response.data.msg.data[0].companyName)

      } catch (error) {
        console.error("Error", error);
      }
    };
    if (!convert || convert.role !== 'employee') {
        return <Navigate to="/unauthorized" />;
      }

    fetchData();
  }, []);



  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      <Employeenavbar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Welcome {convert.name}</h2>
        <h2>Comany Associated: {company}</h2>
      </div>
    </div>
  );
}

export default Employeedashboard;
