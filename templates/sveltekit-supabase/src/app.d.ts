// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: import('@supabase/supabase-js').SupabaseClient;
      session: import('@supabase/supabase-js').Session | null;
      user: import('@supabase/supabase-js').User | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
