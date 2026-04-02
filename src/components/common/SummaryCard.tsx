export function SummaryCard({ label, value, accent }: { label: string; value: number; accent: 'primary' | 'warning' | 'secondary' }) {
  const accentClasses = {
    primary: 'text-primary',
    warning: 'text-warning',
    secondary: 'text-secondary'
  } as const;

  return (
    <article className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accentClasses[accent]}`}>{value}</p>
    </article>
  );
}