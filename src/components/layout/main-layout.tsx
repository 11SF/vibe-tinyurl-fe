"use client"

import { ReactNode } from 'react'
import { Navbar } from './navbar'
import { CyberBackground } from '@/components/web3/cyber-background'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  )
}