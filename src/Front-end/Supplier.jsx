import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaTruck } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaFileExcel } from "react-icons/fa";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import * as XLSX from "xlsx";
import SupplierModal from "../Modal/Supplier/SupplierModal";
import EditSuppierModal from "../Modal/Supplier/EditSuppierModal";

function Supplier() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/supplier/fetch");
      const data = await res.json();
      if (data.status === "success") {
        setSuppliers(data.data);
        setFilteredSuppliers(data.data);
      } else {
        console.error("Error fetching suppliers:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.SupplierName.toLowerCase().includes(term) ||
        (supplier.SupplierAddress &&
          supplier.SupplierAddress.toLowerCase().includes(term)) ||
        supplier.SupplierContact.toLowerCase().includes(term)
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const handleExport = () => {
    if (filteredSuppliers.length === 0) {
      alert("No supplier data to export.");
      return;
    }

    const exportData = filteredSuppliers.map((s) => ({
      "Supplier Name": s.SupplierName,
      Address: s.SupplierAddress || "N/A",
      "Contact Number": s.SupplierContact,
      Status: s.Status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers_List.xlsx");
  };

  const columns = [
    {
      name: "Supplier Name",
      selector: (row) => row.SupplierName,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.SupplierAddress || "N/A",
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.SupplierContact,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.Status === "Active" ? (
            <FaCircleCheck className="text-green-500" />
          ) : (
            <FaCircleXmark className="text-red-500" />
          )}
          <span>{row.Status}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleEditClick(row)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition">
            Edit
          </button>
          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition">
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
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

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setEditIsOpen(true);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <FaTruck className="text-2xl" />
          <h1 className="text-lg font-semibold">Suppliers</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4 p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setAddIsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md border border-green-800 transition font-medium">
              <IoMdAdd className="text-lg" />
              Add Supplier
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
              <FaFileExcel className="text-lg" />
              Export
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSuppliers}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          dense
          customStyles={customStyles}
          noDataComponent={
            <div className="text-gray-500 italic py-3">No suppliers found</div>
          }
        />
      </div>

      {isAddOpen && (
        <SupplierModal
          isAddOpen={isAddOpen}
          onClose={() => setAddIsOpen(false)}
          onSupplierAdded={() => {
            fetchSuppliers();
            setAddIsOpen(false);
          }}
        />
      )}

      {isEditOpen && selectedSupplier && (
        <EditSuppierModal
          isEditOpen={isEditOpen}
          onClose={() => setEditIsOpen(false)}
          supplierData={selectedSupplier}
          onSupplierUpdated={() => {
            fetchSuppliers();
            setEditIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Supplier;
