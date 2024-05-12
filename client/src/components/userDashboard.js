import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Retrieve user token from local storage
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      console.log("User token retrieved:", token);
      // Call fetchUserData when token is retrieved
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8006/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Details</h1>
        {userData ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold">Username:</p>
                <p className="text-lg">{userData.username}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Email:</p>
                <p className="text-lg">{userData.email}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Phone Number:</p>
                <p className="text-lg">{userData.phoneNumber}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Status:</p>
                <p className="text-lg">{userData.status}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
