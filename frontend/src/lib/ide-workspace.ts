import type { ApiComponent } from '@/components/ui/file-viewer'

type WorkspaceExercise = {
  title?: string
  description?: string
  instructions?: string
  hints?: string[]
}

interface BuildWorkspaceOptions {
  workspaceName: string
  workspaceVersion?: string
  language: string
  code: string
  previewHtml?: string
  output?: string
  error?: string | null
  exercise?: WorkspaceExercise | null
  savedSnippetCount?: number
  includePreviewFile?: boolean
}

const sourceFileMap: Record<string, string> = {
  html: 'src/index.html',
  css: 'src/styles.css',
  javascript: 'src/main.js',
  python: 'src/main.py',
  java: 'src/Main.java',
  sql: 'src/query.sql',
}

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const buildIdeWorkspaceComponent = ({
  workspaceName,
  workspaceVersion = 'live',
  language,
  code,
  previewHtml,
  output,
  error,
  exercise,
  savedSnippetCount = 0,
  includePreviewFile = true,
}: BuildWorkspaceOptions): ApiComponent => {
  const sourcePath = sourceFileMap[language] || `src/main.${language || 'txt'}`
  const files: ApiComponent['files'] = [
    {
      path: sourcePath,
      content: code,
      editable: true,
    },
    {
      path: 'workspace/session.json',
      content: JSON.stringify(
        {
          workspace: workspaceName,
          language,
          sourceFile: sourcePath,
          savedSnippetCount,
          hasPreview: Boolean(previewHtml && includePreviewFile),
          hasOutput: Boolean(output),
          hasError: Boolean(error),
        },
        null,
        2
      ),
    },
    {
      path: 'workspace/devhub-guide.md',
      content: `# DevHub Workspace\n\nThis IDE is configured for **${titleCase(language)}** practice.\n\n- Edit the source file in the main editor.\n- Run code to refresh the output panel.\n- Use the file viewer to inspect generated preview and workspace files.\n- Saved snippets available: ${savedSnippetCount}.\n`,
    },
  ]

  if (exercise) {
    files.push({
      path: 'exercise/overview.md',
      content: `# ${exercise.title || workspaceName}\n\n${exercise.description || 'Practice your code in this workspace.'}\n\n## Instructions\n\n${exercise.instructions || 'Follow the task and use the editor to test your solution.'}\n`,
    })

    if (exercise.hints?.length) {
      files.push({
        path: 'exercise/hints.md',
        content: `# Hints\n\n${exercise.hints.map((hint) => `- ${hint}`).join('\n')}\n`,
      })
    }
  }

  if (includePreviewFile && previewHtml && ['html', 'css', 'javascript'].includes(language)) {
    files.push({
      path: 'preview/live-preview.html',
      content: previewHtml,
    })
  }

  if (error) {
    files.push({
      path: 'output/error.log',
      content: error,
    })
  } else {
    files.push({
      path: 'output/console.txt',
      content: output || 'Run code to populate the latest console output.',
    })
  }

  return {
    name: workspaceName,
    version: workspaceVersion,
    defaultSelectedPath: sourcePath,
    files,
  }
}
