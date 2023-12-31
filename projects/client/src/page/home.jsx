import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import ClockAttendance from "../component/staff/ClockAttendance";
import UserProfile from "../component/user/PersonalDetails";
import axios from "axios";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import withAuth from "../component/withAuth";

function Home() {
  const [roleId, setRoleId] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/role-id",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoleId(response.data.role_id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoleId();
  }, [token]);

  return (
    <div className="relative bg-white min-h-screen grid grid-cols-[auto,1fr]">
      <div className="h full">
        <Sidebar roleId={roleId} />
      </div>
      <div>
        <Header />
        {roleId === 1 ? (
          <UserProfile />
        ) : (
          <div className="flex justify-center space-x-4 p-4">
            <div className=" p-4">
              <UserProfile />
            </div>
            <div className="p-4">
              <ClockAttendance />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Home);
