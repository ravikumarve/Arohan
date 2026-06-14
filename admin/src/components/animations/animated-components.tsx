import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

export const scaleOut: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
}

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
}

export const slideInFromTop: Variants = {
  hidden: { y: "-100%" },
  visible: { y: 0 },
  exit: { y: "-100%" },
}

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Animated wrapper components
interface AnimatedWrapperProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  delay?: number
  duration?: number
}

export function AnimatedWrapper({
  children,
  variants = fadeIn,
  className,
  delay = 0,
  duration = 0.3,
}: AnimatedWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerWrapperProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerWrapper({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        ...staggerContainer,
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={staggerItem}>{child}</motion.div>
      ))}
    </motion.div>
  )
}

// Page transition
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// List animation
export function AnimatedList({
  items,
  renderItem,
  className,
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={staggerItem}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}
