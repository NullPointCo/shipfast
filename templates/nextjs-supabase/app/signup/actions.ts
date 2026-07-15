"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 6) {
    return { error: "Email is required and password must be at least 6 characters." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // If Supabase email confirmation is enabled, the user must verify before
  // signing in. They are still sent to /dashboard; the guard there bounces
  // them back to /login until their address is confirmed.
  redirect("/dashboard");
}
