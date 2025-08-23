"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Zap, 
  BarChart3, 
  Settings, 
  User, 
  Menu, 
  X,
  LinkIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NeonButton } from '@/components/web3/neon-button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Shorten', href: '/', icon: LinkIcon },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple"
            >
              <Zap className="h-6 w-6 text-black" />
            </motion.div>
            <div>
              <div className="text-xl font-bold gradient-text">TinyURL</div>
              <div className="text-xs text-muted-foreground font-mono">v3.0</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10',
                    'hover:shadow-lg hover:shadow-neon-cyan/20'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NeonButton neonColor="purple" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </NeonButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-neon-cyan"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200',
                  'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 block'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 pb-2 px-3">
              <NeonButton neonColor="purple" className="w-full justify-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </NeonButton>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}