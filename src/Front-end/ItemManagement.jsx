import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { RiFileList3Fill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaFileExcel } from "react-icons/fa";
import ItemManagementModal from "../Modal/Item Management/ItemManagementModal";
import EditItemManagement from "../Modal/Item Management/EditItemManagement";
import DeleteItemModal from "../Modal/Item Management/DeleteItem";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ItemManagement() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [isDeleteOpen, setDeleteIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/item/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setItems(data.data);
        else console.error("Error fetching items:", data.message);
      })
      .catch((err) => console.error("Error fetching items:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleExport = () => {
    if (items.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = items.map((item) => ({
      "Product Name": item.ProductName,
      Description: item.Description,
      Category: item.CategoryName,
      "Unit Price": `₱${item.UnitPrice.toLocaleString()}`,
      "Stock Quantity": item.StockQty,
      "Date Created": new Date(item.DateCreated).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Item_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.ProductName,
      sortable: true,
    },
    { name: "Description", selector: (row) => row.Description, sortable: true },
    { name: "Category", selector: (row) => row.CategoryName, sortable: true },
    {
      name: "Unit Price",
      selector: (row) => row.UnitPrice,
      sortable: true,
      cell: (row) => (
        <div className="w-full text-right pr-2">
          {row.UnitPrice ? Number(row.UnitPrice).toLocaleString() : "0"}
        </div>
      ),
    },
    {
      name: "Stock Quantity",
      selector: (row) => row.StockQty,
      sortable: true,
      cell: (row) => (
        <div className="w-full text-right pr-2">
          {row.StockQty !== null && row.StockQty !== undefined
            ? Number(row.StockQty).toLocaleString()
            : "0"}
        </div>
      ),
    },
    {
      name: "Date Created",
      selector: (row) => new Date(row.DateCreated).toDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedItem(row);
              setEditIsOpen(true);
            }}
            className="px-3 py-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-md text-xs font-medium transition">
            Edit
          </button>
          <button
            onClick={() => {
              setDeleteItem(row);
              setDeleteIsOpen(true);
            }}
            className="px-3 py-1 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-md text-xs font-medium transition">
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

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center p-4 bg-[#172554] text-white rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <RiFileList3Fill className="text-2xl" />
          <h1 className="text-lg font-semibold">Item Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4 p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setAddIsOpen(true)}
            className="flex items-center cursor-pointer gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md border border-green-800 transition font-medium">
            <IoMdAdd className="text-lg" />
            Add Item
          </button>

          <button
            onClick={handleExport}
            className="flex items-center cursor-pointer gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
            <FaFileExcel className="text-lg" />
            Export
          </button>
        </div>

        <DataTable
          columns={columns}
          data={items}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          dense
          customStyles={customStyles}
          noDataComponent={
            <div className="text-gray-500 italic py-3">No items found</div>
          }
        />
      </div>

      <ItemManagementModal
        isAddOpen={isAddOpen}
        onClose={() => setAddIsOpen(false)}
        onItemAdded={() => {
          setAddIsOpen(false);
          fetchItems();
        }}
      />

      <EditItemManagement
        isEditOpen={isEditOpen}
        item={selectedItem}
        onClose={() => setEditIsOpen(false)}
        onItemUpdated={() => {
          setEditIsOpen(false);
          fetchItems();
        }}
      />

      <DeleteItemModal
        isOpen={isDeleteOpen}
        item={deleteItem}
        onClose={() => setDeleteIsOpen(false)}
        onConfirm={() => {
          fetch(`http://127.0.0.1:8000/item/status/${deleteItem.ItemId}`, {
            method: "PUT",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "success") {
                alert("Item marked as Inactive!");
                fetchItems();
              } else alert("Failed to update item status.");
            })
            .catch((err) => console.error("Update error:", err))
            .finally(() => setDeleteIsOpen(false));
        }}
      />
    </div>
  );
}

export default ItemManagement;
