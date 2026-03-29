"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

export interface FileTreeNode {
  id: string
  name: string
  type: "file" | "folder"
  path?: string
  children?: FileTreeNode[]
  extension?: string
}

interface FileTreeProps {
  data: FileTreeNode[]
  className?: string
  selectedPath?: string
  onSelect?: (path: string) => void
  expandedIds?: Set<string>
  onToggleFolder?: (id: string) => void
  headerTitle?: string
  meta?: string
}

interface FileItemProps {
  node: FileTreeNode
  depth: number
  isLast: boolean
  parentPath: boolean[]
  selectedPath?: string
  onSelect?: (path: string) => void
  expandedIds?: Set<string>
  onToggleFolder?: (id: string) => void
}

const getFileIcon = (extension?: string) => {
  const iconMap: Record<string, { color: string; icon: string }> = {
    tsx: { color: "text-sky-300", icon: "⚛" },
    ts: { color: "text-blue-300", icon: "◆" },
    jsx: { color: "text-cyan-300", icon: "⚛" },
    js: { color: "text-yellow-300", icon: "◆" },
    css: { color: "text-fuchsia-300", icon: "◈" },
    json: { color: "text-amber-300", icon: "{}" },
    md: { color: "text-slate-400", icon: "◊" },
    svg: { color: "text-emerald-300", icon: "◐" },
    png: { color: "text-teal-300", icon: "◑" },
    py: { color: "text-blue-300", icon: "Py" },
    html: { color: "text-orange-300", icon: "</>" },
    java: { color: "text-rose-300", icon: "☕" },
    sql: { color: "text-violet-300", icon: "DB" },
    default: { color: "text-slate-400", icon: "◇" },
  }

  return iconMap[extension || "default"] || iconMap.default
}

function FileItem({
  node,
  depth,
  isLast,
  parentPath,
  selectedPath,
  onSelect,
  expandedIds,
  onToggleFolder,
}: FileItemProps) {
  const [localOpen, setLocalOpen] = useState(true)
  const isFolder = node.type === "folder"
  const hasChildren = isFolder && node.children && node.children.length > 0
  const fileIcon = getFileIcon(node.extension)
  const isSelected = node.type === "file" && selectedPath === node.path
  const isControlled = expandedIds !== undefined && onToggleFolder !== undefined
  const isOpen = isFolder
    ? isControlled
      ? expandedIds.has(node.id)
      : localOpen
    : false

  const handleClick = () => {
    if (isFolder) {
      if (isControlled) {
        onToggleFolder(node.id)
      } else {
        setLocalOpen((current) => !current)
      }
      return
    }

    if (node.path) {
      onSelect?.(node.path)
    }
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "group relative flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 ease-out",
          isSelected
            ? "bg-sky-400/12 text-white ring-1 ring-sky-300/20"
            : "text-slate-300 hover:bg-white/5 hover:text-white",
        )}
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {parentPath.map((showLine, index) =>
          showLine ? (
            <div
              key={`${node.id}-line-${index}`}
              className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/8"
              style={{ left: `${index * 16 + 16}px` }}
            />
          ) : null,
        )}

        {depth > 0 && (
          <div
            className={cn(
              "pointer-events-none absolute h-px w-3 bg-white/10",
              isLast && "bg-white/6",
            )}
            style={{ left: `${(depth - 1) * 16 + 16}px`, top: "50%" }}
          />
        )}

        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-200 ease-out",
            isFolder && isOpen && "rotate-90",
          )}
        >
          {isFolder ? (
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              className="text-slate-400 transition-colors duration-200 group-hover:text-sky-300"
            >
              <path
                d="M1 1L5 4L1 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span className={cn("text-[10px] leading-none transition-opacity duration-200", fileIcon.color)}>
              {fileIcon.icon}
            </span>
          )}
        </div>

        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all duration-200",
            isFolder
              ? "text-sky-300/85 group-hover:scale-110 group-hover:text-sky-200"
              : cn(fileIcon.color, "opacity-80 group-hover:scale-110 group-hover:opacity-100"),
          )}
        >
          {isFolder ? (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" opacity="0.85">
              <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V14.5C0 15.3284 0.671573 16 1.5 16H12.5C13.3284 16 14 15.3284 14 14.5V4.5L9.5 0H1.5Z" />
              <path d="M9 0V4.5H14" fill="currentColor" fillOpacity="0.45" />
            </svg>
          )}
        </div>

        <span
          className={cn(
            "truncate font-mono text-[13px] transition-colors duration-200",
            isFolder
              ? "text-slate-100/90 group-hover:text-white"
              : isSelected
                ? "text-white"
                : "text-slate-400 group-hover:text-slate-100",
          )}
        >
          {node.name}
        </span>

        <div
          className={cn(
            "absolute right-2 h-1.5 w-1.5 rounded-full bg-sky-300 transition-all duration-200",
            isSelected
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100",
          )}
        />
      </div>

      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {node.children!.map((child, index) => (
            <FileItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              parentPath={[...parentPath, !isLast]}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({
  data,
  className,
  selectedPath,
  onSelect,
  expandedIds,
  onToggleFolder,
  headerTitle = "explorer",
  meta,
}: FileTreeProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border border-white/10 bg-slate-950/45 p-3 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 border-b border-white/8 pb-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400/85" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-300/85" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/85" />
        </div>
        <span className="ml-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          {headerTitle}
        </span>
        {meta && <span className="ml-auto text-[11px] text-slate-500">{meta}</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <div className="space-y-0.5">
          {data.map((node, index) => (
            <FileItem
              key={node.id}
              node={node}
              depth={0}
              isLast={index === data.length - 1}
              parentPath={[]}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
