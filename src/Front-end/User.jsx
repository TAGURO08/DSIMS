import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { FaFileExcel } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import UserModal from "../Modal/User/UserModal";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import EditUser from "../Modal/User/EditUser";
import * as XLSX from "xlsx";

function User() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = () => {
    fetch("http://127.0.0.1:8000/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Filter users
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.fname} ${user.mname} ${user.lname}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ✅ EXPORT FUNCTION
  const handleExport = () => {
    if (filteredUsers.length === 0) {
      alert("No users to export!");
      return;
    }

    const dataToExport = filteredUsers.map((user) => ({
      "Last Name": user.lname,
      "First Name": user.fname,
      "Middle Name": user.mname,
      "Birth Date": user.birthdate,
      Email: user.email,
      Office: user.office,
      Role: user.role,
      Status: user.status,
      "Date Created": user.dateCreated,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(wb, "User_List.xlsx");
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 w-full h-full">
        <div className="first-card w-full h-full">
          <div className="flex justify-between items-center p-3 rounded shadow-lg bg-[#172554]">
            <div className="flex text-white gap-2">
              <FaUser className="text-[25px]" />
              <span className="text-[18px]">Users</span>
            </div>
          </div>
        </div>

        <div className="second-card w-full h-full">
          <div className="container w-full h-100vh">
            <div className="container-header text-black rounded-t-lg bg-sky-700">
              <div>
                <div className="flex justify-between items-center p-2">
                  <div className="flex">
                    <div className="flex items-center focus:border-white focus:outline-hidden bg-white gap-2 px-2 py-1 text-black rounded-lg transition">
                      <ImSearch className="text-lg" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm font-medium border-0 outline-none"
                      />
                    </div>
                  </div>
                  <div className="inset-x-0 bottom-0 space-y-2">
                    <button
                      onClick={() => setAddIsOpen(true)}
                      className="flex items-center hover:bg-green-500 gap-2 px-2 py-1 bg-green-800 text-white rounded-lg border border-green-600 transition cursor-pointer">
                      <FaUserPlus className="text-lg" />
                      <span className="text-sm font-medium">Add User</span>
                    </button>
                  </div>
                  <UserModal
                    isAddOpen={isAddOpen}
                    onClose={() => setAddIsOpen(false)}
                    onUserAdded={() => {
                      alert("User registered successfully!");
                      fetchUsers();
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="container-body overflow-x-auto text-black border rounded-b-lg border-sky-700 w-full h-[100%]">
              <div className="table w-full h-full">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                  <thead className="bg-gray-100 text-[#172554] uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Last Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        First Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Middle Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Birth Date
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Email
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Office
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Role
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Date Created
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.lname}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.fname}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.mname}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.birthdate}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.email}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.office}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.role}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 gap-2">
                            <div className="flex items-center gap-2">
                              {user.status === "Active" ? (
                                <FaCircleCheck className="text-green-500" />
                              ) : (
                                <FaCircleXmark className="text-red-500" />
                              )}
                              <span
                                className={
                                  user.status === "Active"
                                    ? "text-green-700 font-medium"
                                    : "text-red-700 font-medium"
                                }>
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {user.dateCreated}
                          </td>
                          <td className="px-2 py-2 border border-gray-300 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setEditIsOpen(true);
                              }}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                              <FaEdit />
                            </button>
                            {isEditOpen && selectedUser && (
                              <EditUser
                                isEditOpen={isEditOpen}
                                onClose={() => setEditIsOpen(false)}
                                userData={selectedUser}
                                onUpdate={fetchUsers}
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="text-center text-gray-500 py-4">
                          No matching users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="last-card w-full h-full">
          <div className="container-footer flex justify-end items-center p-3 bg-gray-50">
            {/* ✅ Export button now works */}
            <button
              onClick={handleExport}
              className="flex cursor-pointer items-center gap-2 px-2 py-2 bg-green-800 hover:bg-green-500 text-white rounded-lg border border-green-600 transition">
              <FaFileExcel className="text-lg" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
