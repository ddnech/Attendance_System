import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AttendanceHistory() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    status: ["full-day", "absent", "half-day"],
    sort: "DESC",
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    getAttendanceHistory();
  }, [filters, token]);

  const getAttendanceHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/staff/attendance/history?year=${
          filters.year
        }&month=${filters.month}&status=${filters.status.join(",")}&sort=${
          filters.sort
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setAttendanceData(response.data.data);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleStatusChange = (event) => {
    if (event.target.checked) {
      setFilters((prevState) => ({
        ...prevState,
        status: [...prevState.status, event.target.value],
      }));
    } else {
      setFilters((prevState) => ({
        ...prevState,
        status: prevState.status.filter(
          (status) => status !== event.target.value
        ),
      }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Attendance History</h1>
      <div className="mb-4 flex justify-between">
        <div className="flex items-center">
          <label className="mr-2">
            Year:
            <input
              type="number"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="ml-2 rounded border border-gray-300 px-2 py-1"
            />
          </label>
          <label className="mr-2">
            Month:
            <input
              type="number"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              min="1"
              max="12"
              className="ml-2 rounded border border-gray-300 px-2 py-1"
            />
          </label>
          <label>
            Sort:
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="ml-2 rounded border border-gray-300 px-2 py-1"
            >
              <option value="DESC">DESC</option>
              <option value="ASC">ASC</option>
            </select>
          </label>
        </div>
        <div className="flex items-center">
          <label className="mr-2">Status:</label>
          <div>
            <label className="mr-2">
              <input
                type="checkbox"
                value="full-day"
                checked={filters.status.includes("full-day")}
                onChange={handleStatusChange}
              />
              Full Day
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                value="absent"
                checked={filters.status.includes("absent")}
                onChange={handleStatusChange}
              />
              Absent
            </label>
            <label>
              <input
                type="checkbox"
                value="half-day"
                checked={filters.status.includes("half-day")}
                onChange={handleStatusChange}
              />
              Half Day
            </label>
          </div>
        </div>
      </div>
      {statistics && (
        <div className="mb-4 flex justify-between">
          <p>Absent days: {statistics.absent}</p>
          <p>Half-day: {statistics["half-day"]}</p>
          <p>Full day: {statistics["full-day"]}</p>
          <p>Business Days: {statistics.businessDays}</p>
        </div>
      )}
      {attendanceData.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Date</th>
              <th className="border border-gray-300 px-2 py-1">Clock In</th>
              <th className="border border-gray-300 px-2 py-1">Clock Out</th>
              <th className="border border-gray-300 px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {item.clockIn
                    ? new Date(item.clockIn).toLocaleTimeString()
                    : "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {item.clockOut
                    ? new Date(item.clockOut).toLocaleTimeString()
                    : "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No attendance history found.</p>
      )}
    </div>
  );
}
