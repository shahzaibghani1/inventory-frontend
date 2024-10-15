import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; import React from 'react'

function CreateAdminProductBatchForm({ onClose }) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    productionDate: '',
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
      console.log(formData)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/productBatch/create`,
        formData,
        { headers }
      );
      toast.success('Product Batch Created Successfully')

      setTimeout(() => {
        onClose();

      }, 1500)
      // Display success message

      // Close the form after submission
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status == 400 || error.response.status == 404) {
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
        <h2>Create Productbatch</h2>
        <form onSubmit={handleSubmit}>
          <label>
            ProductId:
            <input type="text" name="productId" value={formData.productId} onChange={handleChange} required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </label>
          <label>
            Date:
            <input type="date" name="productionDate" value={formData.productionDate} onChange={handleChange} required />
          </label>

          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateAdminProductBatchForm