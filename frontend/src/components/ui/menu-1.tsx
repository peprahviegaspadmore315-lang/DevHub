"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const MenuTrigger = DropdownMenuTrigger
const MenuSub = DropdownMenuSub
const MenuSubTrigger = DropdownMenuSubTrigger
const MenuSection = DropdownMenuGroup
const MenuCollection = React.Fragment

const Menu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-h-[inherit] overflow-auto rounded-xl p-1", className)}
      {...props}
    />
  )
)
Menu.displayName = "Menu"

const MenuPopover = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "min-w-[12rem] rounded-2xl border border-border/70 bg-popover/95 p-2 text-popover-foreground shadow-2xl backdrop-blur-xl",
      className,
    )}
    {...props}
  />
))
MenuPopover.displayName = "MenuPopover"

const MenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
))
MenuItem.displayName = "MenuItem"

interface MenuHeaderProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuLabel> {
  inset?: boolean
  separator?: boolean
}

const MenuHeader = React.forwardRef<
  React.ElementRef<typeof DropdownMenuLabel>,
  MenuHeaderProps
>(({ className, inset, separator = true, ...props }, ref) => (
  <DropdownMenuLabel
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      separator && "mb-1 border-b border-border/60 pb-3",
      className,
    )}
    {...props}
  />
))
MenuHeader.displayName = "MenuHeader"

const MenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator
    ref={ref}
    className={cn("my-2 h-px bg-border/60", className)}
    {...props}
  />
))
MenuSeparator.displayName = "MenuSeparator"

const MenuKeyboard = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuShortcut>) => (
  <DropdownMenuShortcut
    className={cn("ml-auto text-[11px] uppercase tracking-[0.18em] opacity-60", className)}
    {...props}
  />
)
MenuKeyboard.displayName = "MenuKeyboard"

interface JollyMenuProps extends VariantProps<typeof buttonVariants> {
  label?: React.ReactNode
  children: React.ReactNode
  triggerClassName?: string
  popoverClassName?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
}

function JollyMenu({
  label,
  children,
  variant = "ghost",
  size = "default",
  triggerClassName,
  popoverClassName,
  align = "end",
  sideOffset = 8,
}: JollyMenuProps) {
  return (
    <DropdownMenu>
      <MenuTrigger asChild>
        <Button variant={variant} size={size} className={triggerClassName}>
          {label}
        </Button>
      </MenuTrigger>

      <MenuPopover align={align} sideOffset={sideOffset} className={popoverClassName}>
        <Menu>{children}</Menu>
      </MenuPopover>
    </DropdownMenu>
  )
}

export {
  MenuTrigger,
  Menu,
  MenuPopover,
  MenuItem,
  MenuHeader,
  MenuSeparator,
  MenuKeyboard,
  MenuSection,
  MenuSub,
  MenuSubTrigger,
  MenuCollection,
  JollyMenu,
}
export type { MenuHeaderProps, JollyMenuProps }
