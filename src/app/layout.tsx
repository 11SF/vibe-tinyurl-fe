import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
})

export const metadata: Metadata = {
  title: 'TinyURL - Web3 URL Shortener',
  description: 'A powerful, cyberpunk-inspired URL shortening service with analytics and custom aliases',
  keywords: 'url shortener, link shortener, web3, cyberpunk, analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}