import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Modal from "../Modal/dashboard/viewdash";

function Dashboard() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const [stocks, setStocks] = useState([]);
  const [risData, setRisData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStockTable, setShowLowStockTable] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showRISModal, setShowRISModal] = useState(false);

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8A2BE2",
    "#00A651",
    "#C71585",
  ];

  const renderLabel = ({ name, value }) => `${name}: ${value}`;

  useEffect(() => {
    fetchStocks();
    fetchRIS();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch(`${API_BASE}/item/list`);
      const data = await response.json();
      if (data.status === "success") {
        // map backend shape to expected frontend fields
        const mapped = data.data.map((it) => ({
          item_name: it.ProductName || it.label || "",
          quantity: it.StockQty ?? it.stockQty ?? 0,
          category: it.CategoryName || "",
          supplier_name: it.SupplierName || "",
        }));
        setStocks(mapped);
        const lowStock = mapped.filter((item) => item.quantity < 11);
        setLowStockItems(lowStock);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const fetchRIS = async () => {
    try {
      // fetch aggregated RIS item requests for charting
      const response = await fetch(`${API_BASE}/ris/aggregated-items`);
      const data = await response.json();
      if (data.status === "success") {
        // expected shape: [{ ProductName, RequestedQuantity }]
        const mapped = data.data.map((d) => ({
          name: d.ProductName,
          value: d.RequestedQuantity,
        }));
        setRisData(mapped);
      }
    } catch (error) {
      console.error("Error fetching RIS data:", error);
    }
  };

  // FIXED: Get top 10 items for charts to avoid overcrowding
  const getTopStocksForChart = () => {
    return [...stocks]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
      .map((item) => ({
        name: item.item_name,
        value: item.quantity,
      }));
  };

  const getTopRISForChart = () => {
    // risData is already aggregated as [{name, value}]
    return risData.slice(0, 10);
  };

  const lowestStockItems = () =>
    [...stocks].sort((a, b) => a.quantity - b.quantity).slice(0, 5);

  const topRISItems = () => {
    return risData.slice(0, 5).map((d) => [d.name, d.value]);
  };

  // Check if we have data for charts
  const hasStockData = stocks.length > 0;
  const hasRISData = risData.length > 0;

  return (
    <div className="w-full p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-5 rounded-xl shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">
          📊 Dashboard Overview
        </h1>
        <span className="text-sm opacity-90">Inventory & RIS Analytics</span>
      </div>

      {/* ALERT SECTION */}
      {(lowStockItems.length > 0 || risData.length > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-xl shadow-md">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div>
                <p className="font-semibold text-red-700 text-lg">
                  ⚠ Low Stock Items
                </p>
                <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 max-h-36 overflow-auto">
                  {lowStockItems.map((item) => (
                    <li key={item.item_name}>
                      {item.item_name} – Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Top RIS Items */}
            {risData.length > 0 && (
              <div>
                <p className="font-semibold text-orange-700 text-lg">
                  📌 Most Requested Items
                </p>
                <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 max-h-36 overflow-auto">
                  {topRISItems().map(([name, qty], idx) => (
                    <li key={idx}>
                      {name} – Requested: {qty}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOW STOCK TABLE TOGGLE */}
      {lowStockItems.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowLowStockTable(!showLowStockTable)}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition text-sm">
            {showLowStockTable
              ? "Hide Low Stock Items"
              : `View Low Stock Items (${lowStockItems.length})`}
          </button>
        </div>
      )}

      {/* LOW STOCK TABLE */}
      {showLowStockTable && (
        <div className="bg-red-50 border border-red-400 rounded-xl shadow-md p-6 mt-2 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-3 text-red-700">
            ⚠ Low Stock Items
          </h2>

          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-red-100">
              <tr>
                <th className="border px-4 py-2 text-left">Item Name</th>
                <th className="border px-4 py-2 text-left">Category</th>
                <th className="border px-4 py-2 text-left">Supplier</th>
                <th className="border px-4 py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, index) => (
                <tr key={index} className="hover:bg-red-100 transition">
                  <td className="border px-4 py-2">{item.item_name}</td>
                  <td className="border px-4 py-2">{item.category}</td>
                  <td className="border px-4 py-2">{item.supplier_name}</td>
                  <td className="border px-4 py-2 text-center font-semibold text-red-700">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* STOCK PIE CHART */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <button
            onClick={() => setShowStockModal(true)}
            className="w-full bg-red-100 border-l-4 border-red-500 p-3 rounded-lg mb-4 text-left font-semibold text-red-700">
            📉 View Lowest 5 Stock Items
          </button>

          <h2 className="text-lg font-bold mb-4 text-gray-700">
            Stock Level Breakdown (Top 10)
          </h2>
          {hasStockData ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={getTopStocksForChart()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={renderLabel}
                  isAnimationActive={true}>
                  {getTopStocksForChart().map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No stock data available
            </div>
          )}
        </div>

        {/* RIS PIE CHART */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <button
            onClick={() => setShowRISModal(true)}
            className="w-full bg-orange-100 border-l-4 border-orange-500 p-3 rounded-lg mb-4 text-left font-semibold text-orange-700">
            🔥 View Top 5 Requested Items
          </button>

          <h2 className="text-lg font-bold mb-4 text-gray-700">
            RIS Request Distribution (Top 10)
          </h2>
          {hasRISData ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={getTopRISForChart()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={renderLabel}
                  isAnimationActive={true}>
                  {getTopRISForChart().map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No RIS data available
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="📉 Lowest 5 Stock Items"
        mode="stocks"
      />

      <Modal
        isOpen={showRISModal}
        onClose={() => setShowRISModal(false)}
        title="🔥 Top 5 Most Requested Items"
        mode="ris"
      />
    </div>
  );
}

export default Dashboard;
