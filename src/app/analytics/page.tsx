"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Calendar,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react'

import { MainLayout } from '@/components/layout/main-layout'
import { CyberCard } from '@/components/web3/cyber-card'
import { NeonButton } from '@/components/web3/neon-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ClickChart, TopReferrers, HourlyActivity } from '@/components/analytics/click-chart'
import { useUserURLs, useURLAnalytics } from '@/hooks/use-url-api'
import { formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function AnalyticsPage() {
  const [selectedUrl, setSelectedUrl] = useState<string>('')

  // React Query hooks
  const { data: urls = [], isLoading: urlsLoading, error: urlsError } = useUserURLs(50, 0)
  const { 
    data: analytics = [], 
    isLoading: analyticsLoading, 
    error: analyticsError 
  } = useURLAnalytics(selectedUrl, 100, 0)

  // Set initial selected URL when URLs load
  if (!selectedUrl && urls.length > 0) {
    setSelectedUrl(urls[0].id)
  }

  const selectedUrlData = urls.find(url => url.id === selectedUrl)
  
  const deviceStats = analytics.reduce((acc, click) => {
    const userAgent = click.user_agent.toLowerCase()
    let device = 'Unknown'
    
    if (userAgent.includes('mobile') || userAgent.includes('android')) {
      device = 'Mobile'
    } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      device = 'Tablet'
    } else if (userAgent.includes('desktop') || userAgent.includes('windows') || userAgent.includes('mac')) {
      device = 'Desktop'
    }
    
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalClicks = analytics.length
  const uniqueIPs = new Set(analytics.map(click => click.ip_address)).size
  const clicksToday = analytics.filter(click => {
    const clickDate = new Date(click.created_at)
    const today = new Date()
    return clickDate.toDateString() === today.toDateString()
  }).length

  if (urlsLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-neon-cyan" />
            <p className="text-neon-cyan font-mono">Loading analytics...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (urlsError) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <CyberCard className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to Load Analytics</h3>
              <p className="text-muted-foreground font-mono mb-4">
                {(urlsError as any)?.response?.data?.message || urlsError?.message || 'An unexpected error occurred'}
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
              <h1 className="text-4xl font-bold gradient-text mb-2">Analytics</h1>
              <p className="text-muted-foreground font-mono">Deep insights into your link performance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 7 Days
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* URL Selector */}
          <CyberCard>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-mono text-neon-cyan mb-2 block">Select URL to Analyze</label>
                  <select
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    className="w-full p-3 rounded-md bg-black/20 border border-white/10 text-white font-mono focus:border-neon-cyan focus:outline-none"
                  >
                    {urls.map(url => (
                      <option key={url.id} value={url.id} className="bg-black">
                        {url.short_url} - {url.original_url.slice(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
                {selectedUrlData && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-mono">Total Clicks</p>
                    <p className="text-2xl font-bold text-neon-green">{formatNumber(selectedUrlData.click_count || 0)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </CyberCard>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Total Clicks",
                value: formatNumber(totalClicks),
                icon: Eye,
                color: "cyan",
                change: "+12%"
              },
              {
                title: "Unique Visitors", 
                value: formatNumber(uniqueIPs),
                icon: TrendingUp,
                color: "purple",
                change: "+8%"
              },
              {
                title: "Clicks Today",
                value: formatNumber(clicksToday),
                icon: Calendar,
                color: "green",
                change: "+15%"
              },
              {
                title: "Avg. Daily",
                value: formatNumber(Math.round(totalClicks / 7)),
                icon: BarChart3,
                color: "pink",
                change: "+5%"
              }
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glowColor={metric.color as any}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className={cn(
                        "w-10 h-10",
                        metric.color === "cyan" && "text-neon-cyan",
                        metric.color === "purple" && "text-neon-purple",
                        metric.color === "green" && "text-neon-green",
                        metric.color === "pink" && "text-neon-pink"
                      )} />
                      <span className={cn(
                        "text-xs font-mono px-2 py-1 rounded",
                        "bg-green-500/20 text-green-400"
                      )}>
                        {metric.change}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{metric.title}</p>
                    </div>
                  </CardContent>
                </CyberCard>
              </motion.div>
            ))}
          </div>

          {analyticsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-neon-cyan" />
                <p className="text-neon-cyan font-mono">Loading analytics data...</p>
              </div>
            </div>
          ) : analyticsError ? (
            <CyberCard>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Analytics</h3>
                <p className="text-muted-foreground font-mono">
                  {(analyticsError as any)?.response?.data?.message || analyticsError?.message || 'Unable to fetch analytics data'}
                </p>
              </CardContent>
            </CyberCard>
          ) : analytics.length > 0 ? (
            <>
              {/* Charts Row - Temporarily disabled */}
              <CyberCard>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Charts Coming Soon</h3>
                  <p className="text-muted-foreground font-mono">
                    Advanced analytics charts will be available in the next update
                  </p>
                </CardContent>
              </CyberCard>

              {/* Device Stats */}
              <CyberCard glowColor="pink">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Monitor className="w-6 h-6 text-neon-pink" />
                    <span>Device Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(deviceStats).map(([device, count]) => {
                      const percentage = (count / totalClicks * 100).toFixed(1)
                      const IconComponent = device === 'Mobile' ? Smartphone : 
                                          device === 'Tablet' ? Tablet : Monitor
                      
                      return (
                        <motion.div
                          key={device}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-black/20"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-neon-pink" />
                            <span className="font-mono text-white">{device}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">{formatNumber(count)}</div>
                            <div className="text-sm text-neon-pink font-mono">{percentage}%</div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </CyberCard>

              {/* Recent Clicks Table */}
              <CyberCard>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-neon-cyan" />
                    <span>Recent Clicks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/10">
                        <tr className="text-left">
                          <th className="px-6 py-4 text-sm font-mono text-neon-cyan">Time</th>
                          <th className="px-6 py-4 text-sm font-mono text-neon-purple">Location</th>
                          <th className="px-6 py-4 text-sm font-mono text-neon-green">Referrer</th>
                          <th className="px-6 py-4 text-sm font-mono text-neon-pink">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.slice(0, 10).map((click, index) => {
                          const userAgent = click.user_agent.toLowerCase()
                          const device = userAgent.includes('mobile') ? 'Mobile' :
                                        userAgent.includes('tablet') ? 'Tablet' : 'Desktop'
                          
                          return (
                            <tr key={click.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="px-6 py-4 text-sm font-mono">
                                {new Date(click.created_at).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-neon-purple" />
                                  <span>{click.ip_address}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-mono truncate max-w-xs">
                                {click.referer ? new URL(click.referer).hostname : 'Direct'}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono text-neon-pink">
                                {device}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </CyberCard>
            </>
          ) : (
            <CyberCard>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground font-mono">
                  No clicks recorded for this URL yet. Share your link to start collecting data!
                </p>
              </CardContent>
            </CyberCard>
          )}
        </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}