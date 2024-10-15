import React, { useState } from "react";
import axios from "axios";
import "./batchidsearch.css";

function Batchidsearch() {
  const [id, setId] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState(false);
  const handleInputChange = (e) => {
    setId(e.target.value);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoding(false);
      setError(false);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/searchbybatchID/${id}`
      );
      setResult(response.data.msg.data[0]);
      setLoding(true);
    } catch (err) {
      setError(true);
      console.log("Error Fetching Data: ", err);
    }
  };

  return (
    <>
      <h1 style={{textAlign: 'center'}} className="title">Search Products</h1>
      <div className="container">
        <label  style={{fontSize: '25px'}} className="label" htmlFor="batchId">
          Product Batch ID
        </label>
        <input
        style={{fontSize: '18px'}}
          className="input"
          type="text"
          id="batchId"
          placeholder="Batch ID"
          onChange={handleInputChange}
        />
        <button className="button" type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {loading && (
        <table className="tableclass" border={'1px'} >
          <thead>
            <tr>
              <th className="tabledata">Product ID</th>
              <th className="tabledata">Product Name</th>
              <th className="tabledata">Quantity</th>
              <th className="tabledata">Date of Production</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tabledata">{result.productId}</td>
              <td className="tabledata">{result.productName}</td>
              <td className="tabledata">{result.remainingQuantity}</td>
              <td className="tabledata">
                {new Date(result.productionDate).toLocaleDateString(
                  undefined,
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {error && <h1 style={{ textAlign: "center" }}>No Product Found</h1>}
    </>
  );
}

export default Batchidsearch;
