import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/** Browser-side Supabase client (runs in the user's browser). */
export const supabase = createBrowserClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
