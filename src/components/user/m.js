import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CreateCompanyForm from '../CreateCompanyForm';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = localStorage.getItem('userData');
        const convert = JSON.parse(data)
        const token = convert.token
        console.log(token)
        const headers = {
          Authorization: `${token}`
        };

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/company/getAllCompanies`, { headers });

        console.log(response.data.msg.data)
        setCompanies(response.data.msg.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [createFormClosed]); 
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  }
  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev); // Toggle createFormClosed state
  }
  return (
    <div>
      {companies.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Address</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Contact</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }} >update</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '6px' }} >delete</th>


            </tr>
          </thead>
          <tbody>
            {companies.map((element) => (
              <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element._id}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyName}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyAddress}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.contact}</td>
                <td className='up' style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>click here</td>
                <td className='up' style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>click here</td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 onClick={toggleCreateForm}>Don't have any company? Create company? Click here</h3>
      {showCreateForm && <CreateCompanyForm onClose={handleCreateFormClose} />}
    </div>
  );
}

export default Company;
