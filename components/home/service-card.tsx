"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface ServiceCardProps {
  title: string
  items: string[]
  description?: string
}

export function ServiceCard({ title, items, description }: ServiceCardProps) {
  return (
    <Card className="p-8 border-border hover:border-primary/50 transition-all hover:shadow-lg">
      <h3 className="font-serif font-bold text-2xl mb-4 text-primary">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 text-sm">{description}</p>}
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
            <span className="text-foreground text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
