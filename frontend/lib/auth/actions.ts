'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If email confirmation is enabled, user will receive an email
  // If not, they can sign in immediately
  return { success: true, data }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  redirect('/login')
}

/**
 * Send password reset email
 */
export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password reset email sent' }
}

/**
 * Update user password
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const newPassword = formData.get('newPassword') as string

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password updated successfully' }
}
