"use client"

import { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'
import { CyberCard } from '@/components/web3/cyber-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3, Clock, Globe } from 'lucide-react'

interface ClickData {
  id: string
  ip_address: string
  user_agent: string
  referer?: string
  created_at: string
}

interface ClickChartProps {
  data: ClickData[]
  title?: string
  type?: 'line' | 'area' | 'bar'
}

const COLORS = {
  cyan: '#00D4FF',
  purple: '#B845ED', 
  green: '#39FF14',
  pink: '#FF10F0',
  yellow: '#FFED4A'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-3 font-mono">
        <p className="text-neon-cyan text-sm">{`${label}`}</p>
        <p className="text-white">
          <span className="text-neon-green">Clicks: </span>
          {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function ClickChart({ data, title = "Click Analytics", type = 'area' }: ClickChartProps) {
  const chartData = useMemo(() => {
    // Group clicks by hour for the chart
    const hourlyData = data.reduce((acc, click) => {
      const hour = new Date(click.created_at).getHours()
      const key = `${hour}:00`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Fill in missing hours with 0
    const fullDayData = []
    for (let i = 0; i < 24; i++) {
      const key = `${i}:00`
      fullDayData.push({
        time: key,
        clicks: hourlyData[key] || 0,
        hour: i
      })
    }

    return fullDayData
  }, [data])

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="time" 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke={COLORS.cyan}
              strokeWidth={2}
              dot={{ fill: COLORS.cyan, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS.cyan, strokeWidth: 2, fill: COLORS.purple }}
            />
          </LineChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="time" 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="clicks" fill={COLORS.purple} radius={[2, 2, 0, 0]} />
          </BarChart>
        )
      
      default: // area
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="time" 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#00D4FF" 
              fontSize={12}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke={COLORS.cyan}
              fill={`${COLORS.cyan}20`}
              strokeWidth={2}
            />
          </AreaChart>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CyberCard glowColor="cyan">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-neon-cyan" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CyberCard>
    </motion.div>
  )
}

export function TopReferrers({ data }: { data: ClickData[] }) {
  const referrerData = useMemo(() => {
    const referrers = data.reduce((acc, click) => {
      const referrer = click.referer || 'Direct'
      const domain = referrer === 'Direct' ? 'Direct' : 
        referrer.includes('://') ? new URL(referrer).hostname : referrer
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(referrers)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <CyberCard glowColor="purple">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-neon-purple" />
            <span>Top Referrers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referrerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={12}
                  fontFamily="monospace"
                >
                  {referrerData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(COLORS)[index % Object.values(COLORS).length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 backdrop-blur-sm border border-neon-purple/30 rounded-lg p-3 font-mono">
                          <p className="text-neon-purple text-sm">{payload[0].name}</p>
                          <p className="text-white">
                            <span className="text-neon-green">Clicks: </span>
                            {payload[0].value}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CyberCard>
    </motion.div>
  )
}

export function HourlyActivity({ data }: { data: ClickData[] }) {
  const hourlyData = useMemo(() => {
    const hours = Array(24).fill(0)
    
    data.forEach(click => {
      const hour = new Date(click.created_at).getHours()
      hours[hour]++
    })

    return hours.map((clicks, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      clicks,
      hourNum: hour
    }))
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CyberCard glowColor="green">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-neon-green" />
            <span>Hourly Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#39FF14" 
                  fontSize={12}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#39FF14" 
                  fontSize={12}
                  fontFamily="monospace"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="clicks" 
                  fill={COLORS.green}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CyberCard>
    </motion.div>
  )
}