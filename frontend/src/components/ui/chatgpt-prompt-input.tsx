"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import {
  BookOpen,
  Code2,
  ImagePlus,
  Lightbulb,
  Mic,
  Plus,
  Search,
  SendHorizontal,
  Settings2,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export interface PromptTool {
  id: string
  name: string
  shortName: string
  description: string
  icon: LucideIcon
  extra?: string
}

export interface PromptSubmitPayload {
  imageFile: File | null
  imagePreview: string | null
  message: string
  selectedTool: string | null
}

export const learningPromptTools: PromptTool[] = [
  {
    id: "course-help",
    name: "Use lesson context",
    shortName: "Lesson",
    description: "Keep the answer grounded in the course you are viewing.",
    icon: BookOpen,
  },
  {
    id: "explain-code",
    name: "Explain code",
    shortName: "Explain",
    description: "Break down snippets, bugs, and programming concepts clearly.",
    icon: Code2,
  },
  {
    id: "quick-research",
    name: "Research a concept",
    shortName: "Research",
    description: "Compare ideas, patterns, and best-practice guidance quickly.",
    icon: Search,
  },
  {
    id: "generate-ideas",
    name: "Generate examples",
    shortName: "Examples",
    description: "Create practical examples, exercises, or study prompts.",
    icon: Sparkles,
  },
  {
    id: "think-longer",
    name: "Think longer",
    shortName: "Focus",
    description: "Spend more effort on the reasoning before answering.",
    icon: Lightbulb,
  },
]

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean
  }
