import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import RobotAssistant from './components/RobotAssistant.tsx'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LessonPage from './pages/LessonPage'
import CodeEditorPage from './pages/CodeEditorPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserProfilePage from './pages/UserProfilePage'

// Page transition animation settings
const pageTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

// Fade + slide variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

// Route wrapper with animations
const RouteWrapper = ({ children, path }: { children: React.ReactNode; path: string }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
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
    </AnimatePresence>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
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

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RobotAssistant />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={
            <RouteWrapper path="/login">
              <LoginPage />
            </RouteWrapper>
          } />
          <Route path="/register" element={
            <RouteWrapper path="/register">
              <RegisterPage />
            </RouteWrapper>
          } />
          
          <Route element={<Layout />}>
            <Route path="/" element={
              <RouteWrapper path="/">
                <HomePage />
              </RouteWrapper>
            } />
            <Route path="/courses" element={
              <RouteWrapper path="/courses">
                <CoursesPage />
              </RouteWrapper>
            } />
            <Route path="/courses/:courseId" element={
              <RouteWrapper path="/courses/:courseId">
                <CourseDetailPage />
              </RouteWrapper>
            } />
            <Route path="/courses/:courseId/lessons/:lessonId" element={
              <RouteWrapper path="/courses/:courseId/lessons/:lessonId">
                <LessonPage />
              </RouteWrapper>
            } />
            <Route path="/editor" element={
              <RouteWrapper path="/editor">
                <CodeEditorPage />
              </RouteWrapper>
            } />
            <Route path="/editor/:exerciseId" element={
              <RouteWrapper path="/editor/:exerciseId">
                <CodeEditorPage />
              </RouteWrapper>
            } />
            <Route path="/dashboard" element={
              <RouteWrapper path="/dashboard">
                <DashboardPage />
              </RouteWrapper>
            } />
            <Route path="/profile" element={
              <RouteWrapper path="/profile">
                <UserProfilePage />
              </RouteWrapper>
            } />
            <Route path="/quiz" element={
              <RouteWrapper path="/quiz">
                <QuizPage />
              </RouteWrapper>
            } />
            <Route path="*" element={
              <RouteWrapper path="*">
                <HomePage />
              </RouteWrapper>
            } />
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
    </BrowserRouter>
  )
}

export default App
