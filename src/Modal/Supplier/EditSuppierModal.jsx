import React, { useState, useEffect } from "react";
import axios from "axios";

function EditSuppierModal({
  isEditOpen,
  onClose,
  supplierData,
  onSupplierUpdated,
}) {
  if (!isEditOpen) return null;

  const [formData, setFormData] = useState({
    supplier: "",
    address: "",
    contactNumber: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  useEffect(() => {
    if (supplierData) {
      setFormData({
        supplier: supplierData.SupplierName || "",
        address: supplierData.SupplierAddress || "",
        contactNumber: supplierData.SupplierContact || "",
        status: supplierData.Status || "Active",
      });
    }
  }, [supplierData]);

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.supplier) newErrors.supplier = "Supplier is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact Number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!supplierData || !supplierData.SupplierId) {
        alert("Error: Missing supplier ID");
        return;
      }

      try {
        await axios.put(
          `http://127.0.0.1:8000/supplier/edit/${supplierData.SupplierId}`,
          formData
        );
        alert("Supplier updated successfully!");
        if (onSupplierUpdated) onSupplierUpdated();
        onClose();
      } catch (error) {
        console.error("Error updating supplier:", error);
        alert("Failed to update supplier");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Item</h2>
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
              name="supplier"
              value={formData.supplier}
              onChange={handleError}
              placeholder="Supplier Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.supplier ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.supplier && (
              <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
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
              type="number"
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

          <div>
            <select
              name="status"
              value={formData.status}
              onChange={handleError}
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300`}>
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

export default EditSuppierModal;
