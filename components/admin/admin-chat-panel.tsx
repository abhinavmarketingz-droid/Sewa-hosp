"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, User, MessageSquare, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSession {
  id: string
  visitor_id: string
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  status: string
  created_at: string
  last_message_at: string | null
  chat_messages: { count: number }[]
}

interface ChatMessage {
  id: string
  session_id: string
  sender_type: string
  sender_name: string | null
  message: string
  is_read: boolean
  created_at: string
}

interface AdminChatPanelProps {
  sessions: ChatSession[]
  adminName: string
}

export function AdminChatPanel({ sessions: initialSessions, adminName }: AdminChatPanelProps) {
  const [sessions, setSessions] = useState(initialSessions)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const selectedSessionData = sessions.find((s) => s.id === selectedSession)

  // Load messages when session selected
  useEffect(() => {
    if (!selectedSession) return

    const loadMessages = async () => {
      setLoadingMessages(true)
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", selectedSession)
        .order("created_at", { ascending: true })

      if (data) setMessages(data)
      setLoadingMessages(false)
    }

    loadMessages()
  }, [selectedSession, supabase])

  // Real-time subscription
  useEffect(() => {
    if (!selectedSession) return

    const channel = supabase
      .channel(`admin_chat_${selectedSession}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${selectedSession}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedSession, supabase])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedSession) return

    const messageText = newMessage.trim()
    setNewMessage("")

    await supabase.from("chat_messages").insert({
      session_id: selectedSession,
      sender_type: "admin",
      sender_name: adminName,
      message: messageText,
      is_read: true,
    })

    await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", selectedSession)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Sessions List */}
      <Card className="p-4 overflow-y-auto">
        <h2 className="font-serif font-bold mb-4">Chat Sessions</h2>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No chat sessions yet</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  selectedSession === session.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{session.visitor_name || "Anonymous"}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      session.status === "active"
                        ? "bg-green-500/20 text-green-700"
                        : session.status === "waiting"
                          ? "bg-yellow-500/20 text-yellow-700"
                          : "bg-muted",
                    )}
                  >
                    {session.status}
                  </Badge>
                </div>
                {session.visitor_email && (
                  <p className="text-xs text-muted-foreground truncate">{session.visitor_email}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{session.chat_messages?.[0]?.count || 0} messages</span>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden">
        {selectedSession ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold">{selectedSessionData?.visitor_name || "Anonymous Visitor"}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    {selectedSessionData?.visitor_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedSessionData.visitor_email}
                      </span>
                    )}
                    {selectedSessionData?.visitor_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedSessionData.visitor_phone}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    selectedSessionData?.status === "active" ? "bg-green-500/20 text-green-700" : "bg-muted",
                  )}
                >
                  {selectedSessionData?.status}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {loadingMessages ? (
                <p className="text-center text-muted-foreground py-8">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages yet</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-2", message.sender_type === "admin" ? "justify-end" : "justify-start")}
                  >
                    {message.sender_type !== "admin" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2",
                        message.sender_type === "admin"
                          ? "bg-primary text-primary-foreground"
                          : message.sender_type === "system"
                            ? "bg-secondary/20 text-foreground"
                            : "bg-card border border-border text-foreground",
                      )}
                    >
                      <p className="text-xs font-medium mb-1">{message.sender_name || "Visitor"}</p>
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender_type === "admin" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p>Select a chat session to view messages</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
