import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { DateWheelPicker } from '@/components/ui/date-wheel-picker'
import PasswordInput, { isPasswordStrongEnough } from '@/components/ui/password-input-1'
import {
  CalendarDays,
  Globe2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CountryFlag } from '@/components/ui/country-flag'
import { useToast } from '@/components/ui/toast-1'
import { countryOptions } from '@/constants/countries'
import { completeAuthenticatedSession } from '@/lib/auth-session'

const createDefaultBirthDate = () => new Date(2000, 0, 1)
const REMEMBERED_EMAIL_STORAGE_KEY = 'rememberedEmail'

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [includeBirthDate, setIncludeBirthDate] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<Date>(() => createDefaultBirthDate())
  const selectedCountry = countryOptions.find(
    (country) => country.name === formData.location
  )

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_STORAGE_KEY)
    if (savedEmail) {
      setFormData((previous) => ({
        ...previous,
        email: savedEmail,
      }))
      setRememberMe(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      showToast('Please accept the Terms of Service', 'warning', 'top-right')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error', 'top-right')
      return
    }

    if (!isPasswordStrongEnough(formData.password)) {
      showToast('Use 8+ characters with uppercase, lowercase, number, and symbol', 'warning', 'top-right')
      return
    }

    setLoading(true)

    try {
      const normalizedEmail = formData.email.trim()
      const response = await authApi.register({
        username: formData.username,
        email: normalizedEmail,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location || undefined,
        dateOfBirth: includeBirthDate ? formatDateForApi(dateOfBirth) : undefined,
      })
      
      completeAuthenticatedSession(response.data)
      if (rememberMe) localStorage.setItem(REMEMBERED_EMAIL_STORAGE_KEY, normalizedEmail)
      else localStorage.removeItem(REMEMBERED_EMAIL_STORAGE_KEY)
      showToast('Account created successfully!', 'success', 'top-right')
      navigate('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'

      if (typeof message === 'string' && message.toLowerCase().includes('email already exists')) {
        if (rememberMe) localStorage.setItem(REMEMBERED_EMAIL_STORAGE_KEY, formData.email.trim())
        else localStorage.removeItem(REMEMBERED_EMAIL_STORAGE_KEY)
        showToast('That email already has an account. Sign in instead.', 'warning', 'top-right')
        navigate('/login', {
          replace: true,
          state: {
            presetEmail: formData.email,
            presetMode: 'login',
          },
        })
        return
      }

      showToast(message, 'error', 'top-right')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">LP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LearnCode</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Country
              </label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    location: value,
                  })
                }
              >
                <SelectTrigger
                  icon={Globe2}
                  startAdornment={
                    selectedCountry ? (
                      <CountryFlag
                        countryName={selectedCountry.name}
                        emoji={selectedCountry.flag}
                        className="h-4 w-4"
                      />
                    ) : undefined
                  }
                  className="h-11 border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                >
                  {selectedCountry ? (
                    <span className="block truncate">{selectedCountry.name}</span>
                  ) : (
                    <SelectValue placeholder="Select your country" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.name}
                      startAdornment={
                        <CountryFlag
                          countryName={country.name}
                          emoji={country.flag}
                          className="h-4 w-4"
                        />
                      }
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-gray-500">
                Optional. Choose your country to personalize your profile from the start.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Birth Date</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIncludeBirthDate((previous) => !previous)}
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    includeBirthDate
                      ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
                      : 'bg-white text-gray-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {includeBirthDate ? 'Hide' : 'Add date'}
                </button>
              </div>

              {includeBirthDate ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                  <DateWheelPicker
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                    size="sm"
                    maxYear={new Date().getFullYear()}
                    className="w-full justify-between"
                  />
                  <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                    {dateOfBirth.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-xs text-gray-500">
                  You can leave this off for now and still finish registration.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="johndoe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <PasswordInput
                label="Password *"
                value={formData.password}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    password: value,
                  })
                }
                placeholder="••••••••"
                required
                autoComplete="new-password"
                showStrength
                strengthTitle="Your DevHub password should include:"
              />
            </div>

            <div>
              <PasswordInput
                label="Confirm Password *"
                value={formData.confirmPassword}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    confirmPassword: value,
                  })
                }
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 cursor-pointer"
                required
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </a>
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
