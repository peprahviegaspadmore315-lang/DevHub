type ClassDictionary = Record<string, boolean | null | undefined>
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassValue[]

const toClassName = (value: ClassValue): string => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(' ')
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className)
      .join(' ')
  }

  return ''
}

export const cn = (...inputs: ClassValue[]) =>
  inputs
    .map(toClassName)
    .filter(Boolean)
    .join(' ')
