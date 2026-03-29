import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FingerprintScanner, type FingerprintScannerState } from './FingerprintScanner';
import { fingerprintService } from '@/services/fingerprintService';

export interface FingerprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verified: boolean, deviceId?: string, ownerEmail?: string) => void;
  mode?: 'verify' | 'register';
  accountEmail?: string;
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode: initialMode = 'verify',
  accountEmail,
}) => {
  const [scannerState, setScannerState] = useState<FingerprintScannerState>('idle');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'verify' | 'register' | 'register-choice'>(initialMode === 'verify' && fingerprintService.isRegistered() ? 'verify' : initialMode === 'register' ? 'register' : 'register-choice');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScannerState('idle');
      setMessage('');
      setIsProcessing(false);
      
      // Determine mode based on registration status
      if (initialMode === 'verify') {
        if (fingerprintService.isRegistered()) {
          setMode('verify');
          setMessage('Tap start, then approve the fingerprint prompt from your device.');
        } else {
          setMode('register-choice');
          setMessage('No fingerprint registered yet');
        }
      } else {
        setMode('register');
        setMessage('Tap start, then register this device fingerprint for DevHub.');
      }
    }
  }, [isOpen, initialMode]);

  const handleRegisterStart = async () => {
    try {
      if (!accountEmail?.trim()) {
        setScannerState('error');
        setMessage('Enter your email first so DevHub can link this fingerprint to your account.');
        return;
      }

      setIsProcessing(true);
      setScannerState('scanning');
      setMessage('Approve the fingerprint prompt from your device...');

      const fingerprint = await fingerprintService.registerFingerprint(accountEmail);

      setScannerState('success');
      setMessage('Fingerprint registered successfully!');

      setTimeout(() => {
        onSuccess(true, fingerprint.deviceId, fingerprint.ownerEmail);
      }, 900);
    } catch (error) {
      setScannerState('error');
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyStart = async () => {
    try {
      setIsProcessing(true);
      setScannerState('scanning');
      setMessage('Approve the fingerprint prompt from your device...');

      const result = await fingerprintService.verifyFingerprint(
        (msg) => setMessage(msg),
        () => setScannerState('scanning')
      );

      if (result.verified) {
        setScannerState('success');
        setMessage('Fingerprint verified successfully!');
        setTimeout(() => {
          onSuccess(true, result.deviceId, result.ownerEmail);
        }, 900);
      } else {
        setScannerState('error');
        setMessage(result.message);
      }
    } catch (error) {
      setScannerState('error');
      setMessage('Verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    if (mode === 'verify') {
      handleVerifyStart();
    } else if (mode === 'register') {
      handleRegisterStart();
    }
  };

  const handleRegisterChoice = (registerNow: boolean) => {
    if (registerNow) {
      setMode('register');
      setScannerState('idle');
      setMessage('Ready to register your fingerprint');
      setIsProcessing(false);
    } else {
      // Try to simulate a skip for now
      onSuccess(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-bold text-white">
                  {mode === 'register-choice' && 'Fingerprint Authentication'}
                  {mode === 'register' && 'Register Your Fingerprint'}
                  {mode === 'verify' && 'Verify Your Fingerprint'}
                </h2>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {mode === 'register-choice' ? (
                  // Registration Choice Modal
                  <motion.div
                    className="space-y-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-3">
                      <p className="text-gray-300">
                        You haven't registered your fingerprint yet. Would you like to set it up now for faster authentication?
                      </p>
                      <p className="text-xs text-gray-500">
                        DevHub will ask this browser to use your device fingerprint or Windows Hello prompt before sign-in is allowed.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleRegisterChoice(false)}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-medium transition-colors"
                      >
                        Skip for Now
                      </button>
                      <button
                        onClick={() => handleRegisterChoice(true)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        Register Now
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // Scanner Modal
                  <motion.div
                    key="scanner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FingerprintScanner
                      state={scannerState}
                      message={message}
                      isRegistration={mode === 'register'}
                      onRetry={scannerState === 'error' ? handleRetry : undefined}
                    />

                    {/* Action Button - Only show if not scanning or already completed */}
                    {scannerState === 'idle' && (
                      <motion.button
                        onClick={mode === 'register' ? handleRegisterStart : handleVerifyStart}
                        disabled={isProcessing}
                        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {mode === 'register' ? 'Start Registration' : 'Start Verification'}
                      </motion.button>
                    )}

                    {/* Cancel Button */}
                    {scannerState === 'idle' && (
                      <button
                        onClick={onClose}
                        className="w-full mt-3 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Success/Error Action */}
                    {scannerState === 'success' && (
                      <button
                        onClick={onClose}
                        className="w-full mt-6 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-semibold rounded-lg transition-all duration-200"
                      >
                        Close
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer Info */}
              <div className="px-8 py-4 bg-slate-900/50 border-t border-purple-500/20 text-xs text-gray-500 text-center">
                DevHub stores a local device credential for this browser and still requires a real biometric prompt before sign-in.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
