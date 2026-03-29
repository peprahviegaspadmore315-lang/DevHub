export interface VideoResumeSelection {
  courseId: number
  courseSlug: string
  language: string
  topicSlug?: string
}

const VIDEO_RESUME_STORAGE_PREFIX = 'devhub-video-resume'

const getVideoResumeStorageKey = (userScope: string) =>
  `${VIDEO_RESUME_STORAGE_PREFIX}:${userScope}`

export const readVideoResumeSelection = (
  userScope: string,
): VideoResumeSelection | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(getVideoResumeStorageKey(userScope))
    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue) as Partial<VideoResumeSelection>
    if (
      typeof parsed.courseId !== 'number' ||
      typeof parsed.courseSlug !== 'string' ||
      typeof parsed.language !== 'string'
    ) {
      return null
    }

    return {
      courseId: parsed.courseId,
      courseSlug: parsed.courseSlug.trim(),
      language: parsed.language.trim(),
      topicSlug:
        typeof parsed.topicSlug === 'string' && parsed.topicSlug.trim()
          ? parsed.topicSlug.trim()
          : undefined,
    }
  } catch {
    return null
  }
}

export const saveVideoResumeSelection = (
  userScope: string,
  selection: VideoResumeSelection,
) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    getVideoResumeStorageKey(userScope),
    JSON.stringify(selection),
  )
}
