const resolveFlagsFromEnv = () => {
  const raw = process.env.EXTENSION_FLAGS
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) {
      return {}
    }
    return parsed as Record<string, boolean>
  } catch {
    return {}
  }
}

export const getExtensionFlags = () => resolveFlagsFromEnv()
