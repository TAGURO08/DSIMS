import React, { useState, useEffect } from "react";

function CategoryModal({ isAddOpen, onClose, onAddSuccess }) {
  if (!isAddOpen) return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/category/list");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.data);
        } else {
          console.error(data.detail || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleSave = async () => {
    let newErrors = {};

    if (!formData.categoryName) {
      newErrors.categoryName = "Category Name is required";
    } else if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:8000/category/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: formData.categoryName,
            description: formData.description,
            status: "Active",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Category added successfully!");
          if (typeof onAddSuccess === "function") {
            onAddSuccess();
          }
          onClose();
        } else {
          alert(data.detail || "Something went wrong");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to save category");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Category</h2>
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
              name="categoryName"
              value={formData.categoryName}
              onChange={handleError}
              placeholder="Category Name"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.categoryName ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.categoryName && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleError}
              placeholder="Description"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
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

export default CategoryModal;
