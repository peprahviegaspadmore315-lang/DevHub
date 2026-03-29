"use client"

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon, ChevronDown, Check } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

const selectTriggerVariants = cva(
  'flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:border-ring/40 hover:bg-accent/40',
        outline: 'border-2 hover:border-ring/60',
        ghost: 'border-transparent bg-transparent hover:bg-accent/50',
      },
      size: {
        sm: 'h-9 px-2.5 text-xs',
        default: 'h-11 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const selectContentVariants = cva(
  'relative z-50 max-h-[320px] min-w-[8rem] overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-xl'
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value> & {
    placeholder?: string
  }
>(({ className, placeholder, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn('block truncate text-sm', className)}
    placeholder={
      placeholder ? (
        <span className="text-muted-foreground">{placeholder}</span>
      ) : undefined
    }
    {...props}
  />
))
SelectValue.displayName = SelectPrimitive.Value.displayName

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  icon?: LucideIcon
  startAdornment?: React.ReactNode
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant, size, icon: Icon, startAdornment, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn('group', selectTriggerVariants({ variant, size }), className)}
    {...props}
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {startAdornment ? (
        <span className="flex shrink-0 items-center">{startAdornment}</span>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  position?: 'popper' | 'item-aligned'
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', sideOffset = 8, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(selectContentVariants(), className)}
      position={position}
      sideOffset={sideOffset}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'max-h-[280px] overflow-y-auto p-2',
            position === 'popper'
              ? 'w-full min-w-[var(--radix-select-trigger-width)]'
              : 'w-full'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </motion.div>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-3 py-2 text-xs font-semibold text-muted-foreground', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: LucideIcon
  startAdornment?: React.ReactNode
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, icon: Icon, startAdornment, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-xl py-2.5 pl-3 pr-9 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <motion.div
      className="flex w-full items-center gap-2"
      whileHover={{ x: 2 }}
      transition={{ duration: 0.1 }}
    >
      {startAdornment ? (
        <span className="flex shrink-0 items-center">{startAdornment}</span>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </motion.div>
    <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.12 }}
        >
          <Check className="h-4 w-4" />
        </motion.div>
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}
