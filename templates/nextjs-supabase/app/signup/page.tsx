"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUp } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [state, formAction] = useFormState(signUp, { error: null as string | null });

  return (
    <main className="container">
      <div className="card">
        <h2>Create account</h2>
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
            minLength={6}
            autoComplete="new-password"
          />
          <SubmitButton />
        </form>
        <p className="nav">
          Have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}
