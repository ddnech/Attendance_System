import React from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineClockCircle,
  AiOutlineHistory,
  AiOutlineDollarCircle,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";

const routes = [
  { to: "/users", icon: AiOutlineUser, label: "Employee" },
  { to: "/history", icon: AiOutlineHistory, label: "History" },
  { to: "/clock", icon: AiOutlineClockCircle, label: "Clock" },
  { to: "/payroll", icon: AiOutlineDollarCircle, label: "Payroll" },
  { to: "/settings", icon: AiOutlineSetting, label: "Settings" },
];

const routesEmployeee = [
  { to: "/users", icon: AiOutlineUser, label: "Employee" },
  { to: "/history", icon: AiOutlineHistory, label: "History" },
  { to: "/clock", icon: AiOutlineClockCircle, label: "Clock" },
  { to: "/payroll", icon: AiOutlineDollarCircle, label: "Payroll" },
  { to: "/settings", icon: AiOutlineSetting, label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <div className="w-32 h-full p-4 bg-gray-200 text-black flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <Link to="/" className="p-3 rounded-lg inline-block">
          <div className="border-2 border-gray-200 w-8 h-8 flex items-center justify-center rounded-full">
            <AiOutlineUser size={20} />
          </div>
        </Link>
        <span className="border-b-1 border-gray-200 w-full p-2"></span>
        {routes.map(({ to, icon: Icon, label }, idx) => (
          <Link key={idx} to={to} className="flex w-28 h-14 bg-white items-center hover:bg-white cursor-pointer my-4 p-3 rounded-lg">
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