import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineStock } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";
import ViewRISItemsModal from "../Modal/RIS/ViewRISItemsModal";

function CurrentStock() {
  const [risList, setRisList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRIS, setSelectedRIS] = useState(null);

  const fetchRIS = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ris/list");
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setRisList(data.data);
      } else {
        setRisList([]);
      }
    } catch (error) {
      console.error("Error fetching RIS list:", error);
      setRisList([]);
    }
  };

  useEffect(() => {
    fetchRIS();
  }, []);

  const filteredRIS = risList.filter((r) =>
    r.Order_by?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user"));

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
      name: "Date Received",
      selector: (row) => formatDate(row.DateReceived),
      sortable: true,
      left: true,
    },
    {
      name: "Actions",
      left: true,
      width: "220px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewItem(row)}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white rounded-md text-xs font-medium transition">
            View Item
          </button>

          <button
            onClick={() => handlePrint(row)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-800 cursor-pointer text-white rounded-md text-xs font-medium transition">
            Print
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

  const handleViewItem = (row) => {
    setSelectedRIS(row.RIS_id);
    setIsViewOpen(true);
  };

  const handlePrint = (row) => {
    try {
      const content = `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Requisition and Issue Slip</h2>
          <p><strong>Order By:</strong> ${row.Order_by ?? ""}</p>
          <p><strong>Date Requested:</strong> ${formatDate(
            row.DateRequested
          )}</p>
          <p><strong>RIS ID:</strong> ${row.RIS_id ?? ""}</p>
        </div>
      `;
      const w = window.open("", "_blank");
      if (!w) return alert("Unable to open print window. Please allow popups.");
      w.document.write(
        `<!doctype html><html><head><title>Print RIS</title></head><body>${content}</body></html>`
      );
      w.document.close();
      w.focus();
      w.print();
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <AiOutlineStock className="text-2xl" />
          <h1 className="text-lg font-semibold">RIS List</h1>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-md mt-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4 px-4 mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-2 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#172554]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative w-full rounded-b-lg">
          <DataTable
            columns={columns}
            data={filteredRIS}
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

        <ViewRISItemsModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          risId={selectedRIS}
        />
      </div>
    </div>
  );
}

export default CurrentStock;

// Modal placement at bottom to avoid JSX nesting issues
