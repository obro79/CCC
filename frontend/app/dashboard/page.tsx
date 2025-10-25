import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserMenu } from '@/components/auth/user-menu'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-600">
            You are signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
      </main>
    </div>
  )
}
