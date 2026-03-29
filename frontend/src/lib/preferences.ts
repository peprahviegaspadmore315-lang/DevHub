const NAVBAR_AUTO_HIDE_STORAGE_KEY = 'devhub-navbar-autohide'
const NAVBAR_AUTO_HIDE_EVENT = 'devhub-navbar-autohide-change'

export const isNavbarAutoHideEnabled = () => {
  if (typeof window === 'undefined') {
    return true
  }

  const storedValue = localStorage.getItem(NAVBAR_AUTO_HIDE_STORAGE_KEY)

  if (storedValue === null) {
    return true
  }

  return storedValue !== 'false'
}

export const applyNavbarAutoHidePreference = (enabled: boolean) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(NAVBAR_AUTO_HIDE_STORAGE_KEY, enabled ? 'true' : 'false')
  window.dispatchEvent(
    new CustomEvent(NAVBAR_AUTO_HIDE_EVENT, {
      detail: enabled,
    }),
  )
}

export const NAVBAR_AUTO_HIDE_CHANGE_EVENT = NAVBAR_AUTO_HIDE_EVENT
