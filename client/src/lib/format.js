import dayjs from "dayjs";

export const formatTime = (value) => (value ? dayjs(value).format("HH:mm") : "-");
export const formatDate = (value, pattern = "D MMM YYYY") => (value ? dayjs(value).format(pattern) : "-");

const rupiahFormat = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
export const rupiah = (value) => (value == null ? "-" : rupiahFormat.format(value));

/** "8h 05m" between two times. */
export function duration(from, to = new Date()) {
  if (!from) return "";
  const minutes = Math.max(0, dayjs(to).diff(dayjs(from), "minute"));
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export const MONTHS = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("MMMM"));

export const STATUS = {
  "full-day": { label: "Full day", pill: "bg-teal-tint text-teal" },
  "half-day": { label: "Half day", pill: "bg-amber-tint text-amber" },
  absent: { label: "Absent", pill: "bg-red-tint text-red" },
};
