import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Server-protected route: no session => bounce to login.
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <p>
        Welcome, <strong>{user.email}</strong>.
      </p>
      <p>
        This route is server-protected. Visit it while logged out and you&apos;ll
        be redirected to /login.
      </p>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
