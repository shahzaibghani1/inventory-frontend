import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function CreateCompanyForm({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    contact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/vi/company/create`,
        formData,
        { headers }
      );
      toast.success('Company Created Succesfully')

      setTimeout(() => {
        onClose();

      }, 1000)
      // Display success message

      // Close the form after submission
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status == 400) {
        toast.error(error.response.data.msg.msg)
      } else if (error.response && error.response.status == 500) {
        toast.error(error.response.data.msg.msg)
      }
    }
  };


  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Create Company</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
          </label>
          <label>
            Company Address:
            <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} required />
          </label>
          <label>
            Contact:
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
          </label>
          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateCompanyForm;
