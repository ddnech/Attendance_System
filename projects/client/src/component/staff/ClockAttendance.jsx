import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from 'axios';
import { useSelector } from "react-redux";

export default function LiveAttendance() {
    const fullName = "John Doe"; // Replace with user's full name

    const [currentTime, setCurrentTime] = useState(dayjs());
    const [greeting, setGreeting] = useState("");

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

    const token = useSelector((state) => state.auth.token)

    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isClockedOut, setIsClockedOut] = useState(false);
    const [isWeekday, setIsWeekday] = useState(false);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/staff/attendance", { headers: { Authorization: `Bearer ${token}` } });
                setAttendanceRecords(response.data.data);
                setIsClockedIn(response.data.data.clock_in !== null);
                setIsClockedOut(response.data.data.clock_out !== null);
            } catch (error) {
                console.error(error.message);
            }
        };
        const currentDay = currentTime.day();
        const isWeekday = currentDay >= 1 && currentDay <= 5;
        setIsWeekday(isWeekday);
        fetchAttendanceRecords();
    }, [currentTime, token]);

    const handleClockIn = () => {
        axios.post('http://localhost:8000/api/staff/clock-in', null, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setIsClockedIn(true);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleClockOut = () => {
        axios.post('http://localhost:8000/api/staff/clock-out', null, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setIsClockedOut(true);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
            <div className="max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">{greeting}!</h1>
                    <p className="text-gray-500 text-lg mt-2">
                        Hi, {fullName}!
                        <br />
                        It's {currentTime.format("dddd, DD MMMM YYYY")}
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-black mb-4">
                            {currentTime.format("hh:mmA")}
                        </div>
                        {isClockedIn ? (
                            <p className="text-gray-500 mb-4">You have already clocked in.</p>
                        ) : (
                            <button
                                className={`py-2 px-4 rounded ${
                                    (!isWeekday || isClockedOut) ? "text-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                                onClick={handleClockIn}
                                disabled={!isWeekday || isClockedOut}
                            >
                                Clock In
                            </button>
                        )}
                        {isClockedOut ? (
                            <p className="text-gray-500 mt-2">You have already clocked out.</p>
                        ) : (
                            <button
                                className={`py-2 px-4 rounded ${
                                    (!isClockedIn || !isWeekday) ? "text-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                                onClick={handleClockOut}
                                disabled={!isClockedIn || !isWeekday}
                            >
                                Clock Out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
