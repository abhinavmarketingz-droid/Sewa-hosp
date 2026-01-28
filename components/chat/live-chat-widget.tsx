"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Minimize2, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  session_id: string
  sender_type: "visitor" | "admin" | "system"
  sender_name: string | null
  message: string
  is_read: boolean
  created_at: string
}

interface ChatSession {
  id: string
  visitor_id: string
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  status: string
}

// Generate or retrieve visitor ID
function getVisitorId(): string {
  if (typeof window === "undefined") return ""

  let visitorId = localStorage.getItem("sewa_visitor_id")
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem("sewa_visitor_id", visitorId)
  }
  return visitorId
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [session, setSession] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(true)
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const visitorId = getVisitorId()
      if (!visitorId) return

      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("visitor_id", visitorId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (existingSession) {
        setSession(existingSession)
        setShowContactForm(false)

        // Load existing messages
        const { data: existingMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", existingSession.id)
          .order("created_at", { ascending: true })

        if (existingMessages) {
          setMessages(existingMessages)
        }
      }
    }

    checkExistingSession()
  }, [supabase])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!session?.id) return

    const channel = supabase
      .channel(`chat_${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.id, supabase])

  // Start a new chat session
  const startSession = async () => {
    if (!contactInfo.name && !contactInfo.email) return

    setLoading(true)
    try {
      const visitorId = getVisitorId()

      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        .insert({
          visitor_id: visitorId,
          visitor_name: contactInfo.name || null,
          visitor_email: contactInfo.email || null,
          visitor_phone: contactInfo.phone || null,
          page_url: window.location.href,
          status: "active",
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      setSession(newSession)
      setShowContactForm(false)

      // Add welcome message
      await supabase.from("chat_messages").insert({
        session_id: newSession.id,
        sender_type: "system",
        sender_name: "SEWA Concierge",
        message: `Hello ${contactInfo.name || "there"}! Welcome to SEWA Hospitality. How can we assist you today?`,
        is_read: false,
      })
    } catch (error) {
      console.error("Error starting chat session:", error)
    } finally {
      setLoading(false)
    }
  }

  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.id) return

    const messageText = newMessage.trim()
    setNewMessage("")

    try {
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        sender_type: "visitor",
        sender_name: session.visitor_name || "Visitor",
        message: messageText,
        is_read: false,
      })

      // Update last_message_at
      await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", session.id)
    } catch (error) {
      console.error("Error sending message:", error)
      setNewMessage(messageText) // Restore message on error
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center group"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
          1
        </span>
      </button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-50 shadow-2xl border-primary/20 transition-all duration-300",
        isMinimized ? "bottom-6 right-6 w-72 h-14" : "bottom-6 right-6 w-96 h-[500px] max-h-[80vh] flex flex-col",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm">SEWA Concierge</h3>
            <p className="text-xs text-primary-foreground/70">We typically reply instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Contact Form or Messages */}
          {showContactForm ? (
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="font-serif font-bold text-lg mb-2">Start a Conversation</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your details and we&apos;ll connect you with our concierge team.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Your Name *</label>
                  <Input
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address *</label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Phone (Optional)</label>
                  <Input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="bg-background"
                  />
                </div>

                <Button
                  onClick={startSession}
                  disabled={loading || (!contactInfo.name && !contactInfo.email)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Start Chat"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your information is secure and will only be used to assist you.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-2", message.sender_type === "visitor" ? "justify-end" : "justify-start")}
                  >
                    {message.sender_type !== "visitor" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2",
                        message.sender_type === "visitor"
                          ? "bg-primary text-primary-foreground"
                          : message.sender_type === "system"
                            ? "bg-secondary/20 text-foreground"
                            : "bg-card border border-border text-foreground",
                      )}
                    >
                      {message.sender_type !== "visitor" && (
                        <p className="text-xs font-medium mb-1">{message.sender_name || "Concierge"}</p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender_type === "visitor" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                    {message.sender_type === "visitor" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-background"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()} className="bg-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </Card>
  )
}
