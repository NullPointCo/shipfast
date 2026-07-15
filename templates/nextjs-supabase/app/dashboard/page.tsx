import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "./actions";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route: bounce unauthenticated (or unconfirmed) users.
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <p className="nav">User ID: {user.id}</p>
        <form action={signOut}>
          <button type="submit" className="secondary">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
