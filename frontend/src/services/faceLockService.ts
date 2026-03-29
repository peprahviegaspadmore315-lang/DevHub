/**
 * FaceLockService - manages local face profile storage and verification.
 * Uses the browser's platform authenticator so DevHub only signs in after a
 * real device biometric prompt succeeds.
 */

import { platformBiometric } from '@/lib/platform-biometric';

export interface StoredFace {
  id: string;
  deviceId: string;
  credentialId: string;
  timestamp: number;
  scanCount: number;
  ownerEmail?: string;
  lastVerifiedAt?: number;
  faceTemplate?: string;
}

const STORAGE_KEY = 'learning_platform_facelock';
const DEVICE_SALT = 'devhub-facelock-v2';

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

const parseStoredFace = (): StoredFace | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<StoredFace>;

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
      id: typeof parsed.id === 'string' ? parsed.id : `face_${Date.now()}`,
      deviceId: parsed.deviceId,
      credentialId: parsed.credentialId,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
      scanCount: typeof parsed.scanCount === 'number' ? parsed.scanCount : 0,
      ownerEmail: normalizeEmail(parsed.ownerEmail),
      lastVerifiedAt:
        typeof parsed.lastVerifiedAt === 'number' ? parsed.lastVerifiedAt : undefined,
      faceTemplate: typeof parsed.faceTemplate === 'string' ? parsed.faceTemplate : undefined,
    };
  } catch {
    return null;
  }
};

const storeFace = (face: StoredFace) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(face));
};

export const faceLockService = {
  getSupportStatus: () => platformBiometric.getSupportStatus('faceId'),

  generateDeviceId: (): string => platformBiometric.getStableDeviceId(),

  createSignature: (deviceId: string, email?: string): string =>
    `face_sig_${hashString([DEVICE_SALT, deviceId, normalizeEmail(email) || 'guest'].join('::'))}`,

  simulateScan: async (durationMs: number = 1200): Promise<string> => {
    await sleep(durationMs);
    return `scan_face_${Date.now()}`;
  },

  registerFace: async (ownerEmail?: string): Promise<StoredFace> => {
    const linkedEmail = normalizeEmail(ownerEmail);

    if (!linkedEmail) {
      throw new Error('Enter your email first so DevHub can link this face profile to your account.');
    }

    const existing = parseStoredFace();
    const credential = await platformBiometric.registerCredential(
      'faceId',
      linkedEmail,
      existing?.credentialId
    );
    const faceData: StoredFace = {
      id: existing?.id || `face_${Date.now()}`,
      deviceId: credential.deviceId,
      credentialId: credential.credentialId,
      timestamp: existing?.timestamp || Date.now(),
      scanCount: existing?.scanCount || 0,
      ownerEmail: linkedEmail,
      lastVerifiedAt: existing?.lastVerifiedAt,
      faceTemplate:
        existing?.faceTemplate ||
        `template_${hashString(`${Date.now()}:${linkedEmail || 'local-face'}`)}`,
    };

    storeFace(faceData);
    return faceData;
  },

  isRegistered: (): boolean => parseStoredFace() !== null,

  getStoredFace: (): StoredFace | null => parseStoredFace(),

  getRegisteredEmail: (): string | null => parseStoredFace()?.ownerEmail || null,

  verifyFace: async (
    onProgress?: (message: string) => void,
    onScanStart?: () => void
  ): Promise<{ verified: boolean; message: string; deviceId?: string; ownerEmail?: string }> => {
    const stored = parseStoredFace();

    if (!stored) {
      return {
        verified: false,
        message: 'No face profile is registered on this device yet.',
      };
    }

    onScanStart?.();
    onProgress?.('Approve the Face ID prompt from your device...');

    try {
      const verifiedCredential = await platformBiometric.verifyCredential(
        'faceId',
        stored.credentialId
      );

      const updated: StoredFace = {
        ...stored,
        deviceId: verifiedCredential.deviceId,
        scanCount: stored.scanCount + 1,
        lastVerifiedAt: Date.now(),
      };

      storeFace(updated);

      return {
        verified: true,
        message: 'Face ID verified successfully.',
        deviceId: updated.deviceId,
        ownerEmail: updated.ownerEmail,
      };
    } catch (error) {
      return {
        verified: false,
        message:
          error instanceof Error
            ? error.message
            : 'Face ID verification failed. Please try again.',
      };
    }
  },

  removeFace: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getStats: () => {
    const stored = parseStoredFace();

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
      deviceId: stored.deviceId,
    };
  },

  compareFaceScans: (templateA: string, templateB: string): number => {
    const normalizedA = templateA.trim();
    const normalizedB = templateB.trim();

    if (normalizedA && normalizedA === normalizedB) {
      return 100;
    }

    const combined = hashString(`${normalizedA}:${normalizedB}`);
    const normalizedScore = Number.parseInt(combined.slice(0, 2), 36);
    return Math.max(80, Math.min(99, normalizedScore));
  },

  getFaceQualityMetrics: (scanId: string) => {
    const seed = Number.parseInt(hashString(scanId).slice(0, 4), 36);

    return {
      lightingQuality: 78 + (seed % 18),
      faceAlignment: 80 + ((seed >> 1) % 17),
      noiseLevel: 8 + ((seed >> 2) % 10),
      overallQuality: 84 + ((seed >> 3) % 13),
    };
  },
};
