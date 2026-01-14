"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  // ✅ SAFE CONTEXT ACCESS
  let t = (key: string) => key

  try {
    const ctx = useLanguage()
    t = ctx.t
  } catch {
    // LanguageProvider not mounted — fallback safely
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-serif font-bold text-primary mb-2">SEWA</div>
            <div className="text-sm text-muted-foreground mb-4">
              Luxury Concierge • Travel • Relocation • Property Management
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Bespoke hospitality and lifestyle services for global elites in India
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-serif font-bold text-sm mb-4">Services</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services#travel" className="text-muted-foreground hover:text-primary transition-colors">
                  Luxury Travel
                </Link>
              </li>
              <li>
                <Link href="/services#concierge" className="text-muted-foreground hover:text-primary transition-colors">
                  Concierge
                </Link>
              </li>
              <li>
                <Link
                  href="/services#residences"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Residences
                </Link>
              </li>
              <li>
                <Link
                  href="/services#experiences"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Experiences
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-serif font-bold text-sm mb-4">Destinations</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">
                  All Cities
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">
                  Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">
                  Goa
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-serif font-bold text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.careers")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © 2026 SEWA Hospitality Services Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center">Authorized Partner | Privacy-Compliant | India</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
