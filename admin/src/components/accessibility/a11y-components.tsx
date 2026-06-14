import * as React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function VisuallyHidden({
  className,
  children,
  ...props
}: VisuallyHiddenProps) {
  return (
    <div
      className={cn(
        "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
}

export function SkipLink({ className, children, ...props }: SkipLinkProps) {
  return (
    <a
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
}

export function FocusTrap({ children, enabled = true }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener("keydown", handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener("keydown", handleTabKey)
    }
  }, [enabled])

  return <div ref={containerRef}>{children}</div>
}

interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  politeness?: "polite" | "assertive"
  children: React.ReactNode
}

export function LiveRegion({
  politeness = "polite",
  className,
  children,
  ...props
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn("sr-only", className)}
      {...props}
    >
      {children}
    </div>
  )
}
