import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import ClockAttendance from "../component/staff/ClockAttendance";
import UserProfile from "../component/user/PersonalDetails";

export default function Staff() {
  return (
    <div className="relative bg-white min-h-screen grid grid-cols-[auto,1fr]">
      <div className="h-full">
        <Sidebar />
      </div>
      <div>
        <Header />
        <div className="flex justify-center align-middle space-x-4 p-4">
          <div className=" bg-gray-100 p-4">
            <UserProfile />
          </div>
          <div className="bg-gray-100 p-4">
            <ClockAttendance />
          </div>
        </div>
      </div>
    </div>
  );
}
