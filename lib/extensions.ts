export type ExtensionManifest = {
  id: string
  name: string
  description: string
  version: string
  category: "core" | "content" | "commerce" | "marketing" | "ops" | "custom"
  requires?: string[]
  flags?: string[]
}

const defaultExtensions: ExtensionManifest[] = [
  {
    id: "core",
    name: "Core Platform",
    description: "Authentication, RBAC, audit logging, and foundational services.",
    version: "1.0.0",
    category: "core",
  },
  {
    id: "content",
    name: "Content Management",
    description: "Services, destinations, banners, and custom sections.",
    version: "1.0.0",
    category: "content",
    requires: ["core"],
  },
  {
    id: "media",
    name: "Media Library",
    description: "Managed uploads, previews, and storage governance.",
    version: "1.0.0",
    category: "ops",
    requires: ["core"],
  },
  {
    id: "backups",
    name: "Backups & Export",
    description: "On-demand export and backup snapshots.",
    version: "1.0.0",
    category: "ops",
    requires: ["core"],
  },
  {
    id: "seo",
    name: "SEO Toolkit",
    description: "Metadata, sitemaps, and structured data helpers.",
    version: "1.0.0",
    category: "marketing",
    requires: ["core", "content"],
  },
]

export const getExtensionRegistry = (): ExtensionManifest[] => defaultExtensions
