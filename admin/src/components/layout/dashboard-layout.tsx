import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  sidebar?: React.ReactNode
}

export function DashboardLayout({
  children,
  className,
  header,
  sidebar,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-background">
      {header && (
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        >
          {header}
        </motion.header>
      )}

      <div className="flex">
        {sidebar && (
          <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 280 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r overflow-hidden",
              !sidebarOpen && "w-0"
            )}
          >
            {sidebar}
          </motion.aside>
        )}

        <motion.main
          initial={false}
          animate={{ marginLeft: sidebarOpen ? 280 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] p-6",
            className
          )}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
