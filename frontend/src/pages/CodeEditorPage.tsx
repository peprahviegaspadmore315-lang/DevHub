import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { codeExecutionApi, exercisesApi } from '@/services/api'
import ComponentFileViewer from '@/components/ui/file-viewer'
import { buildIdeWorkspaceComponent } from '@/lib/ide-workspace'
import { useToast } from '@/components/ui/toast-1'
import {
  loadSavedCodeSnippets,
  saveSavedCodeSnippets,
  type SavedCodeSnippet,
} from '@/lib/learning-progress'
import { useAuthStore } from '@/store'
import type { Exercise, CodeExecutionResponse } from '@/types'
import {
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FolderOpen,
  LayoutPanelTop,
  MoonStar,
  PanelLeft,
  Play,
  RefreshCcw,
  Save,
  Sparkles,
  SunMedium,
  TerminalSquare,
  Trash2,
} from 'lucide-react'

const LANGUAGES = [
  { id: 'html', name: 'HTML', extension: 'html' },
  { id: 'css', name: 'CSS', extension: 'css' },
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'sql', name: 'SQL', extension: 'sql' },
]

const PREVIEW_LANGUAGES = new Set(['html', 'css', 'javascript'])

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
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

INSERT INTO users (id, name) VALUES
  (1, 'Ada'),
  (2, 'Grace');

