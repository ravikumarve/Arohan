// Optimized Animation Components
// Reduces motion for accessibility and performance

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Fade in animation with reduced motion support
export const FadeIn = memo(({ children, delay = 0, duration = 0.3, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

FadeIn.displayName = 'FadeIn';

// Slide up animation with reduced motion support
export const SlideUp = memo(({ children, delay = 0, duration = 0.3, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

SlideUp.displayName = 'SlideUp';

// Scale animation with reduced motion support
export const ScaleIn = memo(({ children, delay = 0, duration = 0.3, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScaleIn.displayName = 'ScaleIn';

// Stagger children animation
export const StaggerChildren = memo(({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

StaggerChildren.displayName = 'StaggerChildren';

// Optimized list item animation
export const ListItem = memo(({ children, index = 0, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ListItem.displayName = 'ListItem';

// Optimized card hover animation
export const CardHover = memo(({ children, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { 
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={shouldReduceMotion ? {} : { 
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

CardHover.displayName = 'CardHover';

// Optimized button press animation
export const ButtonPress = memo(({ children, className = '' }: any) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileTap={shouldReduceMotion ? {} : { 
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
});

ButtonPress.displayName = 'ButtonPress';
