import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function CreateProductBatchForm({ onClose, productId }) {
  const [formData, setFormData] = useState({
    productId: productId,
    quantity: '',
    date: '',
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
        `${process.env.REACT_APP_BASE_URL}/api/vi/productBatch/create`,
        formData,
        { headers }
      );
      toast.success('Batch Added Successfully')

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
        <h2>Create Productbatch</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Quantity:
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateProductBatchForm;
