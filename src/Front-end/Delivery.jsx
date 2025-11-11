import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaTruck, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Delivery() {
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDelivery = () => {
    setLoading(true);
    fetch("http://localhost:8000/delivery/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setDeliveryData(data.data);
        else console.error("Error fetching delivery:", data.message);
      })
      .catch((err) => console.error("Error fetching delivery:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  const handleMarkDelivered = async (row) => {
    try {
      await fetch(`http://localhost:8000/delivery/mark-delivered/${row.Id}`, {
        method: "PUT",
      });

      setDeliveryData((prev) =>
        prev.map((item) =>
          item === row ? { ...item, Status: "Delivered" } : item
        )
      );
      alert(`${row.ProductName} marked as delivered!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
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
      cell: (row) => (
        <button
          onClick={() => handleMarkDelivered(row)}
          className="py-1 px-1 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium"
          disabled={row.Status === "Delivered"}>
          Mark as Delivered
        </button>
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
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4 p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
            <FaFileExcel className="text-lg" />
            Export
          </button>
        </div>

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
