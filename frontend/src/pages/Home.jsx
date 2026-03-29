import { Link } from 'react-router-dom'
import DevHubWordmark from '@/components/ui/devhub-wordmark'

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="bg-white rounded-lg shadow p-8">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to <DevHubWordmark />
        </h1>
        <p className="text-gray-600 text-lg">Your programming learning platform with interactive tutorials and hands-on exercises.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/courses" className="px-5 py-2 bg-primary-600 text-white rounded-md">Browse Courses</Link>
          <Link to="/dashboard" className="px-5 py-2 border border-primary-600 text-primary-600 rounded-md">Go to Dashboard</Link>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <article className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Track Progress</h3>
          <p className="text-gray-500 text-sm">Daily streaks, XP, and completed lessons.</p>
        </article>
        <article className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Learn by Doing</h3>
          <p className="text-gray-500 text-sm">Code editor and challenge tasks in every tutorial.</p>
        </article>
        <article className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Earn Certificates</h3>
          <p className="text-gray-500 text-sm">Complete quizzes to get badges and certificates.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
