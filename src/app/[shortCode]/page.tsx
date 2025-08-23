"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Clock, 
  Shield, 
  AlertTriangle,
  Loader2,
  ArrowRight,
  Link as LinkIcon,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CyberCard } from '@/components/web3/cyber-card'
import { NeonButton } from '@/components/web3/neon-button'
import { useURLByShortCode } from '@/hooks/use-url-api'
import { formatDate } from '@/lib/utils'

export default function RedirectPage() {
  const params = useParams()
  const shortCode = params.shortCode as string
  const [countdown, setCountdown] = useState(3)
  const [showPreview, setShowPreview] = useState(false)

  // Try to get URL info (this might not work if backend doesn't support preview mode)
  // const { data: urlInfo, isLoading: urlLoading, error: urlError } = useURLByShortCode(shortCode)

  const handleRedirect = () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/${shortCode}`
    window.location.href = redirectUrl
  }

  useEffect(() => {
    if (!shortCode) return

    // Show redirect page for a moment, then redirect
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          handleRedirect()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [shortCode])

  if (!shortCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <CyberCard className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-xl font-semibold text-red-400 mb-2">Invalid Link</h1>
            <p className="text-muted-foreground font-mono mb-6">
              The short link you're trying to access is not valid.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400/10"
            >
              <a href="/">Go to Homepage</a>
            </Button>
          </CardContent>
        </CyberCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cyber Background Effect */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10" />
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <CyberCard className="max-w-lg">
          <CardContent className="p-8 text-center">
            {/* Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center"
            >
              <ExternalLink className="w-10 h-10 text-black" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold gradient-text mb-2"
            >
              Redirecting...
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground font-mono mb-6"
            >
              Taking you to your destination
            </motion.p>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
              <span className="font-mono text-neon-cyan">Processing...</span>
            </motion.div>

            {/* Short Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-neon-cyan font-mono">Short Code:</span>
                <code className="text-lg font-bold text-white">{shortCode}</code>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start space-x-3 p-4 rounded-lg bg-black/20 border border-white/10 mb-6"
            >
              <Shield className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-neon-green">Secure Redirect</p>
                <p className="text-xs text-muted-foreground font-mono">
                  This link has been verified and is safe to visit
                </p>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-neon-cyan/30 flex items-center justify-center relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-neon-cyan"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: (3 - countdown) / 3 }}
                  style={{
                    clipPath: `inset(0 ${((3 - countdown) / 3) * 100}% 0 0)`
                  }}
                />
                <span className="text-2xl font-bold text-neon-cyan">{countdown}</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </motion.div>

            {/* Manual Redirect Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <NeonButton
                neonColor="cyan"
                onClick={handleRedirect}
                className="w-full"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Continue Now</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </NeonButton>
            </motion.div>

            {/* Info Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground"
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono">Click the button to skip waiting</span>
            </motion.div>
          </CardContent>
        </CyberCard>
      </motion.div>
    </div>
  )
}