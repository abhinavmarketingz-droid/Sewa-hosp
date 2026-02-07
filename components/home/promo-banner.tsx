"use client"

import Link from "next/link"
import { useContent } from "@/hooks/use-content"
import { cn } from "@/lib/utils"

const variantStyles: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  neutral: "bg-muted text-foreground",
}

export function PromoBanner() {
  const { banners } = useContent()
  const activeBanners = banners.filter((banner) => banner.active !== false)

  if (!activeBanners.length) {
    return null
  }

  return (
    <section className="w-full">
      {activeBanners.map((banner) => (
        <div
          key={banner.id}
          className={cn(
            "w-full py-3 px-4 text-sm flex flex-wrap items-center justify-center gap-3",
            variantStyles[banner.variant ?? "primary"],
          )}
        >
          <span className="font-medium">{banner.message}</span>
          {banner.ctaLabel && banner.ctaUrl && (
            <Link href={banner.ctaUrl} className="underline underline-offset-4 font-semibold">
              {banner.ctaLabel}
            </Link>
          )}
        </div>
      ))}
    </section>
  )
}
