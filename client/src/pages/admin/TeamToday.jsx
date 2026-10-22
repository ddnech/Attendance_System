import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { duration, formatTime } from "../../lib/format";
import { plural } from "../../lib/plural";
import PageHeader from "../../components/PageHeader";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";

function DayState({ person, isToday, workday }) {
  const a = person.attendance;
  if (!a) {
    if (!workday) return <span className="text-sm text-ink-soft">Weekend</span>;
    return <StatusPill>{isToday ? "Not in yet" : "No record"}</StatusPill>;
  }
  if (a.status === "absent") return <StatusPill status="absent" />;
  if (!a.clock_out) {
    return isToday ? (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
        <span className="font-semibold text-teal">Working</span>
        <span className="text-ink-soft">for {duration(a.clock_in)}</span>
      </span>
    ) : (
      <span className="inline-flex flex-wrap items-center gap-2">
        <StatusPill status="half-day" />
        <span className="text-xs text-ink-soft">never clocked out</span>
      </span>
    );
  }
  return <StatusPill status={a.status} />;
}

export default function TeamToday() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/users", { params: { date } });
      setResult(data);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh every minute while looking at today, so new clock-ins show up.
  useEffect(() => {
    if (date !== dayjs().format("YYYY-MM-DD")) return;
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [date, load]);

  const isToday = date === dayjs().format("YYYY-MM-DD");
  const shift = (days) => setDate(dayjs(date).add(days, "day").format("YYYY-MM-DD"));
  const s = result?.summary;
  const active = result?.data.filter((p) => !p.invitePending) ?? [];
  const pending = result?.data.filter((p) => p.invitePending) ?? [];

  return (
    <>
      <PageHeader
        title={isToday ? "Today" : dayjs(date).format("dddd, D MMMM")}
        description={isToday ? dayjs().format("dddd, D MMMM YYYY") : "Who came in, and when."}
      >
        <Link to="/register" className="btn-primary">
          <UserPlus size={16} aria-hidden="true" /> Add staff
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button className="btn-secondary btn-sm" onClick={() => shift(-1)} aria-label="Previous day">
          <ChevronLeft size={16} />
        </button>
        <input
          type="date"
          value={date}
          max={dayjs().format("YYYY-MM-DD")}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="input w-auto"
          aria-label="Day"
        />
        <button className="btn-secondary btn-sm" onClick={() => shift(1)} disabled={isToday} aria-label="Next day">
          <ChevronRight size={16} />
        </button>
        {!isToday && (
          <button className="btn-secondary btn-sm" onClick={() => setDate(dayjs().format("YYYY-MM-DD"))}>
            Back to today
          </button>
        )}
      </div>

      {s && (
        <p className="panel mb-6 px-5 py-4 text-ink-soft">
          {!s.workday ? (
            "It's a weekend, so nobody is expected in."
          ) : (
            <>
              <span className="font-semibold text-ink">{s.clockedIn + s.done}</span> of {plural(s.total, "person", "people")} clocked in
              {s.clockedIn > 0 && isToday && <>, {s.clockedIn} still working</>}
              {s.absent > 0 && (
                <>
                  , <span className="font-semibold text-red">{s.absent} absent</span>
                </>
              )}
              {s.notYet > 0 && <>, {s.notYet} {isToday ? "not in yet" : "with no record"}</>}.
            </>
          )}
        </p>
      )}

      {result && result.data.length === 0 ? (
        <EmptyState icon={Users} title="No staff yet">
          <Link to="/register" className="font-semibold text-teal hover:underline">
            Add your first staff member
          </Link>{" "}
          and they'll show up here.
        </EmptyState>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-3 py-3 font-medium">In</th>
                <th scope="col" className="px-3 py-3 font-medium">Out</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {active.map((person) => (
                <tr key={person.id}>
                  <td className="px-5 py-3">
                    <Link to={`/staff/${person.id}`} className="font-semibold hover:text-teal hover:underline">
                      {person.full_name}
                    </Link>
                    <p className="text-xs text-ink-soft">{person.email}</p>
                  </td>
                  <td className="figures px-3 py-3 text-lg">{formatTime(person.attendance?.clock_in)}</td>
                  <td className="figures px-3 py-3 text-lg">{formatTime(person.attendance?.clock_out)}</td>
                  <td className="px-5 py-3">
                    <DayState person={person} isToday={isToday} workday={s?.workday} />
                  </td>
                </tr>
              ))}
              {pending.map((person) => (
                <tr key={person.id} className="text-ink-soft">
                  <td className="px-5 py-3">
                    <span className="font-semibold">{person.full_name}</span>
                    <p className="text-xs">{person.email}</p>
                  </td>
                  <td className="px-3 py-3" colSpan={2}>
                    Hasn't set up their account
                  </td>
                  <td className="px-5 py-3">
                    <Link to="/staff" className="text-xs font-semibold text-teal hover:underline">
                      Send a new link
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
