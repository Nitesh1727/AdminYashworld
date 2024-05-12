import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">User Dashboard</h1>
          
        </div>
      </nav>

      {/* User Details */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Details</h1>
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : userData ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-lg">{userData.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Status:</p>
                <p className="text-lg">{userData.status}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-500">Failed to fetch user data.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-500 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 User Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
