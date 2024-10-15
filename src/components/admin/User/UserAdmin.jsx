import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import UserAdminCreateForm from './CreateUserAdminForm';
import CreateUserAdminForm from './CreateUserAdminForm';
import { toast, ToastContainer } from 'react-toastify';
import Associateuser from './Associateuser';

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [associateuserform, setassociateuserform] = useState(false);
  const [associateformclose, setassociateformclose] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem('userData');
      const convert = JSON.parse(data);
      const token = convert.token;

      const headers = {
        Authorization: `${token}`
      };
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/user/find`, { headers });
        setUsers(response.data.msg.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [createFormClosed, associateformclose]);

  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;
  const headers = {
    Authorization: `${token}`
  };

  if (!convert || convert.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  const toggleassociateform = () => {
    setassociateuserform(!associateuserform);
  }
  const handleassociateformclose = () => {
    setassociateuserform(false);
    setassociateformclose(prev => !prev);
  }

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  }
  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  }

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/user/delete/${userId}`, { headers });
      setUsers(users.filter(user => user.userId !== userId));
      toast.success("User Deleted Successfully")
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <button onClick={toggleCreateForm}> Create New User</button>
      <button onClick={toggleassociateform} style={{marginLeft: '10px'}}> Associate User</button>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Role</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.userId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.role}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  <button onClick={() => handleDeleteClick(user.userId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showCreateForm && <CreateUserAdminForm onClose={handleCreateFormClose} />}
      {associateuserform && <Associateuser onClose= {handleassociateformclose}/>}
      <ToastContainer />
    </div>
  );
}

export default UserAdmin;
