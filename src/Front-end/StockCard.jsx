import React, { useState } from "react";
import StockCardModal from "../Modal/Stock Card/StockCardModal";
import { FaClipboardList } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";
import EditStockCard from "../Modal/Stock Card/EditStockCard";

function StockCard() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 w-full h-full">
        <div className="first-card w-full h-full">
          <div className="flex justify-between items-center p-3 rounded shadow-lg bg-[#172554]">
            <div className="flex text-white gap-2">
              <FaClipboardList className="text-[25px]" />
              <span className="text-[18px]">Item Stock Card Management</span>
            </div>
          </div>
        </div>

        <div className="second-card w-full h-full">
          <div className="container w-full h-full">
            <div className="container-header text-black rounded-t-lg bg-sky-700">
              <div className="flex justify-between items-center p-2">
                <div className="flex items-center focus:border-white focus:outline-hidden bg-white gap-2 px-2 py-1 text-black rounded-lg transition">
                  <ImSearch className="text-lg" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="text-sm font-medium border-0 outline-none"
                  />
                </div>
                <div className="inset-x-0 bottom-0 space-y-2">
                  <button
                    onClick={() => setAddIsOpen(true)}
                    className="flex items-center gap-2 px-2 py-1 bg-green-800 text-white rounded-lg border border-green-600 transition cursor-pointer">
                    <IoMdAdd className="text-lg" />
                    <span className="text-sm font-medium">Add Item</span>
                  </button>
                </div>
                <StockCardModal
                  isAddOpen={isAddOpen}
                  onClose={() => setAddIsOpen(false)}
                />
              </div>
            </div>

            <div className="container-body overflow-x-auto text-black border rounded-b-lg border-sky-700 w-full">
              <div className="table w-full h-full">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                  <thead className="bg-gray-100 text-[#172554] uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Item Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Category
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Quantity
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Unit
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Supplier
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-300">MSI</td>
                      <td className="px-4 py-2 border border-gray-300">
                        Monitor
                      </td>
                      <td className="px-4 py-2 border border-gray-300">100</td>
                      <td className="px-4 py-2 border border-gray-300">100</td>
                      <td className="px-4 py-2 border border-gray-300">
                        Eugene
                      </td>
                      <td className="px-4 py-2 border border-gray-300 gap-2">
                        <div className="flex items-center gap-2">
                          <FaCircleCheck className="text-green-500" />
                          <span>Active</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 border border-gray-300 gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditIsOpen(true)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                            <FaEdit />
                          </button>
                          <EditStockCard
                            isEditOpen={isEditOpen}
                            onClose={() => setEditIsOpen(false)}
                          />
                          <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer">
                            <MdDeleteForever />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="last-card w-full h-full">
          <div className="container-footer flex justify-end items-center p-3 bg-gray-50">
            <button className="flex cursor-pointer items-center gap-2 px-2 py-2 bg-green-800 hover:bg-green-500 text-white rounded-lg border border-green-600 transition">
              <FaFileExcel className="text-lg" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
