import React, { useState, useEffect } from "react";
import OfficeMocal from "../Modal/Office/OfficeMocal";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { ImSearch } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaFileExcel } from "react-icons/fa";
import EditOfficeModal from "../Modal/Office/EditOfficeModal";

function Office() {
  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/office/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setOffices(data.data);
        }
      })
      .catch((err) => console.error("Error fetching offices:", err));
  }, []);

  const handleEditClick = (office) => {
    setSelectedOffice({
      OfficeId: office.OfficeId,
      OfficeName: office.OfficeName,
      OfficeLocation: office.OfficeLocation,
      Status: office.Status,
      DateCreated: office.DateCreated,
    });
    setEditIsOpen(true);
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 w-full h-full">
        <div className="first-card w-full h-full">
          <div className="flex justify-between items-center p-3 rounded shadow-lg bg-[#172554]">
            <div className="flex text-white gap-2">
              <HiMiniBuildingOffice className="text-[25px]" />
              <span className="text-[18px]">Office Management</span>
            </div>
          </div>
        </div>

        <div className="second-card w-full h-full">
          <div className="container w-full h-full">
            <div className="container-header text-black rounded-t-lg bg-sky-700">
              <div className="flex justify-between items-center p-2">
                <div className="flex items-center bg-white gap-2 px-2 py-1 text-black rounded-lg transition">
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
                    className="flex items-center gap-2 px-2 py-1 bg-green-800 hover:bg-green-500 text-white rounded-lg border border-green-600 transition cursor-pointer">
                    <IoMdAdd className="text-lg" />
                    <span className="text-sm font-medium">Add Office</span>
                  </button>
                </div>
                <OfficeMocal
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
                        Office Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Location
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Date Created
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {offices.map((office) => (
                      <tr key={office.OfficeId}>
                        <td className="px-4 py-2 border border-gray-300">
                          {office.OfficeName}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {office.OfficeLocation}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 gap-2">
                          <div className="flex items-center gap-2">
                            {office.Status?.trim().toLowerCase() ===
                            "active" ? (
                              <FaCircleCheck className="text-green-500" />
                            ) : (
                              <FaCircleXmark className="text-red-500" />
                            )}
                            <span>{office.Status}</span>
                          </div>
                        </td>

                        <td className="px-4 py-2 border border-gray-300">
                          {office.DateCreated}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 gap-2 flex">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClick(office)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                              <FaEdit />
                            </button>
                            <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer">
                              <MdDeleteForever />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

      {selectedOffice && (
        <EditOfficeModal
          isEditOpen={isEditOpen}
          onClose={() => setEditIsOpen(false)}
          office={selectedOffice}
          onUpdate={(updatedOffice) => {
            setOffices((prevOffices) =>
              prevOffices.map((office) =>
                office.OfficeId === updatedOffice.OfficeId
                  ? updatedOffice
                  : office
              )
            );
          }}
        />
      )}
    </div>
  );
}

export default Office;
