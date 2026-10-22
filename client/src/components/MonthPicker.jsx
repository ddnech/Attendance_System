import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** "‹ October 2026 ›". Can't go past the current month. */
export default function MonthPicker({ year, month, onChange }) {
  const current = dayjs().year(year).month(month - 1);
  const isThisMonth = current.isSame(dayjs(), "month");
  const go = (delta) => {
    const next = current.add(delta, "month");
    onChange(next.year(), next.month() + 1);
  };

  return (
    <div className="flex items-center gap-1">
      <button className="btn-secondary btn-sm" onClick={() => go(-1)} aria-label="Previous month">
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-36 text-center font-semibold" aria-live="polite">
        {current.format("MMMM YYYY")}
      </span>
      <button className="btn-secondary btn-sm" onClick={() => go(1)} disabled={isThisMonth} aria-label="Next month">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
