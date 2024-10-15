import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import eye_open from '../../../Images/eye_open.png';
import eye_close from '../../../Images/eye_close.png';

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  let img = [eye_close, eye_open];

  const inputRef = useRef();
  const imagechg1 = useRef(null);

  function view() {
    if (inputRef.current.type === 'password') {
      inputRef.current.type = 'text';
      imagechg1.current.src = img[1];
    } else {
      imagechg1.current.src = img[0];
      inputRef.current.type = 'password';
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/vi/auth/register`, {
        email,
        password,
        name
      });
      if (response.status == 200) {
        toast.success('account craeted succesfully check for verificatione email')
        setEmail('')
        setName('')
        setPassword('')
      }




    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('User already exist')
      } else if (error.response && error.response.status === 500) {
        toast.error('Server error')
      }
      console.log(error);
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <input type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='enter name' required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='enter email' required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
          <input type="password" placeholder='enter password' value={password} onChange={(e) => setPassword(e.target.value)} required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} ref={inputRef} />
          <img src={eye_close} alt="" onClick={view} ref={imagechg1} style={{ position: 'absolute', right: '0px', bottom: '60px' }} />
          <button type="submit" style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: 'none', width: '100%' }}>Login</button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </form>
        <p>already have an acoount? <span style={{ textDecoration: 'underline', color: 'green', cursor: 'pointer' }} onClick={() => { navigate('/login') }}>login here </span></p>
      </div>
      <ToastContainer />
    </div>

  );
}

export default Register