import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

export default function LiveAttendance() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [greeting, setGreeting] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentHour = currentTime.hour();
    let text = "";

    if (currentHour >= 5 && currentHour < 12) {
      text = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      text = "Good Afternoon";
    } else {
      text = "Good Night";
    }

    setGreeting(text);
  }, [currentTime]);

  const token = useSelector((state) => state.auth.token);

  const fetchUserProfileAndAttendance = async () => {
    try {
      const responseProfile = await axios.get(
        "http://localhost:8000/api/auth/user-profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile(responseProfile.data.data);
      const responseAttendance = await axios.get(
        "http://localhost:8000/api/staff/check-attendance",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(responseAttendance.data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserProfileAndAttendance();
  }, [currentTime, token]);

  const handleClockIn = () => {
    axios
      .post("http://localhost:8000/api/staff/clock-in", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        fetchUserProfileAndAttendance();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClockOut = () => {
    axios
      .patch("http://localhost:8000/api/staff/clock-out", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        fetchUserProfileAndAttendance();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{greeting}!</h1>
          <p className="text-gray-500 text-lg mt-2">
            Hi, {userProfile.full_name}!
            <br />
            It's {currentTime.format("dddd, DD MMMM YYYY")}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-black mb-4">
              {currentTime.format("hh:mmA")}
            </div>
            {attendance.clock_in ? (
              <p className="text-gray-500 mb-4">
                You clocked in at {dayjs(attendance.clock_in).format("hh:mmA")}.
              </p>
            ) : (
              <button
                className={`py-2 px-4 rounded ${
                  attendance.clock_out ||
                  currentTime.day() === 0 ||
                  currentTime.day() === 6
                    ? "text-gray-500 cursor-not-allowed"
                    : "bg-blue-300 hover:bg-blue-200 text-white"
                }`}
                onClick={handleClockIn}
                disabled={
                  !!attendance.clock_out ||
                  currentTime.day() === 0 ||
                  currentTime.day() === 6
                } // this line
              >
                Clock In
              </button>
            )}
            {attendance.clock_out ? (
              <p className="text-gray-500 mt-2">
                You clocked out at{" "}
                {dayjs(attendance.clock_out).format("hh:mmA")}.
              </p>
            ) : (
              <button
                className={`py-2 px-4 rounded ${
                  !attendance.clock_in ||
                  currentTime.day() === 0 ||
                  currentTime.day() === 6
                    ? "text-gray-500 cursor-not-allowed"
                    : "bg-blue-300 hover:bg-blue-200 text-white"
                }`}
                onClick={handleClockOut}
                disabled={
                  !attendance.clock_in ||
                  currentTime.day() === 0 ||
                  currentTime.day() === 6
                } //thisline
              >
                Clock Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
