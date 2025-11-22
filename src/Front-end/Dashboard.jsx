import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch("/api/stock/current");
      const data = await response.json();
      if (data.status === "success") {
        setStocks(data.data);

        const lowStock = data.data.filter((item) => item.quantity < 11);
        setLowStockItems(lowStock);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="bg-[#0f2c56] text-white px-6 py-4 rounded-lg shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <span className="text-sm">Current Stock Overview</span>
      </div>

      {/* Graph Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Stock Levels</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={stocks}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="item_name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="quantity"
              fill="#0f2c56"
              barSize={40}
              radius={[5, 5, 0, 0]}>
              <LabelList
                dataKey="quantity"
                position="top"
                formatter={(value) => `${value}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Button */}
      {lowStockItems.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            {showLowStock
              ? "Hide Low Stock Items"
              : `View Low Stock Items (${lowStockItems.length})`}
          </button>
        </div>
      )}

      {/* Low Stock Table */}
      {showLowStock && (
        <div className="bg-red-50 border border-red-400 rounded-lg shadow-md p-6 mt-4 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-2">⚠️ Low Stock Items</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-red-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Item Name
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
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-red-100 transition duration-150">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.supplier_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Low Stock Table */}
      {showLowStock && (
        <div className="bg-red-50 border border-red-400 rounded-lg shadow-md p-6 mt-4 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-2">⚠️ Low Stock Items</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-red-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Item Name
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
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-red-100 transition duration-150">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {item.supplier_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
