import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Suspense, useEffect, type ReactNode } from 'react';
import { queryClient } from '@/lib/query/client';
import { ThemeProvider } from '@/lib/theme';
import { ToastProvider } from '@/lib/toast';

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'pt-BR';
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
          </BrowserRouter>
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}