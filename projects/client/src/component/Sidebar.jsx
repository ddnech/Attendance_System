import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineLogout, AiOutlineUserAdd, AiOutlineClockCircle, AiOutlineHistory, AiOutlineDollarCircle } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";

const adminRoutes = [
  { to: "/", icon: AiOutlineUser, label: "Personal Details" },
  { to: "/register", icon: AiOutlineUserAdd, label: "Register New Staff" },
  { to: "/staff-list", icon: AiOutlineUser, label: "Staff List" },
  { to: "/logout", icon: AiOutlineLogout, label: "Logout" },
];

const staffRoutes = [
  { to: "/", icon: AiOutlineUser, label: "Personal Details" },
  { to: "/clock", icon: AiOutlineClockCircle, label: "Clock In/Out" },
  { to: "/attendance-history", icon: AiOutlineHistory, label: "Attendance History" },
  { to: "/payroll-history", icon: AiOutlineDollarCircle, label: "Payroll History" },
  { to: "/logout", icon: AiOutlineLogout, label: "Logout" },
];

export default function Sidebar() {
  const [roleId, setRoleId] = useState(null);
  const token = useSelector((state) => state.auth.token);


  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/role-id", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoleId(response.data.role_id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoleId();
  }, [token]);

  const routes = roleId === 1 ? adminRoutes : staffRoutes;

  return (
    <div className="w-40 h-full p-4 bg-gray-200 text-black flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <Link to="/" className="p-3 rounded-lg inline-block">
          <div className="border-2 border-gray-200 w-8 h-8 flex items-center justify-center rounded-full">
            <AiOutlineUser size={20} />
          </div>
        </Link>
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
      </div>
    </div>
  );
}
