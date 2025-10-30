import React, { useState } from "react";

function OfficeMocal({ isAddOpen, onClose }) {
  if (!isAddOpen) return null;

  const [formData, setFormData] = useState({
    officeName: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.officeName) {
      newErrors.officeName = "Office Name is required";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/office/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save office");
      }

      const data = await response.json();
      console.log("Office added:", data);

      alert("✅ Office added successfully!");

      onClose();

      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to add office. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Office</h2>
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
              name="officeName"
              placeholder="Office Name"
              value={formData.officeName}
              onChange={handleError}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.officeName ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.officeName && (
              <p className="text-red-500 text-xs mt-1">{errors.officeName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleError}
              placeholder="Location"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.location ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
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
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfficeMocal;
