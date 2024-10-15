import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Associateuser({ onClose }) {
  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
  });
  const [user, setusers] = useState([]);
  const [company, setcompanies] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlesubmit = async () =>{
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/vi/employee/associate`,
        formData,
        { headers }
      );
      console.log(response.data)
      toast.success('Employee Associated Successfully');

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.msg.msg);
      }
    }
    console.log(formData)
   
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem("userData");
      const convert = JSON.parse(data);
      const token = convert.token;

      const headers = {
        Authorization: `${token}`,
      };
      try {
        const users = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/vi/admin/user/getusers`,
          { headers }
        );
        setusers(users.data.msg.data);
        const companies = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/vi/admin/user/getcompanies`,
          { headers }
        );
        setcompanies(companies.data.msg.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="modal-container">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            <svg fill="none" viewBox="0 0 24 24" height="1.5em" width="1.5em">
              <path
                fill="currentColor"
                d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
              />
            </svg>
          </span>
          <h2 style={{ textAlign: "center" }}>Associate User</h2>
            <label style={{fontSize: '18px'}}>
              Select User:
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="select-container"
              >
                <option value="" disabled>
                  Select a user
                </option>
                {user.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={{fontSize: '18px'}}>
              Select Company:
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="select-container"
              >
                <option value="" disabled>
                  Select a company
                </option>
                {company.map((c) => (
                  <option key={c.companyId} value={c.companyId}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handlesubmit}>Associate</button>
        </div>
      </div>
    </>
  );
}

export default Associateuser;
