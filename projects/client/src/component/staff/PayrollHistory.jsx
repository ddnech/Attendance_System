import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function PayrollHistory() {
  const [payrollData, setPayrollData] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    sort: "date,DESC",
  });

  useEffect(() => {
    getPayrollHistory();
  }, [filters, token]);

  const getPayrollHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/staff/payroll/history?year=${filters.year}&month=${filters.month}&sort=${filters.sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setPayrollData(response.data);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Payroll History</h1>
      <div className="mb-4">
        <label className="mr-2">
          Year:
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="ml-2 mr-4 rounded border-2"
          />
        </label>
        <label className="mr-2">
          Month:
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="ml-2 mr-4 rounded border-2"
          >
            <option value="">All Months</option>
            {/* List all 12 months */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option value={month} key={month}>{month}</option>
            ))}
          </select>
        </label>
        <label>
          Sort:
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="ml-2 rounded border-2"
          >
            <option value="date,DESC">Newest</option>
            <option value="date,ASC">Oldest</option>
          </select>
        </label>
      </div>
      <table className="w-full table-auto border-collapse border-2 border-gray-300">
        <thead>
          <tr>
            <th className="border-2 border-gray-300 p-2">Date</th>
            <th className="border-2 border-gray-300 p-2">Amount</th>
            <th className="border-2 border-gray-300 p-2">Deductions</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map((item, index) => (
            <tr key={index}>
              <td className="border-2 border-gray-300 p-2">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="border-2 border-gray-300 p-2">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}
              </td>
              <td className="border-2 border-gray-300 p-2">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.deductions)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
