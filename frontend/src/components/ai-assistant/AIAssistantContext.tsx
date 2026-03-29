import React, { createContext, useContext } from 'react'

interface AIAssistantContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  togglePanel: () => void
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null)

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <AIAssistantContext.Provider value={{ isOpen, setIsOpen, togglePanel: () => setIsOpen(!isOpen) }}>
      {children}
    </AIAssistantContext.Provider>
  )
}

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext)
  if (!context) {
    return { isOpen: false, setIsOpen: () => {}, togglePanel: () => {} }
  }
  return context
}
