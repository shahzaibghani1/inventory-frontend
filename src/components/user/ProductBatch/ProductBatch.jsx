import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateProductBatchForm from './CreateProductBatchForm';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';


function ProductBatch() {
  const { productId } = useParams();  
  const [productBatch, setProductBatch] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [updatedProductBatch, setUpdatedProductBatch] = useState({});
  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `${token}`
        };
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/productBatch/findByProductName/${productId}`, { headers });
        setProductBatch(response.data.msg.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.msg.msg);
        } else if (error.response && error.response.status === 500) {
          toast.error(error.response.data.msg.msg);
        }
      }
    };

    fetchData();
  }, [createFormClosed, updatingProductId]);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  };

  const handleUpdateClick = productId => {
    const batchToEdit = productBatch.find((p)=>p.productBatchId === productId)
    if(batchToEdit){
      setUpdatedProductBatch({
        quantity: batchToEdit.quantity
      })
    }
    setUpdatingProductId(productId);
  };

  const handleSaveClick = async (productId) => {
    console.log(updatedProductBatch)
    if(parseInt(updatedProductBatch.quantity)<=0)
    {
      toast.error("Quantity cannot be 0 or less than zero")
    }
    else{
    try {
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/productBatch/getByIdAndUpdate/${productId}`,
        updatedProductBatch,
        { headers }
      );
      if (response.data.msg.status == true) {
        toast.success('Product batch updated successfully!');
        setProductBatch(productBatch.map((b)=>b.productBatchId==productId ? {...b, ...updatedProductBatch}: b));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else {
        toast.error('Error Updating Product Batch.');
      }
    } finally {
      setUpdatingProductId(null);
      setUpdatedProductBatch({})
    }
  }
  };

  const handleDeleteClick = async (productId) => {
    try {
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/productBatch/findByIdAndDelete/${productId}`,
        { headers }
      );
      if (response.data.msg.status == true) {
        toast.success('Product batch deleted successfully!');
      }
      setProductBatch(productBatch.filter((b)=>b.productBatchId !== productId))
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else {
        toast.error('Error deleting product batch.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductBatch((prevData) => ({
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
  const handleCancelUpdate = ()=>{
    setUpdatingProductId(null);
    setUpdatedProductBatch({});
  }

  return (
    <div>
      <Navbar />

      {productBatch.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ProductId</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>BatchNumber</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Quantity</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Remaining Qunatity</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Date Of production</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {productBatch.map(element => (
              <tr key={element.productBatchId} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}> <Link to={`/batchSale/${element.productBatchId}`}>{element.productBatchId}</Link></td>
                <td>{element.productId}</td>
                <td>{element.batchNo}</td>
                <td>
                  {updatingProductId === element.productBatchId ? (
                    <input
                      type="text"
                      name='quantity'
                      defaultValue={element.quantity}
                      onChange={handleChange}
                    />
                  ) : (
                    element.quantity
                  )}
                </td>
                <td>{element.remainingQuantity}</td>
                <td>{formatDate(element.productionDate)}</td>
                <td>
                  {updatingProductId === element.productBatchId ? (
                    <>
                    <button onClick={() => handleSaveClick(element.productBatchId)}>Save</button>
                    <button style={{marginLeft: '10px'}} onClick={() => handleCancelUpdate(element.productBatchId)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleUpdateClick(element.productBatchId)}>Update</button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(element.productBatchId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 onClick={toggleCreateForm}>Don't have any productBatch? Create Product Batch? Click here</h3>
      {showCreateForm && <CreateProductBatchForm productId={productId} onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default ProductBatch;
