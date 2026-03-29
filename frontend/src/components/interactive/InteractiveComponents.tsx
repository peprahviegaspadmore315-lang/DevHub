import { motion } from 'framer-motion';
import { ReactNode, memo } from 'react';

// ============================================
// Interactive Button
// ============================================

interface InteractiveButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClassesMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

const variantClassesMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
} as const;

const InteractiveButtonComponent = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: InteractiveButtonProps) => (
  <motion.button
    className={`btn ${variantClassesMap[variant]} ${sizeClassesMap[size]} ${className}`}
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    disabled={disabled || isLoading}
    onClick={onClick}
    type={type}
  >
    {isLoading ? (
      <>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
        Loading...
      </>
    ) : (
      children
    )}
  </motion.button>
);

export const InteractiveButton = memo(InteractiveButtonComponent);

// ============================================
// Interactive Card
// ============================================

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const InteractiveCardComponent = ({
  children,
  className = '',
  onClick,
  hoverable = true,
}: InteractiveCardProps) => (
  <motion.div
    className={`card ${onClick || hoverable ? 'card-interactive' : ''} ${className}`}
    whileHover={hoverable ? { y: -4, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 30px rgba(99, 102, 241, 0.1)' } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const InteractiveCard = memo(InteractiveCardComponent);

// ============================================
// Interactive Input
// ============================================

interface InteractiveInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
}

const InteractiveInputComponent = ({
  label,
  error,
  icon,
  className = '',
  placeholder,
  value,
  onChange,
  type = 'text',
  name,
}: InteractiveInputProps) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="input-icon">{icon}</span>}
        <motion.input
          className={`input ${icon ? 'pl-11' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          type={type}
          name={name}
          whileFocus={{ 
            borderColor: '#6366f1',
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.15)',
            y: -1,
          }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const InteractiveInput = memo(InteractiveInputComponent);

// ============================================
// Animated List Item
// ============================================

interface AnimatedListItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
}

const AnimatedListItemComponent = ({
  children,
  index = 0,
  className = '',
  onClick,
}: AnimatedListItemProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.4, 
      delay: index * 0.05,
      ease: [0.25, 0.1, 0.25, 1] 
    }}
    whileHover={onClick ? { x: 4 } : {}}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const AnimatedListItem = memo(AnimatedListItemComponent);

// ============================================
// Animated Badge
// ============================================

interface AnimatedBadgeProps {
  children: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const colorClassesMap = {
  primary: 'bg-indigo-500/20 text-indigo-400',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  error: 'bg-red-500/20 text-red-400',
} as const;

const AnimatedBadgeComponent = ({
  children,
  color = 'primary',
  className = '',
}: AnimatedBadgeProps) => (
  <motion.span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClassesMap[color]} ${className}`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.span>
);

export const AnimatedBadge = memo(AnimatedBadgeComponent);

// ============================================
// Progress Indicator
// ============================================

interface ProgressIndicatorProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressIndicatorComponent = ({
  progress,
  className = '',
  showLabel = false,
}: ProgressIndicatorProps) => (
  <div className={`space-y-2 ${className}`}>
    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
    {showLabel && (
      <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
    )}
  </div>
);

export const ProgressIndicator = memo(ProgressIndicatorComponent);

// ============================================
// Toggle Switch
// ============================================

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitchComponent = ({ checked, onChange, label }: ToggleSwitchProps) => (
  <label className="toggle cursor-pointer">
    <motion.div
      className={`toggle__track ${checked ? 'bg-indigo-500' : 'bg-gray-600'}`}
      animate={{ backgroundColor: checked ? '#6366f1' : '#4b5563' }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="toggle__thumb"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    {label && <span className="text-sm text-gray-300">{label}</span>}
  </label>
);

export const ToggleSwitch = memo(ToggleSwitchComponent);
