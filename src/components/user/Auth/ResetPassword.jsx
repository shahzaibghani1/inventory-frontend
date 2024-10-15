import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import eye_open from '../../../Images/eye_open.png';
import eye_close from '../../../Images/eye_close.png';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const { userId } = useParams()
  const { token } = useParams()
  const nav = useNavigate()
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
      const body = {
        password: password
      }
      console.log(password)
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/auth/reset-password/${userId}/${token}/${password}`, body);
      console.log(response)
      if (response.status == 200) {
        toast.success('pasword udopated succesfully')
        setPassword('')
        nav('/')
      }




    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid token')
      } else if (error.response && error.response.status === 500) {
        toast.error('failed to udapetd')
      }
      console.log(error);

    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center' }}>New Password</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='enter password' required style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} ref={inputRef} />

          <img src={eye_close} alt="" onClick={view} ref={imagechg1} style={{ position: 'absolute', right: '0px', bottom: '60px' }} />
          <button type="submit" style={{ margin: '5px', padding: '10px', borderRadius: '5px', border: 'none', width: '100%' }}>Update Password</button>

        </form>

      </div>
      <ToastContainer />
    </div>
  )
}

export default ResetPassword