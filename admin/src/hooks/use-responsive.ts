import * as React from "react"

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isAbove, setIsAbove] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]}px)`
    )

    setIsAbove(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setIsAbove(event.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [breakpoint])

  return isAbove
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)")
}
