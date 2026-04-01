import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from '../../lib/query/client'
import { ThemeProvider } from './ThemeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
