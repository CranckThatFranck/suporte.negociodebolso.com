export function AIMonitorPanel() {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-text-primary">Monitor da Ge</p>
      <div className="mt-4 grid gap-3 text-sm text-text-secondary">
        <div className="rounded-2xl bg-background px-4 py-3">Último estado: aguardando confirmação humana</div>
        <div className="rounded-2xl bg-background px-4 py-3">Sugestões geradas: 12</div>
        <div className="rounded-2xl bg-background px-4 py-3">Tempo médio de resposta: 4.2s</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white">
          Aceitar
        </button>
        <button type="button" className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-text-primary">
          Editar
        </button>
        <button type="button" className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-text-primary">
          Descartar
        </button>
      </div>
    </section>
  );
}