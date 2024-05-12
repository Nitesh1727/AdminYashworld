import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";

import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const navigate = useNavigate(); // Hook to perform navigation

  const [currentPage, setCurrentPage] = useState("options");

    
  const handleOptionSelect = (page) => {
    setCurrentPage(page);
  };
  const handleGoBack = () => {
    setCurrentPage("options");
  };

  const setMessage = (message, success) => {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
    messageElement.style.color = success ? "green" : "red";

    // Clear the message after 5 seconds
    setTimeout(() => {
      messageElement.innerText = "";
    }, 5000);
  };
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleAdminRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Modify adminData to include the role as "user"
      const requestData = {
        ...adminData,
        role: "admin",
      };

      console.log("admin data", adminData);

      const response = await axios.post(
        "http://localhost:8006/register",
        requestData
      );
      console.log(response.data);
      setMessage(response.data.message, response.data.success);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        email: loginData.email,
        password: loginData.password,
        role: "user",
      };
  
      const response = await axios.post(
        "http://localhost:8006/login",
        requestData
      );
      console.log(response.data); // Check the response
      setMessage(response.data.message, response.data.success);
  
      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token); // Set userToken in local storage
        navigate("/userdashboard");       }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        email: loginData.email,
        password: loginData.password,
        role: "admin",
      };

      const response = await axios.post(
        "http://localhost:8006/login",
        requestData
      );
      console.log(response.data);
      setMessage(response.data.message, response.data.success);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        console.log("Admintoken->",response.data.token)
        navigate("/admindashboard");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...userData,
        role: "user",
      };
      console.log("user data", userData);
      const response = await axios.post(
        "http://localhost:8006/register",
        requestData
      );
      console.log(response.data);
      setMessage(response.data.message, response.data.success);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      

      case "userLogin":
        return (
          <div>

            <h2 className="text-2xl font-bold mb-4">User Login</h2>
            <form onSubmit={handleUserLoginSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <button
                className="ml-2 text-blue-500 underline"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </form>
          </div>
        );

      case "adminRegister":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Registration</h2>
            <form onSubmit={handleAdminRegisterSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={adminData.username}
                  onChange={(e) =>
                    setAdminData({ ...adminData, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={adminData.email}
                  onChange={(e) =>
                    setAdminData({ ...adminData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={adminData.password}
                  onChange={(e) =>
                    setAdminData({ ...adminData, password: e.target.value })
                  }
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
              <button
                className="ml-2 text-blue-500 underline"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </form>
          </div>
        );

      case "adminLogin":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <form onSubmit={handleAdminLoginSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <button
                className="ml-2 text-blue-500 underline"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Choose an option:</h2>
            
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4"
              onClick={() => handleOptionSelect("userLogin")}
            >
              User Login
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4"
              onClick={() => handleOptionSelect("adminRegister")}
            >
              Admin Register
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4"
              onClick={() => handleOptionSelect("adminLogin")}
            >
              Admin Login
            </button>
          </div>
        );
    }
  };

  return (
    
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
          {renderPageContent()}
          <p id="message"></p>
        </div>
      </div>
      
      
    
  );
};

export default Home;
