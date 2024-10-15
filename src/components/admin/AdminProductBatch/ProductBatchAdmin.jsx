import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateAdminProductBatchForm from './CreateAdminProductBatchForm';
import { Link } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import QRCodeCanvas from "qrcode.react";

function ProductBatchAdmin() {


  const [productBatch, setProductBatch] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [updatedProductBatch, setUpdatedProductBatch] = useState({});
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");

  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `${token}`
        };
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/productBatch/find`, { headers });
        console.log(response)
        setProductBatch(response.data.msg.data);
        // console.log(productBatch)
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
  const handleUpdateClick = (productBatchId) => {
    const batchToEdit = productBatch.find((p) => p.productBatchId === productBatchId);
    if (batchToEdit) {
      setUpdatedProductBatch({
        quantity: batchToEdit.quantity,
      });
    }
    setUpdatingProductId(productBatchId);
  };

  // const handleUpdateClick = productId => {
  //   setUpdatingProductId(productId);
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleSaveClick = async (productId) => {
    console.log(updatedProductBatch)
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/productBatch/findByIdAndUpdate/${productId}`,
        updatedProductBatch,
        { headers }
      );
      // setProductBatch(prevProductBatch => prevProductBatch.map(item => {
      //   if (item._id === productId) {
      //     return { ...item, ...updatedData };
      //   }
      //   return item;
      // }));
      if (response.data) {
        toast.success('Product batch updated successfully!');
        setProductBatch(productBatch.map(p => p.productBatchId === productId ? {...p, ...updatedProductBatch} : p));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else {
        toast.error('Error updating product batch.');
      }
    } finally {
      setUpdatingProductId(null);
    }
  };
  const handleCancelUpdate = () => {
    setUpdatingProductId(null);
    setUpdatedProductBatch({});
  };

  const handleDeleteClick = async (productId) => {
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/productBatch/findByIdAndDelete/${productId}`,
        { headers }
      );
      if (response) {
        toast.success('Product batch deleted successfully!');
      }
      setProductBatch(productBatch.filter(item => item.productBatchId !== productId));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else {
        toast.error('Error deleting product batch.');
      }
    }
  };

  // const handleChange = (e, productId, field) => {
  //   const { value } = e.target;
  //   setUpdatedProductBatch(prevState => ({
  //     ...prevState,
  //     [productId]: {
  //       ...prevState[productId],
  //       [field]: value
  //     }
  //   }));
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductBatch((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const openQRCodeModal = (id) => {
    setQRCodeValue("https://genuinetrace.vercel.app"+"/searchbybatchID/"+id);
    console.log(window.location.hostname)
    setIsQRCodeModalOpen(true);
  };

  const closeQRCodeModal = () => {
    setIsQRCodeModalOpen(false);
  };
  return (
    <div>
      <AdminNavbar />
      <button onClick={toggleCreateForm}> Create Batch</button>
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
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}onClick={() => openQRCodeModal(element.productBatchId)}> {element.productBatchId}</td>
                <td>{element.productId}</td>
                <td>{element.batchNo}</td>
                <td>
                  {updatingProductId === element.productBatchId ? (
                    <input
                      type="text"
                      name='quantity'
                      // value={updatedProductBatch[element.productBatchId]?.quantity || element.quantity}
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
                    <button style={{marginLeft: '10px'}} onClick={handleCancelUpdate}>Cancel</button>
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
      {showCreateForm && <CreateAdminProductBatchForm onClose={handleCreateFormClose} />}
      <div>
        {isQRCodeModalOpen && (
          <div className="modal-container">
            <div className="modal-content">
            <span className="close" onClick={closeQRCodeModal}>X</span>
              <h2><QRCodeCanvas value={qrCodeValue} bgColor="#ffffff"
  fgColor="#000000"
  level="Q"
  size="256"/></h2>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductBatchAdmin