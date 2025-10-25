'use client'

import { signUp } from '@/lib/auth/actions'
import { useState } from 'react'
import Link from 'next/link'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            We sent you a confirmation email. Please check your inbox and click the link to
            verify your account.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block font-medium hover:underline"
            style={{color: 'var(--blue-primary)'}}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Or{' '}
          <Link href="/login" className="font-medium hover:underline" style={{color: 'var(--blue-primary)'}}>
            sign in to your existing account
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="displayName" className="sr-only">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Display name"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Password (min 6 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
