import React from 'react'
import axios from 'axios';
import  { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import CreateAdminBatchSale from './CreateAdminBatchSale';
import { Navigate } from 'react-router-dom';

function BatchSaleAdmin() {

    const [BatchSales, setBatchSales] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormClosed, setCreateFormClosed] = useState(false);
    const [updatingBatchId, setUpdatingBatchId] = useState(null);
    const [updatedBatchSales, setUpdatedBatchSales] = useState({});

 
    useEffect(() => {
    const fetchData = async () => {
    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
        try {
          const headers = {
            Authorization: `${token}`
          };
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/batchSale/find`, { headers });
          setBatchSales(response.data.msg.data);
          console.log(response)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.error(error.response.data.msg.msg);
          } else if (error.response && error.response.status === 500) {
            toast.error(error.response.data.msg.msg);
          }
        }
      };
  
      fetchData();
    }, [createFormClosed, updatingBatchId]);
    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
    
    // const headers = {
    //   Authorization: `${token}`,
    // };
    
    if (!convert || convert.role !== 'admin') {
      return <Navigate to="/unauthorized" />;
    }
   
  
    const toggleCreateForm = () => {
      setShowCreateForm(!showCreateForm);
    };
  
    const handleCreateFormClose = () => {
      setShowCreateForm(false);
      setCreateFormClosed(prev => !prev);
    };
    const handleUpdateClick = (productBatchId) => {
      const batchToEdit = BatchSales.find((p) => p.batchSaleId === productBatchId);
      if (batchToEdit) {
        setUpdatedBatchSales({
          soldQuantity : batchToEdit.soldQuantity,
          dateOfSale : formatDate(batchToEdit.dateOfSale)
        });
      }
      setUpdatingBatchId(productBatchId);
    };
  
    // const handleUpdateClick = (batchId) => {
    //   console.log(batchId)
    //   setUpdatingBatchId(batchId);
    // };
  
    const handleSaveClick = async (batchId) => {
      console.log(updatedBatchSales);
      try {
        const headers = {
          Authorization: `${token}`,
        };
        console.log(token)
  
        const response = await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/vi/admin/batchSale/getByIdAndUpdate/${batchId}`,
          updatedBatchSales,
          { headers }

        );
        if(response.data)
        {
          toast.success('Batch Sales updated Successfully!');
        }
        setBatchSales(BatchSales.map(item => item.batchSaleId === batchId ?{...item, updatedBatchSales} : item));
  
        
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 404 || error.response.status === 400) {
          toast.error(error.response.data.msg.msg);
        } 
      } finally {
        setUpdatingBatchId(null);
      }
    };

    const handleCancelUpdate = () => {
      setUpdatingBatchId(null);
      setUpdatedBatchSales({});
    };
  
    const handleDeleteClick = async (batchId) => {
      try {
        const headers = {
          Authorization: `${token}`,
        };
  
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/vi/admin/batchSale/getByIdAndDelete/${batchId}`,
          { headers }
        );
  
        setBatchSales(BatchSales.filter(item => item.batchSaleId !== batchId));
        toast.success('BatchSales deleted successfully!');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.msg.msg);
        } else {
          toast.error('Error deleting BatchSales.');
        }
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedBatchSales((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    return (
      <div>
        <AdminNavbar />
        <button onClick={toggleCreateForm}>Create Sale</button>
  
        {BatchSales.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Product Batch ID</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Sold Quantity</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Date of sale</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {BatchSales.map(element => (
                <tr key={element.batchSaleId} style={{ borderBottom: '1px solid #dddddd' }}>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.batchSaleId}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.productBatchId}</td>
                  <td>
                    {updatingBatchId === element.batchSaleId ? (
                      <input
                        type="text"
                        name='soldQuantity'
                        defaultValue={element.soldQuantity}
                        onChange={handleChange}
                      />
                    ) : (
                      element.soldQuantity
                    )}
                  </td>
                  <td>{updatingBatchId === element.batchSaleId ? (
                      <input
                        type="date"
                        name='dateOfSale'
                        defaultValue={formatDate(element.dateOfSale)}
                        onChange={handleChange}
                      />
                    ) : (
                      formatDate(element.dateOfSale)
                    )}</td>
                  <td>
                    {updatingBatchId === element.batchSaleId ? (
                      <>
                      <button onClick={() => handleSaveClick(element.batchSaleId)}>Save</button>
                      <button style={{marginLeft: '10px'}} onClick={handleCancelUpdate}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleUpdateClick(element.batchSaleId)}>Update</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteClick(element.batchSaleId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {showCreateForm && <CreateAdminBatchSale  onClose={handleCreateFormClose} />}
        <ToastContainer />
      </div>
    );
}

export default BatchSaleAdmin