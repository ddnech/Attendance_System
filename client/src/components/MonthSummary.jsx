import { plural } from "../lib/plural";

/**
 * A bar split into full / half / absent / not recorded, with a sentence underneath.
 * `stats` is the `statistics` object from the attendance history API.
 */
export default function MonthSummary({ stats, isCurrentMonth = false }) {
  if (!stats) return null;
  const full = stats["full-day"];
  const half = stats["half-day"];
  const absent = stats.absent;
  const total = Math.max(stats.businessDays, 1);
  const recorded = full + half + absent;
  const pct = (n) => `${(n / total) * 100}%`;

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-canvas" aria-hidden="true">
        <div className="bg-teal" style={{ width: pct(full) }} />
        <div className="bg-amber-fill" style={{ width: pct(half) }} />
        <div className="hatch-absent" style={{ width: pct(absent) }} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        <span className="font-semibold text-ink">{plural(full, "full day")}</span>,{" "}
        <span className="font-semibold text-ink">{plural(half, "half day")}</span> and{" "}
        <span className={`font-semibold ${absent ? "text-red" : "text-ink"}`}>{absent} absent</span>, out of{" "}
        {plural(stats.businessDays, "workday")}
        {isCurrentMonth && recorded < stats.businessDays ? ", counting the days still to come" : ""}.
      </p>
    </div>
  );
}
