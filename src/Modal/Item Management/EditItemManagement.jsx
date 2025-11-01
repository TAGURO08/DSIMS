import React, { useState, useEffect } from "react";

function EditItemManagement({ isEditOpen, onClose, item, onItemUpdated }) {
  if (!isEditOpen) return null;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    ProductName: "",
    Description: "",
    CategoryName: "",
    UnitPrice: "",
    StockQty: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/category/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCategories(data.data);
        } else {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        ProductName: item.ProductName || "",
        Description: item.Description || "",
        CategoryName: item.CategoryName || "",
        UnitPrice: item.UnitPrice || "",
        StockQty: item.StockQty || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.ProductName)
      newErrors.ProductName = "Product Name is required";
    if (!formData.Description)
      newErrors.Description = "Description is required";
    if (!formData.CategoryName) newErrors.CategoryName = "Category is required";
    if (!formData.UnitPrice) newErrors.UnitPrice = "Unit Price is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/item/update/${item.ItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: formData.ProductName,
            description: formData.Description,
            categoryName: formData.CategoryName,
            unitPrice: parseFloat(formData.UnitPrice),
            stockQty: parseInt(formData.StockQty),
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        alert("✅ Item updated successfully!");
        onClose();
        if (onItemUpdated) {
          onItemUpdated();
        }
      } else {
        alert(`❌ Failed to update item: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating item:", err);
      alert("❌ Error updating item. Check console for details.");
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
              name="ProductName"
              value={formData.ProductName}
              onChange={handleChange}
              placeholder="Product Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                errors.ProductName ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.ProductName && (
              <p className="text-red-500 text-xs mt-1">{errors.ProductName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Description"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                errors.Description ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.Description && (
              <p className="text-red-500 text-xs mt-1">{errors.Description}</p>
            )}
          </div>

          <div>
            <select
              name="CategoryName"
              value={formData.CategoryName}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none ${
                errors.CategoryName ? "border-red-500" : "focus:ring-blue-300"
              }`}>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.CategoryName && (
              <p className="text-red-500 text-xs mt-1">{errors.CategoryName}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="UnitPrice"
              value={formData.UnitPrice}
              onChange={handleChange}
              placeholder="Unit Price"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                errors.UnitPrice ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.UnitPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.UnitPrice}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="StockQty"
              value={formData.StockQty}
              onChange={handleChange}
              placeholder="Stock Quantity"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                errors.StockQty ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.StockQty && (
              <p className="text-red-500 text-xs mt-1">{errors.StockQty}</p>
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

export default EditItemManagement;
