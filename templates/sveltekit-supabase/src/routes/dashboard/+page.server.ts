import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.session) {
    throw redirect(303, '/login');
  }
  const {
    data: { user }
  } = await locals.supabase.auth.getUser();
  return { user };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    throw redirect(303, '/');
  }
};
