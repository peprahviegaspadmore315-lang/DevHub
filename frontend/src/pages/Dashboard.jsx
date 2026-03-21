import { useState } from 'react'

const Dashboard = () => {
  const [stats] = useState({
    enrolled: 5,
    completed: 2,
    xp: 530,
    streak: 3,
  })

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-sm">Courses Enrolled</p>
        <p className="text-2xl font-bold">{stats.enrolled}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-sm">Completed</p>
        <p className="text-2xl font-bold">{stats.completed}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-sm">Total XP</p>
        <p className="text-2xl font-bold">{stats.xp}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-sm">Streak (days)</p>
        <p className="text-2xl font-bold">{stats.streak}</p>
      </div>
    </div>
  )
}

export default Dashboard
