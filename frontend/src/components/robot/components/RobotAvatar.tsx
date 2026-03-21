import { useMemo } from 'react';
import { RobotState } from '../types';

interface RobotAvatarProps {
  state: RobotState;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const STATE_CONFIG = {
  idle: { emoji: '🤖', label: 'Ready', gradient: 'from-purple-500 to-indigo-500' },
  reading: { emoji: '👀', label: 'Reading', gradient: 'from-blue-500 to-cyan-500' },
  speaking: { emoji: '💬', label: 'Speaking', gradient: 'from-green-500 to-emerald-500' },
  excited: { emoji: '🎉', label: 'Great!', gradient: 'from-yellow-400 to-orange-500' },
  thinking: { emoji: '🤔', label: 'Thinking...', gradient: 'from-indigo-500 to-purple-600' },
  confused: { emoji: '😕', label: 'Hmm...', gradient: 'from-red-400 to-pink-500' },
  celebrating: { emoji: '🏆', label: 'Amazing!', gradient: 'from-yellow-400 to-yellow-500' },
};

const SIZE_CLASSES = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-20 h-20 text-4xl',
  lg: 'w-28 h-28 text-5xl',
};

export const RobotAvatar = ({ state, size = 'md', onClick }: RobotAvatarProps) => {
  const config = useMemo(() => STATE_CONFIG[state] || STATE_CONFIG.idle, [state]);
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`robot ${state} ${sizeClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Robot assistant: ${config.label}`}
    >
      <span className="text-5xl transition-transform duration-200 hover:scale-110">
        {config.emoji}
      </span>
      {size !== 'sm' && (
        <p className="absolute -bottom-6 text-xs font-medium text-center whitespace-nowrap">
          {config.label}
        </p>
      )}
    </div>
  );
};

export default RobotAvatar;
