import React, { useState } from "react";
import axios from "axios";

const DeleteUser = ({ adminToken }) => {
  const [searchOption, setSearchOption] = useState("username");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(null); // State to hold delete message
  const [deleteStatus, setDeleteStatus] = useState(null); // State to hold delete status (success/error)

  const handleSearchUsers = async (e) => {
    e.preventDefault();
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

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:8006/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setDeleteMessage(response.data.message);
      setDeleteStatus("success");
      // Optionally, you can perform any other actions after deletion, such as updating the UI
    } catch (error) {
      setDeleteMessage("Error deleting user.");
      setDeleteStatus("error");
      console.error('Error deleting user:', error);
      // Optionally, you can display an error message or handle the error in another way
    } finally {
      // Clear message after 5 seconds
      setTimeout(() => {
        setDeleteMessage(null);
        setDeleteStatus(null);
      }, 5000);
    }
  };

  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Search Users (Delete Mode)</h2>
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
                        onClick={() => handleDelete(user._id)} // Changed to handleDelete function
                        className={`px-3 py-1 rounded cursor-pointer bg-red-600 text-white hover:bg-red-700 hover:text-white`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete message */}
      {deleteMessage && (
        <div className={`mt-4 text-lg font-bold ${deleteStatus === "success" ? "text-green-600" : "text-red-600"}`}>
          {deleteMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
