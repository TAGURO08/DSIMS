import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { RiFileList3Fill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaFileExcel } from "react-icons/fa";
import RISModal from "../Modal/RIS/RISModal";
import ApproveRISModal from "../Modal/RIS/ApproveRISModal";
import ViewItemModal from "../Modal/RIS/ViewItemModal";

function RIS() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [risData, setRisData] = useState([]);
  const [isApproveOpen, setApproveOpen] = useState(false);
  const [selectedApproveRow, setSelectedApproveRow] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRIS, setSelectedRIS] = useState(null);

  const fetchRIS = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ris/list");
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setRisData(data.data);
      } else {
        setRisData([]);
      }
    } catch (err) {
      console.error("Error fetching RIS:", err);
      setRisData([]);
    }
  };

  useEffect(() => {
    fetchRIS();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateString;
    }
  };

  const handleViewItem = (row) => {
    setSelectedRIS(row.RIS_id);
    setIsViewOpen(true);
  };

  const columns = [
    {
      name: "Order By",
      selector: (row) => row.Order_by,
      sortable: true,
      left: true,
    },
    {
      name: "Date Requested",
      selector: (row) => formatDate(row.DateRequested),
      sortable: true,
      left: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      sortable: true,
      left: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.Status === "Approved"
              ? "bg-green-100 text-green-700"
              : row.Status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : row.Status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}>
          {row.Status || "—"}
        </span>
      ),
    },
    {
      name: "Actions",
      left: true,
      width: "200px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewItem(row)}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white rounded-md text-xs font-medium transition">
            View Item
          </button>

          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition">
            Complete
          </button>
        </div>
      ),
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
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <RiFileList3Fill className="text-2xl" />
          <h1 className="text-lg font-semibold">Requisition and Issue Slip</h1>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-md mt-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4 px-4 mt-4">
          <button
            onClick={() => setAddIsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md border border-green-800 transition font-medium">
            <IoMdAdd className="text-lg" />
            Add RIS
          </button>

          <button className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
            <FaFileExcel className="text-lg" />
            Export
          </button>
        </div>

        <div className="relative w-full rounded-b-lg">
          <DataTable
            columns={columns}
            data={risData}
            pagination
            highlightOnHover
            striped
            responsive
            dense
            customStyles={customStyles}
            noDataComponent={
              <div className="text-gray-500 italic py-3">No RIS data found</div>
            }
          />
        </div>
      </div>

      <RISModal
        isAddOpen={isAddOpen}
        onClose={() => setAddIsOpen(false)}
        onSuccess={fetchRIS}
      />
      <ApproveRISModal
        isOpen={isApproveOpen}
        onClose={() => setApproveOpen(false)}
        risRow={selectedApproveRow}
        onApprove={fetchRIS}
      />

      <ViewItemModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        risId={selectedRIS}
      />
    </div>
  );
}

export default RIS;
