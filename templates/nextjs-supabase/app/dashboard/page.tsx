// {{PROJECT_NAME}} - Dashboard (protected)
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </main>
  )
}
