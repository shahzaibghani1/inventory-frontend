import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateProductForm from './CreateProductForm';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';



function Product() {
  const { companyId } = useParams();
  const [product, setProduct] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      console.log(companyId);
      
      const data = localStorage.getItem('userData');
      const convert = JSON.parse(data);
      const token = convert.token;
      try {
        const headers = {
          Authorization: `${token}`
        };
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/product/findByCompanyName/${companyId}`, { headers });
        setProduct(response.data.msg.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.msg.msg);
        } else if (error.response && error.response.status === 500) {
          toast.error('Internal server error');
        }

      }
    };

    fetchData();
  }, [createFormClosed, editingProductId]);

  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  };
  const handleCancelUpdate = ()=>{
    setEditingProductId(null);
    setUpdatedProduct({});
  }

  const handleUpdateClick = productId => {
    const productToEdit = product.find((p)=>p.productId === productId)
    if(productToEdit){
      setUpdatedProduct({
        productName: productToEdit.productName,
        issueDate: formatDate(productToEdit.issueDate)
      })
    }
    setEditingProductId(productId);
  };

  const handleSaveClick = async productId => {
    console.log(updatedProduct)
    if(updatedProduct.productName == ''){
      toast.error('Product Name cannot be empty');
    }
    else{
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/product/findByIdAndUpdate/${productId}`,
        updatedProduct,
        { headers }
      );
      if (response.data) {
        toast.success(response.data.msg.msg);
        setProduct(product.map((p)=>p.productId === productId ? {...p,...updatedProduct}: p))
      }
    } catch (error) {
      if (error) {
        toast.error(error.response.data.msg.msg);
      }
    } finally {
      setEditingProductId(null);
      setUpdatedProduct({})
    }
  }
  };

  const handleDeleteClick = async productId => {
    try {
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/product/findByIdAndDelete/${productId}`,
        { headers }
      );
      if(response){
        toast.success('Product deleted successfully!');
      }
      setProduct(product.filter((p)=>p.productId !== productId))
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevData) => ({
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

      {product.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Product Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>issue Date</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map(element => (
              <tr key={element.productId} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.productId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.userId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyName}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element.productId ? (
                    <input
                      type="text"
                      name='productName'
                      defaultValue={element.productName}
                      onChange={handleChange}
                    />
                  ) : (
                    <Link to={`/productBatch/${element.productId}`}>{element.productName}</Link>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element.productId ? (
                    <input
                      type="date"
                      name='issueDate'
                      defaultValue={formatDate(element.issueDate)}
                      onChange={handleChange}
                    />
                  ) : (
                    formatDate(element.issueDate)
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element.productId ? (
                    <>
                    <button onClick={() => handleSaveClick(element.productId)}>Save</button>
                    <button style={{marginLeft: '10px'}} onClick={()=>handleCancelUpdate(element.companyId)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleUpdateClick(element.productId)}>Update</button>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  <button onClick={() => handleDeleteClick(element.productId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 onClick={toggleCreateForm}>Don't have any product? Create product? Click here</h3>
      {showCreateForm && <CreateProductForm companyId={companyId} onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default Product;
