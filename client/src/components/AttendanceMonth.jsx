import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ArrowDownUp, CalendarX } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../lib/api";
import { STATUS, duration, formatDate, formatTime } from "../lib/format";
import MonthPicker from "./MonthPicker";
import MonthCalendar from "./MonthCalendar";
import MonthSummary from "./MonthSummary";
import StatusPill from "./StatusPill";
import EmptyState from "./EmptyState";

const ALL = ["full-day", "half-day", "absent"];

/**
 * A month of attendance: picker, summary bar, calendar and a list of days.
 * `endpoint` is the API path that returns { statistics, data }.
 */
export default function AttendanceMonth({ endpoint, onLoaded }) {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [statuses, setStatuses] = useState(ALL);
  const [sort, setSort] = useState("DESC");
  const [result, setResult] = useState(null);
  const [allDays, setAllDays] = useState([]);
  const [loading, setLoading] = useState(true);
  // Kept in a ref so a new function from the parent doesn't trigger a reload.
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // The calendar always shows every status; the list below follows the filter.
      const [filtered, everything] = await Promise.all([
        api.get(endpoint, { params: { year, month, sort, status: statuses.join(",") } }),
        api.get(endpoint, { params: { year, month } }),
      ]);
      setResult(filtered.data);
      setAllDays(everything.data.data);
      onLoadedRef.current?.(filtered.data);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [endpoint, year, month, sort, statuses]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (status) =>
    setStatuses((current) =>
      current.includes(status) ? (current.length > 1 ? current.filter((s) => s !== status) : current) : [...current, status]
    );

  const isCurrentMonth = dayjs().year() === year && dayjs().month() + 1 === month;

  return (
    <div className={loading && result ? "opacity-70" : ""}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MonthPicker
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="panel p-5 sm:p-6">
          <MonthCalendar year={year} month={month} logs={allDays} />
        </section>

        <section className="flex flex-col gap-6">
          <div className="panel p-5 sm:p-6">
            <h2 className="mb-4 font-semibold">Month at a glance</h2>
            <MonthSummary stats={result?.statistics} isCurrentMonth={isCurrentMonth} />
          </div>

          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Show statuses">
                {ALL.map((status) => {
                  const on = statuses.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggle(status)}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        on ? `${STATUS[status].pill} border-transparent` : "border-line text-ink-soft hover:border-ink-soft/40"
                      }`}
                    >
                      {STATUS[status].label}
                    </button>
                  );
                })}
              </div>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink"
                onClick={() => setSort((s) => (s === "DESC" ? "ASC" : "DESC"))}
              >
                <ArrowDownUp size={14} aria-hidden="true" />
                {sort === "DESC" ? "Newest first" : "Oldest first"}
              </button>
            </div>

            {result && result.data.length === 0 ? (
              <div className="p-5">
                <EmptyState icon={CalendarX} title="Nothing to show">
                  No days match these filters in {dayjs().year(year).month(month - 1).format("MMMM")}.
                </EmptyState>
              </div>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-surface text-ink-soft">
                    <tr>
                      <th scope="col" className="px-5 py-2.5 font-medium">Day</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">In</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Out</th>
                      <th scope="col" className="hidden px-3 py-2.5 font-medium sm:table-cell">Hours</th>
                      <th scope="col" className="px-5 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {result?.data.map((day) => (
                      <tr key={day.date}>
                        <td className="px-5 py-2.5 whitespace-nowrap">{formatDate(day.date, "ddd D MMM")}</td>
                        <td className="figures px-3 py-2.5 text-base">{formatTime(day.clockIn)}</td>
                        <td className="figures px-3 py-2.5 text-base">{formatTime(day.clockOut)}</td>
                        <td className="figures hidden px-3 py-2.5 text-base text-ink-soft sm:table-cell">
                          {day.clockIn && day.clockOut ? duration(day.clockIn, day.clockOut) : "-"}
                        </td>
                        <td className="px-5 py-2.5"><StatusPill status={day.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
