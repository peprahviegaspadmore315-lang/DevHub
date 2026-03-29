import React from 'react'

type SceneRobotProps = {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

const SceneRobot: React.FC<SceneRobotProps> = ({ position = 'bottom-right', className = '' }) => {
  return (
    <div className={`scene-robot ${className} ${position}`}>
      <div className="robot-placeholder">Robot Character</div>
    </div>
  )
}

export default SceneRobot

