import React, { useState } from "react";

function SupplierModal({ isAddOpen, onClose, onSupplierAdded }) {
  if (!isAddOpen) return null;

  const [formData, setFormData] = useState({
    supplierName: "",
    address: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState({});
  if (!isAddOpen) return null;
  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleSave = async () => {
    let newErrors = {};

    if (!formData.supplierName)
      newErrors.supplierName = "Supplier Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact Number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/supplier/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      alert(data.message);
      if (data.status === "success") {
        onSupplierAdded();
      }
      onClose();
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Supplier</h2>
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
              name="supplierName"
              value={formData.supplierName}
              onChange={handleError}
              placeholder="Supplier Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.supplierName ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.supplierName && (
              <p className="text-red-500 text-xs mt-1">{errors.supplierName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleError}
              placeholder="Address"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.address ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleError}
              placeholder="Contact Number"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.contactNumber ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactNumber}
              </p>
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
            className="px-4 py-2 text-sm rounded bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierModal;
