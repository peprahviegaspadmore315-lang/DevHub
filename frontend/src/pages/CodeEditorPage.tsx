import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { codeExecutionApi, exercisesApi } from '@/services/api'
import type { Exercise, CodeExecutionResponse } from '@/types'

const LANGUAGES = [
  { id: 'html', name: 'HTML', extension: 'html' },
  { id: 'css', name: 'CSS', extension: 'css' },
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'sql', name: 'SQL', extension: 'sql' },
]

type CommandMenuItemProps = {
  icon: string
  label: string
  shortcut: string
  onClick: () => void
}

const CommandMenuItem = ({ icon, label, shortcut, onClick }: CommandMenuItemProps) => (
  <button
    onClick={onClick}
    className="w-full px-3 py-2 flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-slate-800"
  >
    <span className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
        {icon}
      </span>
      <span>{label}</span>
    </span>
    <span className="text-xs text-slate-500 dark:text-slate-400">{shortcut}</span>
  </button>
)

const getDefaultCode = (lang: string) => {
  switch (lang) {
    case 'html':
      return `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Welcome to my webpage.</p>
</body>
</html>`
    case 'css':
      return `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
}`
    case 'javascript':
      return `// JavaScript Tutorial
console.log("Hello, World!");

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
    case 'python':
      return `# Python Tutorial
print("Hello, World!")

numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)`
    case 'java':
      return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    case 'sql':
      return `-- SQL Tutorial
SELECT * FROM users;`
    default:
      return ''
  }
}

const CodeEditorPage = () => {
  const { exerciseId } = useParams()
  const [searchParams] = useSearchParams()

  const [language, setLanguage] = useState('html')
  const [code, setCode] = useState(getDefaultCode('html'))
  const [output, setOutput] = useState('')
  const [previewHtml, setPreviewHtml] = useState(getDefaultCode('html'))
  const [initializedFromQuery, setInitializedFromQuery] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [savedSnippets, setSavedSnippets] = useState<Array<{id:string;name:string;language:string;code:string;createdAt:number;}>>([])
  const [resultSize, setResultSize] = useState<{width:number;height:number}>({ width: 0, height: 0 })
  const [showResultSize, setShowResultSize] = useState(false)
  const [loadFileError, setLoadFileError] = useState<string | null>(null)
  const [runPulse, setRunPulse] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const commandMenuRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (commandMenuOpen && commandMenuRef.current && !commandMenuRef.current.contains(event.target as Node)) {
        setCommandMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [commandMenuOpen])

  useEffect(() => {
    const storedSnippets = window.localStorage.getItem('saved-code-snippets')
    if (storedSnippets) {
      try {
        setSavedSnippets(JSON.parse(storedSnippets))
      } catch {
        setSavedSnippets([])
      }
    }

    if (exerciseId) {
      const fetchExercise = async () => {
        try {
          const res = await exercisesApi.getById(parseInt(exerciseId))
          const initialLanguage = getLanguageFromType(res.data.type)
          const initialCode = res.data.starterCode || getDefaultCode(initialLanguage)
          setExercise(res.data)
          setLanguage(initialLanguage)
          setCode(initialCode)
          if (initialLanguage === 'html') {
            setPreviewHtml(initialCode)
          } else if (initialLanguage === 'css') {
            setPreviewHtml(buildCssPreview(initialCode))
          } else if (initialLanguage === 'javascript') {
            setPreviewHtml(buildJsPreview(initialCode))
          } else {
            setPreviewHtml('')
          }
        } catch (err) {
          console.error('Failed to fetch exercise:', err)
        }
      }
      fetchExercise()
    }
  }, [exerciseId])

  useEffect(() => {
    if (initializedFromQuery) {
      return
    }

    const langParam = searchParams.get('language')
    const codeParam = searchParams.get('code')
    const fromParam = searchParams.get('from')

    if (langParam && LANGUAGES.some((lang) => lang.id === langParam)) {
      setLanguage(langParam)
    }

    const sessionValue = window.sessionStorage.getItem('tryit-yourself')
    const sessionData = sessionValue ? JSON.parse(sessionValue) : null

    if (codeParam) {
      const decoded = decodeURIComponent(codeParam)
      setCode(decoded)
      if (langParam === 'html') {
        setPreviewHtml(decoded)
      } else if (langParam === 'css') {
        setPreviewHtml(buildCssPreview(decoded))
      } else if (langParam === 'javascript') {
        setPreviewHtml(buildJsPreview(decoded))
      } else {
        setPreviewHtml('')
      }
    } else if (sessionData && fromParam === 'html-tutorial') {
      setLanguage(sessionData.language || 'html')
      setCode(sessionData.code || getDefaultCode(sessionData.language || 'html'))
      if (sessionData.language === 'html') {
        setPreviewHtml(sessionData.code)
      } else if (sessionData.language === 'css') {
        setPreviewHtml(buildCssPreview(sessionData.code))
      } else if (sessionData.language === 'javascript') {
        setPreviewHtml(buildJsPreview(sessionData.code))
      }
    } else if (langParam === 'html') {
      setPreviewHtml(code)
    }

    setInitializedFromQuery(true)
  }, [searchParams, initializedFromQuery, code])


  const handleLanguageChange = (newLanguage: string) => {
    const defaultCode = getDefaultCode(newLanguage)
    setLanguage(newLanguage)
    setCode(defaultCode)
    setOutput('')
    setError(null)
    if (newLanguage === 'html') {
      setPreviewHtml(defaultCode)
    } else if (newLanguage === 'css') {
      setPreviewHtml(buildCssPreview(defaultCode))
    } else {
      setPreviewHtml('')
    }
  }

  const getLanguageFromType = (type: string): 'html' | 'css' | 'javascript' | 'python' | 'java' | 'sql' => {
    switch (type) {
      case 'CSS':
      case 'STYLE_CODE':
        return 'css'
      case 'JAVASCRIPT':
      case 'WRITE_CODE':
      case 'FIX_CODE':
        return 'javascript'
      case 'PYTHON':
        return 'python'
      case 'JAVA':
        return 'java'
      case 'SQL':
        return 'sql'
      default:
        return 'html'
    }
  }

  const getEditorLanguage = (lang: string) => {
    switch (lang) {
      case 'html': return 'html'
      case 'css': return 'css'
      case 'javascript': return 'javascript'
      case 'python': return 'python'
      case 'java': return 'java'
      case 'sql': return 'sql'
      default: return 'plaintext'
    }
  }

  const buildJsPreview = (jsCode: string) => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>body{background:#0a0f1d;color:#d0d7eb;font-family:Menlo,monospace;padding:1rem;white-space:pre-wrap;}</style>
  </head>
  <body>
    <div id="output"></div>
    <script>
      (function() {
        const outputEl = document.getElementById('output')
        const write = (...args) => {
          const text = args.map(a => {
            try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a) }
            catch { return String(a) }
          }).join(' ') + '\n'
          outputEl.textContent += text
        }
        console.log = (...args) => write(...args)
        console.error = (...args) => write('ERROR:', ...args)
        console.warn = (...args) => write('WARN:', ...args)
        try {
          ${jsCode}
        } catch (e) {
          write('ERROR:', e)
        }
      })();
    </script>
  </body>
</html>`
  }

  const buildCssPreview = (cssCode: string) => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${cssCode}</style>
  </head>
  <body>
    <h1>CSS Preview</h1>
    <p>This is a live preview area for your CSS.</p>
    <button class="btn">Example Button</button>
  </body>
