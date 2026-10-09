const LABELS: Record<string, { label: string; classes: string }> = {
  new: { label: "New", classes: "bg-blue-100 text-blue-800" },
  reviewing: { label: "Reviewing", classes: "bg-amber-100 text-amber-800" },
  quoted: { label: "Quoted", classes: "bg-purple-100 text-purple-800" },
  booked: { label: "Booked", classes: "bg-mint-soft text-navy" },
  closed: { label: "Closed", classes: "bg-slate-200 text-slate-600" },
  published: { label: "Published", classes: "bg-mint-soft text-navy" },
  "coming-soon": { label: "Coming soon", classes: "bg-amber-100 text-amber-800" },
  hidden: { label: "Hidden", classes: "bg-slate-200 text-slate-600" },
};

export default function StatusBadge({ status }: { status: string }) {
  const entry = LABELS[status] ?? { label: status, classes: "bg-slate-100 text-slate-700" };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${entry.classes}`}
    >
      {entry.label}
    </span>
  );
}
