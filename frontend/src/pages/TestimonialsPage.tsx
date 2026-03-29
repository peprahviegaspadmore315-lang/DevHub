import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MessageSquareQuote, Sparkles, Users } from 'lucide-react'

import CircularTestimonials from '@/components/ui/circular-testimonials'
import { Button } from '@/components/ui/button'
import { devhubTestimonials } from '@/data/devhubTestimonials'

export default function TestimonialsPage() {
  const handleJumpToProfiles = () => {
    document.getElementById('featured-profiles')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#eef6ff_35%,_#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#06111f_0%,#0d1630_48%,#132654_100%)] p-6 text-white shadow-[0_35px_110px_-55px_rgba(14,165,233,0.5)] md:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-100">
                <MessageSquareQuote className="h-3.5 w-3.5" />
                DevHub testimonies
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                See how DevHub learners describe the experience.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/90 md:text-base">
                This page replaces the old destination behind the Users card. It now highlights learner testimonies,
                public-facing profile details, and the email identities attached to those featured voices.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
              <button
                type="button"
                onClick={handleJumpToProfiles}
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-left backdrop-blur-sm transition hover:border-sky-200/40 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-sky-100">
                  <Users className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold text-white">{devhubTestimonials.length}</p>
                <p className="mt-1 text-sm text-sky-100/85">Featured learner profiles</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/90 transition group-hover:text-white">
                  Open profiles
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
              <Link
                to="/topics"
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:border-sky-200/40 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-sky-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold text-white">1 Hub</p>
                <p className="mt-1 text-sm text-sky-100/85">Tutorials, AI, quizzes, and practice in one place</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/90 transition group-hover:text-white">
                  Explore tutorials
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <CircularTestimonials
          testimonials={devhubTestimonials}
          autoplay
          colors={{
            name: '#06111f',
            designation: '#475569',
            testimony: '#172033',
            arrowBackground: '#0f172a',
            arrowForeground: '#f8fafc',
            arrowHoverBackground: '#0284c7',
          }}
          fontSizes={{
            name: '2rem',
            designation: '1rem',
            quote: '1.05rem',
          }}
        />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div
            id="featured-profiles"
            className="rounded-[2rem] border border-sky-100 bg-white/92 p-6 shadow-[0_25px_80px_-40px_rgba(14,165,233,0.28)] backdrop-blur-sm md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Featured profiles
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Learner profiles behind the featured voices.
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {devhubTestimonials.map((testimonial) => (
                <div
                  key={testimonial.email}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50/85 p-4 transition hover:border-sky-200 hover:bg-sky-50/70"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-950">{testimonial.name}</h3>
                      <p className="text-sm text-slate-500">{testimonial.designation}</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-sky-600" />
                        {testimonial.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.35rem] border border-sky-100 bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                      Profile focus
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">{testimonial.profileTag}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{testimonial.profileSummary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_32px_90px_-52px_rgba(15,23,42,0.94)] md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                Why this page exists
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                The Users card now opens social proof instead of another auth detour.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Instead of sending people back to account creation, this route now gives them a stronger reason to trust
                the product: learner testimonies, profile identity, and clear signals about how DevHub helps people study.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
                  DevHub fit
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  The section uses the same rounded surfaces, sky gradients, and dashboard-style presentation already used
                  across the rest of the app so it feels native instead of bolted on.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white/92 p-6 shadow-[0_22px_70px_-42px_rgba(14,165,233,0.24)] md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                <Mail className="h-3.5 w-3.5" />
                Add your own voice
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                Want your own testimony featured later?
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Use the feedback channel to share what helped, what hindered you, and what should improve. That gives you
                a clean path to keep shaping DevHub from inside the product.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-2xl bg-sky-600 text-white hover:bg-sky-500">
                  <Link to="/feedback">
                    Send feedback
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <Link to="/">
                    Back home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
