import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@/services/api';
import { DateWheelPicker } from '@/components/ui/date-wheel-picker';
import OtpInput from '@/components/ui/otp-input';
import PasswordInput, { isPasswordStrongEnough } from '@/components/ui/password-input-1';
import { CountryFlag } from '@/components/ui/country-flag';
import { useToast } from '@/components/ui/toast-1';
import { CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
// HeroRobot removed
import HeroAnimation from '@/components/hero/HeroAnimation';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { countryOptions, type CountryOption } from '@/constants/countries';
import { FingerprintModal } from '@/components/auth/FingerprintModal';
import { fingerprintService } from '@/services/fingerprintService';
import { FaceLockModal } from '@/components/auth/FaceLockModal';
import { faceLockService } from '@/services/faceLockService';
import { completeAuthenticatedSession } from '@/lib/auth-session';

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

const DEFAULT_COUNTRY_CODE = 'US';
const REMEMBERED_EMAIL_STORAGE_KEY = 'rememberedEmail';
const SOCIAL_SHORTCUT_STORAGE_PREFIX = 'devhubSocialShortcut';
const LAST_DEVICE_ACCOUNT_STORAGE_KEY = 'devhubLastDeviceAccount';
const RESET_RESEND_COOLDOWN_SECONDS = 30;
type SocialProvider = 'google' | 'github';

interface SavedSocialShortcut {
  email: string;
  password: string;
  username?: string;
  savedAt: string;
}

const getSocialShortcutKey = (provider: SocialProvider) =>
  `${SOCIAL_SHORTCUT_STORAGE_PREFIX}:${provider}`;

const loadSavedSocialShortcut = (provider: SocialProvider): SavedSocialShortcut | null => {
  try {
    const raw = localStorage.getItem(getSocialShortcutKey(provider));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SavedSocialShortcut>;
    if (
      typeof parsed?.email !== 'string' ||
      typeof parsed?.password !== 'string' ||
      parsed.email.trim() === '' ||
      parsed.password.trim() === ''
    ) {
      localStorage.removeItem(getSocialShortcutKey(provider));
      return null;
    }

    return {
      email: parsed.email.trim(),
      password: parsed.password,
      username: typeof parsed.username === 'string' ? parsed.username.trim() : undefined,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    localStorage.removeItem(getSocialShortcutKey(provider));
    return null;
  }
};

const persistSocialShortcut = (
  provider: SocialProvider,
  account: Pick<SavedSocialShortcut, 'email' | 'password' | 'username'>
) => {
  const payload: SavedSocialShortcut = {
    email: account.email.trim(),
    password: account.password,
    username: account.username?.trim() || undefined,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(getSocialShortcutKey(provider), JSON.stringify(payload));
};

const clearSocialShortcut = (provider: SocialProvider) => {
  localStorage.removeItem(getSocialShortcutKey(provider));
};

const loadLastDeviceAccount = (): SavedSocialShortcut | null => {
  try {
    const raw = localStorage.getItem(LAST_DEVICE_ACCOUNT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SavedSocialShortcut>;
    if (
      typeof parsed?.email !== 'string' ||
      typeof parsed?.password !== 'string' ||
      parsed.email.trim() === '' ||
      parsed.password.trim() === ''
    ) {
      localStorage.removeItem(LAST_DEVICE_ACCOUNT_STORAGE_KEY);
      return null;
    }

    return {
      email: parsed.email.trim(),
      password: parsed.password,
      username: typeof parsed.username === 'string' ? parsed.username.trim() : undefined,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    localStorage.removeItem(LAST_DEVICE_ACCOUNT_STORAGE_KEY);
    return null;
  }
};

const persistLastDeviceAccount = (
  account: Pick<SavedSocialShortcut, 'email' | 'password' | 'username'>
) => {
  const payload: SavedSocialShortcut = {
    email: account.email.trim(),
    password: account.password,
    username: account.username?.trim() || undefined,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(LAST_DEVICE_ACCOUNT_STORAGE_KEY, JSON.stringify(payload));
};

const detectUserCountryCode = (): string => {
  try {
    const language = navigator.language || (navigator as any).userLanguage;

    if (language) {
      const countryCode = language
        .split(/[-_]/)
        .map((part: string) => part.trim())
        .reverse()
        .find((part: string) => /^[A-Za-z]{2}$/.test(part));

      if (countryCode) {
        return countryCode.toUpperCase();
      }
    }
  } catch (error) {
    console.warn('Could not detect user country:', error);
  }

  return DEFAULT_COUNTRY_CODE;
};

const COUNTRIES: CountryOption[] = countryOptions;

const getInitialCountry = (): CountryOption =>
  COUNTRIES.find(country => country.code === detectUserCountryCode()) ??
  COUNTRIES.find(country => country.code === DEFAULT_COUNTRY_CODE) ??
  COUNTRIES[0];

const createDefaultBirthDate = (): Date => new Date(2000, 0, 1);

const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatReadableBirthDate = (date: Date, locale?: string): string =>
  date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const LoginPageComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { openAssistantTab } = useAIAssistant();
  
   const [formMode, setFormMode] = useState<'login' | 'register' | 'forgot'>('login');
   const [formData, setFormData] = useState({
     email: '',
     password: '',
     username: '',
     firstName: '',
     lastName: '',
     confirmPassword: '',
   });
    const [selectedCountry, setSelectedCountry] = useState<CountryOption>(() => getInitialCountry());
   const [countrySearch, setCountrySearch] = useState('');
   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [oauthLoading, setOauthLoading] = useState<SocialProvider | null>(null);
   const [biometricLoading, setBiometricLoading] = useState(false);
   const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprintMode, setFingerprintMode] = useState<'verify' | 'register'>('verify');
  const [showFaceLockModal, setShowFaceLockModal] = useState(false);
  const [faceLockMode, setFaceLockMode] = useState<'verify' | 'register'>('verify');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricReady, setBiometricReady] = useState(() => ({
    fingerprint: fingerprintService.isRegistered(),
    faceId: faceLockService.isRegistered(),
  }));
    const [inputActivityLevel, setInputActivityLevel] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isRobotActive, setIsRobotActive] = useState(false);
    const [resetCodeSent, setResetCodeSent] = useState(false);
    const [includeBirthDate, setIncludeBirthDate] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date>(() => createDefaultBirthDate());
    const [resetOtpCode, setResetOtpCode] = useState('');
    const [resetPreviewCode, setResetPreviewCode] = useState<string | null>(null);
    const [resetCodeExpiresAt, setResetCodeExpiresAt] = useState<string | null>(null);
    const [resetResendCooldown, setResetResendCooldown] = useState(0);
    const [lastDeviceAccount, setLastDeviceAccount] = useState<SavedSocialShortcut | null>(() => loadLastDeviceAccount());
    const [savedSocialShortcuts, setSavedSocialShortcuts] = useState(() => ({
      google: loadSavedSocialShortcut('google'),
      github: loadSavedSocialShortcut('github'),
    }));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locationState = (location.state as {
    from?: { pathname?: string };
    presetEmail?: string;
    presetMode?: 'login' | 'register';
  } | null) ?? null;

  const from = locationState?.from?.pathname || '/dashboard';

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_STORAGE_KEY);
    setRememberMe(Boolean(savedEmail));
    setBiometricReady({
      fingerprint: fingerprintService.isRegistered(),
      faceId: faceLockService.isRegistered(),
    });
  }, []);

  useEffect(() => {
    if (!locationState?.presetEmail && !locationState?.presetMode) {
      return;
    }

    if (locationState.presetEmail) {
      setFormData((prev) => ({ ...prev, email: locationState.presetEmail || prev.email }));
    }

    if (locationState.presetMode) {
      setFormMode(locationState.presetMode);
    }
  }, [locationState?.presetEmail, locationState?.presetMode]);

  useEffect(() => {
    if (inputActivityLevel > 0) {
      const decayInterval = setInterval(() => {
        setInputActivityLevel(prev => Math.max(0, prev - 0.05));
      }, 50);
      return () => clearInterval(decayInterval);
    }
  }, [inputActivityLevel]);

  useEffect(() => {
    if (resetResendCooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResetResendCooldown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resetResendCooldown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const syncSavedSocialShortcut = useCallback((provider: SocialProvider) => {
    setSavedSocialShortcuts((previous) => ({
      ...previous,
      [provider]: loadSavedSocialShortcut(provider),
    }));
  }, []);

  const storeSocialShortcut = useCallback((
    provider: SocialProvider,
    account: Pick<SavedSocialShortcut, 'email' | 'password' | 'username'>
  ) => {
    persistSocialShortcut(provider, account);
    syncSavedSocialShortcut(provider);
  }, [syncSavedSocialShortcut]);

  const removeSocialShortcut = useCallback((provider: SocialProvider) => {
    clearSocialShortcut(provider);
    syncSavedSocialShortcut(provider);
  }, [syncSavedSocialShortcut]);

  const storeLastDeviceAccount = useCallback((
    account: Pick<SavedSocialShortcut, 'email' | 'password' | 'username'>
  ) => {
    persistLastDeviceAccount(account);
    setLastDeviceAccount(loadLastDeviceAccount());
  }, []);

  const syncRememberedEmail = useCallback((email?: string) => {
    const normalizedEmail = email?.trim();

    if (rememberMe && normalizedEmail) {
      localStorage.setItem(REMEMBERED_EMAIL_STORAGE_KEY, normalizedEmail);
      return;
    }

    localStorage.removeItem(REMEMBERED_EMAIL_STORAGE_KEY);
  }, [rememberMe]);

   const handleInputFocus = useCallback(() => {
     setInputActivityLevel(0.3);
   }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setInputActivityLevel(prev => Math.min(1, prev + 0.15));
    setIsRobotActive(true);
    if (field === 'email') {
      setResetOtpCode('');
      setResetPreviewCode(null);
      setResetCodeExpiresAt(null);
      setResetCodeSent(false);
      setResetResendCooldown(0);
    }
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  useEffect(() => {
    if (isRobotActive) {
      const timer = setTimeout(() => setIsRobotActive(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isRobotActive]);

  const validateLogin = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateRegister = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isPasswordStrongEnough(formData.password)) {
      newErrors.password = 'Use 8+ characters with uppercase, lowercase, number, and symbol';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateForgot = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const normalizedEmail = formData.email.trim();
      const response = await authApi.login({
        email: normalizedEmail,
        password: formData.password,
      });
      const user = completeAuthenticatedSession(response.data);
      storeLastDeviceAccount({
        email: normalizedEmail,
        password: formData.password,
        username: user.username,
      });
      
      syncRememberedEmail(normalizedEmail);
      
      showToast(`Welcome back, ${user.username}!`, 'success', 'top-right');
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(message, 'error', 'top-right');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const normalizedEmail = formData.email.trim();
      const normalizedUsername = formData.username.trim();
      const normalizedFirstName = formData.firstName.trim();
      const normalizedLastName = formData.lastName.trim();

      console.log('Registration payload:', {
        email: normalizedEmail,
        password: formData.password,
        username: normalizedUsername,
        firstName: normalizedFirstName || undefined,
        lastName: normalizedLastName || undefined,
        location: selectedCountry.name,
        dateOfBirth: includeBirthDate ? formatDateForApi(dateOfBirth) : undefined,
      });
      const response = await authApi.register({
        email: normalizedEmail,
        password: formData.password,
        username: normalizedUsername,
        firstName: normalizedFirstName || undefined,
        lastName: normalizedLastName || undefined,
        location: selectedCountry.name,
        dateOfBirth: includeBirthDate ? formatDateForApi(dateOfBirth) : undefined,
      });
      console.log('Registration response:', response);
      const user = completeAuthenticatedSession(response.data);
      storeLastDeviceAccount({
        email: normalizedEmail,
        password: formData.password,
        username: user.username || normalizedUsername,
      });
      syncRememberedEmail(normalizedEmail);
      showToast('Account created successfully! Let\'s set up your profile.', 'success', 'top-right');
      navigate('/profile/complete', { replace: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';

      if (typeof message === 'string' && message.toLowerCase().includes('email already exists')) {
        setFormMode('login');
        showToast('That email already has an account. Sign in instead.', 'warning', 'top-right');
        return;
      }

      showToast(message, 'error', 'top-right');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateForgot()) return;
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(formData.email.trim());
      if (response.data?.codeSent === false) {
        setResetOtpCode('');
        setResetPreviewCode(null);
        setResetCodeExpiresAt(null);
        setResetCodeSent(false);
        showToast(
          response.data?.message || 'No DevHub account was found for that email. Check the address or create an account first.',
          'warning',
          'top-right'
        );
        return;
      }
      setResetOtpCode('');
      setResetPreviewCode(response.data?.previewCode || null);
      setResetCodeExpiresAt(response.data?.expiresAt || null);
      setResetCodeSent(true);
      setResetResendCooldown(RESET_RESEND_COOLDOWN_SECONDS);
      showToast(response.data?.message || 'Recovery code sent. Check your email.', 'success', 'top-right');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to send reset email. Please try again.', 'error', 'top-right');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    if (!formData.email.trim()) {
      showToast('Enter your email first.', 'warning', 'top-right');
      return;
    }

    if (loading || resetResendCooldown > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(formData.email.trim());
      if (response.data?.codeSent === false) {
        setResetOtpCode('');
        setResetPreviewCode(null);
        setResetCodeExpiresAt(null);
        setResetCodeSent(false);
        showToast(
          response.data?.message || 'No DevHub account was found for that email. Check the address or create an account first.',
          'warning',
          'top-right'
        );
        return;
      }
      setResetOtpCode('');
      setResetPreviewCode(response.data?.previewCode || null);
      setResetCodeExpiresAt(response.data?.expiresAt || null);
      setResetCodeSent(true);
      setResetResendCooldown(RESET_RESEND_COOLDOWN_SECONDS);
      showToast(response.data?.message || 'Recovery code sent again. Use the newest code only.', 'success', 'top-right');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to resend recovery email. Please try again.', 'error', 'top-right');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCode = async () => {
    if (!validateForgot()) return;

    if (resetOtpCode.trim().length < 4) {
      showToast('Enter the recovery code sent to your email.', 'warning', 'top-right');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyResetCode(formData.email.trim(), resetOtpCode.trim());
      setResetCodeExpiresAt(response.data?.expiresAt || resetCodeExpiresAt);
      showToast(response.data?.message || 'Recovery code verified. Opening password change page...', 'success', 'top-right');
      const searchParams = new URLSearchParams({
        email: formData.email.trim(),
        token: resetOtpCode.trim(),
      });
      navigate(`/reset-password?${searchParams.toString()}`, {
        replace: false,
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to verify the recovery code. Please try again.', 'error', 'top-right');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedProviderShortcut = useCallback(async (provider: SocialProvider) => {
    const providerName = provider === 'google' ? 'Google' : 'GitHub';
    const savedShortcut = loadSavedSocialShortcut(provider);
    const shortcutAccount = savedShortcut || loadLastDeviceAccount();
    const shortcutSourceLabel = savedShortcut ? `saved ${providerName} account` : 'last account used on this device';

    setOauthLoading(provider);

    try {
      toast.loading(
        shortcutAccount
          ? `Signing in with your ${shortcutSourceLabel}...`
          : `Preparing ${providerName} quick sign-in...`,
        { id: 'oauth' }
      );

      if (shortcutAccount) {
        setFormMode('login');
        setRememberMe(true);
        setFormData((previous) => ({
          ...previous,
          email: shortcutAccount.email,
          password: shortcutAccount.password,
          username: shortcutAccount.username || previous.username,
          confirmPassword: '',
        }));

        const response = await authApi.login({
          email: shortcutAccount.email,
          password: shortcutAccount.password,
        });
        const user = completeAuthenticatedSession(response.data);

        storeLastDeviceAccount({
          email: shortcutAccount.email,
          password: shortcutAccount.password,
          username: user.username || shortcutAccount.username,
        });
        storeSocialShortcut(provider, {
          email: shortcutAccount.email,
          password: shortcutAccount.password,
          username: user.username || shortcutAccount.username,
        });
        syncRememberedEmail(shortcutAccount.email);
        showToast(
          `${providerName} loaded ${savedShortcut ? 'your saved account' : 'the last account used on this device'} and signed you in.`,
          'success',
          'top-right'
        );
        navigate(from, { replace: true });
        return user;
      }

      const normalizedEmail = formData.email.trim();
      const normalizedPassword = formData.password;
      const normalizedUsername = formData.username.trim();

      if (formMode === 'register') {
        if (!validateRegister()) {
          return;
        }

        const response = await authApi.register({
          email: normalizedEmail,
          password: normalizedPassword,
          username: normalizedUsername,
          firstName: formData.firstName.trim() || undefined,
          lastName: formData.lastName.trim() || undefined,
          location: selectedCountry.name,
          dateOfBirth: includeBirthDate ? formatDateForApi(dateOfBirth) : undefined,
        });

        const user = completeAuthenticatedSession(response.data);
        storeLastDeviceAccount({
          email: normalizedEmail,
          password: normalizedPassword,
          username: user.username || normalizedUsername,
        });
        storeSocialShortcut(provider, {
          email: normalizedEmail,
          password: normalizedPassword,
          username: normalizedUsername,
        });
        syncRememberedEmail(normalizedEmail);
        setRememberMe(true);
        showToast(
          `${providerName} saved this account on this device and signed you in.`,
          'success',
          'top-right'
        );
        navigate('/profile/complete', { replace: true });
        return user;
      }

      if (!validateLogin()) {
        return;
      }

      const response = await authApi.login({
        email: normalizedEmail,
        password: normalizedPassword,
      });
      const user = completeAuthenticatedSession(response.data);
      storeLastDeviceAccount({
        email: normalizedEmail,
        password: normalizedPassword,
        username: user.username || normalizedUsername,
      });
      storeSocialShortcut(provider, {
        email: normalizedEmail,
        password: normalizedPassword,
        username: user.username || normalizedUsername,
      });
      syncRememberedEmail(normalizedEmail);
      setRememberMe(true);
      showToast(
        `${providerName} saved this account on this device and signed you in.`,
        'success',
        'top-right'
      );
      navigate(from, { replace: true });
      return user;
    } catch (error: any) {
      if (shortcutAccount) {
        removeSocialShortcut(provider);
        setFormMode('login');
        setFormData((previous) => ({
          ...previous,
          email: shortcutAccount.email,
          password: '',
        }));
        showToast(
          `The ${providerName} shortcut on this device is out of date. Enter the current password once, then tap ${providerName} again to save it.`,
          'warning',
          'top-right'
        );
        return;
      }

      const message = error.response?.data?.message || (
        formMode === 'register'
          ? `${providerName} could not save this new account yet.`
          : `Enter your email and password first so ${providerName} can save this account on this device.`
      );
      showToast(message, 'error', 'top-right');
    } finally {
      setOauthLoading(null);
      toast.remove('oauth');
    }
  }, [
    dateOfBirth,
    formData.confirmPassword,
    formData.email,
    formData.firstName,
    formData.lastName,
    formData.password,
    formData.username,
    formMode,
    from,
    includeBirthDate,
    navigate,
    removeSocialShortcut,
    selectedCountry.name,
    showToast,
    storeLastDeviceAccount,
    storeSocialShortcut,
    validateLogin,
    validateRegister,
  ]);

  const handleGoogleLogin = () => {
    void handleSavedProviderShortcut('google');
  };

  const handleGitHubLogin = () => {
    void handleSavedProviderShortcut('github');
  };

  const getBiometricAccountEmail = useCallback((type: 'fingerprint' | 'faceId') => {
    const typedEmail = formData.email.trim();

    if (typedEmail) {
      return typedEmail;
    }

    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_STORAGE_KEY)?.trim();
    if (rememberedEmail) {
      return rememberedEmail;
    }

    return type === 'fingerprint'
      ? fingerprintService.getRegisteredEmail()
      : faceLockService.getRegisteredEmail();
  }, [formData.email]);

  const openBiometricFlow = useCallback(async (type: 'fingerprint' | 'faceId') => {
    const support = type === 'fingerprint'
      ? await fingerprintService.getSupportStatus()
      : await faceLockService.getSupportStatus()

    if (!support.supported) {
      showToast(
        support.message || 'This device cannot open a secure biometric prompt for DevHub right now.',
        'warning',
        'top-right'
      )
      return
    }

    const isRegistered = type === 'fingerprint'
      ? fingerprintService.isRegistered()
      : faceLockService.isRegistered();

    const linkedEmail = getBiometricAccountEmail(type);

    if (!isRegistered && !linkedEmail) {
      showToast('Enter your email first so DevHub can link this biometric sign-in to your account.', 'warning', 'top-right');
      return;
    }

    if (linkedEmail && !formData.email.trim()) {
      setFormData((previous) => ({ ...previous, email: linkedEmail }));
    }

    if (type === 'fingerprint') {
      setFingerprintMode(isRegistered ? 'verify' : 'register');
      setShowFingerprintModal(true);
      return;
    }

    setFaceLockMode(isRegistered ? 'verify' : 'register');
    setShowFaceLockModal(true);
  }, [formData.email, getBiometricAccountEmail, showToast]);

  const handleBiometricLogin = async (
    type: 'fingerprint' | 'faceId',
    options?: { deviceId?: string; ownerEmail?: string }
  ) => {
    const resolvedDeviceId = options?.deviceId ||
      (type === 'fingerprint'
        ? fingerprintService.getStoredFingerprint()?.deviceId
        : faceLockService.getStoredFace()?.deviceId);
    const resolvedEmail = options?.ownerEmail || getBiometricAccountEmail(type);

    if (!resolvedDeviceId || !resolvedEmail) {
      showToast('This biometric profile is not linked to an account yet. Enter your email and set it up first.', 'warning', 'top-right');
      return;
    }

    setBiometricLoading(true);
    try {
      const label = type === 'fingerprint' ? 'Fingerprint' : 'Face ID';
      toast.loading(`Authenticating with ${label}...`, { id: 'biometric' });

      const signature = type === 'fingerprint'
        ? fingerprintService.createSignature(resolvedDeviceId, resolvedEmail)
        : faceLockService.createSignature(resolvedDeviceId, resolvedEmail);

      const response = await authApi.biometricLogin(resolvedDeviceId, signature, resolvedEmail);
      const user = completeAuthenticatedSession(response.data);

      setBiometricReady((previous) => ({ ...previous, [type]: true }));
      setFormData((previous) => ({ ...previous, email: user.email || resolvedEmail }));

      syncRememberedEmail(user.email);

      showToast(`Authenticated with ${label}. Welcome back, ${user.username}!`, 'success', 'top-right');
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Biometric authentication failed', 'error', 'top-right');
    } finally {
      setBiometricLoading(false);
      toast.remove('biometric');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (formMode) {
      case 'login': handleLogin(); break;
      case 'register': handleRegister(); break;
      case 'forgot':
        if (!resetCodeSent) {
          void handleForgotPassword();
        } else {
          void handleVerifyResetCode();
        }
        break;
    }
  };

  const resetForm = (mode: 'login' | 'register' | 'forgot') => {
    setFormMode(mode);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    }));
    setIncludeBirthDate(false);
    setDateOfBirth(createDefaultBirthDate());
    setResetCodeSent(false);
    setResetOtpCode('');
    setResetPreviewCode(null);
    setResetCodeExpiresAt(null);
    setResetResendCooldown(0);
  };

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const search = countrySearch.toLowerCase();
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  const quickFeatureActions = useMemo(
    () => [
      {
        icon: '🤖',
        label: 'Tutor',
        helper: 'Open DevHub AI chat',
        onClick: () => {
          openAssistantTab('chat');
          showToast('DevHub AI is open and ready to help.', 'info', 'top-right');
        },
      },
      {
        icon: '📚',
        label: 'Interactive',
        helper: 'Browse guided tutorials',
        onClick: () => navigate('/topics'),
      },
      {
        icon: '⚡',
        label: 'Real-time',
        helper: 'Launch the live code editor',
        onClick: () => navigate('/editor'),
      },
    ],
    [navigate, openAssistantTab, showToast]
  );

  return (
    <div className="min-h-screen flex bg-[#050508] relative">
      {/* Animated 3D Background */}
      <HeroAnimation className="absolute inset-0" activityLevel={inputActivityLevel} />
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/95 via-[#050508]/80 to-[#050508]/60" />
      
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-lg text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-slow">
              Learn AI-Powered Coding
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Master programming with interactive lessons, AI assistance, and real-time feedback.
            </p>
            <p className="text-lg text-cyan-300/80 mb-8">
              {formMode === 'login' 
                ? 'Sign in to your account to continue your learning journey' 
                : formMode === 'register'
                ? 'Create a new account to start learning today'
                : 'Enter your email to reset your password'}
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
              {quickFeatureActions.map(({ icon, label, helper, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-cyan-500/15 bg-white/[0.02] px-3 py-3 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xl shadow-[0_0_18px_rgba(0,212,255,0.18)] transition duration-300 group-hover:border-cyan-300/50 group-hover:bg-cyan-400/15">
                    {icon}
                  </span>
                  <span className="font-medium text-white">{label}</span>
                  <span className="text-[11px] leading-4 text-cyan-100/70">{helper}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <HeroAnimation className="w-32 h-32" activityLevel={inputActivityLevel} />
          </div>

          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                <span className="text-white font-bold text-lg">LP</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                LearnCode AI
              </span>
            </Link>
          </div>

          <div className="bg-[#0a0a10]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 shadow-2xl shadow-cyan-500/5">
            {/* Mode Tabs - Futuristic */}
            {formMode !== 'forgot' && (
              <div className="flex mb-8 bg-[#0a0a10]/80 rounded-lg p-1 border border-cyan-500/10">
                {['login', 'register'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => resetForm(mode as 'login' | 'register')}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      formMode === mode
                        ? 'bg-gradient-to-r from-cyan-600/80 to-purple-600/80 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={handleInputFocus}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full px-4 py-3 bg-[#0a0a10]/80 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' 
                      : 'border-cyan-500/20 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                  }`}
                  placeholder="peprahviegaspadmore@gmail.com"
                  required
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Forgot Password Form */}
              {formMode === 'forgot' && (
                <>
                  {resetCodeSent ? (
                    <>
                      <OtpInput
                        value={resetOtpCode}
                        length={6}
                        onValueChange={(value) => {
                          setResetOtpCode(value);
                        }}
                        onValueComplete={(value) => {
                          setResetOtpCode(value);
                          setInputActivityLevel((prev) => Math.min(1, prev + 0.1));
                        }}
                        title="Enter Recovery Code"
                        description={
                          resetPreviewCode
                            ? `DevHub generated a local recovery code for ${formData.email}. Enter it below to verify this request.`
                            : `We sent a secure reset code to ${formData.email}. Enter it below to verify this request.`
                        }
                        hint={
                          resetPreviewCode
                            ? 'Use the preview code shown below for this local session. If you resend, only the newest code will work.'
                            : resetCodeExpiresAt
                            ? `This code expires at ${new Date(resetCodeExpiresAt).toLocaleString()}. If you resend, only the newest code from your email will work.`
                            : 'Enter the newest code from your Gmail inbox to verify the reset request.'
                        }
                        onResend={handleResendResetCode}
                        resendDisabled={loading || resetResendCooldown > 0}
                        resendLabel={
                          loading
                            ? 'Sending recovery code...'
                            : resetResendCooldown > 0
                            ? `Resend available in ${resetResendCooldown}s`
                            : 'Resend recovery code'
                        }
                        showCard={false}
                        className="rounded-2xl border border-cyan-500/15 bg-[#060910]/85 p-5 shadow-[0_22px_70px_-45px_rgba(34,211,238,0.55)]"
                      />

                      {resetPreviewCode && (
                        <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 shadow-[0_18px_50px_-35px_rgba(251,191,36,0.45)]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
                            Local Recovery Code
                          </p>
                          <p className="mt-2 leading-6 text-amber-50">
                            Email sending is not configured on this local setup yet, so use this recovery code for now.
                          </p>
                          <div className="mt-3 inline-flex rounded-xl border border-amber-300/25 bg-black/20 px-3 py-2 text-lg font-semibold tracking-[0.35em] text-amber-100">
                            {resetPreviewCode}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? 'Verifying Code...' : 'Verify Recovery Code'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Recovery Code'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => resetForm('login')}
                    className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {resetCodeSent ? 'Back to Login' : 'Back to Login'}
                  </button>
                </>
              )}

              {/* Registration Fields */}
              {formMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={`w-full px-4 py-3 bg-[#0a0a10]/80 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                        errors.username 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' 
                          : 'border-cyan-500/20 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      placeholder="Pick your unique username"
                    />
                    {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="given-name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        autoComplete="given-name"
                        autoCapitalize="words"
                        className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Peprah"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="family-name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        autoComplete="family-name"
                        autoCapitalize="words"
                        className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Padmore"
                      />
                    </div>
                  </div>

                  <div ref={dropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-left flex items-center justify-between transition-all duration-300 hover:border-cyan-500/40"
                    >
                      <span className="flex items-center gap-2">
                        <CountryFlag
                          countryName={selectedCountry.name}
                          emoji={selectedCountry.flag}
                          className="h-5 w-5 rounded-md"
                        />
                        <span className="text-white">{selectedCountry.name}</span>
                      </span>
                      <svg className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isCountryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#0a0a10]/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg shadow-xl shadow-cyan-500/10 max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-cyan-500/10">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country..."
                            autoComplete="off"
                            className="w-full px-3 py-2 bg-[#111118] border border-cyan-500/20 rounded text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-all duration-300"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-cyan-500/10 flex items-center gap-2 transition-colors duration-200"
                            >
                              <CountryFlag
                                countryName={country.name}
                                emoji={country.flag}
                                className="h-5 w-5 rounded-md"
                              />
                              <span className="text-white">{country.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-[#0a0a10]/90 to-purple-500/5 p-4 shadow-[0_18px_50px_-35px_rgba(34,211,238,0.6)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Birth Date</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIncludeBirthDate((previous) => !previous)}
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                          includeBirthDate
                            ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/30'
                            : 'bg-white/5 text-gray-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {includeBirthDate ? 'Hide' : 'Add date'}
                      </button>
                    </div>

                    {includeBirthDate && (
                      <div className="mt-4 rounded-2xl border border-cyan-500/15 bg-[#05070f]/85 p-3">
                        <DateWheelPicker
                          value={dateOfBirth}
                          onChange={setDateOfBirth}
                          size="sm"
                          variant="inverted"
                          maxYear={new Date().getFullYear()}
                          className="w-full justify-between"
                        />
                        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white drop-shadow-[0_0_14px_rgba(125,211,252,0.45)]">
                          {formatReadableBirthDate(dateOfBirth)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Password (Login & Register) */}
              {formMode !== 'forgot' && (
                <>
                  <div>
                    <PasswordInput
                      label="Password *"
                      name={formMode === 'login' ? 'devhub-login-password' : 'devhub-register-password'}
                      value={formData.password}
                      onChange={(value) => handleInputChange('password', value)}
                      onFocus={handleInputFocus}
                      error={errors.password}
                      placeholder="••••••••"
                      required
                      autoComplete={formMode === 'login' ? 'current-password' : 'new-password'}
                      showStrength={formMode === 'register'}
                      strengthTitle="DevHub password check:"
                      variant="auth-dark"
                    />
                  </div>

                  {/* Confirm Password (Register only) */}
                  {formMode === 'register' && (
                    <div>
                      <PasswordInput
                        label="Confirm Password *"
                        name="devhub-register-confirm-password"
                        value={formData.confirmPassword}
                        onChange={(value) => handleInputChange('confirmPassword', value)}
                        error={errors.confirmPassword}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        variant="auth-dark"
                      />
                    </div>
                  )}

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-cyan-500/30 bg-[#0a0a10] text-cyan-500 focus:ring-cyan-500/30 focus:ring-offset-0" 
                      />
                      <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Remember me</span>
                    </label>
                    {formMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => resetForm('forgot')}
                        className="text-cyan-400/80 hover:text-cyan-300 transition-colors duration-300"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  {/* Submit Button - Futuristic */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 hover:from-cyan-500 hover:via-purple-500 hover:to-cyan-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50 hover:shadow-cyan-500/30 hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      formMode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </>
              )}
            </form>

            {/* Biometric Buttons */}
            {formMode === 'login' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0a0a10]/80 text-gray-400">Or use biometrics</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => openBiometricFlow('fingerprint')}
                    disabled={biometricLoading}
                    className={`group flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-300 disabled:opacity-50 ${
                      biometricReady.fingerprint
                        ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-100 hover:border-emerald-400/40 hover:bg-emerald-500/10'
                        : 'border-cyan-500/20 bg-[#0a0a10]/80 text-gray-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        biometricReady.fingerprint
                          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                          : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-white">
                          {biometricLoading ? 'Working...' : 'Fingerprint'}
                        </span>
                        <span className="block text-xs text-inherit/70">
                          {biometricReady.fingerprint ? 'Registered on this device' : 'Register on this device'}
                        </span>
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => openBiometricFlow('faceId')}
                    disabled={biometricLoading}
                    className={`group flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-300 disabled:opacity-50 ${
                      biometricReady.faceId
                        ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-100 hover:border-emerald-400/40 hover:bg-emerald-500/10'
                        : 'border-cyan-500/20 bg-[#0a0a10]/80 text-gray-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        biometricReady.faceId
                          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                          : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-white">
                          {biometricLoading ? 'Working...' : 'Face ID'}
                        </span>
                        <span className="block text-xs text-inherit/70">
                          {biometricReady.faceId ? 'Registered on this device' : 'Register on this device'}
                        </span>
                      </span>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Social Login */}
            {formMode === 'login' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0a0a10]/80 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={oauthLoading !== null}
                    aria-label="Continue with Google"
                    className="group flex-1 rounded-lg border border-cyan-500/20 bg-[#0a0a10]/80 px-4 py-3 text-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(34,211,238,0.15)] disabled:translate-y-0 disabled:opacity-50"
                  >
                    {oauthLoading === 'google' ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 text-left">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/5 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
                          <svg className="h-7 w-7" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-white">
                            {savedSocialShortcuts.google
                              ? 'Google account'
                              : lastDeviceAccount
                              ? 'Last Google account'
                              : 'Google shortcut'}
                          </span>
                          {savedSocialShortcuts.google || lastDeviceAccount ? (
                            <span className="mt-1 inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                              Saved
                            </span>
                          ) : null}
                        </span>
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    disabled={oauthLoading !== null}
                    aria-label="Continue with GitHub"
                    className="group flex-1 rounded-lg border border-cyan-500/20 bg-[#0a0a10]/80 px-4 py-3 text-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(34,211,238,0.15)] disabled:translate-y-0 disabled:opacity-50"
                  >
                    {oauthLoading === 'github' ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 text-left">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/5 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
                          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-white">
                            {savedSocialShortcuts.github
                              ? 'GitHub account'
                              : lastDeviceAccount
                              ? 'Last GitHub account'
                              : 'GitHub shortcut'}
                          </span>
                          {savedSocialShortcuts.github || lastDeviceAccount ? (
                            <span className="mt-1 inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                              Saved
                            </span>
                          ) : null}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Sign up link - Futuristic */}
            {formMode === 'login' && (
              <p className="text-center text-gray-400 mt-6">
                Don't have an account?{' '}
                <button onClick={() => resetForm('register')} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300">
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fingerprint Modal */}
      <FingerprintModal
        isOpen={showFingerprintModal}
        onClose={() => setShowFingerprintModal(false)}
        mode={fingerprintMode}
        accountEmail={getBiometricAccountEmail('fingerprint') || undefined}
        onSuccess={async (verified, deviceId, ownerEmail) => {
          setShowFingerprintModal(false);
          if (verified && deviceId) {
            setBiometricReady((previous) => ({ ...previous, fingerprint: true }));
            await handleBiometricLogin('fingerprint', { deviceId, ownerEmail });
          }
        }}
      />

      {/* Face Lock Modal */}
      <FaceLockModal
        isOpen={showFaceLockModal}
        onClose={() => setShowFaceLockModal(false)}
        mode={faceLockMode}
        accountEmail={getBiometricAccountEmail('faceId') || undefined}
        onSuccess={async (verified, deviceId, ownerEmail) => {
          setShowFaceLockModal(false);
          if (verified && deviceId) {
            setBiometricReady((previous) => ({ ...previous, faceId: true }));
            await handleBiometricLogin('faceId', { deviceId, ownerEmail });
          }
        }}
      />
    </div>
  );
};

const LoginPage = memo(LoginPageComponent);
export default LoginPage;
