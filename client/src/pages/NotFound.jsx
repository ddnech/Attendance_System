import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function NotFound() {
  const { user } = useAuth();
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="figures text-7xl font-semibold text-ink-soft/40">404</p>
        <h1 className="mt-2 text-2xl font-bold">There's nothing on this page</h1>
        <p className="mt-2 text-ink-soft">Check the address, or head back.</p>
        <Link to={user ? "/home" : "/"} className="btn-primary mt-6">
          {user ? "Go to the dashboard" : "Go to login"}
        </Link>
      </div>
    </main>
  );
}
