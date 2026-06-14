import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  icon?: React.ReactNode
  className?: string
  delay?: number
}

export function StatCard({
  title,
  value,
  change,
  icon,
  className,
  delay = 0,
}: StatCardProps) {
  const getTrendColor = () => {
    if (change?.trend === "up") return "text-green-500"
    if (change?.trend === "down") return "text-red-500"
    return "text-gray-500"
  }

  const getTrendIcon = () => {
    if (change?.trend === "up") return "↑"
    if (change?.trend === "down") return "↓"
    return "→"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("hover:shadow-lg transition-shadow", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground">{icon}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <p className={cn("text-xs mt-1", getTrendColor())}>
              {getTrendIcon()} {Math.abs(change.value)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
