export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center">
      {Icon && <Icon size={28} className="mb-3 text-ink-soft" aria-hidden="true" />}
      <p className="text-lg font-semibold">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm text-ink-soft">{children}</div>}
    </div>
  );
}
