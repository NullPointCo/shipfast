import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (!email || password.length < 6) {
      return fail(400, {
        error: 'Email is required and password must be at least 6 characters.',
        email
      });
    }

    const { error } = await locals.supabase.auth.signUp({ email, password });
    if (error) {
      return fail(400, { error: error.message, email });
    }

    // If email confirmation is enabled in Supabase, the user must verify
    // before they can sign in. They are still redirected to /dashboard;
    // the guard there will bounce them back to /login until verified.
    throw redirect(303, '/dashboard');
  }
};
