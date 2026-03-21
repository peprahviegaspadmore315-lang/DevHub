import { useState } from 'react'

const Editor = () => {
  const [code, setCode] = useState('// Start coding here...')

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-semibold mb-2">Code Editor</h1>
        <p className="text-gray-500 mb-4">Use this editor to practice code during tutorials.</p>
        <textarea
          className="w-full h-64 p-3 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="mt-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md">Run Code</button>
        </div>
      </div>
    </div>
  )
}

export default Editor
