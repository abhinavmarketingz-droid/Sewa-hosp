"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface ConciergeFormProps {
  title?: string
  description?: string
}

export function ConciergeForm({ title = "Concierge Request", description }: ConciergeFormProps) {
  // ✅ SAFE CONTEXT ACCESS
  let language = "en"

  try {
    const ctx = useLanguage()
    language = ctx.language
  } catch {
    // LanguageProvider not mounted — fallback safely
  }
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nationality: "",
    serviceInterest: "",
    preferredLanguage: language,
    message: "",
    website: "",
  })

  const services = [
    "Luxury Travel & Mobility",
    "Concierge & Lifestyle",
    "Premium Residences",
    "Relocation & Immigration",
    "Events & Experiences",
    "Corporate Solutions",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.serviceInterest) {
        setError("Please select a service interest to continue.")
        return
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const responseBody = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(responseBody?.error ?? "Failed to send message")
      }

      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        nationality: "",
        serviceInterest: "",
        preferredLanguage: language,
        message: "",
        website: "",
      })

      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send your request."
      setError(`${message} Please try again or contact us directly.`)
      console.error("Form error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 border-border">
      <h3 className="font-serif font-bold text-2xl mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            Thank you for your request! Our concierge team will contact you within 24 hours.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
            className="bg-background border-border"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email Address *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
            className="bg-background border-border"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium mb-2">Nationality</label>
          <Input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            placeholder="Country of residence"
            className="bg-background border-border"
          />
        </div>

        {/* Service Interest */}
        <div>
          <label className="block text-sm font-medium mb-2">Service Interest *</label>
          <Select
            value={formData.serviceInterest}
            onValueChange={(value) => setFormData({ ...formData, serviceInterest: value })}
            required
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Language</label>
          <Select
            value={formData.preferredLanguage}
            onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="tr">Türkçe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2">Message *</label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your requirements..."
            required
            rows={5}
            className="bg-background border-border resize-none"
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <Input
            id="website"
            type="text"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif py-6"
        >
          {loading ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Sending...
            </>
          ) : (
            "Send Concierge Request"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your information is secure. We respect your privacy completely.
        </p>
      </form>
    </Card>
  )
}
