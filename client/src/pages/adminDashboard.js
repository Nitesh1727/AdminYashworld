import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "../components/editUserForm";
import DeleteUser from "../components/deleteUser";
import AddUserForm from "../components/addUserForm";
import ReadAllUsers from "../components/readAllUsers";
import EditUser from "../components/editUse";
// import SearchUser from "../components/searchUser";

const AdminDashboard = () => {
    const [adminToken, setAdminToken] = useState(null);

  // Check if admin token exists in local storage
  useEffect(() => {
    // Retrieve admin token from local storage
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      console.log("Admin token retrieved:", token);
    }
  }, []);

  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setActiveComponent("AddUser")}
                className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer"
              >
                Add User
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("UpdateUser")}
                className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer"
              >
                Update User
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("DeleteUser")}
                className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer"
              >
                Delete User
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("ReadAllUsers")}
                className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer"
              >
                Read All Users
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {activeComponent === "AddUser" && <AddUserForm adminToken={adminToken}/>}
          {activeComponent === "UpdateUser" && <EditUser adminToken={adminToken} />}
          {activeComponent === "DeleteUser" && <DeleteUser adminToken={adminToken} />}
          {activeComponent === "ReadAllUsers" && <ReadAllUsers adminToken={adminToken}/>}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; 2024 Admin Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
