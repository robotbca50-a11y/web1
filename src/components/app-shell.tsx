"use client";

import { useState, useEffect, ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { LoadingScreen } from "@/components/loading-screen";
import { Particles } from "@/components/particles";
import { AIChatbot } from "@/components/ai-chatbot";

export function AppShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="relative min-h-screen">
      <Particles count={25} />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <AIChatbot />
    </div>
  );
}
