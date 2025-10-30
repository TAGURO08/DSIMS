import React, { useState } from "react";

function EditRISModal({ isEditOpen, onClose }) {
  if (!isEditOpen) return null;

  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = () => {
    let newErrors = {};

    if (!formData.itemName) {
      newErrors.itemName = "Item Name is required";
    } else if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    }

    setErrors(newErrors);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add RIS</h2>
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
              name="itemName"
              value={formData.itemName}
              onChange={handleError}
              placeholder="Item Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.itemName ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleError}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.quantity ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
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

export default EditRISModal;
