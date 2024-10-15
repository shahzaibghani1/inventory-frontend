import React, { useState, useEffect } from "react";
import {Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Employeenavbar from "../Employeenavbar";
import Employeeaddproduct from "./Employeeaddproduct";

function Employeeproducts() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const convert = JSON.parse(data);
    const token = convert.token;
    const headers = {
      Authorization: `${token}`,
    };
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/vi/employee/fetchproducts`,
          { headers }
        );
        setProduct(response.data.msg.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [createFormClosed, editingProductId]);

  const data = localStorage.getItem("userData");
  const convert = JSON.parse(data);
  const token = convert.token;

  const headers = {
    Authorization: `${token}`,
  };

  if (!convert || convert.role !== "employee") {
    return <Navigate to="/unauthorized" />;
  }

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed((prev) => !prev);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleUpdateClick = (productId) => {
    const productToEdit = product.find((p) => p.productId === productId);
    if (productToEdit) {
      setUpdatedProduct({
        productName: productToEdit.productName,
        issueDate: formatDate(productToEdit.issueDate),
      });
    }
    setEditingProductId(productId);
  };

  const handleCancelUpdate = () => {
    setEditingProductId(null);
    setUpdatedProduct({});
  };

  const handleSaveClick = async (productId) => {
    console.log(updatedProduct)
    if(updatedProduct.productName === '')
    {
      toast.error("Product Name can't be empty");
    }
    else{
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/findByIdAndUpdate/${productId}`,
        updatedProduct,
        { headers }
      );
      console.log(response)
      if (response.data) {
        toast.success(response.data.msg.msg);
        setProduct(product.map(p => p.productId === productId ? {...p, ...updatedProduct} : p));
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again later.");
    } finally {
      setEditingProductId(null);
      setUpdatedProduct({});
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

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/findByIdAndDelete/${productId}`,
        { headers }
      );
      setProduct(product.filter((element) => element.productId !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again later.");
    }
  };

  return (
    <div>
      <Employeenavbar />
      <button onClick={toggleCreateForm}>Create Product</button>
      {loading ? (
        <p>Loading...</p>
      ) : product.length === 0 ? (
        <p>No Products found.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>UserID</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Company ID</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Company Name</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Product Name</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Issue Date</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Actions</th>
              <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {product.map((element) => (
              <tr key={element.productId} style={{ borderBottom: "1px solid #dddddd" }}>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{element.productId}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{element.userId}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{element.companyId}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{element.companyName}</td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                  {editingProductId === element.productId ? (
                    <input
                      type="text"
                      name="productName"
                      defaultValue={element.productName}
                      onChange={handleChange}
                    />
                  ) : (
                    element.productName
                  )}
                </td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                  {editingProductId === element.productId ? (
                    <input
                      type="date"
                      name="issueDate"
                      defaultValue={element.issueDate}
                      onChange={handleChange}
                    />
                  ) : (
                    formatDate(element.issueDate)
                  )}
                </td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                  {editingProductId === element.productId ? (
                    <>
                      <button onClick={() => handleSaveClick(element.productId)}>Save</button>
                      <button style={{marginLeft: '10px'}} onClick={handleCancelUpdate}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleUpdateClick(element.productId)}>Update</button>
                  )}
                </td>
                <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                  <button onClick={() => handleDeleteClick(element.productId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showCreateForm && <Employeeaddproduct onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default Employeeproducts;
