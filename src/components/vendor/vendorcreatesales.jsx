import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function Vendorcreatesales({ userId, onClose}) {
  const [formData, setFormData] = useState({
    userId: userId,
    productBatchId: '',
    soldQuantity: '',
    dateOfSale: '',
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
        `${process.env.REACT_APP_BASE_URL}/api/vi/vendor/vendorBatchSales/create`,
        formData,
        { headers }
      );
      toast.success('Sales Generated')

      setTimeout(() => {
        onClose();

      }, 1000)
      // Display success message

      // Close the form after submission
    } catch (error) {
      console.log(error)
      if (error.response) {
        toast.error(error.response.data.msg.msg)
        console.log(error.response.data.msg.msg)
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.msg)
      }
    }
  };


  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Create BatchSales</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Product Batch ID:
            <input type="text" name="productBatchId" value={formData.productBatchId} onChange={handleChange} required />
          </label>
          <label>
            soldQuantity:
            <input type="number" name="soldQuantity" value={formData.soldQuantity} onChange={handleChange} required />
          </label>
          <label>
            Date:
            <input type="date" name="dateOfSale" value={formData.dateOfSale} onChange={handleChange} required />
          </label>

          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Vendorcreatesales;
