import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { RobotProvider } from './components/robot'

// Backward compatible alias for old import paths like './context/RobotContext.tsx'
// Some setups may still reference this path in their editor overlay or workspace cache.
if (
  import.meta.env.DEV &&
  window.location.hostname === 'localhost' &&
  ['5173', '5175', '5176'].includes(window.location.port)
) {
  const redirectUrl = `${window.location.protocol}//${window.location.hostname}:5174${window.location.pathname}${window.location.search}${window.location.hash}`
  window.location.replace(redirectUrl)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RobotProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RobotProvider>
  </React.StrictMode>,
)
