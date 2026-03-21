import { useState, useEffect, useRef, useCallback } from 'react';

interface HeroRobotProps {
  isActive?: boolean;
  onFocus?: () => void;
}

const EMOJIS = {
  idle: '🤖',
  thinking: '🤔',
  speaking: '🗣️',
  excited: '🎉',
  happy: '😊',
};

type RobotMood = keyof typeof EMOJIS;

export const HeroRobot = ({ isActive = false, onFocus }: HeroRobotProps) => {
  const [mood, setMood] = useState<RobotMood>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [mouseAngle, setMouseAngle] = useState(0);
  const robotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();
  const idleTimerRef = useRef<NodeJS.Timeout>();

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
      
      // Reset to idle after a short time
      idleTimerRef.current = setTimeout(() => {
        setMood('idle');
      }, 2000 + Math.random() * 3000);
    };

    const scheduleNextMood = () => {
      const delay = 5000 + Math.random() * 10000; // 5-15 seconds
      animationRef.current = setTimeout(() => {
        if (!isHovered && !isActive) {
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
  }, [isHovered, isActive]);

  // React to focus
  useEffect(() => {
    if (isActive) {
      setMood('thinking');
      const timer = setTimeout(() => setMood('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const getEyeOffset = useCallback(() => {
    const maxOffset = 3;
    return {
      x: Math.cos(mouseAngle) * maxOffset,
      y: Math.sin(mouseAngle) * maxOffset,
    };
  }, [mouseAngle]);

  const eyeOffset = getEyeOffset();

  return (
    <div
      ref={robotRef}
      className="relative cursor-pointer select-none"
      onMouseEnter={() => { setIsHovered(true); setMood('happy'); }}
      onMouseLeave={() => { setIsHovered(false); setMood('idle'); }}
      onClick={onFocus}
    >
      {/* Glow effect behind robot */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-xl transition-opacity duration-500 ${
          mood === 'thinking' ? 'opacity-60 animate-pulse' : 
          mood === 'excited' ? 'opacity-80 scale-110' :
          'opacity-30'
        }`}
      />

      {/* Robot container */}
      <div className={`
        relative w-20 h-20 md:w-24 md:h-24
        bg-gradient-to-br from-gray-800 to-gray-900
        rounded-2xl
        border border-gray-700/50
        shadow-2xl shadow-indigo-500/20
        flex items-center justify-center
        transition-all duration-300
        ${mood === 'thinking' ? 'animate-bounce' : ''}
        ${mood === 'happy' ? 'scale-105' : ''}
        ${mood === 'excited' ? 'animate-pulse scale-110' : ''}
        hover:border-indigo-500/50
        ${isHovered ? 'shadow-indigo-500/40' : ''}
      `}>
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-50" />
        
        {/* Inner content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Face with eyes */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex gap-4 mb-2">
              <div 
                className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-400 transition-transform duration-100"
                style={{ 
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)'
                }}
              />
              <div 
                className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-400 transition-transform duration-100"
                style={{ 
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)'
                }}
              />
            </div>
            
            {/* Mouth */}
            <div className={`
              w-6 md:w-8 h-1 mx-auto rounded-full
              bg-gradient-to-r from-indigo-500 to-purple-500
              transition-all duration-300
              ${mood === 'happy' ? 'w-8 md:w-10 h-2 rounded-full' : ''}
              ${mood === 'thinking' ? 'w-4 h-1 animate-pulse' : ''}
              ${mood === 'speaking' ? 'w-8 h-2 animate-pulse' : ''}
            `} />
          </div>

          {/* Antenna */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-1 h-4 md:h-5 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-full" />
            <div 
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                mood === 'thinking' ? 'bg-purple-400 animate-ping' : 'bg-cyan-400'
              }`}
              style={{ boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
            />
          </div>

          {/* Side lights */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
              mood === 'thinking' ? 'bg-purple-400 animate-pulse' : 'bg-indigo-500'
            }`} style={{ boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)' }} />
            <div className={`w-1.5 h-1.5 rounded-full ${
              mood === 'idle' ? 'bg-cyan-400 animate-pulse' : mood === 'happy' ? 'bg-green-400' : 'bg-indigo-500'
            }`} style={{ boxShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              mood === 'speaking' ? 'bg-green-400 animate-pulse' : 'bg-indigo-500'
            }`} style={{ boxShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
              mood === 'excited' ? 'bg-yellow-400 animate-pulse' : 'bg-indigo-500'
            }`} style={{ boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)' }} />
          </div>
        </div>
      </div>

      {/* Floating label */}
      <div className={`
        absolute -bottom-8 left-1/2 -translate-x-1/2
        text-xs text-gray-400 whitespace-nowrap
        transition-all duration-300
        ${isHovered ? 'text-indigo-400' : ''}
      `}>
        {mood === 'thinking' ? 'Processing...' : 
         mood === 'speaking' ? 'Talking...' : 
         mood === 'happy' ? 'Hello!' : 
         mood === 'excited' ? 'Wow!' : 
         'LearnBot'}
      </div>
    </div>
  );
};

export default HeroRobot;
