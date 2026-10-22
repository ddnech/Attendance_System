import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import dayjs from "dayjs";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { duration, formatTime } from "../../lib/format";
import { useNow } from "../../hooks/useNow";
import { useAuth } from "../../auth/AuthContext";
import MonthCalendar from "../../components/MonthCalendar";
import MonthSummary from "../../components/MonthSummary";

function greeting(hour) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TimeClock() {
  const { user } = useAuth();
  const now = useNow();
  const [today, setToday] = useState(null);
  const [month, setMonth] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([api.get("/staff/check-attendance"), api.get("/staff/attendance/history")]);
      setToday(t.data);
      setMonth(m.data);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const punch = async (kind) => {
    setBusy(true);
    try {
      const { data } = kind === "in" ? await api.post("/staff/clock-in") : await api.patch("/staff/clock-out");
      toast.success(data.message);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const log = today?.data;
  const clockedIn = !!log?.clock_in;
  const clockedOut = !!log?.clock_out;
  const absent = log?.status === "absent";
  const firstName = user.full_name.split(" ")[0];

  let status = "Loading…";
  let action = null;
  if (today) {
    if (absent) {
      status = "Today was marked as absent. Talk to your admin if that's wrong.";
    } else if (clockedOut) {
      status = `Done for today. You worked ${formatTime(log.clock_in)} to ${formatTime(log.clock_out)}, that's ${duration(log.clock_in, log.clock_out)}.`;
    } else if (clockedIn) {
      status = `Clocked in at ${formatTime(log.clock_in)}, ${duration(log.clock_in, now)} ago. Remember to clock out before you leave, or today counts as a half day.`;
      action = "out";
    } else if (!today.workday) {
      status = "It's the weekend. Clocking in opens again on Monday.";
    } else {
      status = "You haven't clocked in yet.";
      action = "in";
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="flex flex-col justify-between rounded-xl bg-ink p-7 text-white sm:p-9">
        <div>
          <p className="text-white/60">{dayjs(now).format("dddd, D MMMM YYYY")}</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {greeting(now.getHours())}, {firstName}
          </h1>
        </div>

        <p className="figures my-10 text-[5.5rem] leading-none font-semibold tracking-tight sm:text-[7.5rem]" aria-label={`The time is ${dayjs(now).format("HH:mm")}`}>
          {dayjs(now).format("HH:mm")}
          <span className="ml-2 align-top text-3xl text-white/40 sm:text-4xl">{dayjs(now).format("ss")}</span>
        </p>

        <div>
          <p className="max-w-md text-white/80" aria-live="polite">
            {status}
          </p>

          {action && (
            <button
              onClick={() => punch(action)}
              disabled={busy}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-4 text-lg font-bold transition-colors disabled:opacity-60 sm:w-auto ${
                action === "in" ? "bg-teal text-white hover:bg-teal-dark" : "bg-white text-ink hover:bg-white/90"
              }`}
            >
              {action === "in" ? <LogIn size={20} aria-hidden="true" /> : <LogOut size={20} aria-hidden="true" />}
              {busy ? "Saving…" : action === "in" ? "Clock in" : "Clock out"}
            </button>
          )}

          {clockedIn && (
            <dl className="mt-8 grid max-w-xs grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <dt className="text-sm text-white/50">In</dt>
                <dd className="figures text-3xl font-semibold">{formatTime(log.clock_in)}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Out</dt>
                <dd className="figures text-3xl font-semibold">{clockedOut ? formatTime(log.clock_out) : "--:--"}</dd>
              </div>
            </dl>
          )}
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">{dayjs().format("MMMM")}</h2>
          <Link to="/attendance-history" className="text-sm font-semibold text-teal hover:underline">
            Full history
          </Link>
        </div>
        {month ? (
          <>
            <MonthCalendar year={dayjs().year()} month={dayjs().month() + 1} logs={month.data} compact />
            <div className="mt-6 border-t border-line pt-5">
              <MonthSummary stats={month.statistics} isCurrentMonth />
            </div>
          </>
        ) : (
          <div className="aspect-square animate-pulse rounded-md bg-canvas" />
        )}
      </section>
    </div>
  );
}
