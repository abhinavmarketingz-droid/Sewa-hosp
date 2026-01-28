"use client"

import type React from "react"
import { LanguageProvider } from "@/lib/language-context"
import { ChatProvider } from "@/components/chat/chat-provider"
import { LiveChatWidget } from "@/components/chat/live-chat-widget"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ChatProvider>
        {children}
        <LiveChatWidget />
        <AnalyticsTracker />
      </ChatProvider>
    </LanguageProvider>
  )
}
