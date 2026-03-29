import { motion } from 'framer-motion';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';

export type FaceLockScannerState = 'idle' | 'scanning' | 'success' | 'error';

interface FaceLockScannerProps {
  state: FaceLockScannerState;
  message: string;
  onRetry?: () => void;
  isRegistration?: boolean;
}

export const FaceLockScanner: React.FC<FaceLockScannerProps> = ({
  state,
  message,
  onRetry,
  isRegistration = false,
}) => {
  const getStatusColor = () => {
    switch (state) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'scanning':
        return 'text-cyan-400';
      default:
        return 'text-purple-400';
    }
  };

  const getStatusBgColor = () => {
    switch (state) {
      case 'success':
        return 'from-green-500/20 to-green-600/10';
      case 'error':
        return 'from-red-500/20 to-red-600/10';
      case 'scanning':
        return 'from-cyan-500/20 to-purple-600/10';
      default:
        return 'from-purple-500/20 to-cyan-600/10';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Face Scanner Container */}
      <div className="relative w-40 h-56">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-2xl" />

        {/* Face Frame */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-r ${getStatusBgColor()} border-2 border-purple-500/30 backdrop-blur-sm overflow-hidden`}>
          {/* Face outline SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 224" fill="none">
            {/* Face oval */}
            <circle
              cx="80"
              cy="100"
              r="50"
              stroke={
                state === 'success'
                  ? '#4ade80'
                  : state === 'error'
                  ? '#f87171'
                  : state === 'scanning'
                  ? '#06b6d4'
                  : '#c084fc'
              }
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Eyes */}
            {state !== 'success' && (
              <>
                <circle cx="60" cy="85" r="5" stroke={state === 'error' ? '#f87171' : '#06b6d4'} strokeWidth="2" />
                <circle cx="100" cy="85" r="5" stroke={state === 'error' ? '#f87171' : '#06b6d4'} strokeWidth="2" />
              </>
            )}

            {/* Checkmark for success */}
            {state === 'success' && (
              <>
                <polyline points="50,90 65,105 95,75" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>

          {/* Animated scanning rings */}
          {state === 'scanning' && (
            <>
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-purple-400/30"
                animate={{ scale: [1.2, 0.9, 1.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}

          {/* Success checkmark animation */}
          {state === 'success' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400" strokeWidth={1.5} />
            </motion.div>
          )}

          {/* Error indicator */}
          {state === 'error' && (
            <motion.div
              animate={{ x: [0, -8, 8, 0] }}
              transition={{ duration: 0.4 }}
            >
              <AlertCircle className="w-20 h-20 text-red-400" strokeWidth={1.5} />
            </motion.div>
          )}
        </div>

        {/* Corner markers */}
        {state !== 'success' && state !== 'error' && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-purple-400/50"
              animate={state === 'scanning' ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-400/50"
              animate={state === 'scanning' ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-400/50"
              animate={state === 'scanning' ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400/50"
              animate={state === 'scanning' ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center space-y-2">
        <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
          {state === 'scanning' && !isRegistration && 'Check Device Prompt'}
          {state === 'scanning' && isRegistration && 'Registering Face'}
          {state === 'success' && 'Face Verified'}
          {state === 'error' && 'Not Recognized'}
          {state === 'idle' && (isRegistration ? 'Register Your Face' : 'Scan Your Face')}
        </h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>

      {/* Loading indicator */}
      {state === 'scanning' && (
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Retry Button */}
      {state === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-all duration-200"
        >
          Try Again
        </button>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 text-center max-w-sm pt-4 border-t border-gray-700/50">
        {isRegistration
          ? 'DevHub will open your device biometric prompt. Complete it to register this browser for future Face ID sign-in.'
          : 'DevHub will open your device biometric prompt. Complete it to verify this browser Face ID credential.'}
      </div>
    </div>
  );
};
