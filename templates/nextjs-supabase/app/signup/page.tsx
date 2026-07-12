"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session === null) {
      // Email confirmation required.
      setMessage("Check your email for a confirmation link.");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="container">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? "…" : "Sign up"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
