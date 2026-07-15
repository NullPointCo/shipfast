"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [state, formAction] = useFormState(signIn, { error: null as string | null });

  return (
    <main className="container">
      <div className="card">
        <h2>Sign in</h2>
        {searchParams.error && <p className="error">{searchParams.error}</p>}
        {state.error && <p className="error">{state.error}</p>}
        <form action={formAction}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <SubmitButton />
        </form>
        <p className="nav">
          No account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </main>
  );
}
