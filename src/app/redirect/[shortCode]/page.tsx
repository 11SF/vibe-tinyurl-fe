"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Clock,
  Shield,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CyberCard } from "@/components/web3/cyber-card";
import { NeonButton } from "@/components/web3/neon-button";
import { formatDate } from "@/lib/utils";

export default function RedirectPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [countdown, setCountdown] = useState(3);
  const [showPreview, setShowPreview] = useState(false);

  const handleRedirect = () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/v1/redirect/${shortCode}`;
    window.location.href = redirectUrl;
  };

  useEffect(() => {
    if (!shortCode) return;

    // Show redirect page for a moment, then redirect
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [shortCode]);

  if (!shortCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <CyberCard className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-xl font-semibold text-red-400 mb-2">
              Invalid Link
            </h1>
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
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cyber Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-cyan-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjeWFuIiBzdHJva2Utd2lkdGg9IjAuMiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20" />

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const left = (i * 19 + 29) % 100;
          const top = (i * 37 + 53) % 100;
          const duration = 12 + (i % 6) * 3;

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
              animate={{
                x: [left * 8, ((left + 40) % 100) * 8],
                y: [top * 6, ((top + 35) % 100) * 6],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                left: left + "%",
                top: top + "%",
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <CyberCard className="max-w-lg bg-black/50 border-cyan-500/30 backdrop-blur-lg shadow-2xl shadow-cyan-500/10">
          <CardContent className="p-8 text-center">
            {/* Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
            >
              <ExternalLink className="w-10 h-10 text-black" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
            >
              Redirecting...
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-mono mb-6"
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
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="font-mono text-cyan-400">Processing...</span>
            </motion.div>

            {/* Short Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-lg border border-cyan-400/30 bg-cyan-400/5 mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-cyan-400 font-mono">
                  Short Code:
                </span>
                <code className="text-lg font-bold text-white">
                  {shortCode}
                </code>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start space-x-3 p-4 rounded-lg bg-black/20 border border-white/10 mb-6"
            >
              <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-400">
                  Secure Redirect
                </p>
                <p className="text-xs text-gray-400 font-mono">
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
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-cyan-400/30 flex items-center justify-center relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-cyan-400"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    clipPath: `inset(0 ${100 - ((3 - countdown) / 3) * 100}% 0 0)`,
                  }}
                />
                <span className="text-2xl font-bold text-cyan-400">
                  {countdown}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-mono">
                Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
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
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
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
              className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-400"
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono">
                Click the button to skip waiting
              </span>
            </motion.div>
          </CardContent>
        </CyberCard>
      </motion.div>
    </div>
  );
}
