import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eye_open from '../../../Images/eye_open.png';
import eye_close from '../../../Images/eye_close.png';

const Login = () => {
  const { setAuth } = useAuth();
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
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/vi/auth/login`, {
        email,
        password,
      });
      console.log(response)
      const emails = response.data.msg.data.email;

      const { verified, name, userId, role } = response.data.msg.data;
      const token = response.data.msg.token
      localStorage.setItem('userData', JSON.stringify({ emails, verified, name, role, userId, token }));
      setAuth({ emails, verified, name, role, userId });
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'user') {
        navigate('/user')
      } else if (role === 'vendor'){
        navigate('/vendor')
      } else if (role === 'employee'){
        navigate('/employee')
      }
      // const from = location.state?.from|| '/';
      // console.log(from)
      // navigate(from, { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error)
        toast.error('Invalid credentials')
      } else if (error.response && error.response.status === 401) {
        toast.error('User not verify')
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
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='enter email' required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
          {/* <div style={{position: 'relative'}}> */}
          <input type="password" placeholder='enter password' value={password} onChange={(e) => setPassword(e.target.value)} required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} ref={inputRef} />
          <img src={eye_close} alt="" onClick={view} ref={imagechg1} style={{ position: 'absolute', right: '0px', top: '63px' }} />
          {/* </div> */}
          <p style={{ width: '100%' }}>forget password?  <span onClick={() => { navigate('/forgetpassword') }} style={{ color: 'green', textDecoration: 'underline', cursor: 'pointer', }}>click here</span></p>
          <button type="submit" style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: 'none', width: '100%' }}>Login</button>

        </form>
      </div>
      <ToastContainer />
    </div>

  );
};


export default Login;
