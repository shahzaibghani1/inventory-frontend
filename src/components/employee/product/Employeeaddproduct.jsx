import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function Employeeaddproduct({ onClose }) {
  const [company, setCompany] = useState(''); 
  const [formData, setFormData] = useState({
    productName: '',
    issueDate: '',
    companyId: '',
  });
  useEffect(()=>{
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
        setCompany(response.data.msg.data.companyId)
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();

  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      companyId: company
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/create`,
        formData,
        { headers }
      );
      if (response) {
        toast.success('Product Created Successfully');
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.msg.msg);
      }
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Product Name:
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </label>
          <label>
            Issue Date:
            <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
          </label>
          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Employeeaddproduct;
