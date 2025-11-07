import React, { useState, useEffect } from "react";

function RequestStock() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/stock/items");
      const data = await response.json();
      if (data.status === "success") {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/list");
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/supplier/fetch");
      const data = await response.json();
      if (data.status === "success") {
        setSuppliers(data.data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(); // Optional: Modify to include search params if needed
  };

  const filteredItems = items.filter(
    (item) =>
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="header bg-blue-600 text-white p-4 rounded-lg mb-6 shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Item Stock Card Management</h2>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            <i className="fa-solid fa-file-export mr-2"></i> Generate Report
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="card bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="search-form flex gap-2">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="btn bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
            <i className="fa-solid fa-search mr-2"></i> Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="btn bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
              <i className="fa-solid fa-rotate-left mr-2"></i> Reset
            </button>
          )}
        </form>
      </div>

      {/* Items Table */}
      <div className="card bg-white rounded-lg shadow-md p-6">
        <div className="card-header flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            <i className="fa-solid fa-list mr-2"></i> Item Stock Card List
          </h3>
        </div>

        <div className="table-wrap overflow-x-auto">
          <table className="table w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Item Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Quantity
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Unit Price
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.productName}</td>
                  <td className="py-3 px-4">{item.categoryName}</td>
                  <td className="py-3 px-4">{item.quantity || 0}</td>
                  <td className="py-3 px-4">竄ｱ{item.unitPrice?.toFixed(2)}</td>
                  <td className="py-3 px-4">{item.supplier_name}</td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-4 text-center text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestStock;
