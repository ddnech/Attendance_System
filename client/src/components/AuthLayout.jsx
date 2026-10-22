import dayjs from "dayjs";
import { useNow } from "../hooks/useNow";
import { Brand } from "./AppShell";

// Split screen for login and account setup. The left side is a wall clock.
export default function AuthLayout({ children }) {
  const now = useNow();

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Brand />
        <div>
          <p className="text-white/60">{dayjs(now).format("dddd, D MMMM YYYY")}</p>
          <p className="figures mt-2 text-[8.5rem] leading-none font-semibold tracking-tight" aria-hidden="true">
            {dayjs(now).format("HH:mm")}
            <span className="ml-3 align-top text-4xl text-white/40">{dayjs(now).format("ss")}</span>
          </p>
          <p className="mt-8 max-w-sm text-lg text-white/70">
            Clock in when you start, clock out when you leave. Your attendance and payslips are here whenever you need them.
          </p>
        </div>
        <p className="text-sm text-white/40">Office hours are Monday to Friday.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Brand className="mb-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
