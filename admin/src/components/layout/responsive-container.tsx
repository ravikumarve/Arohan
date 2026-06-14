import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
  children: React.ReactNode
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
}

export function Container({
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: number
  children: React.ReactNode
}

export function ResponsiveGrid({
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${cols.mobile || 1}`,
        `md:grid-cols-${cols.tablet || 2}`,
        `lg:grid-cols-${cols.desktop || 3}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ResponsiveFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: {
    mobile?: "row" | "column"
    tablet?: "row" | "column"
    desktop?: "row" | "column"
  }
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
  gap?: number
  children: React.ReactNode
}

export function ResponsiveFlex({
  direction = { mobile: "column", tablet: "row", desktop: "row" },
  align = "center",
  justify = "start",
  gap = 4,
  className,
  children,
  ...props
}: ResponsiveFlexProps) {
  return (
    <div
      className={cn(
        "flex",
        `flex-${direction.mobile || "column"}`,
        `md:flex-${direction.tablet || "row"}`,
        `lg:flex-${direction.desktop || "row"}`,
        `items-${align}`,
        `justify-${justify}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
