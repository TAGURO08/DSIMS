import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaTags } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { FaFileExcel } from "react-icons/fa6";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import * as XLSX from "xlsx";
import CategoryModal from "../Modal/Category/CategoryModal";
import EditCategoryModal from "../Modal/Category/EditCategoryModal";

function Category() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/category/list");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data);
      } else {
        console.error(data.detail || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const search = searchTerm.toLowerCase();
    return (
      cat.categoryName.toLowerCase().includes(search) ||
      cat.description.toLowerCase().includes(search) ||
      cat.status.toLowerCase().includes(search)
    );
  });

  const exportToExcel = () => {
    if (filteredCategories.length === 0) {
      alert("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCategories.map((cat) => ({
        "Category Name": cat.categoryName,
        Description: cat.description,
        Status: cat.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "Category_List.xlsx");
  };

  const columns = [
    {
      name: "Category",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "Active" ? (
            <>
              <FaCircleCheck className="text-green-600" />
              <span className="text-green-700 font-medium">{row.status}</span>
            </>
          ) : (
            <>
              <FaCircleXmark className="text-red-600" />
              <span className="text-red-700 font-medium">{row.status}</span>
            </>
          )}
        </div>
      ),
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setEditIsOpen(true);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition">
            Edit
          </button>
          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition">
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      center: true,
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
          <FaTags className="text-2xl" />
          <h1 className="text-lg font-semibold">Category Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-4 p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md border border-gray-300 w-1/3">
            <input
              type="text"
              placeholder="Search Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setAddIsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md border border-green-800 transition font-medium">
              <IoMdAdd className="text-lg" />
              Add Category
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-3 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md border border-green-900 transition font-medium">
              <FaFileExcel className="text-lg" />
              Export
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredCategories}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          dense
          customStyles={customStyles}
          noDataComponent={
            <div className="text-gray-500 italic py-3">No categories found</div>
          }
        />
      </div>

      {isAddOpen && (
        <CategoryModal
          isAddOpen={isAddOpen}
          onClose={() => setAddIsOpen(false)}
          onAddSuccess={fetchCategories}
        />
      )}

      {isEditOpen && selectedCategory && (
        <EditCategoryModal
          isEditOpen={isEditOpen}
          onClose={() => setEditIsOpen(false)}
          categoryData={selectedCategory}
          onUpdate={fetchCategories}
        />
      )}
    </div>
  );
}

export default Category;
