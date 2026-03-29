import { useState, useRef, useCallback, useMemo } from 'react'
import { codeExecutionService, type SupportedLanguage } from '@/services/codeExecutionService'
import ComponentFileViewer from '@/components/ui/file-viewer'
import { buildIdeWorkspaceComponent } from '@/lib/ide-workspace'
import './TryItYourself.css'

interface TryItYourselfProps {
  defaultLanguage?: string
  defaultCode?: string
  height?: string
  onSuccess?: (output: string) => void
  onError?: (error: string) => void
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', monaco: 'javascript', apiLang: 'JAVASCRIPT' as SupportedLanguage },
  { id: 'python', name: 'Python', extension: 'py', monaco: 'python', apiLang: 'PYTHON' as SupportedLanguage },
  { id: 'java', name: 'Java', extension: 'java', monaco: 'java', apiLang: 'JAVA' as SupportedLanguage },
  { id: 'html', name: 'HTML', extension: 'html', monaco: 'html', apiLang: 'HTML' as SupportedLanguage },
  { id: 'css', name: 'CSS', extension: 'css', monaco: 'css', apiLang: 'CSS' as SupportedLanguage },
]

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Write your JavaScript code here
console.log("Hello, World!");

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Student"));
`,
  python: `# Write your Python code here
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

print(greet("Student"))
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Welcome to my webpage.</p>
</body>
</html>`,
  css: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

h1 {
  color: #333;
}
`,
}

function speak(text: string) {
  const robot = (window as any).__robot
  if (robot?.speak) {
    robot.speak(text)
  }
}

export default function TryItYourself({
  defaultLanguage = 'javascript',
  defaultCode,
  height = '400px',
  onSuccess,
  onError
}: TryItYourselfProps) {
  const [language, setLanguage] = useState(defaultLanguage)
  const [code, setCode] = useState(defaultCode || DEFAULT_CODE[defaultLanguage] || '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const langConfig = LANGUAGES.find(l => l.id === language) || LANGUAGES[0]

  const runCode = useCallback(async () => {
    setLoading(true)
    setError('')
    setOutput('')
    setShowPreview(false)

    try {
      if (language === 'html' || language === 'css') {
        setShowPreview(true)
        speak('HTML preview ready!')
        setLoading(false)
        return
      }

      const result = await codeExecutionService.execute({
        code,
        language: langConfig.apiLang,
        runTests: false,
      })

      if (result.success) {
        setOutput(result.output || '(no output)')
        onSuccess?.(result.output)
        if (result.output) {
          speak('Code executed successfully!')
        }
      } else {
        setError(result.error || 'Execution failed')
        onError?.(result.error || 'Execution failed')
        speak('There was an error running your code.')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect to server'
      setError(errorMsg)
      onError?.(errorMsg)
      speak('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }, [code, language, langConfig.apiLang, onSuccess, onError])

  const resetCode = () => {
    setCode(DEFAULT_CODE[language])
    setOutput('')
    setError('')
    setShowPreview(false)
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    setCode(DEFAULT_CODE[newLang])
    setOutput('')
    setError('')
    setShowPreview(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }
  }

  const previewDocument =
    showPreview && language === 'html'
      ? code
      : showPreview && language === 'css'
        ? `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${code}</style>
  </head>
  <body>
    <h1>CSS Preview</h1>
    <p>This preview is generated from your Try It Yourself editor.</p>
  </body>
</html>`
        : undefined

  const workspaceComponent = useMemo(
    () =>
      buildIdeWorkspaceComponent({
        workspaceName: 'Try It Yourself Workspace',
        workspaceVersion: 'lesson',
        language,
        code,
        previewHtml: previewDocument,
        output,
        error,
        exercise: {
          title: 'Lesson practice',
          description: 'Experiment safely inside the embedded DevHub lesson editor.',
          instructions:
            'Edit the source file, run your code, and inspect the generated workspace files below.',
        },
      }),
    [code, error, language, output, previewDocument]
  )

  return (
    <div className="try-editor" onKeyDown={handleKeyDown}>
      <div className="try-editor-header">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="try-editor-select"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>

        <div className="try-editor-actions">
          <button onClick={resetCode} className="try-editor-btn try-editor-btn-secondary">
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={loading}
            className="try-editor-btn try-editor-btn-primary"
          >
            {loading ? (
              <>
                <span className="try-editor-spinner"></span>
                Running...
              </>
            ) : (
              <>▶ Run</>
            )}
          </button>
        </div>
      </div>

      <div className="try-editor-body" style={{ height }}>
        <div className="try-editor-editor bg-slate-950">
          <ComponentFileViewer
            component={workspaceComponent}
            onFileChange={(_, nextValue) => setCode(nextValue)}
            editorTheme="vs-dark"
            editorOptions={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              lineNumbers: 'on',
              folding: true,
              wordWrap: 'on',
            }}
            className="h-full rounded-none border-0 shadow-none"
          />
        </div>

        <div className="try-editor-output">
          <div className="try-editor-output-header">
            <span>Output</span>
            {output && (
              <span className="try-editor-output-success">✓ Success</span>
            )}
          </div>

          <div className="try-editor-output-body">
            {loading ? (
              <div className="try-editor-loading">
                <span className="try-editor-spinner try-editor-spinner-dark"></span>
                <span>Executing code...</span>
              </div>
            ) : showPreview && language === 'html' ? (
              <iframe
                ref={iframeRef}
                title="Output Preview"
                className="try-editor-preview"
                sandbox="allow-scripts"
                srcDoc={code}
              />
            ) : error ? (
              <div className="try-editor-error">
                <strong>Error:</strong> {error}
              </div>
            ) : output ? (
              <pre className="try-editor-output-text">{output}</pre>
            ) : (
              <div className="try-editor-placeholder">
                Click "Run" to execute your code (or press Ctrl+Enter)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
