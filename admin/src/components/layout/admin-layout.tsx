import * as React from "react"
import { motion } from "framer-motion"
import AdminHeader from "../admin/AdminHeader"
import AdminSidebar from "../admin/AdminSidebar"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r overflow-hidden",
            !sidebarOpen && "w-0"
          )}
        >
          <AdminSidebar />
        </motion.aside>

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
