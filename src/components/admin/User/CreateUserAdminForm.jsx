import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function CreateUserAdminForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isVerified: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
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
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/user/create`,
        formData,
        { headers }
      );
      toast.success('User Created Successfully');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg.msg);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.msg.msg);
      }
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" height="1.5em" width="1.5em">
      <path
        fill="currentColor"
        d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
      />
    </svg></span>
        <h2 style={{textAlign: 'center'}}>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password (at least 6 characters):
            <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6" required />
          </label>
          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </label>
          <label>
            Verified:
            <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleCheckboxChange} />
          </label>
          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateUserAdminForm;
