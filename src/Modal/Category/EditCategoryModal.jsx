import React, { useState, useEffect } from "react";
function EditCategoryModal({ isEditOpen, onClose, categoryData, onUpdate }) {
  if (!isEditOpen) return null;

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryData && Object.keys(categoryData).length > 0) {
      setFormData({
        categoryName: categoryData.categoryName || "",
        description: categoryData.description || "",
        status: categoryData.status || "Active",
      });
    }
  }, [categoryData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.categoryName)
      newErrors.categoryName = "Category Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log("Editing category:", categoryData);
      const res = await fetch(
        `http://127.0.0.1:8000/category/edit/${categoryData.categoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        alert("Category updated successfully!");
        onUpdate();
        onClose();
      } else {
        alert(`Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Category</h2>
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Description"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${
                errors.description ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300">
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

export default EditCategoryModal;
