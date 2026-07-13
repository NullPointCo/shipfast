// Plan configuration. Set STRIPE_PRICE_ID_PRO in your .env to a real
// Stripe Price ID (mode: subscription) created in the Stripe dashboard.
export const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$19/mo',
    priceIdEnv: 'STRIPE_PRICE_ID_PRO',
    features: ['Unlimited projects', 'Priority support', 'API access']
  }
] as const;

export type Plan = (typeof PLANS)[number];
