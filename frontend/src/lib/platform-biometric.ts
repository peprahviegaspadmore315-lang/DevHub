export type PlatformBiometricKind = 'fingerprint' | 'faceId';

interface PlatformSupportResult {
  supported: boolean;
  message?: string;
}

interface PlatformRegistrationResult {
  credentialId: string;
  deviceId: string;
}

const RP_NAME = 'DevHub AI';
const DEVICE_ID_STORAGE_KEY = 'devhub_platform_device_id';
const DEVICE_ID_PREFIX = 'devhub_device_';
const CHALLENGE_SIZE = 32;
const TIMEOUT_MS = 60_000;
const USER_HANDLE_SIZE = 32;
const encoder = new TextEncoder();

const toBase64Url = (value: ArrayBuffer | Uint8Array) => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const randomBytes = (size: number) => {
  const bytes = new Uint8Array(size);
  window.crypto.getRandomValues(bytes);
  return bytes;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const makeUserHandle = (email: string, kind: PlatformBiometricKind) => {
  const raw = encoder.encode(`devhub:${kind}:${normalizeEmail(email)}`);
  const handle = new Uint8Array(USER_HANDLE_SIZE);
  handle.set(raw.slice(0, USER_HANDLE_SIZE));
  return handle;
};

const getFriendlyLabel = (kind: PlatformBiometricKind) =>
  kind === 'fingerprint' ? 'fingerprint' : 'face lock';

const getPlatformCredentialApi = () => {
  if (
    typeof window === 'undefined' ||
    !window.isSecureContext ||
    typeof window.PublicKeyCredential === 'undefined' ||
    !navigator.credentials
  ) {
    return null;
  }

  return window.PublicKeyCredential as typeof PublicKeyCredential & {
    isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean>;
  };
};

const mapPlatformError = (
  error: unknown,
  action: 'register' | 'verify',
  kind: PlatformBiometricKind
) => {
  const label = getFriendlyLabel(kind);

  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        return `The ${label} check was cancelled or not completed.`;
      case 'InvalidStateError':
        return action === 'register'
          ? `This device already has a saved ${label} passkey for DevHub.`
          : `This saved ${label} credential is no longer available on this device.`;
      case 'NotSupportedError':
        return 'This browser or device does not support secure biometric sign-in.';
      case 'SecurityError':
        return 'Biometric sign-in only works on localhost or HTTPS.';
      case 'AbortError':
        return `The ${label} request was interrupted. Please try again.`;
      default:
        return error.message || `Unable to ${action} your ${label} right now.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return `Unable to ${action} your ${label} right now.`;
};

export const platformBiometric = {
  async getSupportStatus(kind: PlatformBiometricKind): Promise<PlatformSupportResult> {
    const credentialApi = getPlatformCredentialApi();

    if (!credentialApi) {
      return {
        supported: false,
        message:
          'This browser cannot open a real biometric prompt here yet. Use DevHub on localhost/HTTPS with Windows Hello, Touch ID, or another device authenticator.',
      };
    }

    if (typeof credentialApi.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
      return { supported: true };
    }

    try {
      const available =
        await credentialApi.isUserVerifyingPlatformAuthenticatorAvailable();

      if (!available) {
        return {
          supported: false,
          message: `No platform biometric prompt is available for ${getFriendlyLabel(kind)} sign-in on this device yet.`,
        };
      }

      return { supported: true };
    } catch {
      return {
        supported: false,
        message:
          'DevHub could not confirm a platform biometric authenticator on this device.',
      };
    }
  },

  getStableDeviceId() {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

    if (existing) {
      return existing;
    }

    const generated = `${DEVICE_ID_PREFIX}${toBase64Url(randomBytes(18))}`;
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  },

  async registerCredential(
    kind: PlatformBiometricKind,
    email: string,
    existingCredentialId?: string
  ): Promise<PlatformRegistrationResult> {
    const support = await this.getSupportStatus(kind);

    if (!support.supported) {
      throw new Error(support.message);
    }

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: randomBytes(CHALLENGE_SIZE),
      rp: {
        name: RP_NAME,
      },
      user: {
        id: makeUserHandle(email, kind),
        name: normalizeEmail(email),
        displayName: normalizeEmail(email),
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      timeout: TIMEOUT_MS,
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials: existingCredentialId
        ? [
            {
              id: fromBase64Url(existingCredentialId),
              type: 'public-key',
            },
          ]
        : undefined,
    };

    try {
      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential | null;

      if (!credential) {
        throw new Error('No biometric credential was created.');
      }

      return {
        credentialId: toBase64Url(credential.rawId),
        deviceId: this.getStableDeviceId(),
      };
    } catch (error) {
      throw new Error(mapPlatformError(error, 'register', kind));
    }
  },

  async verifyCredential(
    kind: PlatformBiometricKind,
    credentialId: string
  ): Promise<PlatformRegistrationResult> {
    const support = await this.getSupportStatus(kind);

    if (!support.supported) {
      throw new Error(support.message);
    }

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: randomBytes(CHALLENGE_SIZE),
      allowCredentials: [
        {
          id: fromBase64Url(credentialId),
          type: 'public-key',
        },
      ],
      userVerification: 'required',
      timeout: TIMEOUT_MS,
    };

    try {
      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential | null;

      if (!credential) {
        throw new Error('No biometric credential was returned.');
      }

      return {
        credentialId: toBase64Url(credential.rawId),
        deviceId: this.getStableDeviceId(),
      };
    } catch (error) {
      throw new Error(mapPlatformError(error, 'verify', kind));
    }
  },
};
