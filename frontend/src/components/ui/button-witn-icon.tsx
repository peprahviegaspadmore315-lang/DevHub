import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonWithIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

const ButtonWithIconDemo = ({
  label = 'Login / Sign up',
  className,
  type = 'button',
  ...props
}: ButtonWithIconProps) => {
  return (
    <Button
      type={type}
      className={cn(
        'group relative h-11 w-fit overflow-hidden rounded-full border border-sky-100 bg-white/95 p-1 ps-5 pe-12 text-sm font-semibold text-[#123a86] shadow-sm shadow-slate-900/10 transition-all duration-500 hover:bg-slate-50 hover:text-[#0f2f6b] hover:ps-12 hover:pe-5 focus-visible:ring-[#93c5fd] dark:border-white/15 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 dark:hover:text-white',
        className
      )}
      {...props}
    >
      <span className="relative z-10 whitespace-nowrap text-inherit transition-all duration-500">
        {label}
      </span>
      <span className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#317EFB] text-white transition-all duration-500 group-hover:right-[calc(100%-40px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </span>
    </Button>
  )
}

export default ButtonWithIconDemo
