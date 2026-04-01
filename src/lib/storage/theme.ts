export type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

export function getStoredTheme(): Theme | null {
  const theme = localStorage.getItem(THEME_KEY)
  return theme === 'light' || theme === 'dark' ? theme : null
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function persistTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme)
}
