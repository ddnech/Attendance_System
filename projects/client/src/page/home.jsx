import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import StaffRegistrationForm from "../component/admin/StaffRegiser";

export default function Home() {
  return (
    <div className="relative bg-white min-h-screen grid grid-cols-[auto,1fr]">
      <div className="h full">
        <Sidebar />
      </div>
      <div>
        <Header />
        <StaffRegistrationForm/>
      </div>
    </div>
  );
}


