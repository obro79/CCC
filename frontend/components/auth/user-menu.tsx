'use client'

import { useAuth } from '@/lib/auth/client'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        {user.user_metadata?.display_name || user.email}
      </span>
      <button
        onClick={signOut}
        className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Sign out
      </button>
    </div>
  )
}
