// {{PROJECT_NAME}} - Landing page
import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 40, fontFamily: 'system-ui' }}>
      <h1>{{PROJECT_NAME}}</h1>
      <p>Built with Next.js App Router + Supabase Auth.</p>
      <nav style={{ display: 'flex', gap: 16 }}>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </main>
  )
}
