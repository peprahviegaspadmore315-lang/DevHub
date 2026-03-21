import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RobotProvider } from './components/robot'

// Backward compatible alias for old import paths like './context/RobotContext.tsx'
// Some setups may still reference this path in their editor overlay or workspace cache.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RobotProvider>
      <App />
    </RobotProvider>
  </React.StrictMode>,
)
