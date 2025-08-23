"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NeonButtonProps extends ButtonProps {
  neonColor?: 'cyan' | 'purple' | 'green' | 'pink'
  pulse?: boolean
}

export function NeonButton({ 
  children, 
  className, 
  neonColor = 'cyan',
  pulse = false,
  asChild,
  ...props 
}: NeonButtonProps) {
  const colorClasses = {
    cyan: 'text-neon-cyan border-neon-cyan/50 hover:border-neon-cyan hover:shadow-neon-cyan/50 hover:text-black',
    purple: 'text-neon-purple border-neon-purple/50 hover:border-neon-purple hover:shadow-neon-purple/50 hover:text-black',
    green: 'text-neon-green border-neon-green/50 hover:border-neon-green hover:shadow-neon-green/50 hover:text-black',
    pink: 'text-neon-pink border-neon-pink/50 hover:border-neon-pink hover:shadow-neon-pink/50 hover:text-black'
  }

  const glowClasses = {
    cyan: 'hover:bg-neon-cyan/10',
    purple: 'hover:bg-neon-purple/10', 
    green: 'hover:bg-neon-green/10',
    pink: 'hover:bg-neon-pink/10'
  }

  // If asChild is true, we need to be more careful about children structure
  if (asChild) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={pulse ? 'animate-pulse-neon' : ''}
      >
        <Button
          variant="cyber"
          asChild
          className={cn(
            colorClasses[neonColor],
            glowClasses[neonColor],
            'relative overflow-hidden group transition-all duration-300',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-current before:to-transparent',
            'before:translate-x-[-100%] before:opacity-0 hover:before:translate-x-[100%] hover:before:opacity-20',
            'before:transition-transform before:duration-700',
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={pulse ? 'animate-pulse-neon' : ''}
    >
      <Button
        variant="cyber"
        className={cn(
          colorClasses[neonColor],
          glowClasses[neonColor],
          'relative overflow-hidden group transition-all duration-300',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-current before:to-transparent',
          'before:translate-x-[-100%] before:opacity-0 hover:before:translate-x-[100%] hover:before:opacity-20',
          'before:transition-transform before:duration-700',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  )
}