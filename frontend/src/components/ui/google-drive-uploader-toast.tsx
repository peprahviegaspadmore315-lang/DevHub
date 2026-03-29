"use client"

import * as React from "react"
import { create } from "zustand"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  File,
  FileArchive,
  FileAudio,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Presentation,
  X,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type UploadStatus = "UPLOADING" | "SUCCESS" | "ERROR"

export interface UploadItem {
  contextLabel?: string
  error?: string
  fileName: string
  fileType: string
  id: string
  progress: number
  status: UploadStatus
}

interface CreateUploadItemInput {
  contextLabel?: string
  fileName: string
  fileType: string
}

interface UploadToastStore {
  addItem: (input: CreateUploadItemInput) => string
  clearAll: () => void
  items: UploadItem[]
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<UploadItem>) => void
}

const useUploadToastStore = create<UploadToastStore>((set) => ({
  addItem: ({ contextLabel, fileName, fileType }) => {
    const id = Math.random().toString(36).slice(2, 11)

    set((state) => ({
      items: [
        ...state.items,
        {
          contextLabel,
          fileName,
          fileType,
          id,
          progress: 0,
          status: "UPLOADING",
        },
      ],
    }))

    return id
  },
  clearAll: () => set({ items: [] }),
  items: [],
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
}))

export const uploadToast = {
  addItem: (input: CreateUploadItemInput) =>
    useUploadToastStore.getState().addItem(input),
  clearAll: () => useUploadToastStore.getState().clearAll(),
  removeItem: (id: string) => useUploadToastStore.getState().removeItem(id),
  updateItem: (id: string, updates: Partial<UploadItem>) =>
    useUploadToastStore.getState().updateItem(id, updates),
}

const FILE_TYPES = {
  css: { color: "text-sky-500", icon: FileCode2 },
  doc: { color: "text-blue-500", icon: FileText },
  docx: { color: "text-blue-500", icon: FileText },
  gif: { color: "text-amber-500", icon: FileImage },
  html: { color: "text-orange-500", icon: FileCode2 },
  jpeg: { color: "text-amber-500", icon: FileImage },
  jpg: { color: "text-amber-500", icon: FileImage },
  js: { color: "text-indigo-500", icon: FileCode2 },
  json: { color: "text-emerald-500", icon: FileCode2 },
  mp3: { color: "text-pink-500", icon: FileAudio },
  mp4: { color: "text-violet-500", icon: FileVideo },
  pdf: { color: "text-rose-500", icon: FileText },
  png: { color: "text-amber-500", icon: FileImage },
  ppt: { color: "text-orange-500", icon: Presentation },
  pptx: { color: "text-orange-500", icon: Presentation },
  py: { color: "text-cyan-500", icon: FileCode2 },
  txt: { color: "text-slate-500", icon: FileText },
  webp: { color: "text-amber-500", icon: FileImage },
  xls: { color: "text-emerald-500", icon: FileSpreadsheet },
  xlsx: { color: "text-emerald-500", icon: FileSpreadsheet },
  zip: { color: "text-slate-500", icon: FileArchive },
} as const

const getFileConfig = (fileType: string) =>
  FILE_TYPES[fileType.toLowerCase() as keyof typeof FILE_TYPES] ?? {
    color: "text-slate-400",
    icon: File,
  }

const formatContextLabel = (label?: string) => {
  if (!label) {
    return "upload"
  }

  return label
}

const getHeaderCopy = (items: UploadItem[]) => {
  const uploadingCount = items.filter((item) => item.status === "UPLOADING").length
  const erroredCount = items.filter((item) => item.status === "ERROR").length
  const latestContextLabel = items[items.length - 1]?.contextLabel

  if (uploadingCount > 0) {
    return {
      subtitle: `Optimizing ${formatContextLabel(latestContextLabel)} for your DevHub experience.`,
      title: `Uploading ${uploadingCount} item${uploadingCount > 1 ? "s" : ""}`,
    }
  }

  if (erroredCount > 0) {
    return {
      subtitle: "A few files need another try. You can clear them or upload again.",
      title: "Upload attention needed",
    }
  }

  return {
    subtitle: "Everything is processed and ready to use in your profile.",
    title: "Upload complete",
  }
}

const CircleProgress = ({ progress }: { progress: number }) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)
  const circumference = 2 * Math.PI * 10
  const offset = circumference - (normalizedProgress / 100) * circumference

  return (
    <div className="relative h-5 w-5">
      <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
        <circle
          className="stroke-sky-100 dark:stroke-slate-700"
          strokeWidth="3"
          fill="none"
          r="10"
          cx="12"
          cy="12"
        />
        <circle
          className="stroke-sky-500 transition-all duration-300 dark:stroke-cyan-400"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          r="10"
          cx="12"
          cy="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  )
}

