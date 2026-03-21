import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { codeExecutionService } from '@/services/codeExecutionService'
import type { SupportedLanguage } from '@/services/codeExecutionService'

interface TryItYourselfProps {
  initialCode?: string
  language?: 'html' | 'css' | 'javascript' | 'python' | 'java'
  height?: string
  showEditor?: boolean
  onExecute?: (result: { success: boolean; output: string }) => void
}

const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JAVASCRIPT',
  python: 'PYTHON',
  java: 'JAVA',
}

const LANGUAGE_CONFIGS = {
  html: {
    name: 'HTML',
    extension: 'html',
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Welcome to my webpage.</p>
  <button onclick="alert('Clicked!')">Click Me</button>
</body>
</html>`,
    mode: 'html',
  },
  css: {
    name: 'CSS',
    extension: 'css',
    defaultCode: `/* Write your CSS here */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
  text-align: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
    mode: 'css',
  },
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    defaultCode: `// JavaScript Tutorial
// Variables
let message = "Hello, World!";
console.log(message);

// Functions
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Student"));

// Arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`,
    mode: 'javascript',
  },
  python: {
    name: 'Python',
    extension: 'py',
    defaultCode: `# Python Tutorial
# Variables
message = "Hello, World!"
print(message)

# Functions
def greet(name):
    return f"Hello, {name}!"

print(greet("Student"))

# Lists
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)`,
    mode: 'python',
  },
  java: {
    name: 'Java',
    extension: 'java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        // Hello World
        System.out.println("Hello, World!");
        
        // Variables
        String message = "Welcome to Java!";
        System.out.println(message);
        
        // For loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
    mode: 'java',
  },
}

const TryItYourself: React.FC<TryItYourselfProps> = ({
  initialCode,
  language = 'html',
  height = '400px',
  showEditor = true,
  onExecute,
}) => {
  const config = LANGUAGE_CONFIGS[language]
  const [code, setCode] = useState(initialCode || config.defaultCode)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'output' | 'console'>('output')
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (language === 'html' && iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(code)
        doc.close()
      }
    }
  }, [code, language])

  const runCode = async () => {
    setLoading(true)
    setError(null)
    setOutput('')
    setExecutionTime(null)

    try {
      if (language === 'html') {
        setActiveTab('output')
        setOutput('HTML rendered in preview panel')
        onExecute?.({ success: true, output: 'HTML rendered' })
        return
      }

      const result = await codeExecutionService.execute({
        code,
        language: LANGUAGE_MAP[language],
        runTests: false,
      })

      setExecutionTime(result.executionTimeMs)

      if (result.success) {
        setOutput(result.output || 'No output')
        onExecute?.({ success: true, output: result.output || '' })
      } else {
        setError(result.error || 'Execution failed')
        onExecute?.({ success: false, output: result.error || '' })
      }

      setActiveTab('console')
    } catch (err: any) {
      setError(err.message || 'Failed to execute code')
      onExecute?.({ success: false, output: err.message })
      setActiveTab('console')
    } finally {
      setLoading(false)
    }
  }

  const resetCode = () => {
    setCode(config.defaultCode)
    setOutput('')
    setError(null)
    setExecutionTime(null)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm font-medium">
            {config.name} Editor
          </span>
          <div className="flex gap-1">
            <button
              onClick={resetCode}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {executionTime !== null && (
            <span className="text-xs text-gray-400">
              ⚡ {executionTime}ms
            </span>
          )}
          <button
            onClick={runCode}
            disabled={loading}
            className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-green-500/25"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <span>▶</span> Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ height }}>
        {/* Code Editor */}
        {showEditor && (
          <div className="border-r border-gray-200">
            <Editor
              height="100%"
              language={config.mode}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                },
              }}
            />
          </div>
        )}

        {/* Output Panel */}
        <div className="flex flex-col">
          {/* Tabs */}
          <div className="bg-gray-100 px-2 py-1 flex gap-2 border-b border-gray-200">
            {language === 'html' && (
              <button
                onClick={() => setActiveTab('output')}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  activeTab === 'output'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
            )}
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeTab === 'console'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Console
            </button>
          </div>

          {/* Output Content */}
          <div className="flex-1 bg-white overflow-hidden">
            {language === 'html' && activeTab === 'output' ? (
              <iframe
                ref={iframeRef}
                title="Output Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="h-full overflow-auto bg-[#1e1e1e] p-4 font-mono text-sm">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Executing...
                  </div>
                ) : error ? (
                  <pre className="text-red-400 whitespace-pre-wrap">
                    <span className="text-red-500">Error:</span> {error}
                  </pre>
                ) : output ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center justify-center h-full">
                    <span className="text-4xl mb-2">💻</span>
                    <span>Click "Run Code" to see output</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TryItYourself
