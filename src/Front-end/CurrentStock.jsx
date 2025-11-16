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
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="bg-[#0f2c56] text-white px-6 py-3 rounded-t-lg -mx-6 -mt-6 mb-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          📦 Current Stock
        </h1>
      </div>

      {/* Search Bar + Optional Export Button */}
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search item, category, or supplier..."
          className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#0f2c56]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Item
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Supplier
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Unit Price
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {stock.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {stock.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {stock.supplier_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    {stock.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    ₱{stock.unit_price?.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 text-sm"
                >
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
