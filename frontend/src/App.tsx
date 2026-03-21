import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
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

function App() {
  const [showSplash, setShowSplash] = useState(true)

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
      <RobotAssistant />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/editor" element={<CodeEditorPage />} />
          <Route path="/editor/:exerciseId" element={<CodeEditorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
      
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
