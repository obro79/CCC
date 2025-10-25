import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, FolderGit2, Users, Lock } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--brand-orange)'}}>
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="font-semibold text-foreground">Claude Context</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Never lose your Claude conversations again
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Claude Code Context Manager captures and version-controls your AI conversations
              alongside your code commits, making them accessible to your entire team.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">Context Capture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatically capture Claude conversations at every git commit
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FolderGit2 className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">Version Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track conversation history alongside your code changes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Share AI reasoning and context with your entire team
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Row-level security ensures your contexts stay private
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Claude Code Context Manager. Built with Claude.</p>
        </div>
      </footer>
    </div>
  )
}
