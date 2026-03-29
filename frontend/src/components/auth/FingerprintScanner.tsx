import { motion } from 'framer-motion';
import { Fingerprint, CheckCircle, AlertCircle } from 'lucide-react';

export type FingerprintScannerState = 'idle' | 'scanning' | 'success' | 'error';

interface FingerprintScannerProps {
  state: FingerprintScannerState;
  message: string;
  onRetry?: () => void;
  isRegistration?: boolean;
}

export const FingerprintScanner: React.FC<FingerprintScannerProps> = ({
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
      {/* Animated Fingerprint Icon Container */}
      <div className="relative w-32 h-32">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl" />

        {/* Icon Container */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-r ${getStatusBgColor()} border border-purple-500/30 backdrop-blur-sm`}>
          <motion.div
            animate={
              state === 'scanning'
                ? {
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }
                : state === 'success'
                ? {
                    scale: 1,
                    rotate: 0,
                  }
                : state === 'error'
                ? {
                    x: [0, -5, 5, 0],
                  }
                : {
                    scale: 1,
                    rotate: 0,
                  }
            }
            transition={{
              duration: state === 'scanning' ? 1.5 : 0.6,
              repeat: state === 'scanning' ? Infinity : 0,
            }}
          >
            {state === 'success' ? (
              <CheckCircle className="w-16 h-16 text-green-400" strokeWidth={1.5} />
            ) : state === 'error' ? (
              <AlertCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />
            ) : state === 'scanning' ? (
              <Fingerprint className="w-16 h-16 text-cyan-400" strokeWidth={1.5} />
            ) : (
              <Fingerprint className="w-16 h-16 text-purple-400" strokeWidth={1.5} />
            )}
          </motion.div>
        </div>

        {/* Scanning Rings */}
        {state === 'scanning' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
              animate={{ scale: [1, 1.3, 1.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ opacity: 1 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400/30"
              animate={{ scale: [1, 1.15, 1.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              style={{ opacity: 1 }}
            />
          </>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center space-y-2">
        <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
          {state === 'scanning' && !isRegistration && 'Check Device Prompt'}
          {state === 'scanning' && isRegistration && 'Registering Fingerprint'}
          {state === 'success' && 'Fingerprint Verified'}
          {state === 'error' && 'Recognition Failed'}
          {state === 'idle' && (isRegistration ? 'Register Your Fingerprint' : 'Scan Your Fingerprint')}
        </h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>

      {/* Loading Indicator */}
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
          ? 'DevHub will open your device biometric prompt. Complete it to register this browser for future fingerprint sign-in.'
          : 'DevHub will open your device biometric prompt. Complete it to verify this browser fingerprint credential.'}
      </div>
    </div>
  );
};
