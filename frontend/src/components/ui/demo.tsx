import { useState } from "react"

import AnimatedNumberFlip from "@/components/ui/animated-number-flip"
import { Button } from "@/components/ui/button"
import { GoogleDriveUploaderToastDemo } from "@/components/ui/google-drive-uploader-toast"
import { OrbitalLoader } from "@/components/ui/orbital-loader"
import { ToastProvider, ToastShowcaseDemo } from "@/components/ui/toast-1"

const DemoOne = () => {
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <AnimatedNumberFlip value={page} />
      <div className="flex gap-4">
        <Button onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}>
          Prev
        </Button>
        <Button onClick={() => setPage((currentPage) => currentPage + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

const DriveUploadToastDemo = () => <GoogleDriveUploaderToastDemo />

const DevHubToastDemo = () => (
  <ToastProvider>
    <ToastShowcaseDemo />
  </ToastProvider>
)

const OrbitalLoaderDemo = () => (
  <div className="flex min-h-[20rem] items-center justify-center rounded-[2rem] bg-gradient-to-br from-white via-slate-50 to-sky-50/70 p-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
    <OrbitalLoader
      message="Loading the next DevHub experience..."
      size="lg"
    />
  </div>
)

export { DemoOne, DriveUploadToastDemo, DevHubToastDemo, OrbitalLoaderDemo }
