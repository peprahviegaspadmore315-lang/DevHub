import React from 'react'

type ReadControlsProps = {
  text?: string
  compact?: boolean
  className?: string
}

export const ReadControls: React.FC<ReadControlsProps> = ({ text = '', compact = false, className = '' }) => {
  return (
    <div className={`robot-read-controls ${compact ? 'compact' : ''} ${className}`}>
      <span>{text ? `${text.slice(0, 50)}${text.length > 50 ? '...' : ''}` : 'No text available'}</span>
    </div>
  )
}
