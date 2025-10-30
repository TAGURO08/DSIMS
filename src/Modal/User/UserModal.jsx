import React, { useState, useEffect } from "react";

function UserModal({ isAddOpen, onClose, onUserAdded }) {
  if (!isAddOpen) return null;

  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    birthdate: "",
    email: "",
    office: "",
    role: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/office/list"); // same as Office page
        const data = await res.json();
        if (data.status === "success") {
          setOffices(data.data); // data.data should be an array of offices
        }
      } catch (err) {
        console.error("Error fetching offices:", err);
      }
    };
    fetchOffices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fname) newErrors.fname = "First name is required";
    if (!formData.lname) newErrors.lname = "Last name is required";
    if (!formData.birthdate) newErrors.birthdate = "Birthdate is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.office) newErrors.office = "Office is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("User registered successfully!");
        onUserAdded();
        onClose();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while registering the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={formData.fname}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.fname ? "border-red-500" : "focus:ring-blue-300"
            }`}
          />
          {errors.fname && (
            <p className="text-red-500 text-xs mt-1">{errors.fname}</p>
          )}

          <input
            type="text"
            name="mname"
            placeholder="Middle Name"
            value={formData.mname}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={formData.lname}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.lname ? "border-red-500" : "focus:ring-blue-300"
            }`}
          />
          {errors.lname && (
            <p className="text-red-500 text-xs mt-1">{errors.lname}</p>
          )}

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

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.email ? "border-red-500" : "focus:ring-blue-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <select
            name="office"
            value={formData.office}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.office ? "border-red-500" : "focus:ring-blue-300"
            }`}>
            <option value="">-- Select Office --</option>
            {offices.map((office) => (
              <option key={office.OfficeId} value={office.OfficeName}>
                {office.OfficeName}
              </option>
            ))}
          </select>

          {errors.office && (
            <p className="text-red-500 text-xs mt-1">{errors.office}</p>
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.role ? "border-red-500" : "focus:ring-blue-300"
            }`}>
            <option value="">-- Select Role --</option>
            <option value="User">User</option>
            <option value="Programmer">Programmer</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.password ? "border-red-500" : "focus:ring-blue-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
              errors.confirm_password ? "border-red-500" : "focus:ring-blue-300"
            }`}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirm_password}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
