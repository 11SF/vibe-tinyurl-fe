"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  Settings, 
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NeonButton } from '@/components/web3/neon-button'
import { CyberCard } from '@/components/web3/cyber-card'
import { urlService, type CreateURLRequest } from '@/lib/api'
import { copyToClipboard, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  customAlias: z.string().optional(),
  expiresAt: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

interface ShortenedURL {
  id: string
  short_code: string
  short_url: string
  original_url: string
  custom_alias?: string
  expires_at?: string
  created_at: string
}

export function ShortenForm() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedURL | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const payload: CreateURLRequest = {
        url: data.url,
        ...(data.customAlias && { custom_alias: data.customAlias }),
        ...(data.expiresAt && { expires_at: new Date(data.expiresAt).toISOString() })
      }

      const response = await urlService.createURL(payload)
      setShortenedUrl(response.data)
      reset()
    } catch (error) {
      console.error('Failed to shorten URL:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (shortenedUrl) {
      await copyToClipboard(shortenedUrl.short_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Form */}
      <CyberCard className="overflow-visible">
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-4"
          >
            <Zap className="w-8 h-8 text-black" />
          </motion.div>
          <CardTitle className="text-4xl font-bold gradient-text">
            Shorten Your URLs
          </CardTitle>
          <p className="text-muted-foreground text-lg font-mono">
            Transform long URLs into powerful, trackable short links
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan h-5 w-5" />
                <Input
                  {...register('url')}
                  placeholder="https://example.com/your-very-long-url"
                  className="pl-11 h-14 text-lg cyber-border"
                  disabled={isLoading}
                />
              </div>
              {errors.url && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm font-mono"
                >
                  {errors.url.message}
                </motion.p>
              )}
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-neon-purple hover:text-neon-cyan transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced Options
                <motion.div
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  className="ml-2"
                >
                  ▼
                </motion.div>
              </Button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-white/10 bg-black/20"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neon-cyan">
                      Custom Alias
                    </label>
                    <Input
                      {...register('customAlias')}
                      placeholder="my-custom-link"
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neon-purple">
                      Expires At
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-purple h-4 w-4" />
                      <Input
                        {...register('expiresAt')}
                        type="datetime-local"
                        className="pl-10 font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NeonButton
                type="submit"
                disabled={isLoading}
                neonColor="cyan"
                className="w-full h-14 text-lg font-semibold"
                pulse={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5" />
                    <span>Shorten URL</span>
                  </div>
                )}
              </NeonButton>
            </motion.div>
          </form>
        </CardContent>
      </CyberCard>

      {/* Result Card */}
      {shortenedUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CyberCard glowColor="green">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neon-green">URL Shortened!</h3>
                  <p className="text-muted-foreground font-mono">Your link is ready to share</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Short URL */}
                <div className="p-4 rounded-lg border border-neon-green/30 bg-neon-green/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neon-green font-mono mb-1">Short URL</p>
                      <p className="text-lg font-semibold truncate">{shortenedUrl.short_url}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        className={cn(
                          "transition-all duration-200",
                          copied ? "text-neon-green border-neon-green" : "hover:text-neon-green hover:border-neon-green"
                        )}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="hover:text-neon-cyan hover:border-neon-cyan"
                      >
                        <a href={shortenedUrl.short_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Original URL */}
                <div className="p-4 rounded-lg border border-white/10 bg-black/20">
                  <p className="text-sm text-muted-foreground font-mono mb-1">Original URL</p>
                  <p className="text-sm truncate">{shortenedUrl.original_url}</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-neon-cyan font-mono">Created</p>
                    <p className="font-mono">{formatDate(shortenedUrl.created_at)}</p>
                  </div>
                  {shortenedUrl.custom_alias && (
                    <div>
                      <p className="text-neon-purple font-mono">Custom Alias</p>
                      <p className="font-mono">{shortenedUrl.custom_alias}</p>
                    </div>
                  )}
                  {shortenedUrl.expires_at && (
                    <div>
                      <p className="text-neon-pink font-mono">Expires</p>
                      <p className="font-mono">{formatDate(shortenedUrl.expires_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </CyberCard>
        </motion.div>
      )}
    </div>
  )
}