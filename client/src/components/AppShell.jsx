import { NavLink, Outlet, useNavigate } from "react-router";
import { CalendarDays, Clock3, LogOut, ReceiptText, UserPlus, UserRound, Users } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const NAV = {
  admin: [
    { to: "/home", label: "Today", icon: Clock3 },
    { to: "/staff", label: "Staff", icon: Users },
    { to: "/register", label: "Add staff", icon: UserPlus },
    { to: "/profile", label: "My profile", icon: UserRound },
  ],
  staff: [
    { to: "/home", label: "Clock in", icon: Clock3 },
    { to: "/attendance-history", label: "My attendance", icon: CalendarDays },
    { to: "/payroll-history", label: "Payslips", icon: ReceiptText },
    { to: "/profile", label: "My profile", icon: UserRound },
  ],
};

export function Brand({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <img src="/favicon.svg" alt="" className="h-7 w-7" />
      <span className="text-lg font-bold tracking-tight">Attendance</span>
    </span>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user.role] || NAV.staff;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-[0.95rem] transition-colors ${
      isActive ? "bg-white/12 font-semibold text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
    }`;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink px-4 py-6 text-white lg:flex">
        <Brand className="px-3" />
        <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 px-3 pt-5">
          <p className="truncate font-semibold">{user.full_name}</p>
          <p className="truncate text-sm text-white/60">{user.role === "admin" ? "Admin" : user.email}</p>
          <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 bg-ink text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-white/80">
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Main">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={(s) => `${linkClass(s)} shrink-0 whitespace-nowrap`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
