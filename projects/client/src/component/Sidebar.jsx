import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineUserAdd,
  AiOutlineHistory,
  AiOutlineDollarCircle,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { remove } from "../store/reducer/authSlice";

const adminRoutes = [
  { to: "/home", icon: AiOutlineUser, label: "Personal Details" },
  { to: "/register", icon: AiOutlineUserAdd, label: "Register New Staff" },
  // { to: "/staff-list", icon: AiOutlineUser, label: "Staff List" },
];

const staffRoutes = [
  { to: "/home", icon: AiOutlineUser, label: "Personal Details" },
  {
    to: "/attendance-history",
    icon: AiOutlineHistory,
    label: "Attendance History",
  },
  {
    to: "/payroll-history",
    icon: AiOutlineDollarCircle,
    label: "Payroll History",
  },
];

export default function Sidebar({ roleId }) {
  const routes = roleId === 1 ? adminRoutes : staffRoutes;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(remove());
    navigate("/");
  };

  return (
    <div className="w-40 h-full p-4 bg-gray-200 text-black flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <span className="border-b-1 border-gray-200 w-full p-2"></span>
        {routes.map(({ to, icon: Icon, label }, idx) => (
          <Link
            key={idx}
            to={to}
            className="flex w-32 h-14 bg-white items-center cursor-pointer my-4 p-3 rounded-lg transition duration-300 hover:bg-gray-100 hover:border-black hover:border-2"
          >
            <div className="border-2 border-gray-200 w-8 h-8 flex items-center justify-center rounded-full">
              <Icon size={20} />
            </div>
            <div>{label}</div>
          </Link>
        ))}
        <div
          onClick={handleLogout}
          className="flex w-32 h-14 bg-white items-center cursor-pointer my-4 p-3 rounded-lg transition duration-300 hover:bg-gray-100 hover:border-black hover:border-2"
        >
          <div className="border-2 border-gray-200 w-8 h-8 flex items-center justify-center rounded-full">
            <AiOutlineLogout size={20} />
          </div>
          <div>Logout</div>
        </div>
      </div>
    </div>
  );
}
