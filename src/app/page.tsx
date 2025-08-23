"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { ShortenForm } from '@/components/url/shorten-form'

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <ShortenForm />
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Powered by Web3 Technology
            </h2>
            <p className="text-xl text-muted-foreground font-mono">
              Next-generation URL shortening with advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group"
              >
                <div className="relative p-8 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm hover:border-neon-cyan/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <feature.icon className="w-12 h-12 text-neon-cyan mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground font-mono">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

const features = [
  {
    icon: ({ className }: { className: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
      </svg>
    ),
    title: "Lightning Fast",
    description: "Generate shortened URLs in milliseconds with our optimized infrastructure."
  },
  {
    icon: ({ className }: { className: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    title: "Advanced Analytics",
    description: "Track clicks, monitor performance, and analyze your link traffic with detailed insights."
  },
  {
    icon: ({ className }: { className: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
    ),
    title: "Enterprise Security",
    description: "Military-grade security with encryption and advanced threat protection."
  }
]