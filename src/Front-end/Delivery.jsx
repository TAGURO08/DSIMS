import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaTruck, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Delivery() {
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  const fetchDelivery = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/delivery/list");
      const data = await res.json();
      if (data.status === "success") {
        setDeliveryData(data.data);
      } else {
        console.error("Error fetching delivery:", data.message);
        setDeliveryData([]);
      }
    } catch (err) {
      console.error("Error fetching delivery:", err);
      setDeliveryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  const handleMarkDelivered = async (row) => {
    if (!window.confirm(`Mark ${row.ProductName} as delivered?`)) return;

    setMarkingId(row.PurchaseId);
    try {
      const res = await fetch(
        `http://localhost:8000/delivery/mark-delivered/${row.PurchaseId}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (res.ok && data.status === "success") {
        alert(`${row.ProductName} marked as delivered!`);
        fetchDelivery();
      } else {
        alert("Error: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setMarkingId(null);
    }
  };

  const handleExport = () => {
    if (deliveryData.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = deliveryData.map((row) => ({
      "Product Name": row.ProductName,
      "Supplier Name": row.SupplierName,
      Quantity: row.QtyToOrder,
      "Order Date": row.DateApproved,
      Status: row.Status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delivery");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Delivery_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.ProductName,
      sortable: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row.SupplierName,
      sortable: true,
    },
    { name: "Quantity", selector: (row) => row.QtyToOrder, sortable: true },
    { name: "Order Date", selector: (row) => row.DateApproved, sortable: true },
    { name: "Status", selector: (row) => row.Status, sortable: true },
    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) =>
        user?.role === "Admin" || user?.role === "Programmer" ? (
          <button
            onClick={() => handleMarkDelivered(row)}
            className={`py-1 px-2 rounded-md text-xs font-medium ${
              row.Status === "Delivered"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={
              row.Status === "Delivered" || markingId === row.PurchaseId
            }>
            {markingId === row.PurchaseId
              ? "Marking..."
              : row.Status === "Delivered"
              ? "Delivered"
              : "Mark as Delivered"}
          </button>
        ) : (
          <span className="text-gray-500 text-xs">No Actions</span>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1E3A8A",
        color: "white",
        fontWeight: "600",
        fontSize: "13px",
        textTransform: "uppercase",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        color: "#111827",
        "&:hover": { backgroundColor: "#EFF6FF" },
      },
    },
    pagination: {
      style: { color: "#111827", fontWeight: 500 },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <FaTruck className="text-2xl" />
          <h1 className="text-lg font-semibold">Delivery</h1>
        </div>

        {/* Only show Export for Admin or Programmer */}
        {(user?.role === "Admin" || user?.role === "Programmer") && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
            <FaFileExcel className="text-lg" />
            Export
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4 p-5 border border-gray-200">
        <DataTable
          columns={columns}
          data={deliveryData}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          dense
          customStyles={customStyles}
          noDataComponent={
            <div className="text-gray-500 italic py-3">
              No delivery records found
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Delivery;
