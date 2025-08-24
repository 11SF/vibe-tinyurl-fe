"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Link as LinkIcon, 
  Eye, 
  Calendar,
  Copy,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Clock,
  Globe,
  AlertCircle,
  Loader2
} from 'lucide-react'

import { MainLayout } from '@/components/layout/main-layout'
import { CyberCard } from '@/components/web3/cyber-card'
import { NeonButton } from '@/components/web3/neon-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserURLs, useDeleteURL } from '@/hooks/use-url-api'
import { formatDate, formatNumber, copyToClipboard } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // React Query hooks
  const { data: urls = [], isLoading, error } = useUserURLs(50, 0)
  const deleteURLMutation = useDeleteURL()

  const handleCopy = async (url: string, id: string) => {
    await copyToClipboard(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    deleteURLMutation.mutate(id)
  }

  const filteredUrls = urls.filter(url =>
    url.original_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.short_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (url.custom_alias && url.custom_alias.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0)
  const activeUrls = urls.filter(url => !url.expires_at || new Date(url.expires_at) > new Date()).length

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-neon-cyan" />
            <p className="text-neon-cyan font-mono">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <CyberCard className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to Load Dashboard</h3>
              <p className="text-muted-foreground font-mono mb-4">
                {(error as any)?.response?.data?.message || error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400/10"
              >
                Retry
              </Button>
            </CardContent>
          </CyberCard>
        </div>
      </MainLayout>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
              <p className="text-muted-foreground font-mono">Manage and monitor your shortened URLs</p>
            </div>
            <NeonButton neonColor="purple" asChild>
              <a href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create New Link
              </a>
            </NeonButton>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Total Links",
                value: formatNumber(urls.length),
                icon: LinkIcon,
                color: "cyan",
                trend: "+12% this month"
              },
              {
                title: "Total Clicks",
                value: formatNumber(totalClicks),
                icon: Eye,
                color: "purple",
                trend: "+8% this week"
              },
              {
                title: "Active Links",
                value: formatNumber(activeUrls),
                icon: TrendingUp,
                color: "green",
                trend: `${activeUrls}/${urls.length} active`
              },
              {
                title: "Avg. CTR",
                value: urls.length > 0 ? `${((totalClicks / urls.length) || 0).toFixed(1)}` : "0",
                icon: BarChart3,
                color: "pink",
                trend: "Per link"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glowColor={stat.color as any}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-mono">{stat.title}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className={cn(
                          "text-xs font-mono",
                          stat.color === "cyan" && "text-neon-cyan",
                          stat.color === "purple" && "text-neon-purple",
                          stat.color === "green" && "text-neon-green",
                          stat.color === "pink" && "text-neon-pink"
                        )}>
                          {stat.trend}
                        </p>
                      </div>
                      <stat.icon className={cn(
                        "w-12 h-12",
                        stat.color === "cyan" && "text-neon-cyan",
                        stat.color === "purple" && "text-neon-purple",
                        stat.color === "green" && "text-neon-green",
                        stat.color === "pink" && "text-neon-pink"
                      )} />
                    </div>
                  </CardContent>
                </CyberCard>
              </motion.div>
            ))}
          </div>

          {/* Search and Filters */}
          <CyberCard>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search links by URL, short code, or alias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Filter by Date
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="w-4 h-4 mr-2" />
                    All Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </CyberCard>

          {/* URLs Table */}
          <CyberCard>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <LinkIcon className="w-6 h-6 text-neon-cyan" />
                <span>Your Links ({filteredUrls.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-sm font-mono text-neon-cyan">Short URL</th>
                      <th className="px-6 py-4 text-sm font-mono text-neon-purple">Original URL</th>
                      <th className="px-6 py-4 text-sm font-mono text-neon-green">Clicks</th>
                      <th className="px-6 py-4 text-sm font-mono text-neon-pink">Created</th>
                      <th className="px-6 py-4 text-sm font-mono text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUrls.map((url, index) => (
                      <motion.tr
                        key={url.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono text-neon-cyan truncate">
                                {url.short_url}
                              </p>
                              {url.custom_alias && (
                                <p className="text-xs text-muted-foreground font-mono">
                                  Alias: {url.custom_alias}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono truncate max-w-xs" title={url.original_url}>
                            {url.original_url}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-neon-green" />
                            <span className="text-sm font-mono text-neon-green">
                              {formatNumber(url.click_count || 0)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-neon-pink" />
                            <span className="text-sm font-mono text-neon-pink">
                              {formatDate(url.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCopy(url.short_url, url.id)}
                              className={cn(
                                "transition-all duration-200",
                                copiedId === url.id ? "text-neon-green border-neon-green" : "hover:text-neon-cyan hover:border-neon-cyan"
                              )}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              className="hover:text-neon-purple hover:border-neon-purple"
                            >
                              <a href={url.short_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:text-neon-yellow hover:border-neon-yellow"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(url.id)}
                              disabled={deleteURLMutation.isPending}
                              className="hover:text-red-400 hover:border-red-400"
                            >
                              {deleteURLMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUrls.length === 0 && (
                <div className="text-center py-12">
                  <LinkIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No links found</h3>
                  <p className="text-muted-foreground font-mono">
                    {searchTerm ? "Try adjusting your search" : "Create your first shortened URL to get started"}
                  </p>
                </div>
              )}
            </CardContent>
          </CyberCard>
        </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}