import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineStock } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";

function CurrentStock() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    { name: "Item", selector: row => row.item_name, sortable: true, left: true },
    { name: "Category", selector: row => row.category, sortable: true, left: true },
    { name: "Supplier", selector: row => row.supplier_name, sortable: true, left: true },
    { name: "Quantity", selector: row => row.quantity, sortable: true, center: true },
    { 
      name: "Unit Price", 
      selector: row => `₱${row.unit_price?.toFixed(2)}`, 
      sortable: true, 
      center: true 
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        justifyContent: "flex-start",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#1E3A8A",
        color: "white",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "16px",
      },
    },
    cells: {
      style: {
        justifyContent: "flex-start",
        textAlign: "left",
        fontSize: "14px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "16px",
      },
    },
    rows: {
      style: {
        alignItems: "center",
        minHeight: "50px",
      },
    },
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <AiOutlineStock className="text-2xl" />
          <h1 className="text-lg font-semibold">Current Stock</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-b-lg shadow-md mt-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4 px-4 mt-4">
          <input
            type="text"
            placeholder="Search item, category, or supplier..."
            className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#172554]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      
{(user?.role === "Admin" || user?.role === "Programmer") && (
  <button className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
    <FaFileExcel className="text-lg" />
    Export
  </button>
)}
        </div>

        {/* Data Table */}
        <div className="relative w-full rounded-b-lg">
          <DataTable
            columns={columns}
            data={filteredStocks}
            pagination
            highlightOnHover
            striped
            responsive
            dense
            customStyles={customStyles}
            noDataComponent={<div className="text-gray-500 italic py-3">No stock data found</div>}
          />
        </div>
      </div>
    </div>
  );
}

export default CurrentStock;