</html>`
  }

  const runCode = async () => {
    setRunPulse(true)
    setTimeout(() => setRunPulse(false), 700)
    setLoading(true)
    setError(null)
    setOutput('')

    try {
      if (language === 'html') {
        setPreviewHtml(code)
        setOutput('HTML preview rendered')
        return
      }

      if (language === 'css') {
        setPreviewHtml(buildCssPreview(code))
        setOutput('CSS preview rendered')
        return
      }

      if (language === 'javascript') {
        setPreviewHtml(buildJsPreview(code))
        setOutput('JavaScript preview rendered')
        return
      }

      const res = await codeExecutionApi.execute({
        language,
        code,
      })

      const result: CodeExecutionResponse = res.data
      setOutput(result.output || 'No output')

      if (result.status === 'ERROR') {
        setError(result.output)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute code')
    } finally {
      setLoading(false)
    }
  }

  const resetCode = () => {
    const defaultCode = exercise?.starterCode || getDefaultCode(language)
    setCode(defaultCode)
    if (language === 'html') {
      setPreviewHtml(defaultCode)
      setOutput('')
      setError(null)
      return
    }
    setOutput('')
    setError(null)
  }

  const saveSnippet = () => {
    const snippetName = `${language.toUpperCase()} snippet ${new Date().toLocaleString()}`
    const newSnippet = {
      id: `${Date.now()}`,
      name: snippetName,
      language,
      code,
      createdAt: Date.now(),
    }
    const next = [newSnippet, ...savedSnippets]
    window.localStorage.setItem('saved-code-snippets', JSON.stringify(next))
    setSavedSnippets(next)
    alert(`Snippet saved as "${snippetName}"`)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      alert('Code copied to clipboard')
    } catch {
      alert('Failed to copy code, please copy manually')
    }
  }

  const loadFileStyle = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const file = files[0]
    const extension = file.name.split('.').pop()?.toLowerCase()

    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      if (extension === 'css') {
        setLanguage('css')
        setCode(text)
        setPreviewHtml(buildCssPreview(text))
        setLoadFileError(null)
      } else if (extension === 'html') {
        setLanguage('html')
        setCode(text)
        setPreviewHtml(text)
        setLoadFileError(null)
      } else if (extension === 'js') {
        setLanguage('javascript')
        setCode(text)
        setPreviewHtml(buildJsPreview(text))
        setLoadFileError(null)
      } else {
        setLoadFileError('Unsupported file type. Use .css, .html, or .js')
      }
    }
    reader.readAsText(file)
  }

  const triggerFileLoad = () => {
    fileInputRef.current?.click()
  }

  const openInNewTab = () => {
    const payload = {
      language,
      code,
      source: 'open-in-new-tab',
      timestamp: Date.now(),
    }
    window.sessionStorage.setItem('tryit-yourself', JSON.stringify(payload))
    window.open('/editor?from=html-tutorial', '_blank')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] w-full flex flex-col pt-2 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <button
              onClick={() => navigate('/')}
              className="h-9 w-9 rounded-md bg-white border border-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 flex items-center justify-center"
              title="Home"
            >
              <span role="img" aria-label="home">🏠</span>
            </button>
            <button
              onClick={() => setCommandMenuOpen((prev) => !prev)}
              aria-expanded={commandMenuOpen}
              aria-label="Command Menu"
              className="h-9 w-9 rounded-md bg-white border border-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 flex items-center justify-center"
              title="Command Menu"
            >
              <span aria-hidden="true">≡</span>
            </button>
            {commandMenuOpen && (
              <div ref={commandMenuRef} className="absolute left-0 top-12 w-72 bg-white text-black rounded-xl shadow-2xl z-50 border border-gray-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
                <CommandMenuItem icon="▶" label="Run Code" shortcut="Ctrl+Alt+R" onClick={() => { runCode(); setCommandMenuOpen(false) }} />
                <CommandMenuItem icon="💾" label="Save Code" shortcut="Ctrl+Alt+A" onClick={() => { saveSnippet(); setCommandMenuOpen(false) }} />
                <CommandMenuItem icon="↔" label="Change Orientation" shortcut="Ctrl+Alt+O" onClick={() => { setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal')); setCommandMenuOpen(false) }} />
                <CommandMenuItem icon="🌓" label="Change Theme" shortcut="Ctrl+Alt+D" onClick={() => { setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark')); setCommandMenuOpen(false) }} />
                <CommandMenuItem icon="🗂" label="Go to Spaces" shortcut="Ctrl+Alt+P" onClick={() => { navigate('/dashboard'); setCommandMenuOpen(false) }} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {exercise ? exercise.title : 'Code Editor'}
            </h1>
            {exercise && (
              <p className="text-sm text-gray-500 dark:text-slate-400">{exercise.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="input w-40"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Editor, Output, and Side Panel */}
      <div
        className={`flex-1 gap-4 min-h-[calc(100vh-8rem)] h-[calc(100vh-8rem)] w-full ${
          orientation === 'horizontal'
            ? 'grid grid-cols-[3.5fr_3.5fr_1fr]'
            : 'grid grid-rows-[3.5fr_3.5fr_1fr]'
        }`}
      >
        {/* Code Editor */}
        <div className="card overflow-hidden flex flex-col h-full min-h-0 max-h-[calc(100vh-10rem)]">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">
              {LANGUAGES.find((l) => l.id === language)?.name}
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={saveSnippet}
                className="text-green-300 hover:text-white text-sm"
                title="Save snippet"
              >
                💾 Save
              </button>
              <button
                onClick={copyCode}
                className="text-blue-300 hover:text-white text-sm"
                title="Copy code"
              >
                📋 Copy
              </button>
              <button
                onClick={openInNewTab}
                className="text-indigo-300 hover:text-white text-sm"
                title="Open in new tab"
              >
                ↗ Open
              </button>
              <button
                onClick={triggerFileLoad}
                className="text-yellow-300 hover:text-white text-sm"
                title="Load file style"
              >
                📁 Load file style
              </button>
              <button
                onClick={resetCode}
                className="text-gray-400 hover:text-white text-sm"
                title="Reset code"
              >
                Reset
              </button>
              <input
                type="file"
                className="hidden"
                accept=".css,.html,.js"
                ref={fileInputRef}
                onChange={(e) => loadFileStyle(e.target.files)}
              />
            </div>
          </div>
          {loadFileError && (
            <div className="bg-red-100 text-red-700 px-3 py-2 text-sm border border-red-300">
              {loadFileError}
            </div>
          )}
          <div className="flex-1">
            <Editor
              height="100%"
              language={getEditorLanguage(language)}
              theme={editorTheme}
              value={code}
              onChange={(value) => {
                const newValue = value || ''
                setCode(newValue)
                if (language === 'html') {
                  setPreviewHtml(newValue)
                }
                if (language === 'css') {
                  setPreviewHtml(buildCssPreview(newValue))
                }
                if (language === 'javascript') {
                  setPreviewHtml(buildJsPreview(newValue))
                }
              }}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center justify-end gap-2 sticky bottom-0 z-20">
            <button
              onClick={runCode}
              disabled={loading}
              className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 ${runPulse ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse' : ''}`}
              title="Run code from the code editor panel"
            >
              {loading ? 'Running...' : 'Run Code ▶'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="card overflow-hidden flex flex-col h-full min-h-0 max-h-[calc(100vh-10rem)]">
          <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
            <span className="text-white text-sm font-medium">Output</span>
            <div className="text-xs text-blue-100 flex items-center gap-3">
              <span className="text-blue-100" title="Use the Run button in the left code panel to update this output">
                Execute in code panel ⌨️
              </span>
              <button
                onClick={() => setShowResultSize((prev) => !prev)}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
              >
                {showResultSize ? 'Hide result size' : 'Show result size'}
              </button>
              {showResultSize && (
                <span>
                  {resultSize.width} x {resultSize.height}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 bg-white p-4 overflow-auto font-mono text-sm text-black">
            {(language === 'html' || language === 'javascript') ? (
              <iframe
                title="Preview"
                srcDoc={previewHtml}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-none"
                ref={iframeRef}
                onLoad={() => {
                  if (iframeRef.current) {
                    setResultSize({
                      width: iframeRef.current.clientWidth,
                      height: iframeRef.current.clientHeight,
                    })
                  }
                }}
              />
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <pre className="text-red-700 bg-red-50 p-2 rounded whitespace-pre-wrap">{error}</pre>
            ) : output ? (
              <pre className="text-slate-900 bg-slate-100 p-2 rounded whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500 flex items-center justify-center h-full">
                Click "Run Code" to see output
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Ads / instructions / tips */}
        <div className="card overflow-hidden flex flex-col h-full min-h-0">
          <div className="bg-gray-800 px-4 py-2">
            <span className="text-gray-300 text-sm font-medium">Tutorial Tips</span>
          </div>
          <div className="flex-1 p-4 overflow-auto space-y-3 text-sm text-gray-700">
            <div className="rounded border border-dashed border-gray-300 p-3 bg-white/5">
              <p className="font-semibold">Need help?</p>
              <p>Use the left editor for code. Click run to refresh output.</p>
            </div>
            <div className="rounded border border-dashed border-gray-300 p-3 bg-white/5">
              <p className="font-semibold">Shortcut</p>
              <p>Save code: clicking 💾 Save stores snippet in local storage.</p>
            </div>
            <div className="rounded border border-dashed border-gray-300 p-3 bg-white/5">
              <p className="font-semibold">Pro tip</p>
              <p>Use Load file style to import .css/.html/.js directly to editor.</p>
            </div>
            <div className="rounded border border-dashed border-gray-300 p-3 bg-white/5">
              <p className="font-semibold">Sponsored</p>
              <p className="text-xs text-gray-500">Upgrade to premium course for advanced exercises.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Instructions */}
      {exercise && (
        <div className="mt-4 card p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
          <p className="text-gray-600">{exercise.instructions}</p>
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="mt-3">
              <details>
                <summary className="cursor-pointer text-primary-600 hover:text-primary-700">
                  Show Hints
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {exercise.hints.map((hint, i) => (
                    <li key={i}>💡 {hint}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CodeEditorPage
