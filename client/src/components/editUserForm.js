import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchUser from './searchUser';

const EditUserForm = ({ user, onUpdateUser }) => {
  const [adminToken, setAdminToken] = useState("");
  useEffect(() => {
    // Retrieve admin token from local storage
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      console.log("Admin token retrieved:", token);
    }
  }, []);

  // Initialize formData with default values or user's data if available
  const initialFormData = {
    phoneNumber: user?.phoneNumber || "",
    devicesAllocated: user?.devicesAllocated?.join(", ") || "",
    status: user?.status || "Active",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user._id; // Extract user ID
    try {
      const response = await axios.put(`http://localhost:8006/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      onUpdateUser(response.data); // Call the onUpdateUser function with the updated user data
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="mt-8">
      <SearchUser adminToken={adminToken} action="edit" />
  
      {   user && (
        <div>
          <h2 className="text-2xl font-bold mt-8 mb-4">Edit User(after searchUser)</h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number (Must have numeric and 10 digits)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Phone Number"
                pattern="[0-9]{10}"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="devices" className="block text-gray-700 text-sm font-bold mb-2">
                Devices (List of devices) Multiple Selection
              </label>
              <textarea
                id="devices"
                name="devicesAllocated"
                value={formData.devicesAllocated}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Device Names (comma-separated)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                Status: (Selection - Active, Deactive)
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
  };

export default EditUserForm;
