export const isDarkThemeEnabled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem('theme') === 'dark'
}

export const applyThemePreference = (isDark: boolean) => {
  if (typeof window === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  window.dispatchEvent(new CustomEvent('devhub-theme-change', { detail: isDark }))
}
