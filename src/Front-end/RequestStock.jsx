import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { RiFileList3Fill } from "react-icons/ri";
import { FaFileExcel } from "react-icons/fa";

function RequestStock() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/stock/requests");
      const data = await response.json();
      if (data.status === "success") {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (req) =>
      req.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.office_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    { name: "Item Name", selector: row => row.item_name, sortable: true, left: true },
    { name: "Category", selector: row => row.category, sortable: true, left: true },
    { name: "Office", selector: row => row.office_name, sortable: true, left: true },
    { name: "Quantity", selector: row => row.quantity, sortable: true, center: true },
    { 
      name: "Status",
      selector: row => row.status,
      center: true,
      cell: row => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.status === "Approved"
            ? "bg-green-100 text-green-700"
            : row.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}>{row.status}</span>
      )
    },
    {
      name: "Date Requested",
      selector: row => new Date(row.request_date).toLocaleDateString(),
      sortable: true,
      center: true
    }
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
          <RiFileList3Fill className="text-2xl" />
          <h1 className="text-lg font-semibold">Request Stock</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-b-lg shadow-md mt-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4 px-4 mt-4">
          <input
            type="text"
            placeholder="Search item, category, or office..."
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
            data={filteredRequests}
            pagination
            highlightOnHover
            striped
            responsive
            dense
            customStyles={customStyles}
            noDataComponent={<div className="text-gray-500 italic py-3">No request data found</div>}
          />
        </div>
      </div>
    </div>
  );
}

export default RequestStock;
