import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Code2,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import ScrollMorphHero, {
  defaultHelpCenterCards,
  type HelpCenterHeroCard,
} from '@/components/ui/scroll-morph-hero'
import { useAIAssistant } from '@/contexts/AIAssistantContext'

const quickActions = [
  {
    title: 'Open AI chat',
    description: 'Ask broad questions, get study help, or unblock yourself fast.',
    icon: Bot,
    actionKey: 'chat',
  },
  {
    title: 'Explain code',
    description: 'Paste a snippet and let DevHub break it down clearly.',
    icon: Code2,
    actionKey: 'explain',
  },
  {
    title: 'Start a quiz',
    description: 'Turn the lesson you are studying into revision questions.',
    icon: BrainCircuit,
    actionKey: 'quiz',
  },
  {
    title: 'Use reading mode',
    description: 'Listen to explanations or lesson text while you follow along.',
    icon: Headphones,
    actionKey: 'reading',
  },
]

const routeActions = [
  {
    title: 'Browse tutorials',
    description: 'Return to the topic hub and continue guided learning.',
    icon: BookOpen,
    href: '/topics',
    cta: 'Open tutorials',
  },
  {
    title: 'Open code editor',
    description: 'Practice what you learned in DevHub’s editor.',
    icon: Code2,
    href: '/editor',
    cta: 'Open editor',
  },
  {
    title: 'Visit dashboard',
    description: 'Check progress, streaks, and the next best step.',
    icon: LayoutDashboard,
    href: '/dashboard',
    cta: 'Go to dashboard',
  },
]

export default function HelpCenterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { openAssistantTab } = useAIAssistant()

  const openHelpTool = (tool: string) => {
    if (tool === 'chat' || tool === 'explain' || tool === 'quiz' || tool === 'reading') {
      openAssistantTab(tool)
    }
  }

  const handleCardSelect = (card: HelpCenterHeroCard) => {
    const tool = card.href.match(/tool=([^&]+)/)?.[1]

    if (tool) {
      openHelpTool(tool)
      return
    }

    navigate(card.href)
  }

  const requestedTool = searchParams.get('tool')

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7fbff_0%,_#eef7ff_38%,_#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ScrollMorphHero
          cards={defaultHelpCenterCards}
          onPrimaryAction={() => openHelpTool('chat')}
          onSecondaryAction={() => navigate('/topics')}
          onTertiaryAction={() => navigate('/editor')}
          onCardSelect={handleCardSelect}
        />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-[0_26px_80px_-42px_rgba(14,165,233,0.35)] backdrop-blur-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  DevHub quick help
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Pick the support lane you need right now.
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {quickActions.map((item) => {
                const Icon = item.icon
                const active = requestedTool === item.actionKey

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => openHelpTool(item.actionKey)}
                    className={`rounded-[1.6rem] border p-5 text-left transition ${
                      active
                        ? 'border-sky-300 bg-sky-50 shadow-[0_18px_36px_-28px_rgba(14,165,233,0.55)]'
                        : 'border-slate-200 bg-slate-50/80 hover:border-sky-200 hover:bg-sky-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-slate-400" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_32px_90px_-50px_rgba(15,23,42,0.92)] md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5" />
              What changed
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Help Center now opens a real DevHub support space.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This page replaces the old Help Center behavior that dropped you back into tutorial
              content. From here, users can open AI chat, explain code, start quizzes, switch to
              reading mode, or jump straight into tutorials, courses, the dashboard, and the
              editor.
            </p>

            <div className="mt-6 space-y-3">
              {routeActions.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link to={item.href}>{item.cta}</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
