"use client"

import type * as React from 'react'

import { cn } from '@/lib/utils'

interface CountryFlagProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  countryName: string
  emoji: string
}

const getEmojiAssetUrl = (emoji: string) => {
  const codePoints = Array.from(emoji)
    .map((character) => character.codePointAt(0)?.toString(16))
    .filter((value): value is string => Boolean(value))
    .join('-')

  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoints}.svg`
}

export function CountryFlag({
  className,
  countryName,
  decoding = 'async',
  emoji,
  loading = 'lazy',
  ...props
}: CountryFlagProps) {
  return (
    <img
      alt={`${countryName} flag`}
      className={cn('h-5 w-5 shrink-0 rounded-[4px] object-cover', className)}
      decoding={decoding}
      loading={loading}
      src={getEmojiAssetUrl(emoji)}
      {...props}
    />
  )
}
