"use client";

import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: "$9 / mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    name: "Pro",
    price: "$29 / mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(priceId?: string) {
    if (!priceId) {
      alert("Set NEXT_PUBLIC_STRIPE_*_PRICE_ID in .env.local first.");
      return;
    }
    setLoading(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="container">
      <h1>{{PROJECT_NAME}}</h1>
      <p>Production-ready Next.js + Stripe SaaS starter.</p>
      <div className="plans">
        {PLANS.map((plan) => (
          <div className="plan" key={plan.name}>
            <h3>{plan.name}</h3>
            <div>{plan.price}</div>
            <button
              onClick={() => checkout(plan.priceId)}
              disabled={loading === plan.priceId}
            >
              {loading === plan.priceId ? "Redirecting…" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
