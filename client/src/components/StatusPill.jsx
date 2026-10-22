import { STATUS } from "../lib/format";

export default function StatusPill({ status, children }) {
  const s = STATUS[status];
  const cls = s?.pill || "bg-canvas text-ink-soft border border-line";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${cls}`}>
      {children || s?.label || "No record"}
    </span>
  );
}
