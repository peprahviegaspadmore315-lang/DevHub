import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface SearchComponentProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  name?: string
}

const SearchComponent = ({
  placeholder = 'Search topics, lessons, or courses...',
  value,
  defaultValue = '',
  onChange,
  onSearch,
  className,
  name = 'search',
}: SearchComponentProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const inputValue = value !== undefined ? value : internalValue

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch?.(inputValue.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex w-full max-w-[280px] items-center justify-center', className)}>
      <div className="absolute -z-10 min-h-full w-full" />
      <div className="group relative flex w-full items-center justify-center">
        <div className="absolute -z-10 h-full w-full max-h-[62px] overflow-hidden rounded-xl blur-[3px] before:absolute before:left-1/2 before:top-1/2 before:-z-20 before:h-[999px] before:w-[999px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[60deg] before:bg-[conic-gradient(#eff6ff,#317efb_6%,#eff6ff_38%,#eff6ff_50%,#22d3ee_62%,#eff6ff_88%)] before:bg-no-repeat before:content-[''] before:transition-all before:duration-[2000ms] group-hover:before:-rotate-[120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]" />
        <div className="absolute -z-10 h-full w-full max-h-[58px] overflow-hidden rounded-xl blur-[3px] before:absolute before:left-1/2 before:top-1/2 before:-z-20 before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg] before:bg-[conic-gradient(rgba(255,255,255,0),#bfdbfe,rgba(255,255,255,0)_12%,rgba(255,255,255,0)_50%,#a5f3fc,rgba(255,255,255,0)_62%)] before:bg-no-repeat before:content-[''] before:transition-all before:duration-[2000ms] group-hover:before:-rotate-[98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]" />
        <div className="absolute -z-10 h-full w-full max-h-[56px] overflow-hidden rounded-lg blur-[2px] before:absolute before:left-1/2 before:top-1/2 before:-z-20 before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg] before:bg-[conic-gradient(rgba(255,255,255,0)_0%,#dbeafe,rgba(255,255,255,0)_8%,rgba(255,255,255,0)_50%,#cffafe,rgba(255,255,255,0)_58%)] before:bg-no-repeat before:brightness-125 before:content-[''] before:transition-all before:duration-[2000ms] group-hover:before:-rotate-[97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]" />
        <div className="absolute -z-10 h-full w-full max-h-[52px] overflow-hidden rounded-xl blur-[0.5px] before:absolute before:left-1/2 before:top-1/2 before:-z-20 before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[70deg] before:bg-[conic-gradient(#e0f2fe,#317efb_5%,#e0f2fe_14%,#e0f2fe_50%,#06b6d4_60%,#e0f2fe_64%)] before:bg-no-repeat before:brightness-125 before:content-[''] before:transition-all before:duration-[2000ms] group-hover:before:-rotate-[110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]" />

        <div className="relative w-full">
          <input
            placeholder={placeholder}
            type="text"
            name={name}
            value={inputValue}
            onChange={(event) => handleValueChange(event.target.value)}
            autoComplete="off"
            className="h-[48px] w-full rounded-lg border border-white/70 bg-white/95 px-[46px] pr-[48px] text-sm text-slate-800 shadow-[0_10px_28px_rgba(49,126,251,0.14)] placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900/95 dark:text-white dark:placeholder:text-slate-500"
          />

          <div className="pointer-events-none absolute left-4 top-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="20" fill="none" className="feather feather-search">
              <circle stroke="url(#search)" r="8" cy="11" cx="11" />
              <line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22" />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#f8e7f8" offset="0%" />
                  <stop stopColor="#b6a9b7" offset="50%" />
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#b6a9b7" offset="0%" />
                  <stop stopColor="#837484" offset="50%" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="pointer-events-none absolute left-[54px] top-[14px] h-[18px] w-[88px] bg-gradient-to-r from-transparent to-white group-focus-within:hidden dark:to-slate-900" />
          <div className="pointer-events-none absolute left-[5px] top-[8px] h-[18px] w-[26px] bg-sky-300 opacity-80 blur-2xl transition-all duration-[2000ms] group-hover:opacity-0 dark:bg-cyan-400" />

          <div className="absolute right-[6px] top-[6px] h-[36px] w-[36px] overflow-hidden rounded-lg before:absolute before:left-1/2 before:top-1/2 before:h-[600px] before:w-[600px] before:-translate-x-1/2 before:-translate-y-1/2 before:animate-[spin_12s_linear_infinite] before:bg-[conic-gradient(rgba(255,255,255,0),#93c5fd,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_50%,#67e8f9,rgba(255,255,255,0)_100%)] before:bg-no-repeat before:brightness-125 before:content-['']" />

          <button
            type="submit"
            className="absolute right-1.5 top-1.5 z-[2] flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-sky-100 bg-gradient-to-b from-sky-50 via-white to-cyan-50 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
            aria-label="Submit search"
          >
            <svg preserveAspectRatio="none" height="22" width="22" viewBox="4.8 4.56 14.832 15.408" fill="none">
              <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#317EFB" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchComponent
