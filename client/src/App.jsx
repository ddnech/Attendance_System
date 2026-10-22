import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider, RequireAuth, useAuth } from "./auth/AuthContext";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import TimeClock from "./pages/staff/TimeClock";
import Attendance from "./pages/staff/Attendance";
import Payslips from "./pages/staff/Payslips";
import TeamToday from "./pages/admin/TeamToday";
import StaffList from "./pages/admin/StaffList";
import StaffDetail from "./pages/admin/StaffDetail";
import AddStaff from "./pages/admin/AddStaff";

// /home shows the time clock to staff and the team overview to admins.
function Home() {
  const { user } = useAuth();
  return user.role === "admin" ? <TeamToday /> : <TimeClock />;
}

const staff = (page) => <RequireAuth role="staff">{page}</RequireAuth>;
const admin = (page) => <RequireAuth role="admin">{page}</RequireAuth>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/set-pass/:token" element={<SetPassword />} />

          <Route
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/clock" element={<Navigate to="/home" replace />} />
            <Route path="/attendance-history" element={staff(<Attendance />)} />
            <Route path="/payroll-history" element={staff(<Payslips />)} />

            <Route path="/staff" element={admin(<StaffList />)} />
            <Route path="/staff/:id" element={admin(<StaffDetail />)} />
            <Route path="/register" element={admin(<AddStaff />)} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
