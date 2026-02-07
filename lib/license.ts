import crypto from "crypto"

export type LicensePayload = {
  tenantId: string
  plan: string
  features: string[]
  issuedAt: string
  expiresAt?: string
}

export type LicenseStatus = {
  valid: boolean
  reason?: string
  payload?: LicensePayload
}

const resolvePublicKey = () => process.env.LICENSE_PUBLIC_KEY ?? ""
const resolveLicenseKey = () => process.env.LICENSE_KEY ?? ""

const decodeBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const buffer = Buffer.from(padded, "base64")
  return buffer
}

const parsePayload = (buffer: Buffer): LicensePayload | null => {
  try {
    const parsed = JSON.parse(buffer.toString("utf-8")) as LicensePayload
    if (!parsed || typeof parsed !== "object") {
      return null
    }
    if (!parsed.tenantId || !parsed.plan || !parsed.issuedAt) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const verifySignature = (payload: Buffer, signature: Buffer, publicKey: string) => {
  try {
    const key = crypto.createPublicKey(publicKey)
    return crypto.verify(null, payload, key, signature)
  } catch {
    return false
  }
}

export const evaluateLicense = (): LicenseStatus => {
  const publicKey = resolvePublicKey()
  const licenseKey = resolveLicenseKey()

  if (!publicKey || !licenseKey) {
    return { valid: false, reason: "License is not configured." }
  }

  const parts = licenseKey.split(".")
  if (parts.length !== 2) {
    return { valid: false, reason: "License format is invalid." }
  }

  const payloadBuffer = decodeBase64Url(parts[0])
  const signatureBuffer = decodeBase64Url(parts[1])
  const payload = parsePayload(payloadBuffer)
  if (!payload) {
    return { valid: false, reason: "License payload is invalid." }
  }

  const isValid = verifySignature(payloadBuffer, signatureBuffer, publicKey)
  if (!isValid) {
    return { valid: false, reason: "License signature is invalid." }
  }

  if (payload.expiresAt) {
    const expiresAt = new Date(payload.expiresAt)
    if (Number.isNaN(expiresAt.getTime())) {
      return { valid: false, reason: "License expiration is invalid." }
    }
    if (expiresAt.getTime() < Date.now()) {
      return { valid: false, reason: "License has expired." }
    }
  }

  return { valid: true, payload }
}
