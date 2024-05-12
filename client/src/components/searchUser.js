import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteUser from "./deleteUser";
import EditUserForm from "./editUserForm";

const SearchUser = ({ adminToken, action }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    searchType: "",
    searchTerm: "",
  });
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchOption, setSearchOption] = useState("username");
  const [searchInput, setSearchInput] = useState("");

  const [userAction, setUserAction] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    setUserAction(action);
  }, [action]);

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (searchOption && searchInput.trim() !== "") {
      try {
        const query = `${searchOption}=${encodeURIComponent(
          searchInput.trim()
        )}`;
        const response = await axios.get(
          `http://localhost:8006/searchuser?${query}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error searching users:", error);
        setErrorMessage("Failed to search users.");
      }
    } else {
      console.error("Search criteria not provided.");
      setErrorMessage(
        "Please select a search criteria and enter a search term."
      );
    }
  };

  const handleUpdateUser = (user) => {
    setEditUser(user);
    setEditMode(true);
  };

  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Search Users</h2>
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
                  <th className="border border-gray-600 px-4 py-2">
                    Phone Number
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    Devices Allocated
                  </th>
                  <th className="border border-gray-600 px-4 py-2">Status</th>
                  <th className="border border-gray-600 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border border-gray-600 px-4 py-2">
                      {user.username}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {user.phoneNumber}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {user.devicesAllocated.join(", ")}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {user.status}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {userAction === "edit" ? (
                        <button
                          onClick={() => handleUpdateUser(user)}
                          className={`px-3 py-1 rounded cursor-pointer ${
                            userAction === "edit"
                              ? "bg-green-600 text-white hover:bg-green-700 hover:text-white"
                              : "bg-red-600 text-white hover:bg-red-700 hover:text-white"
                          }`}
                        >
                          Edit
                        </button>
                      ) : (
                        <DeleteUser user={user} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editMode && <EditUserForm user={editUser} onUpdateUser={handleUpdateUser} />}
    </div>
  );
};

export default SearchUser;
