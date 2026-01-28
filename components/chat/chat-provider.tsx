"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ChatContextType {
  unreadCount: number
  setUnreadCount: (count: number) => void
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider")
  }
  return context
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Persist chat state across page navigations
  useEffect(() => {
    const savedState = sessionStorage.getItem("sewa_chat_open")
    if (savedState === "true") {
      setIsChatOpen(true)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem("sewa_chat_open", isChatOpen.toString())
  }, [isChatOpen])

  return (
    <ChatContext.Provider value={{ unreadCount, setUnreadCount, isChatOpen, setIsChatOpen }}>
      {children}
    </ChatContext.Provider>
  )
}
