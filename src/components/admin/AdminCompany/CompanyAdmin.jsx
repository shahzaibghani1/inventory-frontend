import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import CompanyAdminCreateForm from './CreateCompanyAdminForm';
import CreateCompanyAdminForm from './CreateCompanyAdminForm';
import { ToastContainer, toast } from 'react-toastify';

function CompanyAdmin() {

    const [updatedData, setUpdatedData] = useState({
        companyName: null,
        companyAddress: null,
        contact : null,
    })

    const [company, setCompany] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [createFormClosed, setCreateFormClosed] = useState(false);

    const [editingCompanyId, setEditingCompanyId] = useState(null);




    useEffect(() => {
        const fetchData = async () => {

            const data = localStorage.getItem('userData');

            const convert = JSON.parse(data);

            const token = convert.token;
            const headers = {
                Authorization: `${token}`
            };
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/company/find`, { headers });
                const companyData = response.data.msg.data;
                setCompany(companyData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Company:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [createFormClosed, editingCompanyId]);


    const data = localStorage.getItem('userData');
   
    const convert = JSON.parse(data);
    const token = convert.token;
    const headers = {
        Authorization: `${token}`
    };

    if (!convert || convert.role !== 'admin') {
        return <Navigate to="/unauthorized" />;
    }


    const handleUpdateClick = (companyId) => {
        setEditingCompanyId(companyId);
    };

    const handleCancelUpdate = () => {
        setEditingCompanyId(null);
    };

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };
    const handleSaveUpdate = async (companyId, element) => {
        // setUpdatedData({companyName: element.companyName, companyAddress: element.companyAddress, contact: element.contact});
        console.log(updatedData)
        console.log(companyId)

        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/api/vi/admin/company/findByIdAndUpdate/${companyId}`,
                updatedData,
                { headers }
            );
            if (response.data) {
                toast.success('Company updated successfully!');
                setEditingCompanyId(null);
            }
        } catch (error) {
            console.error('Error updating company:', error);
            toast.error('Failed to update company. Please try again later.');
        }
        finally{
            setEditingCompanyId(null);
        }
    };



    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    }
    const handleCreateFormClose = () => {
        setShowCreateForm(false);
        setCreateFormClosed(prev => !prev);
    }

    const handleDeleteClick = async (companyId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/company/findByIdAndDelete/${companyId}`, { headers });
            setCompany(company.filter(element => element.companyId !== companyId));
            toast.success('Company Deleted successfully!');
        } catch (error) {
            console.error('Error deleting element:', error);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <button onClick={toggleCreateForm}> Create Company</button>
            {loading ? (
                <p>Loading...</p>
            ) : company.length === 0 ? (
                <p>No Company found.</p>
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>userId</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>CompanyName</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Companyaddress</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Contact</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {company.map(element => (
                            <tr key={element.companyId} style={{ borderBottom: '1px solid #dddddd' }}>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyId}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.userId}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>

                                    {editingCompanyId === element.companyId ? (
                                        <input
                                            type="text"
                                            name = "companyName"
                                            defaultValue={element.companyName}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        element.companyName
                                    )}
                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element.companyId ? (
                                        <input
                                            type="text"
                                            name = "companyAddress"
                                            defaultValue={element.companyAddress}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        element.companyAddress
                                    )}

                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element.companyId ? (
                                        <input
                                            type="text"
                                            name= "contact"
                                            defaultValue={element.contact}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        element.contact
                                    )}
                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element.companyId ? (
                                        <>
                                            <button onClick={() => handleSaveUpdate(element.companyId, element)}>Save</button>

                                        </>
                                    ) : (
                                        <button onClick={() => handleUpdateClick(element.companyId)}>Update</button>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteClick(element.companyId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showCreateForm && <CreateCompanyAdminForm onClose={handleCreateFormClose} />}
            <ToastContainer />
        </div>
    );
}

export default CompanyAdmin;
