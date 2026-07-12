import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

/**
 * Creates the Supabase server client and refreshes the user's session on every
 * request. The `setAll` cookie handler appends `set-cookie` headers to a
 * response-scoped Headers object, which are applied to the outgoing response
 * after `resolve` — this is the official Supabase-recommended SvelteKit pattern.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const responseHeaders = new Headers();

  event.locals.supabase = createServerClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(event.request.headers.get('cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            responseHeaders.append('set-cookie', serializeCookieHeader(name, value, options))
          );
        }
      }
    }
  );

  const {
    data: { session }
  } = await event.locals.supabase.auth.getSession();

  event.locals.session = session;
  event.locals.user = session
    ? (await event.locals.supabase.auth.getUser()).data.user
    : null;

  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });

  responseHeaders.forEach((value, key) => response.headers.append(key, value));
  return response;
};
