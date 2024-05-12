import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteUser from "./deleteUser";

const EditUser = ({ adminToken }) => {
  const [searchOption, setSearchOption] = useState("username");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    devicesAllocated: "",
    status: "Active",
  });

  
  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8006/users", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    console.log("admin",adminToken);
    if (searchInput.trim() !== "") {
      try {
        const response = await axios.get(
          `http://localhost:8006/searchuser?${searchOption}=${encodeURIComponent(
            searchInput.trim()
          )}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  const handleUpdateUser = (user) => {
    setEditUser(user);
    setEditMode(true);
    // Pre-fill form data with user details
    setFormData({
      phoneNumber: user.phoneNumber || "",
      devicesAllocated: user.devicesAllocated?.join(", ") || "",
      status: user.status || "Active",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = editUser._id; // Extract user ID
    try {
      const response = await axios.put(
        `http://localhost:8006/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      // Update user list with updated data
      const updatedUsers = users.map((user) =>
        user._id === userId ? response.data : user
      );
      setUsers(updatedUsers);
      setEditMode(false);
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  return (
    <div>
      {editMode ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mt-8 mb-4">Edit User</h2>
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
      ) : (
        <div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Search Users(edituse)</h2>
            <form onSubmit={handleSearchUsers} className="mt-4">
              <div className="flex flex-wrap -mx-3 mb-6 items-center">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="searchCriteria"
                  >
                    Search By
                  </label>
                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    id="searchCriteria"
                    value={searchOption}
                    onChange={(e) => setSearchOption(e.target.value)}
                  >
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="phoneNumber">Phone Number</option>
                  </select>
                </div>
                {searchOption && (
                  <div className="w-full md:w-2/3 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor={searchOption}
                    >
                      {searchOption === "username"
                        ? "Username"
                        : searchOption === "email"
                        ? "Email"
                        : "Phone Number"}
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id={searchOption}
                      type={searchOption === "email" ? "email" : "text"}
                      placeholder={`Enter ${
                        searchOption === "username"
                          ? "Username"
                          : searchOption === "email"
                          ? "Email"
                          : "Phone Number"
                      }`}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
  
          {users.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Search Results</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-600">
                  <thead>
                    <tr>
                      <th className="border border-gray-600 px-4 py-2">Username</th>
                      <th className="border border-gray-600 px-4 py-2">Email</th>
                      <th className="border border-gray-600 px-4 py-2">Phone Number</th>
                      <th className="border border-gray-600 px-4 py-2">Devices Allocated</th>
                      <th className="border border-gray-600 px-4 py-2">Status</th>
                      <th className="border border-gray-600 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="border border-gray-600 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-600 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-600 px-4 py-2">{user.phoneNumber}</td>
                        <td className="border border-gray-600 px-4 py-2">{user.devicesAllocated?.join(", ") || ""}</td>
                        <td className="border border-gray-600 px-4 py-2">{user.status}</td>
                        <td className="border border-gray-600 px-4 py-2">
                          <button
                            onClick={() => handleUpdateUser(user)}
                            className={`px-3 py-1 rounded cursor-pointer bg-green-600 text-white hover:bg-green-700 hover:text-white`}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditUser;