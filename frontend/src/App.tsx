import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
// RobotAssistant removed
import { AIAssistantProvider } from '@/contexts/AIAssistantContext'
import { DriveUploadToastViewport } from '@/components/ui/google-drive-uploader-toast'
import { ToastProvider } from '@/components/ui/toast-1'
import DigitalSerenity from '@/components/ui/digital-serenity-animated-landing-page'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TopicsPage from './pages/TopicsPage'
import { migrateGuestLearningStateToUser } from '@/lib/learning-progress'
import { useAuthStore } from '@/store'

const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'))
const AIAssistant = lazy(() => import('./components/ai-assistant/AIAssistant'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const CodeEditorPage = lazy(() => import('./pages/CodeEditorPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ProfileCompletionPage = lazy(() => import('./pages/ProfileCompletionPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const LearningDashboard = lazy(() => import('./pages/LearningDashboard'))
const TopicPage = lazy(() => import('./pages/TopicPage'))
const LearningLessonPage = lazy(() => import('./pages/LearningLessonPage'))
const TopicsDashboard = lazy(() => import('./pages/TopicsDashboard'))
const TopicsHome = lazy(() => import('./pages/TopicsHome'))
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const VideosPage = lazy(() => import('./pages/VideosPage'))
const ProgrammingNewsPage = lazy(() => import('./pages/ProgrammingNewsPage'))

// Animation presets from unified system
const pageTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const LAUNCH_FLOW_SESSION_KEY = 'devhubLaunchFlowSeen'

const getInitialLaunchStage = (): 'splash' | 'entry' | 'app' => {
  if (typeof window === 'undefined') {
    return 'splash'
  }

  return window.sessionStorage.getItem(LAUNCH_FLOW_SESSION_KEY) === 'true' ? 'app' : 'splash'
}

const markLaunchFlowSeen = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(LAUNCH_FLOW_SESSION_KEY, 'true')
  }
}

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

const SessionSyncBridge = () => {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user?.id) {
      return
    }

    let isCancelled = false

    const syncGuestState = async () => {
      const { courseData } = await import('@/data/courseData')

      if (isCancelled) {
        return
      }

      migrateGuestLearningStateToUser({
        userId: user.id,
        courses: courseData.map((course) => ({
          id: course.id,
          lessons: course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
          })),
        })),
      })
    }

    void syncGuestState()

    return () => {
      isCancelled = true
    }
  }, [user?.id])

  return null
}

// Route wrapper with animations
const RouteWrapper = ({ children, path }: { children: React.ReactNode; path: string }) => (
  <motion.div
    key={path}
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </motion.div>
)

const RouteLoadingFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="rounded-[1.6rem] border border-sky-100 bg-white/90 px-6 py-5 text-sm font-medium text-slate-600 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.38)] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
      Loading the next DevHub view...
    </div>
  </div>
)

const RouteSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
)

function App() {
  const [launchStage, setLaunchStage] = useState<'splash' | 'entry' | 'app'>(() => getInitialLaunchStage())
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (launchStage !== 'splash') {
      return
    }

    markLaunchFlowSeen()
    const timer = setTimeout(() => setLaunchStage('entry'), 4000)
    return () => clearTimeout(timer)
  }, [launchStage])

  const completeLaunchFlow = (destination?: string) => {
    markLaunchFlowSeen()
    setLaunchStage('app')

    if (destination) {
      navigate(destination)
    }
  }

  if (launchStage === 'splash') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <img
          src="/devhubsymbolmain.png"
          alt="DevHub splash"
          className="h-full w-full object-contain animate-splash"
          style={{ maxHeight: '100vh', maxWidth: '100vw' }}
        />
      </div>
    )
  }

  if (launchStage === 'entry') {
    return (
      <DigitalSerenity
        fullScreen
        eyebrow="DevHub entry point"
        headline="Begin with calm focus."
        supportingLine="Choose your path and enter DevHub."
        subtitle="This screen now lives exactly after your splash image finishes loading. It acts as the app entry point before the rest of DevHub opens."
        actions={[
          {
            label: 'Enter DevHub',
            onClick: () => completeLaunchFlow(),
            variant: 'default',
          },
          {
            label: 'Start Learning',
            onClick: () => completeLaunchFlow('/topics'),
            variant: 'outline',
          },
          {
            label: 'Open Editor',
            onClick: () => completeLaunchFlow('/editor'),
            variant: 'outline',
          },
        ]}
        metrics={[
          { value: 'Learn', label: 'Guided tutorials' },
          { value: 'Build', label: 'Practice in editor' },
          { value: 'Design', label: 'Create with confidence' },
        ]}
      />
    )
  }

  return (
    <>
     <ScrollToTop />
     <ToastProvider>
     <AIAssistantProvider>
       <SessionSyncBridge />
       <AnimatePresence mode="wait" initial={false}>
         <Routes location={location} key={location.pathname}>
           <Route path="/login" element={<RouteWrapper path="/login"><LoginPage /></RouteWrapper>} />
           <Route path="/register" element={<RouteSuspense><RouteWrapper path="/register"><RegisterPage /></RouteWrapper></RouteSuspense>} />
           <Route path="/reset-password" element={<RouteSuspense><RouteWrapper path="/reset-password"><ResetPasswordPage /></RouteWrapper></RouteSuspense>} />
           <Route path="/profile/complete" element={<RouteSuspense><RouteWrapper path="/profile/complete"><ProfileCompletionPage /></RouteWrapper></RouteSuspense>} />
           
           <Route element={<Layout />}>
             <Route path="/" element={<RouteWrapper path="/"><HomePage /></RouteWrapper>} />
             <Route path="/courses" element={<RouteSuspense><RouteWrapper path="/courses"><CoursesPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/courses/:courseId" element={<RouteSuspense><RouteWrapper path="/courses/:courseId"><CourseDetailPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/courses/:courseId/lessons/:lessonId" element={<RouteSuspense><RouteWrapper path="/courses/:courseId/lessons/:lessonId"><LessonPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/editor" element={<RouteSuspense><RouteWrapper path="/editor"><CodeEditorPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/editor/:exerciseId" element={<RouteSuspense><RouteWrapper path="/editor/:exerciseId"><CodeEditorPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/dashboard" element={<RouteSuspense><RouteWrapper path="/dashboard"><DashboardPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/help-center" element={<RouteSuspense><RouteWrapper path="/help-center"><HelpCenterPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/feedback" element={<RouteSuspense><RouteWrapper path="/feedback"><FeedbackPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/testimonials" element={<RouteSuspense><RouteWrapper path="/testimonials"><TestimonialsPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/videos" element={<RouteSuspense><RouteWrapper path="/videos"><VideosPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/news" element={<RouteSuspense><RouteWrapper path="/news"><ProgrammingNewsPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/profile" element={<RouteSuspense><RouteWrapper path="/profile"><UserProfilePage /></RouteWrapper></RouteSuspense>} />
             <Route path="/u/:username" element={<RouteSuspense><RouteWrapper path="/u/:username"><UserProfilePage /></RouteWrapper></RouteSuspense>} />
             <Route path="/quiz" element={<RouteSuspense><RouteWrapper path="/quiz"><QuizPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/quiz/:quizId" element={<RouteSuspense><RouteWrapper path="/quiz/:quizId"><QuizPage /></RouteWrapper></RouteSuspense>} />
             
             {/* Learning Content System */}
             <Route path="/learn" element={<RouteSuspense><RouteWrapper path="/learn"><LearningDashboard /></RouteWrapper></RouteSuspense>} />
             <Route path="/learn/:languageSlug" element={<RouteSuspense><RouteWrapper path="/learn/:languageSlug"><TopicPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/learn/:languageSlug/:topicSlug" element={<RouteSuspense><RouteWrapper path="/learn/:languageSlug/:topicSlug"><TopicPage /></RouteWrapper></RouteSuspense>} />
             <Route path="/learn/:languageSlug/:topicSlug/:lessonSlug" element={<RouteSuspense><RouteWrapper path="/learn/:languageSlug/:topicSlug/:lessonSlug"><LearningLessonPage /></RouteWrapper></RouteSuspense>} />
             
             {/* Topics System with Sidebar Navigation */}
             <Route path="/topics" element={<TopicsPage />}>
               <Route index element={<RouteSuspense><TopicsDashboard /></RouteSuspense>} />
               <Route path=":language" element={<RouteSuspense><TopicsHome /></RouteSuspense>} />
               <Route path=":language/:slug" element={<RouteSuspense><TopicPage /></RouteSuspense>} />
             </Route>
             
             <Route path="*" element={<RouteWrapper path="*"><HomePage /></RouteWrapper>} />
           </Route>
         </Routes>
       </AnimatePresence>
       
       <Toaster 
         position="top-right"
         toastOptions={{
           duration: 4000,
           style: {
             background: '#363636',
             color: '#fff',
           },
         }}
       />
       <DriveUploadToastViewport />
       <Suspense fallback={null}>
         <AIAssistant />
       </Suspense>
     </AIAssistantProvider>
     </ToastProvider>
   </>
 )
}

export default App
