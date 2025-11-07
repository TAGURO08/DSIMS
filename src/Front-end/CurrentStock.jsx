import React, { useState, useEffect } from "react";

function CurrentStock() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch("/api/stock/current");
      const data = await response.json();
      if (data.status === "success") {
        setStocks(data.data);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Current Stock</h1>
      </div>

      {/* Search Form */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search item, category, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md">
          Search
        </button>
      </form>

      {/* Stock Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-3 text-left">Item</th>
              <th className="py-2 px-3 text-left">Category</th>
              <th className="py-2 px-3 text-left">Supplier</th>
              <th className="py-2 px-3 text-center">Quantity</th>
              <th className="py-2 px-3 text-center">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{stock.item_name}</td>
                <td className="py-2 px-3">{stock.category}</td>
                <td className="py-2 px-3">{stock.supplier_name}</td>
                <td className="py-2 px-3 text-center">{stock.quantity}</td>
                <td className="py-2 px-3 text-center">
                  竄ｱ{stock.unit_price?.toFixed(2)}
                </td>
              </tr>
            ))}
            {filteredStocks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No stock records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CurrentStock;
