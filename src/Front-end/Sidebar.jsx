import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { MdDashboard } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { AiFillProduct } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { FaTags, FaUserCog, FaSignOutAlt } from "react-icons/fa";

function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const userItems = [
    { label: "Profile", link: "profile" },
    { label: "Users", link: "user" },
  ];

  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-45 sm:-50 md:w-55 lg:w-60 bg-[#172554] flex flex-col items-center p-2">
        <div className="logo-container w-full flex rounded-xl bg-white">
          <div className="w-25 h-25 flex w-full">
            <img src={logo} alt="Logo" className="object-contain" />
            <ul className="w-full h-full content-center list-none leading-tight">
              <li>
                <span className="name font-bold text-[9px] sm:text-[9px] md:text-[14px] lg:text-[14px]">
                  {user
                    ? `${user.fname || ""} ${user.mname || ""} ${
                        user.lname || ""
                      }`
                    : "No User"}
                </span>
              </li>
              <li>
                <span className="role text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]">
                  {user ? user.role : "TALAVERA NUEVA ECIJA"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full h-full mt-7 relative">
          <div className="max-h-[64vh]">
            <ul className="text-white text-[15px] space-y-2">
              <li>
                <NavLink
                  to="dashboard"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <MdDashboard className="text-[20px]" />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="stockcard"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <FaClipboardList className="text-[20px]" />
                  Stock Card
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="ris"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <RiFileList3Fill className="text-[20px]" />
                  RIS
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="office"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <HiMiniBuildingOffice className="text-[20px]" />
                  Office Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="itemManagement"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <AiFillProduct className="text-[20px]" />
                  Item Management
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="supplier"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <FaTruck className="text-[20px]" />
                  Suppliers
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="category"
                  className={({ isActive }) =>
                    `flex gap-2 rounded-lg border-white p-1 items-center transition-all ${
                      isActive
                        ? "bg-sky-700 border-l-4 text-white"
                        : "hover:bg-sky-700 hover:border-l-4"
                    }`
                  }>
                  <FaTags className="text-[20px]" />
                  Category
                </NavLink>
              </li>
            </ul>

            <ul className="text-white absolute inset-x-0 bottom-0 space-y-2">
              <li
                className={`rounded-lg hover:border-l-4 hover:bg-sky-700 border-white p-1.5 w-full ${
                  userOpen ||
                  location.pathname.includes("/profile") ||
                  location.pathname.includes("/user")
                    ? "bg-sky-700 border-l-4 border-b-2"
                    : ""
                }`}>
                <button
                  className={`gap-3 w-full h-full transition-all flex border-white ${
                    userOpen ? "border-b-2" : ""
                  }`}
                  type="button flex"
                  onClick={() => setUserOpen(!userOpen)}>
                  <FaUserCog className="text-[25px]" />
                  {open && (
                    <>
                      <span className="flex justify-between items-center w-full whitespace-nowrap">
                        User Management
                      </span>
                      <span>{userOpen ? "▲" : "▼"}</span>
                    </>
                  )}
                </button>

                {userOpen && (
                  <div className="p-2 bg-bg-sky-700 text-black">
                    <ul className="space-y-1">
                      {userItems.map((item, index) => (
                        <NavLink key={index} to={item.link} end>
                          {({ isActive }) => (
                            <li
                              className={`cursor-pointer text-white transition-colors duration-200 ms-0 ps-4 border-s-2 border-white ${
                                isActive
                                  ? "bg-blue-800 font-semibold"
                                  : "hover:bg-blue-800"
                              }`}>
                              <span className="absolute -start-[-15px] mt-2 w-2 h-2 bg-white rounded-full"></span>
                              {item.label}
                            </li>
                          )}
                        </NavLink>
                      ))}
                    </ul>
                  </div>
                )}
              </li>

              <li
                onClick={handleLogout}
                className="flex gap-2 rounded-lg hover:border-l-4 hover:bg-sky-700 border-white p-1 cursor-pointer">
                <FaSignOutAlt className="text-[20px]" />
                Logout
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