const FileTypeIcon = ({
  className,
  fileType,
}: {
  className?: string
  fileType: string
}) => {
  const { color, icon: Icon } = getFileConfig(fileType)

  return <Icon className={cn("h-4.5 w-4.5", color, className)} />
}

const StatusIcon = ({ status }: { status: UploadStatus }) => {
  if (status === "SUCCESS") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  }

  if (status === "ERROR") {
    return <XCircle className="h-5 w-5 text-rose-500" />
  }

  return null
}

const getItemDescription = (item: UploadItem) => {
  if (item.status === "UPLOADING") {
    return item.contextLabel
      ? `Preparing ${item.contextLabel} for DevHub`
      : "Uploading file"
  }

  if (item.status === "SUCCESS") {
    return item.contextLabel
      ? `${item.contextLabel} is ready to save`
      : "Finished successfully"
  }

  return item.error ?? "Upload failed. Please try again."
}

const UploadItemRow = ({
  item,
  onRemove,
}: {
  item: UploadItem
  onRemove: (id: string) => void
}) => (
  <div className="flex items-start justify-between gap-3 py-3">
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/70 dark:border-slate-700 dark:bg-slate-900/70">
        <FileTypeIcon fileType={item.fileType} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-slate-800 dark:text-slate-100"
          title={item.fileName}
        >
          {item.fileName}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {getItemDescription(item)}
        </p>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-2">
      {item.status === "UPLOADING" ? (
        <div className="relative group">
          <CircleProgress progress={item.progress} />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100 group-hover:bg-slate-900/6 dark:group-hover:bg-white/10"
            aria-label="Remove upload item"
          >
            <X className="h-3 w-3 text-slate-500 dark:text-slate-300" />
          </button>
        </div>
      ) : (
        <>
          <StatusIcon status={item.status} />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-900 hover:text-white dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Dismiss upload item"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  </div>
)

export const DriveUploadToastViewport = ({
  className,
}: {
  className?: string
}) => {
  const items = useUploadToastStore((state) => state.items)
  const removeItem = useUploadToastStore((state) => state.removeItem)
  const clearAll = useUploadToastStore((state) => state.clearAll)
  const [isExpanded, setIsExpanded] = React.useState(true)

  if (items.length === 0) {
    return null
  }

  const { subtitle, title } = getHeaderCopy(items)

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 z-[1100] w-[min(24rem,calc(100vw-1.5rem))]",
        className
      )}
    >
      <div className="overflow-hidden rounded-[1.6rem] border border-sky-200/70 bg-white/95 shadow-[0_28px_70px_-38px_rgba(14,165,233,0.55)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex items-start justify-between gap-4 border-b border-sky-100/80 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded((currentValue) => !currentValue)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label={isExpanded ? "Collapse upload list" : "Expand upload list"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Clear all upload items"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isExpanded ? (
          <div className="max-h-72 overflow-y-auto px-4">
            {items
              .slice()
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="border-b border-slate-100/90 last:border-b-0 dark:border-slate-800"
                >
                  <UploadItemRow item={item} onRemove={removeItem} />
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const demoFileTypes = [
  { fileName: "avatar-photo.jpg", fileType: "jpg", label: "Profile image" },
  { fileName: "notes.pdf", fileType: "pdf", label: "Study notes" },
  { fileName: "project.zip", fileType: "zip", label: "Project archive" },
  { fileName: "preview.mp4", fileType: "mp4", label: "Video clip" },
] as const

export const GoogleDriveUploaderToastDemo = () => {
  const items = useUploadToastStore((state) => state.items)

  const startDemoUpload = (fileName: string, fileType: string) => {
    const id = uploadToast.addItem({
      contextLabel: "demo upload",
      fileName,
      fileType,
    })

    let progress = 0

    const interval = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 16 + 10, 96)
      uploadToast.updateItem(id, { progress: Math.round(progress) })

      if (progress >= 96) {
        window.clearInterval(interval)
        const isSuccess = Math.random() > 0.2

        uploadToast.updateItem(id, {
          error: isSuccess ? undefined : "Upload failed. Please try again.",
          progress: 100,
          status: isSuccess ? "SUCCESS" : "ERROR",
        })
      }
    }, 180)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-sky-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
            Demo
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
            DevHub upload toast
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Trigger a few uploads to preview how the toast behaves in the bottom-right corner.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {demoFileTypes.map((item) => (
            <button
              key={item.fileName}
              type="button"
              onClick={() => startDemoUpload(item.fileName, item.fileType)}
              className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-4 text-left transition hover:border-sky-200 hover:bg-sky-100/70 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div className="flex items-center gap-2">
                <FileTypeIcon fileType={item.fileType} />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.label}
                </span>
              </div>
              <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {item.fileName}
              </p>
            </button>
          ))}
        </div>

        {items.length > 0 ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Watch the upload status card in the lower-right corner update in real time.
          </p>
        ) : null}
      </div>

      <DriveUploadToastViewport />
    </div>
  )
}
