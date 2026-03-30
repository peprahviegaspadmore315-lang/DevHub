import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  LifeBuoy,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Wrench,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { feedbackApi } from '@/services/api'
import { useAuthStore } from '@/store'

type FeedbackCategory = 'Bug report' | 'Improvement idea' | 'Performance issue' | 'General feedback'

const categoryOptions: FeedbackCategory[] = [
  'Bug report',
  'Improvement idea',
  'Performance issue',
  'General feedback',
]

const helperCards = [
  {
    title: 'Tell DevHub what blocked you',
    description: 'Describe where the app felt confusing, broken, slow, or hard to finish.',
    icon: TriangleAlert,
    category: 'Bug report' as FeedbackCategory,
    actionLabel: 'Open blocker field',
    surface:
      'from-rose-500/20 via-rose-400/10 to-transparent border-rose-200/20 hover:border-rose-200/40 hover:shadow-[0_24px_60px_-34px_rgba(244,63,94,0.55)]',
    iconSurface: 'bg-rose-500/15 text-rose-100',
    target: 'blockers' as const,
  },
  {
    title: 'Suggest what should improve',
    description: 'Share the polish, feature, or UI change that would make DevHub better for you.',
    icon: Wrench,
    category: 'Improvement idea' as FeedbackCategory,
    actionLabel: 'Open improvement field',
    surface:
      'from-amber-400/20 via-orange-300/10 to-transparent border-amber-200/20 hover:border-amber-200/40 hover:shadow-[0_24px_60px_-34px_rgba(251,191,36,0.45)]',
    iconSurface: 'bg-amber-400/15 text-amber-50',
    target: 'improvements' as const,
  },
  {
    title: 'Send it straight to the inbox',
    description: 'Your signed-in account details are attached automatically so the feedback is easier to act on.',
    icon: Mail,
    category: 'General feedback' as FeedbackCategory,
    actionLabel: 'Jump to send step',
    surface:
      'from-sky-400/20 via-cyan-300/10 to-transparent border-sky-200/20 hover:border-sky-200/40 hover:shadow-[0_24px_60px_-34px_rgba(14,165,233,0.45)]',
    iconSurface: 'bg-sky-400/15 text-sky-50',
    target: 'submit' as const,
  },
]

