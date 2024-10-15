import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateBatchSalesForm from './CreateBatchSalesForm';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';


function BatchSales() {
  const { productBatchId } = useParams();
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
      if (!convert || convert.role !== 'user') {
        return <Navigate to="/unauthorized" />;
      }
      try {
        const headers = {
          Authorization: `${token}`
        };
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/batchSales/findByBatchName/${productBatchId}`, { headers });
        setBatchSales(response.data.msg.data);
      } catch (error) {
        if (error.response || error.response.status === 404) {
          console.log(error.response.data.msg.msg)
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
  if (!convert || convert.role !== 'user') {
    return <Navigate to="/unauthorized" />;
  }


  const headers = {
    Authorization: `${token}`
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  };
  const handleCancelUpdate = ()=>{
    setUpdatingBatchId(null);
    setUpdatedBatchSales({});
  }

  const handleUpdateClick = batchId => {
    const batchtoEdit = BatchSales.find((b)=>b.batchSaleId === batchId)
    if(batchtoEdit){
      setUpdatedBatchSales({
        soldQuantity: batchtoEdit.soldQuantity,
        dateOfSale: formatDate(batchtoEdit.dateOfSale)
      })
    }
    setUpdatingBatchId(batchId);
  };

  const handleSaveClick = async (batchId) => {
    console.log(updatedBatchSales)
    if(updatedBatchSales.soldQuantity<=0){
      toast.error("Sold Quantity cannot be 0 or less than 0");
    }else{
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/batchSales/getByIdAndUpdate/${batchId}`,
        updatedBatchSales,
        { headers }
      );
      if(response)
      {
        toast.success('Batch Sales Updated Successfully!');
        setBatchSales(BatchSales.map((b)=>b.batchSaleId === batchId ? {...b,...updatedBatchSales}:b));
      }
    } catch (error) {
      if (error.response && error.response.status === 404 || error.response.status === 400) {
        toast.error(error.response.data.msg.msg);
      } else {
        toast.error('Error Updating BatchSales.');
      }
    } finally {
      setUpdatingBatchId(null);
      setUpdatedBatchSales({})
    }
  }
  };

  const handleDeleteClick = async (batchId) => {
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/batchSales/getByIdAndDelete/${batchId}`,
        { headers }
      );
      setBatchSales(BatchSales.filter((item) => item.batchSaleId !== batchId));
      toast.success('Batch Sales deleted successfully!');
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
      <Navbar />
      {BatchSales.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Product Batch Id</th>
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
                    defaultValue={element.dateOfSale}
                    onChange={handleChange}
                  />
                ) : (
                  formatDate(element.dateOfSale)
                )}</td>
                <td>
                  {updatingBatchId === element.batchSaleId ? (
                    <>
                    <button onClick={() => handleSaveClick(element.batchSaleId)}>Save</button>
                    <button style={{marginLeft: '10px'}} onClick={()=>handleCancelUpdate(element.batchSaleId)}>Cancel</button>
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
      <h3 onClick={toggleCreateForm}>Don't have any BatchSales? Generate Batch Sale? Click here</h3>
      {showCreateForm && <CreateBatchSalesForm id={productBatchId} onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default BatchSales;
