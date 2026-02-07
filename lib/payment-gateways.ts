export type PaymentGatewayConfig = {
  id: string
  name: string
  description: string
  status: "disabled" | "enabled"
  mode: "test" | "live"
}

export type PaymentGatewayAdapter = {
  id: string
  name: string
  supports: string[]
  buildConfig: () => PaymentGatewayConfig
}

const stripeAdapter: PaymentGatewayAdapter = {
  id: "stripe",
  name: "Stripe",
  supports: ["card", "wallet"],
  buildConfig: () => ({
    id: "stripe",
    name: "Stripe",
    description: "Card payments with global coverage.",
    status: process.env.STRIPE_SECRET_KEY ? "enabled" : "disabled",
    mode: process.env.STRIPE_MODE === "live" ? "live" : "test",
  }),
}

const razorpayAdapter: PaymentGatewayAdapter = {
  id: "razorpay",
  name: "Razorpay",
  supports: ["card", "upi", "netbanking"],
  buildConfig: () => ({
    id: "razorpay",
    name: "Razorpay",
    description: "India-first payments (UPI, cards, netbanking).",
    status: process.env.RAZORPAY_KEY_ID ? "enabled" : "disabled",
    mode: process.env.RAZORPAY_MODE === "live" ? "live" : "test",
  }),
}

export const paymentGateways: PaymentGatewayAdapter[] = [stripeAdapter, razorpayAdapter]

export const getPaymentGatewayConfigs = (): PaymentGatewayConfig[] =>
  paymentGateways.map((gateway) => gateway.buildConfig())
