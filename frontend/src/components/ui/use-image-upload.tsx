import { useCallback, useEffect, useRef, useState } from "react"

import { uploadToast } from "@/components/ui/google-drive-uploader-toast"

interface UseImageUploadProps {
  initialUrl?: string | null
  onUpload?: (url: string) => void
  onRemove?: () => void
  onError?: (message: string) => void
  maxDimension?: number
  quality?: number
  uploadContextLabel?: string
}

const DEFAULT_MAX_DIMENSION = 320
const DEFAULT_QUALITY = 0.82
const DEFAULT_UPLOAD_CONTEXT_LABEL = "profile image"

const getFileType = (file: File) =>
  file.name.split(".").pop()?.toLowerCase() ??
  file.type.split("/").pop()?.toLowerCase() ??
  "file"

const createProgressSimulator = (id: string) => {
  let progress = 8

  uploadToast.updateItem(id, { progress })

  const interval = window.setInterval(() => {
    progress = Math.min(progress + Math.max(4, (88 - progress) * 0.18), 88)
    uploadToast.updateItem(id, { progress: Math.round(progress) })
  }, 110)

  return () => {
    window.clearInterval(interval)
  }
}

const resizeImageFile = (
  file: File,
  maxDimension: number,
  quality: number,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error("Failed to read image file"))
    reader.onload = () => {
      const image = new Image()

      image.onerror = () => reject(new Error("Failed to process image file"))
      image.onload = () => {
        const scale = Math.min(
          1,
          maxDimension / image.width,
          maxDimension / image.height,
        )

        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext("2d")
        if (!context) {
          reject(new Error("Failed to prepare image upload"))
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }

      image.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })

export function useImageUpload({
  initialUrl = null,
  onUpload,
  onRemove,
  onError,
  maxDimension = DEFAULT_MAX_DIMENSION,
  quality = DEFAULT_QUALITY,
  uploadContextLabel = DEFAULT_UPLOAD_CONTEXT_LABEL,
}: UseImageUploadProps = {}) {
  const objectPreviewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const clearObjectPreview = useCallback(() => {
    if (objectPreviewRef.current) {
      URL.revokeObjectURL(objectPreviewRef.current)
      objectPreviewRef.current = null
    }
  }, [])

  useEffect(() => {
    clearObjectPreview()
    setPreviewUrl(initialUrl)
    if (!initialUrl) {
      setFileName(null)
    }
  }, [clearObjectPreview, initialUrl])

  const processFile = useCallback(
    async (file: File) => {
      const fileType = getFileType(file)

      if (!file.type.startsWith("image/")) {
        const uploadId = uploadToast.addItem({
          contextLabel: uploadContextLabel,
          fileName: file.name,
          fileType,
        })

        uploadToast.updateItem(uploadId, {
          error: "Please choose a valid image file",
          progress: 100,
          status: "ERROR",
        })

        onError?.("Please choose a valid image file")
        return
      }

      const uploadId = uploadToast.addItem({
        contextLabel: uploadContextLabel,
        fileName: file.name,
        fileType,
      })
      const stopProgressSimulation = createProgressSimulator(uploadId)

      try {
        clearObjectPreview()
        const localPreviewUrl = URL.createObjectURL(file)
        objectPreviewRef.current = localPreviewUrl
        setPreviewUrl(localPreviewUrl)
        setFileName(file.name)

        const uploadedValue = await resizeImageFile(file, maxDimension, quality)
        onUpload?.(uploadedValue)
        stopProgressSimulation()
        uploadToast.updateItem(uploadId, {
          progress: 100,
          status: "SUCCESS",
        })
        window.setTimeout(() => {
          uploadToast.removeItem(uploadId)
        }, 4200)
      } catch (error) {
        stopProgressSimulation()
        clearObjectPreview()
        setPreviewUrl(initialUrl)
        uploadToast.updateItem(uploadId, {
          error:
            error instanceof Error ? error.message : "Failed to prepare image upload",
          progress: 100,
          status: "ERROR",
        })
        onError?.(
          error instanceof Error ? error.message : "Failed to prepare image upload",
        )
      }
    },
    [
      clearObjectPreview,
      initialUrl,
      maxDimension,
      onError,
      onUpload,
      quality,
      uploadContextLabel,
    ],
  )

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      await processFile(file)
      event.target.value = ""
    },
    [processFile],
  )

  const handleRemove = useCallback(() => {
    clearObjectPreview()
    setPreviewUrl(null)
    setFileName(null)
    setIsDragging(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onUpload?.("")
    onRemove?.()
  }, [clearObjectPreview, onRemove, onUpload])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)

      const file = event.dataTransfer.files?.[0]
      if (!file) {
        return
      }

      await processFile(file)
    },
    [processFile],
  )

  useEffect(() => {
    return () => {
      clearObjectPreview()
    }
  }, [clearObjectPreview])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    isDragging,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  }
}
