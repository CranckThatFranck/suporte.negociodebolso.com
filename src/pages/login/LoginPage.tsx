import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildLoginPayload, useLoginMutation } from '@/features/auth/useAuth';
import { pushGlobalToast } from '@/lib/toast';

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState({ idEmpresa: '', nickname: '', password: '' });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.idEmpresa || !form.nickname || !form.password) {
      pushGlobalToast({ title: 'Campos obrigatórios', description: 'Preencha idEmpresa, nickname e password.', type: 'warning' });
      return;
    }

    try {
      await loginMutation.mutateAsync(buildLoginPayload(form));
      navigate('/dashboard');
    } catch {
      pushGlobalToast({ title: 'Falha no login', description: 'Não foi possível autenticar a equipe.', type: 'error' });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-[28px] border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-text-primary">Entrar no suporte</h1>
        <p className="mt-2 text-sm text-text-secondary">Acesso exclusivo da equipe interna.</p>
        <div className="mt-6 space-y-4">
          <input
            value={form.idEmpresa}
            onChange={(event) => setForm((current) => ({ ...current, idEmpresa: event.target.value }))}
            placeholder="idEmpresa"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary"
          />
          <input
            value={form.nickname}
            onChange={(event) => setForm((current) => ({ ...current, nickname: event.target.value }))}
            placeholder="nickname"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary"
          />
          <input
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            type="password"
            placeholder="password"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}