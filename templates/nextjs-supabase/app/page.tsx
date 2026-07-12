import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="container">
      <h1>{{PROJECT_NAME}}</h1>
      <p>Production-ready Next.js 14 + Supabase SaaS starter.</p>
      {user ? (
        <p>
          Signed in as <strong>{user.email}</strong>.{" "}
          <Link href="/dashboard">Go to dashboard &rarr;</Link>
        </p>
      ) : (
        <p>
          <Link href="/login">Log in</Link> &middot;{" "}
          <Link href="/signup">Sign up</Link>
        </p>
      )}
    </main>
  );
}
