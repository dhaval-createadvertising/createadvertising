export const useTheme = () => {
  const theme = useState<'dark' | 'light'>('theme', () => 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme.value)
      localStorage.setItem('create_theme', theme.value)
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('create_theme') as 'dark' | 'light'
      if (saved) {
        theme.value = saved
        document.documentElement.setAttribute('data-theme', saved)
      }
    }
  }

  return { theme, toggleTheme, initTheme }
}
