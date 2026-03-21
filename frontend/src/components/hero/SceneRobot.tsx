import { useState, useEffect, useRef, useCallback } from 'react';
import './SceneRobot.css';

interface SceneRobotProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const EMOJIS = {
  idle: '🤖',
  thinking: '🤔',
  speaking: '🗣️',
  excited: '🎉',
  happy: '😊',
};

type RobotMood = keyof typeof EMOJIS;

const SceneRobot: React.FC<SceneRobotProps> = ({ 
  position = 'bottom-right',
  className = ''
}) => {
  const [mood, setMood] = useState<RobotMood>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [mouseAngle, setMouseAngle] = useState(0);
  const robotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout>>();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Eye tracking toward cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      
      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setMouseAngle(angle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random mood changes when idle
  useEffect(() => {
    const moods: RobotMood[] = ['idle', 'happy', 'thinking'];
    
    const changeMood = () => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(randomMood);
      
      idleTimerRef.current = setTimeout(() => {
        setMood('idle');
      }, 2000 + Math.random() * 3000);
    };

    const scheduleNextMood = () => {
      const delay = 5000 + Math.random() * 10000;
      animationRef.current = setTimeout(() => {
        if (!isHovered) {
          changeMood();
        }
        scheduleNextMood();
      }, delay);
    };

    scheduleNextMood();

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isHovered]);

  // Listen for robot events
  useEffect(() => {
    const handleRobotEvent = (event: CustomEvent) => {
      const { state } = event.detail;
      
      if (state === 'excited' || state === 'celebrating') {
        setMood('excited');
        interactionTimeoutRef.current = setTimeout(() => setMood('idle'), 3000);
      } else if (state === 'thinking' || state === 'evaluating') {
        setMood('thinking');
      } else if (state === 'speaking') {
        setMood('speaking');
      }
    };

    window.addEventListener('robot-state-change' as any, handleRobotEvent);
    return () => window.removeEventListener('robot-state-change' as any, handleRobotEvent);
  }, []);

  // Listen for typing events
  useEffect(() => {
    const handleTypingStart = () => {
      setMood('thinking');
    };

    const handleTypingEnd = () => {
      if (mood === 'thinking') {
        setMood('idle');
      }
    };

    window.addEventListener('user-typing-start' as any, handleTypingStart);
    window.addEventListener('user-typing-end' as any, handleTypingEnd);
    
    return () => {
      window.removeEventListener('user-typing-start' as any, handleTypingStart);
      window.removeEventListener('user-typing-end' as any, handleTypingEnd);
    };
  }, [mood]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const getEyeOffset = useCallback(() => {
    const maxOffset = 3;
    return {
      x: Math.cos(mouseAngle) * maxOffset,
      y: Math.sin(mouseAngle) * maxOffset,
    };
  }, [mouseAngle]);

  const eyeOffset = getEyeOffset();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <div
      ref={robotRef}
      className={`scene-robot ${positionClasses[position]} ${className}`}
      onMouseEnter={() => { setIsHovered(true); setMood('happy'); }}
      onMouseLeave={() => { setIsHovered(false); setMood('idle'); }}
    >
      {/* Glow effect behind robot */}
      <div 
        className={`scene-robot-glow ${
          mood === 'thinking' ? 'scene-robot-glow--thinking' : 
          mood === 'excited' ? 'scene-robot-glow--excited' :
          mood === 'speaking' ? 'scene-robot-glow--speaking' :
          'scene-robot-glow--idle'
        }`}
      />

      {/* Robot container */}
      <div className={`
        scene-robot-body
        ${mood === 'thinking' ? 'scene-robot-body--thinking' : ''}
        ${mood === 'happy' ? 'scene-robot-body--happy' : ''}
        ${mood === 'excited' ? 'scene-robot-body--excited' : ''}
        ${mood === 'speaking' ? 'scene-robot-body--speaking' : ''}
      `}>
        {/* Animated gradient border */}
        <div className="scene-robot-border" />
        
        {/* Inner content */}
        <div className="scene-robot-inner">
          {/* Face with eyes */}
          <div className="scene-robot-face">
            {/* Eyes */}
            <div className="scene-robot-eyes">
              <div 
                className="scene-robot-eye"
                style={{ 
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              />
              <div 
                className="scene-robot-eye"
                style={{ 
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              />
            </div>
            
            {/* Mouth */}
            <div className={`
              scene-robot-mouth
              ${mood === 'happy' ? 'scene-robot-mouth--happy' : ''}
              ${mood === 'thinking' ? 'scene-robot-mouth--thinking' : ''}
              ${mood === 'speaking' ? 'scene-robot-mouth--speaking' : ''}
            `} />
          </div>

          {/* Antenna */}
          <div className="scene-robot-antenna">
            <div className="scene-robot-antenna-stem" />
            <div 
              className={`scene-robot-antenna-tip ${
                mood === 'thinking' ? 'scene-robot-antenna-tip--thinking' : ''
              }`}
            />
          </div>

          {/* Side lights */}
          <div className="scene-robot-lights scene-robot-lights--left">
            <div className={`scene-robot-light ${
              mood === 'thinking' ? 'scene-robot-light--thinking' : ''
            }`} />
            <div className={`scene-robot-light ${
              mood === 'idle' ? 'scene-robot-light--idle' : 
              mood === 'happy' ? 'scene-robot-light--happy' : ''
            }`} />
          </div>
          <div className="scene-robot-lights scene-robot-lights--right">
            <div className={`scene-robot-light ${
              mood === 'speaking' ? 'scene-robot-light--speaking' : ''
            }`} />
            <div className={`scene-robot-light ${
              mood === 'excited' ? 'scene-robot-light--excited' : ''
            }`} />
          </div>
        </div>
      </div>

      {/* Floating label */}
      <div className={`
        scene-robot-label
        ${isHovered ? 'scene-robot-label--hovered' : ''}
      `}>
        {mood === 'thinking' ? 'Processing...' : 
         mood === 'speaking' ? 'Talking...' : 
         mood === 'happy' ? 'Hello!' : 
         mood === 'excited' ? 'Amazing!' : 
         'LearnBot'}
      </div>
    </div>
  );
};

export default SceneRobot;