export default function FeedbackPage() {
  const user = useAuthStore((state) => state.user)
  const [category, setCategory] = useState<FeedbackCategory>('Bug report')
  const [summary, setSummary] = useState('')
  const [blockers, setBlockers] = useState('')
  const [improvements, setImprovements] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastSentAt, setLastSentAt] = useState<string | null>(null)
  const [activeHelperCard, setActiveHelperCard] = useState<(typeof helperCards)[number]['target'] | null>(null)
  const summaryInputRef = useRef<HTMLInputElement | null>(null)
  const blockersInputRef = useRef<HTMLTextAreaElement | null>(null)
  const improvementsInputRef = useRef<HTMLTextAreaElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const browserInfo = useMemo(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return [
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Language: ${navigator.language}`,
      `Platform: ${navigator.platform || 'Unknown'}`,
      `Viewport: ${window.innerWidth}x${window.innerHeight}`,
    ].join(' | ')
  }, [])

  const resetForm = () => {
    setCategory('Bug report')
    setSummary('')
    setBlockers('')
    setImprovements('')
    setPageUrl('')
    setActiveHelperCard(null)
  }

  const populatePageContext = () => {
    if (typeof window === 'undefined') {
      return
    }

    setPageUrl((current) => current || window.location.pathname)
  }

  const focusField = (element: HTMLElement | null) => {
    if (!element) {
      return
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => {
      element.focus()
    }, 180)
  }

  const handleHelperCardClick = (card: (typeof helperCards)[number]) => {
    setActiveHelperCard(card.target)
    setCategory(card.category)
    populatePageContext()

    if (card.target === 'blockers') {
      setSummary((current) => current || 'Something in DevHub blocked me')
      focusField(blockersInputRef.current)
      return
    }

    if (card.target === 'improvements') {
      setSummary((current) => current || 'I have an improvement idea for DevHub')
      focusField(improvementsInputRef.current)
      return
    }

    setSummary((current) => current || 'Feedback for the DevHub team')
    focusField(summaryInputRef.current)

    window.setTimeout(() => {
      submitButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 260)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!summary.trim()) {
      toast.error('Add a short summary first so DevHub knows what this feedback is about.')
      return
    }

    if (!blockers.trim() && !improvements.trim()) {
      toast.error('Describe what blocked you or what DevHub should improve before sending feedback.')
      return
    }

    setLoading(true)

    try {
      const response = await feedbackApi.submit({
        category,
        summary: summary.trim(),
        blockers: blockers.trim(),
        improvements: improvements.trim(),
        pageUrl: pageUrl.trim(),
        browserInfo,
      })

      toast.success(response.data.message || 'Feedback sent to the DevHub inbox.')
      setLastSentAt(new Date().toLocaleString())
      resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'DevHub could not send your feedback right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_36%,_#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_32%),linear-gradient(135deg,#06111f_0%,#0a1730_50%,#10214a_100%)] p-6 text-white shadow-[0_35px_110px_-55px_rgba(14,165,233,0.55)] md:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-100">
                <MessageSquare className="h-3.5 w-3.5" />
                DevHub feedback channel
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Send what hindered you and what DevHub should improve.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/90 md:text-base">
                This page turns user feedback into a real message for the DevHub inbox so blockers, confusing flows,
                bugs, and improvement ideas can be fixed faster.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {helperCards.map((card) => {
                const Icon = card.icon
                const isActive = activeHelperCard === card.target

                return (
                  <button
                    type="button"
                    key={card.title}
                    onClick={() => handleHelperCardClick(card)}
                    className={cn(
                      'group relative overflow-hidden rounded-[1.6rem] border bg-white/10 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1',
                      `bg-gradient-to-br ${card.surface}`,
                      isActive && 'border-white/50 bg-white/16 shadow-[0_26px_70px_-36px_rgba(255,255,255,0.32)]'
                    )}
                  >
                    <div
                      className={cn(
                        'inline-flex rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105',
                        card.iconSurface
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-white">{card.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-sky-100/85">{card.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75 transition group-hover:text-white">
                      {card.actionLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-sky-100 bg-white/95 p-6 shadow-[0_26px_80px_-42px_rgba(14,165,233,0.3)] backdrop-blur-sm md:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Feedback form
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Tell DevHub exactly what needs attention.
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                <ShieldCheck className="h-4 w-4" />
                Sent from your signed-in account
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Signed-in DevHub account</label>
                <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700">
                  {user?.email || 'Sign in to attach your account email'}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">Short summary</label>
              <input
                ref={summaryInputRef}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Example: Fingerprint sign-in failed after registering on my laptop"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                maxLength={160}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">What hindered you?</label>
              <textarea
                ref={blockersInputRef}
                value={blockers}
                onChange={(event) => setBlockers(event.target.value)}
                placeholder="Describe the blocker, bug, broken step, confusing area, or slow part."
                className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">What should DevHub improve?</label>
              <textarea
                ref={improvementsInputRef}
                value={improvements}
                onChange={(event) => setImprovements(event.target.value)}
                placeholder="Share the fix, polish, feature, or change you would like to see."
                className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">Page or area affected</label>
              <input
                value={pageUrl}
                onChange={(event) => setPageUrl(event.target.value)}
                placeholder="Example: /editor or HTML Tutorial page"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-28px_rgba(14,165,233,0.75)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending feedback...' : 'Send to DevHub inbox'}
              </button>

              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <Link to="/help-center">
                  Back to Help Center
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_32px_90px_-52px_rgba(15,23,42,0.95)] md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                What gets emailed
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                Your message lands in the DevHub inbox with useful context.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  DevHub attaches your account email, username, category, summary, blocker details,
                  improvement ideas, and browser context so the issue is easier to reproduce and fix.
                </p>
                <p>
                  Use this when the app feels broken, confusing, too slow, or missing something important.
                </p>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Account currently sending feedback
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {user?.firstName || user?.username || 'DevHub user'}
                </p>
                <p className="mt-1 text-sm text-slate-300">{user?.email || 'Sign in to attach your account email'}</p>
              </div>

              {lastSentAt ? (
                <div className="mt-4 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                    Last sent
                  </p>
                  <p className="mt-2 text-sm text-emerald-50">
                    Feedback was delivered to the DevHub inbox at {lastSentAt}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-[0_18px_60px_-42px_rgba(14,165,233,0.3)] md:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                    Useful examples
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    High-signal feedback is fastest to fix.
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Bug example</p>
                  <p className="mt-1">“After I resend a recovery code, the old one still looks active on screen.”</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Improvement example</p>
                  <p className="mt-1">“The quiz review should highlight the exact lesson topic I missed.”</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Performance example</p>
                  <p className="mt-1">“The editor takes too long to run Python the first time after opening the page.”</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
