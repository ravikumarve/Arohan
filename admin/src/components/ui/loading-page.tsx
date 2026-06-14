import * as React from "react"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface LoadingPageProps {
  message?: string
  className?: string
}

export function LoadingPage({ message = "Loading...", className }: LoadingPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center min-h-screen bg-background",
        className
      )}
    >
      <LoadingSpinner size="lg" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-muted-foreground"
      >
        {message}
      </motion.p>
    </motion.div>
  )
}
