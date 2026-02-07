import { z } from "zod"

export const themeTokensSchema = z.object({
  colors: z.record(z.string().trim()).optional(),
  typography: z.record(z.string().trim()).optional(),
  spacing: z.record(z.string().trim()).optional(),
  radii: z.record(z.string().trim()).optional(),
  shadows: z.record(z.string().trim()).optional(),
})

export type ThemeTokens = z.infer<typeof themeTokensSchema>

export const defaultThemeTokens: ThemeTokens = {
  colors: {
    primary: "#1a4d2e",
    secondary: "#cba36d",
    background: "#ffffff",
    foreground: "#0f172a",
  },
  typography: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  spacing: {
    section: "4rem",
    card: "2rem",
  },
  radii: {
    card: "12px",
    button: "999px",
  },
  shadows: {
    card: "0 12px 32px rgba(15, 23, 42, 0.08)",
  },
}
