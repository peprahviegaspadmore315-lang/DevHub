/**
 * FingerprintService - manages local fingerprint profile storage and verification.
 * Uses the browser's platform authenticator so DevHub only signs in after a
 * real Windows Hello / Touch ID / device biometric prompt succeeds.
 */

import { platformBiometric } from '@/lib/platform-biometric';

export interface StoredFingerprint {
  id: string;
  deviceId: string;
  credentialId: string;
  timestamp: number;
  scanCount: number;
  ownerEmail?: string;
  lastVerifiedAt?: number;
}

const STORAGE_KEY = 'learning_platform_fingerprint';
const DEVICE_SALT = 'devhub-fingerprint-v2';

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() || undefined;

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    const charCode = value.charCodeAt(index);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
};

const sleep = (durationMs: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });

const parseStoredFingerprint = (): StoredFingerprint | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<StoredFingerprint>;

    if (
      !parsed ||
      typeof parsed.deviceId !== 'string' ||
      typeof parsed.credentialId !== 'string' ||
      !parsed.credentialId.trim()
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      id: typeof parsed.id === 'string' ? parsed.id : `fp_${Date.now()}`,
      deviceId: parsed.deviceId,
      credentialId: parsed.credentialId,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
      scanCount: typeof parsed.scanCount === 'number' ? parsed.scanCount : 0,
      ownerEmail: normalizeEmail(parsed.ownerEmail),
      lastVerifiedAt:
        typeof parsed.lastVerifiedAt === 'number' ? parsed.lastVerifiedAt : undefined,
    };
  } catch {
    return null;
  }
};

const storeFingerprint = (fingerprint: StoredFingerprint) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fingerprint));
};

export const fingerprintService = {
  getSupportStatus: () => platformBiometric.getSupportStatus('fingerprint'),

  generateDeviceId: (): string => platformBiometric.getStableDeviceId(),

  createSignature: (deviceId: string, email?: string): string =>
    `fp_sig_${hashString([DEVICE_SALT, deviceId, normalizeEmail(email) || 'guest'].join('::'))}`,

  simulateScan: async (durationMs: number = 900): Promise<string> => {
    await sleep(durationMs);
    return `scan_fp_${Date.now()}`;
  },

  registerFingerprint: async (ownerEmail?: string): Promise<StoredFingerprint> => {
    const linkedEmail = normalizeEmail(ownerEmail);

    if (!linkedEmail) {
      throw new Error('Enter your email first so DevHub can link this fingerprint to your account.');
    }

    const existing = parseStoredFingerprint();
    const credential = await platformBiometric.registerCredential(
      'fingerprint',
      linkedEmail,
      existing?.credentialId
    );
    const fingerprint: StoredFingerprint = {
      id: existing?.id || `fp_${Date.now()}`,
      deviceId: credential.deviceId,
      credentialId: credential.credentialId,
      timestamp: existing?.timestamp || Date.now(),
      scanCount: existing?.scanCount || 0,
      ownerEmail: linkedEmail,
      lastVerifiedAt: existing?.lastVerifiedAt,
    };

    storeFingerprint(fingerprint);
    return fingerprint;
  },

  isRegistered: (): boolean => parseStoredFingerprint() !== null,

  getStoredFingerprint: (): StoredFingerprint | null => parseStoredFingerprint(),

  getRegisteredEmail: (): string | null => parseStoredFingerprint()?.ownerEmail || null,

  verifyFingerprint: async (
    onProgress?: (message: string) => void,
    onScanStart?: () => void
  ): Promise<{ verified: boolean; message: string; deviceId?: string; ownerEmail?: string }> => {
    const stored = parseStoredFingerprint();

    if (!stored) {
      return {
        verified: false,
        message: 'No fingerprint is registered on this device yet.',
      };
    }

    onScanStart?.();
    onProgress?.('Approve the fingerprint prompt from your device...');

    try {
      const verifiedCredential = await platformBiometric.verifyCredential(
        'fingerprint',
        stored.credentialId
      );

      const updated: StoredFingerprint = {
        ...stored,
        deviceId: verifiedCredential.deviceId,
        scanCount: stored.scanCount + 1,
        lastVerifiedAt: Date.now(),
      };

      storeFingerprint(updated);

      return {
        verified: true,
        message: 'Fingerprint verified successfully.',
        deviceId: updated.deviceId,
        ownerEmail: updated.ownerEmail,
      };
    } catch (error) {
      return {
        verified: false,
        message:
          error instanceof Error
            ? error.message
            : 'Fingerprint verification failed. Please try again.',
      };
    }
  },

  removeFingerprint: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getStats: () => {
    const stored = parseStoredFingerprint();

    if (!stored) {
      return null;
    }

    const registrationDate = new Date(stored.timestamp);
    const timeSinceRegistration = Date.now() - stored.timestamp;
    const daysSinceRegistration = Math.floor(timeSinceRegistration / (1000 * 60 * 60 * 24));

    return {
      registered: true,
      registrationDate,
      daysSinceRegistration,
      totalScans: stored.scanCount,
      ownerEmail: stored.ownerEmail,
      lastVerifiedAt: stored.lastVerifiedAt ? new Date(stored.lastVerifiedAt) : null,
    };
  },
};
