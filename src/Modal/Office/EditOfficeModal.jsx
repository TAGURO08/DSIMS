import React, { useState, useEffect } from "react";

function EditOfficeModal({ isEditOpen, onClose, office, onUpdate }) {
  const [formData, setFormData] = useState({
    OfficeId: "",
    officeName: "",
    location: "",
    status: "",
    dateCreated: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditOpen && office) {
      setFormData({
        OfficeId: office.OfficeId || "",
        officeName: office.OfficeName || "",
        location: office.OfficeLocation || "",
        status: office?.Status?.trim() || "",
        dateCreated: office.DateCreated || "",
      });
    }
  }, [isEditOpen, office]);

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.officeName) newErrors.officeName = "Office Name is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/office/edit/${formData.OfficeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            officeName: formData.officeName,
            location: formData.location,
            status: formData.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update office");
      }

      alert("Office updated successfully!"); // show alert
      onClose(); // close modal

      // Call parent function to update table
      if (onUpdate) {
        onUpdate({
          OfficeId: formData.OfficeId,
          OfficeName: formData.officeName,
          OfficeLocation: formData.location,
          Status: formData.status,
          DateCreated: formData.dateCreated,
        });
      }
    } catch (error) {
      console.error("Error updating office:", error);
      alert(error.message);
    }
  };

  if (!isEditOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Office</h2>
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
              value={formData.officeName}
              onChange={handleError}
              placeholder="Office Name"
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

          <div>
            <select
              name="status"
              value={formData.status}
              onChange={handleError}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300">
              <option value="">Select Status</option>
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

export default EditOfficeModal;
