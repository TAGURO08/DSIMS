import React, { useState } from "react";

function StockCardModal({ isAddOpen, onClose }) {
  if (!isAddOpen) return null;

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    supplier: "",
  });
  const [errors, setErrors] = useState({});
  if (!isAddOpen) return null;
  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = () => {
    let newErrors = {};

    if (!formData.itemName) {
      newErrors.itemName = "Item Name is required";
    } else if (
      !formData.category ||
      formData.category === "-- Select Category --"
    ) {
      newErrors.category = "Category is required";
    } else if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (!formData.unit) {
      newErrors.unit = "Unit is required";
    } else if (
      !formData.supplier ||
      formData.supplier === "-- Select Supplier --"
    ) {
      newErrors.supplier = "Supplier is required";
    }

    setErrors(newErrors);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Item</h2>
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
            <select
              name="category"
              value={formData.category}
              onChange={handleError}
              id="category"
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring ${
                errors.category ? "border-red-500" : "focus:ring-blue-300"
              }`}>
              <option value="-- Select Category --">
                -- Select Category --
              </option>
              <option value="Fire">Eugene</option>
              <option value="Medical">Marzan</option>
              <option value="Crime">Pogi</option>
              <option value="Natural Disaster">haha</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleError}
              placeholder="Quantity"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.quantity ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="unit"
              value={formData.unit}
              onChange={handleError}
              placeholder="Unit"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.unit && (
              <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
            )}
          </div>
          <div>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleError}
              id="supplier"
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring ${
                errors.supplier ? "border-red-500" : "focus:ring-blue-300"
              }`}>
              <option value="-- Select Category --">
                -- Select Supplier --
              </option>
              <option value="Fire">Eugene</option>
              <option value="Medical">Marzan</option>
              <option value="Crime">Pogi</option>
              <option value="Natural Disaster">haha</option>
            </select>
            {errors.supplier && (
              <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
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

export default StockCardModal;
