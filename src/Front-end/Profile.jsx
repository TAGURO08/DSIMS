import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import { BsCalendar2DateFill } from "react-icons/bs";
import { HiOfficeBuilding } from "react-icons/hi";
import { MdBadge } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { RiExchangeBoxFill } from "react-icons/ri";
import EditProfile from "../Modal/Profile/EditProfile";
import ChangePassword from "../Modal/Profile/ChangePassword";

function Profile() {
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
      }
    }
  }, []);

  return (
    <div className="contetnt w-full h-full">
      <div className="flex justify-between items-center p-3 rounded shadow-lg bg-[#172554]">
        <div className="flex text-white gap-2">
          <FaUser className="text-[25px]" />
          <span className="text-[18px]">Profile</span>
        </div>
      </div>

      <div className="container mt-4 w-full flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg w-[500px]">
          <div className="flex flex-col">
            <div className="flex flex-col items-center bg-blue-100 p-6 rounded-2xl">
              <div className="w-30 h-30 rounded-full bg-gray-300 mb-6"></div>
              <div className="flex">
                <h2 className="fname text-xl font-bold mb-2 text-[25px]">
                  {user?.fname || ""}
                </h2>
                <h2 className="mname text-xl font-bold mb-2 ms-2 text-[25px]">
                  {user?.mname || ""}
                </h2>
                <h2 className="lname text-xl font-bold mb-2 ms-2 text-[25px]">
                  {user?.lname || ""}
                </h2>
              </div>
            </div>

            <div className="w-full h-full p-6">
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span className="text-[23px]">
                  <MdEmail />
                </span>
                <span className="font-bold">Email address:</span>
                {user?.email || ""}
              </p>

              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span className="text-[20px]">
                  <BsCalendar2DateFill />
                </span>
                <span className="font-bold">Date of birth: </span>
                {user?.birthdate || ""}
              </p>

              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span className="text-[23px]">
                  <HiOfficeBuilding />
                </span>
                <span className="font-bold">Office: </span>
                {user?.office || ""}
              </p>

              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span className="text-[23px]">
                  <MdBadge />
                </span>
                <span className="font-bold">Role: </span>
                {user?.role || ""}
              </p>
              <p className="text-gray-600 mb-6 flex items-center gap-2">
                <span className="text-[20px]">
                  <BsCalendar2DateFill />
                </span>
                <span className="font-bold">Date created: </span>
                {user?.dateCreated || ""}
              </p>

              <div className=" flex justify-between">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3 flex items-center gap-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
                  <span>
                    <RiExchangeBoxFill className="text-[20px]" />
                  </span>
                  Change Password
                </button>
                <ChangePassword
                  isOpen={isPasswordModalOpen}
                  onClose={() => setIsPasswordModalOpen(false)}
                  userId={user?.id}
                />
                <button
                  onClick={() => {
                    setEditIsOpen(true);
                  }}
                  className="px-3 flex items-center gap-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <span>
                    <MdEditSquare className="text-[20px]" />
                  </span>
                  Edit Profile
                </button>
                <EditProfile
                  isEditOpen={isEditOpen}
                  onClose={() => setEditIsOpen(false)}
                  user={user}
                  onUpdate={handleUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
