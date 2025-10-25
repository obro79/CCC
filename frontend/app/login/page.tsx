import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg mb-4" style={{backgroundColor: 'var(--brand-orange)'}}>
          <span className="text-white font-bold text-xl">CC</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Claude Context</h1>
      </div>
      <LoginForm />
    </div>
  )
}
