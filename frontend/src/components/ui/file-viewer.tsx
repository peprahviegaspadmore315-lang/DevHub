import Editor from '@monaco-editor/react'
import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  FileJson2,
  FileText,
  PencilLine,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileTree, type FileTreeNode } from '@/components/ui/file-tree'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast-1'
import { cn } from '@/lib/utils'
import { isDarkThemeEnabled } from '@/lib/theme'

type EditorOptions = NonNullable<ComponentProps<typeof Editor>['options']>

export interface ApiComponent {
  name: string
  version: string
  externalUrl?: string
  defaultSelectedPath?: string
  files: Array<{
    path: string
    content?: string
    editable?: boolean
  }>
}

interface FileViewerProps {
  component: ApiComponent
  className?: string
  panelDirection?: 'horizontal' | 'vertical'
  defaultTreeSize?: number
  defaultCodeSize?: number
  headerActions?: ReactNode
  onFileChange?: (path: string, content: string) => void
  editorTheme?: string
  editorOptions?: EditorOptions
}

const getFileExtension = (filePath: string) =>
  filePath.split('.').pop()?.toLowerCase() || 'txt'

const getFileMeta = (filePath: string) => {
  const extension = getFileExtension(filePath)

  if (extension === 'tsx') return { label: 'TSX', lang: 'typescript', icon: FileCode2 }
  if (extension === 'ts') return { label: 'TS', lang: 'typescript', icon: FileCode2 }
  if (extension === 'jsx') return { label: 'JSX', lang: 'javascript', icon: FileCode2 }
  if (extension === 'js') return { label: 'JS', lang: 'javascript', icon: FileCode2 }
  if (extension === 'py') return { label: 'PY', lang: 'python', icon: FileCode2 }
  if (extension === 'java') return { label: 'JAVA', lang: 'java', icon: FileCode2 }
  if (extension === 'sql') return { label: 'SQL', lang: 'sql', icon: FileCode2 }
  if (extension === 'html') return { label: 'HTML', lang: 'html', icon: FileCode2 }
  if (extension === 'css') return { label: 'CSS', lang: 'css', icon: FileCode2 }
  if (extension === 'json') return { label: 'JSON', lang: 'json', icon: FileJson2 }
  if (extension === 'md') return { label: 'MD', lang: 'markdown', icon: FileText }

  return { label: extension.toUpperCase(), lang: 'text', icon: FileText }
}

const buildTree = (paths: string[]) => {
  const root: Record<string, any> = {}

  for (const path of paths) {
    const parts = path.split('/')
    let cursor = root

    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('/')

      if (!cursor[part]) {
        cursor[part] =
          index === parts.length - 1
            ? {
                id: currentPath,
                name: part,
                path,
                type: 'file',
                extension: getFileExtension(path),
              }
            : {
                id: currentPath,
                name: part,
                type: 'folder',
                children: {},
              }
      }

      if (cursor[part].children) {
        cursor = cursor[part].children
      }
    })
  }

  const normalize = (value: Record<string, any>): FileTreeNode[] =>
    Object.values(value)
      .map((item: any) =>
        item.children
          ? { ...item, children: normalize(item.children) }
          : { ...item }
      )
      .sort((a, b) => {
        const aFolder = a.type === 'folder'
        const bFolder = b.type === 'folder'

        if (aFolder !== bFolder) return aFolder ? -1 : 1
        return a.name.localeCompare(b.name)
      })

  return normalize(root)
}

const collectFolderIds = (nodes: FileTreeNode[]): string[] => {
  const values: string[] = []

  const visit = (items: FileTreeNode[]) => {
    items.forEach((item) => {
      if (item.type === 'folder' && item.children?.length) {
        values.push(item.id)
        visit(item.children)
      }
    })
  }

  visit(nodes)
  return values
}

