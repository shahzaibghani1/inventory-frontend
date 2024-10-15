import React, { useEffect, useState } from "react";
import axios from "axios";
import "./batchidsearch.css";
import { useParams } from "react-router-dom";

function Batchidurlsearch() {
  const { id } = useParams();
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);

  useEffect(() => {
    const search = async () => {
      try {
        setLoading(true);
        setError(false);
        setQuantityError(false);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/searchbybatchID/${id}`
        );
        setResult(response.data.msg.data[0]);
        if (response.data.msg.data.remainingQuantity <= 0) {
          setQuantityError(true);
        }
        setLoading(false);
      } catch (err) {
        setError(true);
        console.log("Error Fetching Data: ", err);
      }
    };
    search();
  }, [id]);

  return (
    <div className="container">
      {!loading && (
        <div className="data-container">
          <div className="data-row">
            <div className="data-key">Product ID</div>
            <div className="data-value">{result.productId}</div>
          </div>
          <div className="data-row">
            <div className="data-key">Product Name</div>
            <div className="data-value">{result.productName}</div>
          </div>
          <div className="data-row">
            <div className="data-key">Quantity</div>
            <div className="data-value">{result.remainingQuantity}</div>
          </div>
          <div className="data-row">
            <div className="data-key">Date of Production</div>
            <div className="data-value">
              {new Date(result.productionDate).toLocaleDateString(
                undefined,
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </div>
          </div>
        </div>
      )}
      {error && <h1 className="error-message">Product Not In Database</h1>}
      {quantityError ? 
        <h1 className="error-message">This product has been sold out and should not be in store.</h1>:(!loading && !error &&(<h1 className="success-message">This product is Genuine and Valid to Buy</h1>))
      }
    </div>
  );
}

export default Batchidurlsearch;
