"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface CyberCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'cyan' | 'purple' | 'green' | 'pink'
  animated?: boolean
}

export function CyberCard({ 
  children, 
  className, 
  glowColor = 'cyan',
  animated = true,
  ...props 
}: CyberCardProps) {
  const glowClasses = {
    cyan: 'hover:shadow-neon-cyan/20 border-neon-cyan/20',
    purple: 'hover:shadow-neon-purple/20 border-neon-purple/20',
    green: 'hover:shadow-neon-green/20 border-neon-green/20', 
    pink: 'hover:shadow-neon-pink/20 border-neon-pink/20'
  }

  const CardComponent = animated ? motion.div : 'div'
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -5, transition: { duration: 0.2 } },
    transition: { duration: 0.3 }
  } : {}

  return (
    <CardComponent {...motionProps}>
      <Card
        className={cn(
          'relative overflow-hidden group',
          'bg-black/40 backdrop-blur-md',
          'border border-white/10',
          glowClasses[glowColor],
          'hover:border-white/20 transition-all duration-500',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0',
          'hover:before:opacity-100 before:transition-opacity before:duration-500',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-cyber-grid opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </CardComponent>
  )
}