export default function ComponentFileViewer({
  component,
  className,
  panelDirection = 'horizontal',
  defaultTreeSize = 28,
  defaultCodeSize = 72,
  headerActions,
  onFileChange,
  editorTheme,
  editorOptions,
}: FileViewerProps) {
  const files = useMemo(
    () => component.files.filter((file) => file.content !== undefined),
    [component.files]
  )
  const filePathsSignature = useMemo(
    () => files.map((file) => file.path).join('||'),
    [files]
  )
  const tree = useMemo(
    () => buildTree(files.map((file) => file.path)),
    [filePathsSignature]
  )
  const filePaths = useMemo(
    () => (filePathsSignature ? filePathsSignature.split('||') : []),
    [filePathsSignature]
  )
  const [selectedPath, setSelectedPath] = useState<string | undefined>(
    component.defaultSelectedPath || files[0]?.path
  )
  const [copied, setCopied] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(collectFolderIds(tree))
  )
  const [isDark, setIsDark] = useState(() => isDarkThemeEnabled())
  const { showToast } = useToast()

  useEffect(() => {
    setExpandedFolders(new Set(collectFolderIds(tree)))
    setSelectedPath((current) => {
      if (current && filePaths.includes(current)) {
        return current
      }

      if (
        component.defaultSelectedPath &&
        filePaths.includes(component.defaultSelectedPath)
      ) {
        return component.defaultSelectedPath
      }

      return filePaths[0]
    })
  }, [component.defaultSelectedPath, filePaths, tree])

  useEffect(() => {
    const syncTheme = () => setIsDark(isDarkThemeEnabled())
    syncTheme()

    window.addEventListener('storage', syncTheme)
    window.addEventListener('devhub-theme-change', syncTheme as EventListener)

    return () => {
      window.removeEventListener('storage', syncTheme)
      window.removeEventListener('devhub-theme-change', syncTheme as EventListener)
    }
  }, [])

  const selectedFile = files.find((file) => file.path === selectedPath) || files[0]

  const toggleFolder = (id: string) => {
    setExpandedFolders((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCopy = async () => {
    if (!selectedFile?.content) return

    try {
      await navigator.clipboard.writeText(selectedFile.content)
      setCopied(true)
      showToast('File content copied', 'success', 'top-right')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      showToast('Could not copy file content', 'error', 'top-right')
    }
  }

  if (files.length === 0) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground',
          className
        )}
      >
        No workspace files available yet.
      </div>
    )
  }

  const meta = selectedFile
    ? getFileMeta(selectedFile.path)
    : { label: 'TXT', lang: 'text', icon: FileText }
  const selectedIsEditable = Boolean(selectedFile?.editable && onFileChange)
  const resolvedEditorTheme = editorTheme || (isDark ? 'vs-dark' : 'light')
  const mergedEditorOptions: EditorOptions = {
    fontSize: 14,
    fontFamily: "'Fira Code', Consolas, Menlo, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    ...(editorOptions || {}),
  }

  return (
    <ResizablePanelGroup
      direction={panelDirection}
      className={cn(
        'overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_50px_-30px_rgba(14,165,233,0.55)]',
        className
      )}
    >
      <ResizablePanel
        defaultSize={defaultTreeSize}
        minSize={panelDirection === 'horizontal' ? 20 : 25}
        maxSize={panelDirection === 'horizontal' ? 42 : 55}
      >
        <FileTree
          data={tree}
          selectedPath={selectedFile?.path}
          onSelect={setSelectedPath}
          expandedIds={expandedFolders}
          onToggleFolder={toggleFolder}
          headerTitle="workspace explorer"
          meta={`${files.length} files`}
          className="h-full rounded-none border-0 bg-transparent p-3"
        />
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-white/8" />

      <ResizablePanel defaultSize={defaultCodeSize} minSize={40}>
        {selectedFile && (
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-sky-300/20 bg-sky-400/10 text-[11px] text-sky-100"
                >
                  {meta.label}
                </Badge>
                {selectedIsEditable && (
                  <Badge
                    variant="outline"
                    className="border-emerald-300/20 bg-emerald-400/10 text-[11px] text-emerald-100"
                  >
                    <PencilLine className="mr-1 h-3 w-3" />
                    Live
                  </Badge>
                )}
                <span className="truncate text-sm text-slate-300">
                  {selectedFile.path}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-1.5">
                {headerActions}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-slate-300 hover:bg-white/8 hover:text-white"
                  title="Copy file content"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                {component.externalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 text-slate-300 hover:bg-white/8 hover:text-white"
                    title="Open external link"
                  >
                    <a href={component.externalUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <Separator className="bg-white/10" />

            <div className="min-h-0 flex-1 overflow-hidden">
              {selectedIsEditable ? (
                <Editor
                  height="100%"
                  language={meta.lang}
                  theme={resolvedEditorTheme}
                  value={selectedFile.content || ''}
                  onChange={(value) =>
                    onFileChange?.(selectedFile.path, value || '')
                  }
                  options={mergedEditorOptions}
                />
              ) : (
                <ScrollArea className="h-full">
                  <SyntaxHighlighter
                    language={meta.lang}
                    style={isDark ? oneDark : oneLight}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                      margin: 0,
                      minHeight: '100%',
                      background: 'transparent',
                      padding: '1rem',
                      fontSize: '0.86rem',
                      lineHeight: 1.55,
                    }}
                    lineNumberStyle={{
                      minWidth: '2.2rem',
                      opacity: 0.45,
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: "'Fira Code', Consolas, Menlo, monospace",
                      },
                    }}
                  >
                    {selectedFile.content || ''}
                  </SyntaxHighlighter>
                </ScrollArea>
              )}
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
