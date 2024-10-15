import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CreateCompanyForm from './CreateCompanyForm';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [updatedCompanies, setUpdatedCompanies] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = localStorage.getItem('userData');
        const convert = JSON.parse(data)
        const token = convert.token
        const headers = {
          Authorization: `${token}`
        };

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/company/getAllCompanies`, { headers });
        // console.log(response)
        setCompanies(response.data.msg.data);
      } catch (error) {
        console.log(error)
        if (error.response) {
          toast.error(error.response.data.msg.msg)
        } else if (error.response && error.response.status == 500) {
          toast.error(error.response.data.msg.msg)
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [createFormClosed, editingCompanyId]);
  // Fetch data whenever editingCompanyId state changes
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  }
  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  }
  const handleUpdateClick = (CompanyId) => {
    const companyToEdit = companies.find((c) => c.companyId === CompanyId);
    if (companyToEdit) {
      setUpdatedCompanies({
        companyName: companyToEdit.companyName,
        companyAddress: companyToEdit.companyAddress,
        contact: companyToEdit.contact
      });
    }
    setEditingCompanyId(CompanyId);
  };
  const handleCancelUpdate = ()=>{
    setEditingCompanyId(null);
    setUpdatedCompanies({});
  }

  const handleSaveClick = async (companyId) => {
    console.log(updatedCompanies)
    if(updatedCompanies.companyName == '' || updatedCompanies.companyAddress== '' || updatedCompanies.contact == '')
    {
      toast.error("Field cannot be empty")
    }
    else{
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/company/findByIdAndUpdate/${companyId}`,
        updatedCompanies,
        { headers }
      );
      if(response.data) {
        toast.success(response.data.msg.msg)
        setCompanies(companies.map((c)=>c.companyId === companyId ? {...c, ...updatedCompanies}: c));
      }
    } catch (error) {
      if (error.response && error.response.status == 404) {
        toast.error(error.response.data.msg.msg)
      }

    } finally {
      setEditingCompanyId(null);
      setUpdatedCompanies({})
    }
  }
  };

  const handleDeleteClick = async (companyId) => {
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/company/findByIdAndDelete/${companyId}`,
        { headers }
      );
      if (response) {
        console.log(response)
        toast.success('Company deleted successfully!');
      }
      console.log('Delete successful:', response.data);
      setCompanies(companies.filter((c)=>c.companyId !== companyId));
    } catch (error) {
      if (error.response && error.response.status == 404) {
        toast.error(error.response.data.msg.msg)
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompanies((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Navbar />
      {companies.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Address</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Contact</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>

            </tr>
          </thead>
          <tbody>
            {companies.map((element) => (
              <tr key={element.companyId} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element.companyId ? (
                    <input
                      type="text"
                      name='companyName'
                      defaultValue={element.companyName}
                      onChange={handleChange}
                    />
                  ) : (
                    <Link to={`/product/${element.companyId}`}>{element.companyName}</Link>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element.companyId ? (
                    <input
                      type="text"
                      name='companyAddress'
                      defaultValue={element.companyAddress}
                      onChange={handleChange}
                    />
                  ) : (
                    element.companyAddress
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element.companyId ? (
                    <input
                      type="text"
                      name='contact'
                      defaultValue={element.contact}
                      onChange={handleChange}
                    />
                  ) : (
                    element.contact
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element.companyId ? (
                    <>
                    <button onClick={() => handleSaveClick(element.companyId)}>Save</button>
                    <button style={{marginLeft: '10px'}} onClick={()=>handleCancelUpdate(element.companyId)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleUpdateClick(element.companyId)}>Update</button>
                    </>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>


                  <button onClick={() => handleDeleteClick(element.companyId)}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{marginTop: "20px"}} onClick={toggleCreateForm}>Create Company</button>
      {showCreateForm && <CreateCompanyForm onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default Company;
