import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LogIn from './page/login';
import Home from './page/home';
import SetAccount from './component/user/SetAccount'
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { keep } from './store/reducer/authSlice';
import Profile from './page/UserProfileAndAttendance';
import AttendancePage from './page/attendancePage';
import PayrollPage from './page/payrollPage';
import StaffRegisterPage from './page/registerStaffPage';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(keep(localStorage.getItem("token")));
      fetchUserRole();
    }
  }, [dispatch, token]);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/role-id",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserRole(response.data.role_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/set-pass/:token" element={<SetAccount />} />
        <Route path="/clock" element={userRole === 2 ? <Profile /> : <Navigate to="/home" />} />
        <Route path="/payroll-history" element={userRole === 2 ? <PayrollPage /> : <Navigate to="/home" />} />
        <Route path="/attendance-history" element={userRole === 2 ? <AttendancePage /> : <Navigate to="/home" />} />
        <Route path="/register" element={userRole === 1 ? <StaffRegisterPage /> : <Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;