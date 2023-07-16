import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import StaffRegistrationForm from "../component/admin/StaffRegiser";
import AttendanceHistory from "../component/staff/AttendanceHistory";
import PayrollHistory from "../component/staff/PayrollHistory";
import ClockAttendance from "../component/staff/ClockAttendance";


export default function Home() {
  return (
    <div className="relative bg-white min-h-screen grid grid-cols-[auto,1fr]">
      <div className="h full">
        <Sidebar />
      </div>
      <div>
        <Header />
        {/* <StaffRegistrationForm/> */}
        <AttendanceHistory/>
        <PayrollHistory/>
        <ClockAttendance/>
      </div>
    </div>
  );
}


