// ReadAllUsers.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ReadAllUsers = ({ adminToken }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users data when component mounts
    axios
      .get("http://localhost:8006/users", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((response) => {
        console.log("Users data:", response.data);
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [adminToken]); // Fetch users data whenever adminToken changes

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Read All Users</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="border border-gray-600 px-4 py-2">Username</th>
              <th className="border border-gray-600 px-4 py-2">Email</th>
              <th className="border border-gray-600 px-4 py-2">Phone Number</th>
              <th className="border border-gray-600 px-4 py-2">Devices Allocated</th>
              <th className="border border-gray-600 px-4 py-2">Status</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border border-gray-600 px-4 py-2">{user.username}</td>
                <td className="border border-gray-600 px-4 py-2">{user.email}</td>
                <td className="border border-gray-600 px-4 py-2">{user.phoneNumber}</td>
                <td className="border border-gray-600 px-4 py-2">{user.devicesAllocated.join(", ")}</td>
                <td className="border border-gray-600 px-4 py-2">{user.status}</td>
                {/* Add more table cells with user data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadAllUsers;
