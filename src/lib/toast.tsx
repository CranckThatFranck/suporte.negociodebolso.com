import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const createId = () => Math.random().toString(36).slice(2, 10);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<ToastItem, 'id'>>;
      pushToast(customEvent.detail);
    };

    window.addEventListener('support:toast', listener as EventListener);
    return () => window.removeEventListener('support:toast', listener as EventListener);
  }, []);

  const pushToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = createId();
    setItems((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 3500);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft">
            <p className="text-sm font-semibold text-text-primary">{item.title}</p>
            {item.description ? <p className="mt-1 text-sm text-text-secondary">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};

export const pushGlobalToast = (toast: Omit<ToastItem, 'id'>) => {
  window.dispatchEvent(new CustomEvent('support:toast', { detail: toast }));
};