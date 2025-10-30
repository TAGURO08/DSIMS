import React, { useState, useEffect } from "react";

function ItemManagementModal({ isAddOpen, onClose, onItemAdded }) {
  if (!isAddOpen) return null;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/category/list")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.itemName) newErrors.itemName = "Item Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://127.0.0.1:8000/item/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: formData.itemName,
            categoryId: parseInt(formData.category),
            description: formData.description,
            unitPrice: parseFloat(formData.unit),
          }),
        });

        const result = await response.json();
        if (result.status === "success") {
          alert("✅ Item saved successfully!");
          onClose();
          if (onItemAdded) onItemAdded();
          setFormData({
            itemName: "",
            category: "",
            quantity: "",
            unit: "",
            description: "",
          });
        } else {
          alert("❌ " + result.message);
        }
      } catch (error) {
        console.error("❌ Error saving item:", error);
        alert("❌ Failed to save item. Please try again.");
      }
    }
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
              className={`w-full border rounded px-3 py-2 text-sm ${
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
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.category ? "border-red-500" : "focus:ring-blue-300"
              }`}>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
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
              className={`w-full border rounded px-3 py-2 text-sm ${
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
              placeholder="Unit Price"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.unit ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.unit && (
              <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleError}
              placeholder="Description"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.description ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-green-700 text-white hover:bg-green-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemManagementModal;
