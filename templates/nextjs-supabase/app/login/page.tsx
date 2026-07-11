// {{PROJECT_NAME}} - Login page
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Login() {
  async function login(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) redirect('/dashboard')
  }
  return (
    <form action={login} style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Login</h2>
      <input name="email" type="email" placeholder="Email" required style={{ display: 'block', margin: '8px 0', padding: 8, width: '100%' }} />
      <input name="password" type="password" placeholder="Password" required style={{ display: 'block', margin: '8px 0', padding: 8, width: '100%' }} />
      <button type="submit" style={{ padding: '8px 16px', marginTop: 8 }}>Sign In</button>
    </form>
  )
}
