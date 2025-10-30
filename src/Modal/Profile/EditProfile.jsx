import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfile({ isEditOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    birthdate: "",
    office: "",
    role: "",
  });

  useEffect(() => {
    if (isEditOpen) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setFormData({
            fname: parsedUser.fname || "",
            mname: parsedUser.mname || "",
            lname: parsedUser.lname || "",
            email: parsedUser.email || "",
            birthdate: parsedUser.birthdate || "",
            office: parsedUser.office || "",
            role: parsedUser.role || "",
          });
        } catch (err) {
          console.error("Invalid user data in localStorage:", err);
        }
      }
    }
  }, [isEditOpen]);

  if (!isEditOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;

      const response = await axios.put(
        `http://127.0.0.1:8000/profile/${userId}`,
        formData
      );

      if (response.data.success) {
        alert("Profile updated successfully!");

        const updatedUser = { ...storedUser, ...formData };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (onUpdate) onUpdate(updatedUser);

        onClose();
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (!isEditOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="First Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300`}
            />
          </div>
          <div>
            <input
              type="text"
              name="mname"
              value={formData.mname}
              onChange={handleChange}
              placeholder="Middle Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300`}
            />
          </div>
          <div>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300`}
            />
          </div>
          <div>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              placeholder="Birth Date"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300`}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300`}
            />
          </div>
          <div>
            <select
              name="office"
              id="office"
              value={formData.office}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300`}>
              <option value="-- Select Office --">-- Select Office --</option>
              <option value="BSIT">BSIT</option>
              <option value="BSBA">BSBA</option>
              <option value="BEED">BEED</option>
            </select>
          </div>
          <div>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300`}>
              <option value="-- Select Role --">-- Select Role --</option>
              <option value="User">User</option>
              <option value="Programmer">Programmer</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
