import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = ({ adminToken }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    devicesAllocated: [],
    status: 'Active',
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8006/registeruser", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log("User added successfully:", response.data);
        setMessage(response.data.message);
        setSuccess(true);
        setUserData({
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          devicesAllocated: [],
          status: 'Active',
        });
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setMessage("Error adding user: " + error.response.data.message);
        setSuccess(false);
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Add User</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Username"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Password"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Phone Number"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="devicesAllocated" className="block text-gray-700 text-sm font-bold mb-2">Devices Allocated</label>
          <input
            type="text"
            id="devicesAllocated"
            name="devicesAllocated"
            value={userData.devicesAllocated}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Devices Allocated (comma-separated)"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={userData.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className={success ? 'text-green-500 mt-2' : 'text-red-500 mt-2'}>{message}</p>
      )}
    </div>
  );
};

export default AddUserForm;

