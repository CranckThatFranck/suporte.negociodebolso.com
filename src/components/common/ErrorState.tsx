export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-5 text-sm text-text-primary">
      <p className="font-semibold text-error-cancel">{title}</p>
      <p className="mt-1 text-text-secondary">{description}</p>
    </div>
  );
}