>(({ className, sideOffset = 8, showArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-xl border border-sky-100 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-lg shadow-sky-100/60 backdrop-blur data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {props.children}
      {showArrow ? <TooltipPrimitive.Arrow className="fill-white" /> : null}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 10, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-[min(22rem,calc(100vw-3rem))] rounded-3xl border border-sky-100 bg-white/98 p-2 text-slate-900 shadow-2xl shadow-sky-100/60 outline-none backdrop-blur data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const Dialog = DialogPrimitive.Root

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[min(92vw,44rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/20 bg-white p-2 shadow-2xl shadow-slate-950/30 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
        <X className="h-4 w-4" />
        <span className="sr-only">Close image preview</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export interface PromptBoxProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "defaultValue" | "onChange" | "onSubmit" | "value"
  > {
  isLoading?: boolean
  onSubmit?: (payload: PromptSubmitPayload) => Promise<void> | void
  onValueChange: (value: string) => void
  onVoiceClick?: () => void
  tools?: PromptTool[]
  value: string
  voiceActive?: boolean
}

export const PromptBox = React.forwardRef<HTMLTextAreaElement, PromptBoxProps>(
  (
    {
      className,
      disabled,
      isLoading = false,
      onKeyDown,
      onPaste,
      onSubmit,
      onValueChange,
      onVoiceClick,
      placeholder = "Ask for help with code, lessons, or debugging...",
      tools = learningPromptTools,
      value,
      voiceActive = false,
      ...props
    },
    ref
  ) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [imageFile, setImageFile] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [selectedTool, setSelectedTool] = React.useState<string | null>(null)

    React.useImperativeHandle(ref, () => internalTextareaRef.current as HTMLTextAreaElement, [])

    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current

      if (!textarea) {
        return
      }

      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`
    }, [value])

    const activeTool = React.useMemo(
      () => tools.find((tool) => tool.id === selectedTool) ?? null,
      [selectedTool, tools]
    )

    const loadImageFile = React.useCallback((file: File | null) => {
      if (!file || !file.type.startsWith("image/")) {
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImageFile(file)
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange(event.target.value)
    }

    const handleAttachClick = () => {
      if (disabled || isLoading) {
        return
      }

      fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file || !file.type.startsWith("image/")) {
        event.target.value = ""
        return
      }

      loadImageFile(file)
      event.target.value = ""
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      onPaste?.(event)

      if (event.defaultPrevented) {
        return
      }

      const clipboardItems = Array.from(event.clipboardData?.items ?? [])
      const imageItem = clipboardItems.find((item) => item.type.startsWith("image/"))
      const imageFile = imageItem?.getAsFile() ?? null

      if (!imageFile) {
        return
      }

      event.preventDefault()
      loadImageFile(imageFile)
    }

    const clearAttachment = (event?: React.MouseEvent<HTMLButtonElement>) => {
      event?.stopPropagation()
      setImageFile(null)
      setImagePreview(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    const resetComposer = () => {
      onValueChange("")
      setSelectedTool(null)
      clearAttachment()
    }

    const hasValue = value.trim().length > 0 || Boolean(imagePreview)

    const handleSubmit = async () => {
      if (!hasValue || disabled || isLoading || !onSubmit) {
        return
      }

      const draftValue = value
      const draftTool = selectedTool
      const draftImageFile = imageFile
      const draftImagePreview = imagePreview
      const trimmedMessage = value.trim()

      resetComposer()

      try {
        await onSubmit({
          imageFile: draftImageFile,
          imagePreview: draftImagePreview,
          message: trimmedMessage,
          selectedTool: draftTool,
        })
      } catch {
        // Restore the draft only if submission fails, so users can retry quickly.
        onValueChange(draftValue)
        setSelectedTool(draftTool)
        setImageFile(draftImageFile)
        setImagePreview(draftImagePreview)
      }
    }

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event)

      if (
        event.defaultPrevented ||
        event.key !== "Enter" ||
        event.shiftKey ||
        (event.nativeEvent as KeyboardEvent).isComposing
      ) {
        return
      }

      event.preventDefault()
      await handleSubmit()
    }

    const ActiveToolIcon = activeTool?.icon

    return (
      <div
        className={cn(
          "rounded-[28px] border border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-2 shadow-[0_18px_40px_-28px_rgba(14,165,233,0.55)] transition-shadow focus-within:shadow-[0_20px_48px_-26px_rgba(14,165,233,0.62)]",
          className
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {imagePreview ? (
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <div className="px-1 pb-1 pt-1">
              <div className="relative inline-flex rounded-2xl border border-sky-100 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  className="overflow-hidden rounded-[1rem]"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <img
                    src={imagePreview}
                    alt="Attached preview"
                    className="h-20 w-20 object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove attached image</span>
                </button>
              </div>
            </div>
            <DialogContent>
              <img
                src={imagePreview}
                alt="Attached preview"
                className="max-h-[80vh] w-full rounded-[1.5rem] object-contain"
              />
            </DialogContent>
          </Dialog>
        ) : null}

        <textarea
          ref={internalTextareaRef}
          rows={1}
          value={value}
          disabled={disabled || isLoading}
          placeholder={placeholder}
          className="min-h-12 w-full resize-none border-0 bg-transparent px-3 py-3 text-[0.97rem] leading-6 text-slate-900 outline-none placeholder:text-slate-500"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          {...props}
        />

        <div className="mt-1 flex flex-wrap items-center gap-2 px-1 pb-1">
          <TooltipProvider delayDuration={120}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleAttachClick}
                  disabled={disabled || isLoading}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-slate-600 transition hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span className="sr-only">Attach screenshot</span>
                </button>
              </TooltipTrigger>
              <TooltipContent showArrow>
                <p>Attach screenshot</p>
              </TooltipContent>
            </Tooltip>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={disabled || isLoading}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-sky-100 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Settings2 className="h-4 w-4" />
                      {!activeTool ? <span>Focus</span> : null}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent showArrow>
                  <p>Choose response focus</p>
                </TooltipContent>
              </Tooltip>

              <PopoverContent>
                <div className="mb-1 px-2 pb-1 pt-1">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-sky-700">
                    AI Tools
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Give the assistant a little more context before you send.
                  </p>
                </div>

                <div className="space-y-1">
                  {tools.map((tool) => {
                    const ToolIcon = tool.icon
                    const isActive = selectedTool === tool.id

                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => {
                          setSelectedTool(tool.id)
                          setIsPopoverOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                          isActive
                            ? "bg-sky-50 text-sky-900"
                            : "hover:bg-slate-50"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                            isActive
                              ? "bg-sky-100 text-sky-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          <ToolIcon className="h-4.5 w-4.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            {tool.name}
                            {tool.extra ? (
                              <span className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-medium text-slate-500 shadow-sm">
                                {tool.extra}
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {tool.description}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {activeTool && ActiveToolIcon ? (
              <>
                <div className="h-5 w-px bg-sky-100" />
                <button
                  type="button"
                  onClick={() => setSelectedTool(null)}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-sky-50 px-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  <ActiveToolIcon className="h-4 w-4" />
                  <span>{activeTool.shortName}</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : null}

            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onVoiceClick}
                    disabled={disabled || isLoading}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-50",
                      voiceActive
                        ? "border-sky-200 bg-sky-50 text-sky-700 shadow-sm shadow-sky-100"
                        : "border-transparent hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700"
                    )}
                  >
                    <Mic className="h-4.5 w-4.5" />
                    <span className="sr-only">Use voice input</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent showArrow>
                  <p>{voiceActive ? "Stop voice input" : "Voice input"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      void handleSubmit()
                    }}
                    disabled={!hasValue || disabled || isLoading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0ea5e9_0%,#0284c7_100%)] text-white shadow-lg shadow-sky-300/50 transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white disabled:shadow-none"
                  >
                    {isLoading ? (
                      <ImagePlus className="h-4.5 w-4.5 animate-pulse" />
                    ) : (
                      <SendHorizontal className="h-4.5 w-4.5" />
                    )}
                    <span className="sr-only">Send message</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent showArrow>
                  <p>{isLoading ? "Sending" : "Send message"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    )
  }
)

PromptBox.displayName = "PromptBox"
