import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <h1>{process.env.NEXT_PUBLIC_SITE_NAME ?? "{{PROJECT_NAME}}"}</h1>
      <p>Production-ready Next.js 14 + Supabase SaaS starter.</p>
      <p>
        Email/password auth, SSR session refresh, and protected routes — wired
        up with the official <code>@supabase/ssr</code> pattern.
      </p>
      <div className="nav">
        <Link href="/signup">Create account</Link> ·{" "}
        <Link href="/login">Sign in</Link> ·{" "}
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </main>
  );
}
