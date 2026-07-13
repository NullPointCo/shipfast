"use client";

import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: "$9 / mo",
    variantId: process.env.NEXT_PUBLIC_LS_STARTER_VARIANT_ID,
  },
  {
    name: "Pro",
    price: "$29 / mo",
    variantId: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID,
  },
];

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(variantId?: string) {
    if (!variantId) {
      alert("Set NEXT_PUBLIC_LS_*_VARIANT_ID in .env.local first.");
      return;
    }
    setLoading(variantId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
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
      <h1>{process.env.NEXT_PUBLIC_SITE_NAME ?? "{{PROJECT_NAME}}"}</h1>
      <p>Production-ready Next.js + Lemon Squeezy SaaS starter.</p>
      <div className="plans">
        {PLANS.map((plan) => (
          <div className="plan" key={plan.name}>
            <h3>{plan.name}</h3>
            <div>{plan.price}</div>
            <button
              onClick={() => checkout(plan.variantId)}
              disabled={loading === plan.variantId}
            >
              {loading === plan.variantId ? "Redirecting…" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