SELECT * FROM users;`
    default:
      return ''
  }
}

const CodeEditorPage = () => {
  const { exerciseId } = useParams()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const [language, setLanguage] = useState('html')
  const [code, setCode] = useState(getDefaultCode('html'))
  const [output, setOutput] = useState('')
  const [previewHtml, setPreviewHtml] = useState(getDefaultCode('html'))
  const [initializedFromQuery, setInitializedFromQuery] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const user = useAuthStore((state) => state.user)
  const [savedSnippets, setSavedSnippets] = useState<SavedCodeSnippet[]>([])
  const [resultSize, setResultSize] = useState<{width:number;height:number}>({ width: 0, height: 0 })
  const [showResultSize, setShowResultSize] = useState(false)
  const [loadFileError, setLoadFileError] = useState<string | null>(null)
  const [runPulse, setRunPulse] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [savedSnippetsOpen, setSavedSnippetsOpen] = useState(false)
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [lastRunAt, setLastRunAt] = useState<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const commandMenuRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const activeLanguage = useMemo(
    () => LANGUAGES.find((item) => item.id === language) ?? LANGUAGES[0],
    [language]
  )
  const previewCapable = PREVIEW_LANGUAGES.has(language)
  const outputModeLabel = previewCapable ? 'Live preview' : 'Execution console'
  const workspaceStatus = error
    ? 'Attention needed'
    : loading
    ? 'Running now'
    : lastRunAt
    ? 'Ready'
    : 'Standing by'

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
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || !event.altKey) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === 'r') {
        event.preventDefault()
        void runCode()
        return
      }

      if (key === 'a') {
        event.preventDefault()
        saveSnippet()
        return
      }

      if (key === 'o') {
        event.preventDefault()
        setOrientation((previous) => (previous === 'horizontal' ? 'vertical' : 'horizontal'))
        return
      }

      if (key === 'd') {
        event.preventDefault()
        setEditorTheme((previous) => (previous === 'vs-dark' ? 'light' : 'vs-dark'))
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcuts)
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
  })

  useEffect(() => {
    setSavedSnippets(loadSavedCodeSnippets(user?.id))

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
  }, [exerciseId, user?.id])

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
    setLoadFileError(null)
    if (newLanguage === 'html') {
      setPreviewHtml(defaultCode)
    } else if (newLanguage === 'css') {
      setPreviewHtml(buildCssPreview(defaultCode))
    } else if (newLanguage === 'javascript') {
      setPreviewHtml(buildJsPreview(defaultCode))
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

  const updateSourceCode = (newValue: string) => {
    setCode(newValue)

    if (language === 'html') {
      setPreviewHtml(newValue)
      return
    }

    if (language === 'css') {
      setPreviewHtml(buildCssPreview(newValue))
      return
    }

    if (language === 'javascript') {
      setPreviewHtml(buildJsPreview(newValue))
    }
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
        setLastRunAt(Date.now())
        return
      }

      if (language === 'css') {
        setPreviewHtml(buildCssPreview(code))
        setOutput('CSS preview rendered')
        setLastRunAt(Date.now())
        return
      }

      if (language === 'javascript') {
        setPreviewHtml(buildJsPreview(code))
        setOutput('JavaScript preview rendered')
        setLastRunAt(Date.now())
        return
      }

      const res = await codeExecutionApi.execute({
        language,
        code,
      })

      const result: CodeExecutionResponse = res.data
      setOutput(result.output || result.error || 'No output')
      setLastRunAt(Date.now())

      if (result.success === false || result.status === 'ERROR') {
        setError(result.error || result.output || 'Execution failed')
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.output
      setError(backendError || 'Failed to execute code')
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
    if (language === 'css') {
      setPreviewHtml(buildCssPreview(defaultCode))
      setOutput('')
      setError(null)
      return
    }
    if (language === 'javascript') {
      setPreviewHtml(buildJsPreview(defaultCode))
      setOutput('')
      setError(null)
      return
    }
    setPreviewHtml('')
    setOutput('')
    setError(null)
  }

  const saveSnippet = () => {
    const snippetName = `${language.toUpperCase()} snippet ${new Date().toLocaleString()}`
    const newSnippet: SavedCodeSnippet = {
      id: `${Date.now()}`,
      name: snippetName,
      language,
      code,
      createdAt: Date.now(),
    }
    const next = [newSnippet, ...savedSnippets]
    saveSavedCodeSnippets(next, user?.id)
    setSavedSnippets(next)
    showToast(`Saved "${snippetName}" to this device.`, 'success', 'top-right')
    setSavedSnippetsOpen(true)
  }

  const loadSavedSnippet = (snippet: SavedCodeSnippet) => {
    setLanguage(snippet.language)
    setCode(snippet.code)
    setOutput('')
    setError(null)
    setLoadFileError(null)

    if (snippet.language === 'html') {
      setPreviewHtml(snippet.code)
    } else if (snippet.language === 'css') {
      setPreviewHtml(buildCssPreview(snippet.code))
    } else if (snippet.language === 'javascript') {
      setPreviewHtml(buildJsPreview(snippet.code))
    } else {
      setPreviewHtml('')
    }

    setSavedSnippetsOpen(false)
    showToast(`Opened "${snippet.name}".`, 'info', 'top-right')
  }

  const deleteSavedSnippet = (snippetId: string) => {
    const next = savedSnippets.filter((snippet) => snippet.id !== snippetId)
    saveSavedCodeSnippets(next, user?.id)
    setSavedSnippets(next)
    showToast('Saved snippet removed.', 'success', 'top-right')
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
      } else if (extension === 'py') {
        setLanguage('python')
        setCode(text)
        setPreviewHtml('')
        setLoadFileError(null)
      } else if (extension === 'java') {
        setLanguage('java')
        setCode(text)
        setPreviewHtml('')
        setLoadFileError(null)
      } else if (extension === 'sql') {
        setLanguage('sql')
        setCode(text)
        setPreviewHtml('')
        setLoadFileError(null)
      } else {
        setLoadFileError('Unsupported file type. Use .html, .css, .js, .py, .java, or .sql')
      }
    }
    reader.readAsText(file)
  }

  const triggerFileLoad = () => {
    fileInputRef.current?.click()
  }

  const openInNewTab = () => {
    const params = new URLSearchParams({
      language,
      code,
      from: 'editor-workspace',
    })
    window.open(`/editor?${params.toString()}`, '_blank', 'noopener,noreferrer')
  }

  const openPreviewTab = () => {
    if (!previewCapable) {
      return
    }

    const previewWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!previewWindow) {
      showToast('The browser blocked the preview tab. Allow pop-ups and try again.', 'warning', 'top-right')
      return
    }

    previewWindow.document.open()
    previewWindow.document.write(previewHtml)
    previewWindow.document.close()
  }

  const copyOutputContent = async () => {
    const content = previewCapable ? previewHtml : error || output

    if (!content) {
      showToast('There is no output to copy yet.', 'warning', 'top-right')
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopiedOutput(true)
      showToast('Output copied.', 'success', 'top-right')
      window.setTimeout(() => setCopiedOutput(false), 1800)
    } catch {
      showToast('Could not copy the output.', 'error', 'top-right')
    }
  }

  const clearOutputPanel = () => {
    setOutput('')
    setError(null)
    setPreviewHtml('')
  }

  const workspaceComponent = useMemo(
    () =>
      buildIdeWorkspaceComponent({
        workspaceName: exercise ? exercise.title : 'DevHub IDE Workspace',
        workspaceVersion: exercise ? 'exercise' : 'practice',
        language,
        code,
        previewHtml,
        output,
        error,
        exercise: exercise
          ? {
              title: exercise.title,
              description: exercise.description,
              instructions: exercise.instructions,
              hints: exercise.hints,
            }
          : {
              title: 'Live code session',
              description: 'Use the DevHub editor to practice and test ideas.',
              instructions:
                'Write code in the main editor, run it, then inspect the generated files and output in the workspace viewer.',
            },
        savedSnippetCount: savedSnippets.length,
      }),
    [code, error, exercise, language, output, previewHtml, savedSnippets.length]
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] w-full space-y-4 pt-2 pb-2">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white shadow-[0_35px_90px_-55px_rgba(14,165,233,0.55)]">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-3">
              <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-lg shadow-sky-500/10">
                <button
                  onClick={() => navigate('/')}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                  title="Back home"
                >
                  <ArrowUpRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => setCommandMenuOpen((prev) => !prev)}
                  aria-expanded={commandMenuOpen}
                  aria-label="Command Menu"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                  title="Workspace command menu"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                {commandMenuOpen && (
                  <div ref={commandMenuRef} className="absolute left-0 top-16 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Command palette</p>
                      <p className="mt-1 text-sm text-slate-500">Run the workspace and switch layout quickly.</p>
                    </div>
                    <CommandMenuItem icon="▶" label="Run Code" shortcut="Ctrl+Alt+R" onClick={() => { runCode(); setCommandMenuOpen(false) }} />
                    <CommandMenuItem icon="💾" label="Save Snippet" shortcut="Ctrl+Alt+A" onClick={() => { saveSnippet(); setCommandMenuOpen(false) }} />
                    <CommandMenuItem icon="📂" label="Open Saved Snippets" shortcut="Open panel" onClick={() => { setSavedSnippetsOpen(true); setCommandMenuOpen(false) }} />
                    <CommandMenuItem icon="↔" label="Toggle Layout" shortcut="Ctrl+Alt+O" onClick={() => { setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal')); setCommandMenuOpen(false) }} />
                    <CommandMenuItem icon="🌓" label="Toggle Theme" shortcut="Ctrl+Alt+D" onClick={() => { setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark')); setCommandMenuOpen(false) }} />
                    <CommandMenuItem icon="🗂" label="Open Dashboard" shortcut="Ctrl+Alt+P" onClick={() => { navigate('/dashboard'); setCommandMenuOpen(false) }} />
                  </div>
                )}
              </div>

              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200/80">DevHub workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {exercise ? exercise.title : 'Code Editor'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  {exercise?.description || 'Write, run, save, and revisit your DevHub practice code from one professional workspace.'}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[26rem]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Current mode</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{activeLanguage.name}</p>
                    <p className="text-sm text-slate-300">{outputModeLabel}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${error ? 'border-rose-400/20 bg-rose-500/15 text-rose-100' : 'border-emerald-400/20 bg-emerald-500/15 text-emerald-100'}`}>
                    {workspaceStatus}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Workspace details</p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <span>Saved snippets</span>
                    <span className="font-semibold">{savedSnippets.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Layout</span>
                    <span className="font-semibold">{orientation === 'horizontal' ? 'Side by side' : 'Stacked'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Theme</span>
                    <span className="font-semibold">{editorTheme === 'vs-dark' ? 'Dark editor' : 'Light editor'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
              <span className="font-medium text-slate-200">Language</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="min-w-[9rem] bg-transparent text-sm text-white outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="text-slate-950">
                    {lang.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => setSavedSnippetsOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <FolderOpen className="h-4 w-4 text-sky-300" />
              Saved snippets
            </button>

            <button
              onClick={() => setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {orientation === 'horizontal' ? <PanelLeft className="h-4 w-4 text-sky-300" /> : <LayoutPanelTop className="h-4 w-4 text-sky-300" />}
              {orientation === 'horizontal' ? 'Stack panels' : 'Side by side'}
            </button>

            <button
              onClick={() => setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'))}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {editorTheme === 'vs-dark' ? <SunMedium className="h-4 w-4 text-amber-300" /> : <MoonStar className="h-4 w-4 text-sky-300" />}
              {editorTheme === 'vs-dark' ? 'Light editor' : 'Dark editor'}
            </button>

            <button
              onClick={runCode}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-22px_rgba(14,165,233,0.65)] transition hover:bg-sky-400 disabled:opacity-60 ${runPulse ? 'ring-2 ring-sky-200/70 ring-offset-2 ring-offset-slate-950' : ''}`}
            >
              <Play className="h-4 w-4" />
              {loading ? 'Running workspace...' : 'Run workspace'}
            </button>
          </div>
        </div>
      </section>

      {savedSnippetsOpen && (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Saved work</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Open a previous DevHub snippet</h2>
              <p className="mt-1 text-sm text-slate-500">Load saved practice code back into the editor, or remove older drafts you no longer need.</p>
            </div>
            <button
              onClick={() => setSavedSnippetsOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              Close panel
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {savedSnippets.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No saved snippets yet. Save your current work and it will appear here.
            </div>
          ) : (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {savedSnippets.slice(0, 8).map((snippet) => (
                <div key={snippet.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-900">{snippet.name}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 font-semibold uppercase tracking-[0.2em] text-slate-100">
                          {snippet.language}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {new Date(snippet.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSavedSnippet(snippet.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-500 transition hover:bg-rose-50"
                      title="Delete snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => loadSavedSnippet(snippet)}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Open snippet
                    </button>
                    <span className="text-xs text-slate-500">Loads directly into the active workspace.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      <div
        className={`flex-1 gap-4 min-h-[calc(100vh-8rem)] h-[calc(100vh-8rem)] w-full ${
          orientation === 'horizontal'
            ? 'grid grid-cols-[1.7fr_1fr]'
            : 'grid grid-rows-[1.55fr_1fr]'
        }`}
      >
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-3 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.42)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Source workspace</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">Write and refine your code</h2>
            </div>
            <p className="text-sm text-slate-500">
              Save drafts, import files, or run the current workspace when you're ready.
            </p>
          </div>

          {loadFileError && (
            <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadFileError}
            </div>
          )}

          <ComponentFileViewer
            component={workspaceComponent}
            onFileChange={(_, nextValue) => updateSourceCode(nextValue)}
            editorTheme={editorTheme}
            editorOptions={{
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
            headerActions={
              <>
                <button
                  onClick={saveSnippet}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100 transition-colors hover:bg-emerald-400/20"
                  title="Save snippet"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
                <button
                  onClick={() => setSavedSnippetsOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-100 transition-colors hover:bg-sky-400/20"
                  title="Open a saved snippet"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Open
                </button>
                <button
                  onClick={triggerFileLoad}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-400/20"
                  title="Load file from device"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Load file
                </button>
                <button
                  onClick={resetCode}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
                  title="Reset code"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={loading}
                  className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-50 ${runPulse ? 'ring-2 ring-emerald-300/70' : ''}`}
                  title="Run code"
                >
                  <Play className="h-3.5 w-3.5" />
                  {loading ? 'Running...' : 'Run'}
                </button>
              </>
            }
            className="h-full min-h-0 rounded-[1.5rem] border border-slate-200/30 shadow-none"
          />

          <input
            type="file"
            className="hidden"
            accept=".css,.html,.js,.py,.java,.sql"
            ref={fileInputRef}
            onChange={(e) => loadFileStyle(e.target.files)}
          />
        </div>

        <div className="flex min-h-0 max-h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.42)]">
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 px-4 py-4 text-white">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TerminalSquare className="h-4 w-4 text-sky-300" />
                  <span className="text-sm font-semibold">{outputModeLabel}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${error ? 'bg-rose-500/15 text-rose-100' : 'bg-emerald-500/15 text-emerald-100'}`}>
                    {workspaceStatus}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {previewCapable
                    ? 'Preview updates when you run the workspace. Pop it out or copy the rendered source when you need more room.'
                    : 'Run your code to inspect console output, runtime errors, and backend execution results.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowResultSize((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/15"
                >
                  {showResultSize ? 'Hide size' : 'Show size'}
                </button>
                {previewCapable && (
                  <button
                    onClick={openPreviewTab}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/15"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview tab
                  </button>
                )}
                <button
                  onClick={copyOutputContent}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/15"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedOutput ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={clearOutputPanel}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/15"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Clear
                </button>
                <button
                  onClick={openInNewTab}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  New editor tab
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>
                Run from the source panel or with <span className="font-semibold text-white">Ctrl+Alt+R</span>
              </span>
              {showResultSize && <span>Viewport: {resultSize.width} x {resultSize.height}</span>}
              {lastRunAt && <span>Last run: {new Date(lastRunAt).toLocaleTimeString()}</span>}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-white p-4 font-mono text-sm text-black">
            {previewCapable ? (
              <iframe
                title="Preview"
                srcDoc={previewHtml}
                sandbox="allow-scripts allow-same-origin"
                className="h-full w-full rounded-2xl border border-slate-200/80 bg-white"
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
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-500">Execution error</p>
                <pre className="whitespace-pre-wrap text-sm text-red-700">{error}</pre>
              </div>
            ) : output ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Runtime output</p>
                <pre className="whitespace-pre-wrap text-sm text-slate-900">{output}</pre>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <TerminalSquare className="h-6 w-6" />
                  </div>
                  <p className="text-base font-semibold text-slate-900">Your output will appear here</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Run the current workspace to preview front-end code or inspect runtime output for Python, Java, and SQL.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Instructions */}
      {exercise && (
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.42)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Exercise brief</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">Instructions</h3>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Practice mode
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{exercise.instructions}</p>
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="mt-4">
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-sky-600 hover:text-sky-700">
                  Show Hints
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {exercise.hints.map((hint, i) => (
                    <li key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">💡 {hint}</li>
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
