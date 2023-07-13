import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";

export default function Home() {
  return (
    <div className="flex bg-white min-h-screen">
      <div className="w-16">
        <Sidebar />
      </div>
      <div className="flex-grow">
        <Header />
        <div className="bg-t h-full">
            hi
        </div>
        {/* Add any other components or content below the Header */}
      </div>
    </div>
  );
}
