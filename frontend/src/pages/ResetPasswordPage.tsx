import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import PasswordInput, { isPasswordStrongEnough } from '@/components/ui/password-input-1'
import { authApi } from '@/services/api'
import { useToast } from '@/components/ui/toast-1'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const token = searchParams.get('token')?.trim() || ''
  const email = searchParams.get('email')?.trim() || ''
  const hasToken = token.length > 0

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const helperEmail = useMemo(() => {
    if (!email) {
      return 'Your recovery code has already been verified. Choose a new password for your DevHub account.'
    }

    return `Your recovery code for ${email} has been verified. Choose a new password now.`
  }, [email])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!hasToken) {
      showToast('This password-change page is missing its verified recovery code. Request a new one.', 'error', 'top-right')
      return
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error', 'top-right')
      return
    }

    if (!isPasswordStrongEnough(password)) {
      showToast('Use 8+ characters with uppercase, lowercase, number, and symbol.', 'warning', 'top-right')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(email, token, password)
      showToast('Password updated. You can sign in now.', 'success', 'top-right')
      navigate('/login', {
        replace: true,
        state: {
          presetEmail: email || undefined,
          presetMode: 'login',
        },
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Recovery code is invalid or has expired.'
      showToast(message, 'error', 'top-right')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#0a0a10]/90 p-8 shadow-[0_30px_90px_-45px_rgba(34,211,238,0.45)] backdrop-blur-xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30">
              <span className="text-sm font-bold">DH</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Reset Password</p>
              <p className="text-sm text-cyan-200/80">DevHub account recovery</p>
            </div>
          </Link>
        </div>

        {!hasToken ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            This password-change page is incomplete. Go back and verify a new recovery code first.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-white">Change your password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">{helperEmail}</p>
          </div>

          <PasswordInput
            label="New Password *"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            showStrength
            strengthTitle="DevHub password check:"
            variant="auth-dark"
            autoComplete="new-password"
            required
          />

          <PasswordInput
            label="Confirm Password *"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            variant="auth-dark"
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={loading || !hasToken}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="text-cyan-300 transition-colors hover:text-cyan-200">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
