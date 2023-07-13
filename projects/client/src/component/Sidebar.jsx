import React from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineClockCircle,
  AiOutlineHistory,
  AiOutlineDollarCircle,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";

export default function AdminSidebar() {
  return (
    <div className="fixed w-20 h-screen p-4 bg-steel_b text-white flex flex-col justify-between px-20">
      <div className="flex flex-col items-center">
        <Link to="/">
          <div className="p-3 rounded-lg inline-block">
            <AiOutlineUser size={20} />
          </div>
        </Link>
        <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
        <Link to="/users">
          <div className="flex items-center hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg">
            <AiOutlineUser size={20} />
            <div>Employee</div>
          </div>
        </Link>
        <Link to="/history">
          <div className="flex items-center hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg">
            <AiOutlineHistory size={20} />
            <div>History</div>
          </div>
        </Link>
        <Link to="/clock">
          <div className="flex items-center hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg">
            <AiOutlineClockCircle size={20} />
            <div>Clock</div>
          </div>
        </Link>
        <Link to="/payroll">
          <div className="flex items-center hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg">
            <AiOutlineDollarCircle size={20} />
            <div>Payroll</div>
          </div>
        </Link>
        <Link to="/settings">
          <div className="flex items-center hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg">
            <AiOutlineSetting size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}
