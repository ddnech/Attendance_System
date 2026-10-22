import dayjs from "dayjs";
import { STATUS, formatTime } from "../lib/format";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CELL = {
  "full-day": "bg-teal text-white",
  "half-day": "bg-amber-fill text-ink",
  absent: "hatch-absent text-red",
};

/**
 * A month laid out like a punch card: one square per day, filled by attendance.
 * `logs` is [{ date: "YYYY-MM-DD", clockIn, clockOut, status }].
 */
export default function MonthCalendar({ year, month, logs = [], compact = false }) {
  const first = dayjs().year(year).month(month - 1).startOf("month");
  const offset = (first.day() + 6) % 7; // Monday first
  const byDate = Object.fromEntries(logs.map((log) => [log.date, log]));
  const today = dayjs().format("YYYY-MM-DD");

  const days = Array.from({ length: first.daysInMonth() }, (_, i) => first.add(i, "day"));

  return (
    <div>
      <div className={`grid grid-cols-7 ${compact ? "gap-1" : "gap-1.5 sm:gap-2"}`}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center text-xs font-medium text-ink-soft">
            {compact ? d[0] : d}
          </div>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const key = day.format("YYYY-MM-DD");
          const log = byDate[key];
          const weekend = day.day() === 0 || day.day() === 6;
          const future = key > today;
          const isToday = key === today;

          let style = "border border-line bg-surface text-ink-soft";
          if (log) style = CELL[log.status];
          else if (weekend) style = "text-ink-soft/40";
          else if (!future && !isToday) style = "border border-dashed border-ink-soft/30 text-ink-soft";

          const label = [
            day.format("dddd D MMMM"),
            log ? STATUS[log.status].label : weekend ? "weekend" : future ? "" : "no record",
            log?.clockIn ? `in ${formatTime(log.clockIn)}` : "",
            log?.clockOut ? `out ${formatTime(log.clockOut)}` : "",
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={key}
              title={label}
              aria-label={label}
              className={`relative flex aspect-square flex-col justify-between rounded-md ${compact ? "p-1" : "p-1.5 sm:p-2"} ${style} ${
                isToday ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
              }`}
            >
              <span className={`figures leading-none ${compact ? "text-xs" : "text-sm sm:text-base"} font-semibold`}>
                {day.date()}
              </span>
              {!compact && log?.clockIn && (
                <span className="figures hidden text-xs leading-none opacity-90 sm:block">{formatTime(log.clockIn)}</span>
              )}
            </div>
          );
        })}
      </div>
      <Legend />
    </div>
  );
}

export function Legend() {
  const item = (cls, label) => (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${cls}`} aria-hidden="true" />
      {label}
    </span>
  );
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
      {item("bg-teal", "Full day")}
      {item("bg-amber-fill", "Half day")}
      {item("hatch-absent", "Absent")}
      {item("border border-dashed border-ink-soft/40", "No record")}
    </div>
  );
}
