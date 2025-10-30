import React, { useState, useEffect } from "react";

function EditUser({ isEditOpen, onClose, userData, onUpdate }) {
  if (!isEditOpen) return null;

  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    extensionName: "",
    birthdate: "",
    email: "",
    office: "",
    role: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFormData({
        fname: userData.fname || "",
        mname: userData.mname || "",
        lname: userData.lname || "",
        extensionName: userData.extensionName || "",
        birthdate: userData.birthdate || "",
        email: userData.email || "",
        office: userData.office || "",
        role: userData.role || "",
        status: userData.status || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.fname) newErrors.fname = "First Name is required";
    if (!formData.lname) newErrors.lname = "Last Name is required";
    if (!formData.birthdate) newErrors.birthdate = "Birth Date is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.office) newErrors.office = "Office is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log("Raw userData.id:", userData.id);
      console.log("Type of userData.id:", typeof userData.id);

      const response = await fetch(
        `http://127.0.0.1:8000/edit_user/${Number(userData.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("User updated successfully!");
        onClose();
        if (typeof onUpdate === "function") {
          onUpdate();
        }
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Failed to update user: " + error.message);
    }
  };

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
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.fname ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.fname && (
              <p className="text-red-500 text-xs mt-1">{errors.fname}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="mname"
              value={formData.mname}
              onChange={handleChange}
              placeholder="Middle Name"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.lname ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.lname && (
              <p className="text-red-500 text-xs mt-1">{errors.lname}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.birthdate ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.birthdate && (
              <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.email ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <select
              name="office"
              value={formData.office}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="">-- Select Office --</option>
              <option value="BSIT">BSIT</option>
              <option value="BSBA">BSBA</option>
              <option value="BEED">BEED</option>
            </select>
            {errors.office && (
              <p className="text-red-500 text-xs mt-1">{errors.office}</p>
            )}
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="">-- Select Role --</option>
              <option value="User">User</option>
              <option value="Programmer">Programmer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          <div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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

export default EditUser;
