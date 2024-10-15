import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import eye_open from '../../../Images/eye_open.png';
import eye_close from '../../../Images/eye_close.png';

function ForgetPassword() {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/vi/auth/forget-password`, {
        email,
      });
      if (response.status == 200) {
        toast.success('forget password email sent')
        setEmail('')

      }




    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('User not found')
      } else if (error.response && error.response.status === 500) {
        toast.error('Server error')
      }
      console.log(error);

    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center' }}>ForgetPassword</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='enter email' required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />

          <button type="submit" style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: 'none', width: '100%' }}>Send Verification email</button>

        </form>

      </div>
      <ToastContainer />
    </div>

  );
}

export default ForgetPassword