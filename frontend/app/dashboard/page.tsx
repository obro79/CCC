import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ContextCard } from '@/components/contexts/context-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Mock data for demonstration - will be replaced with real data later
  const mockContexts = [
    {
      contextId: "ctx-abc123",
      commitSha: "abc123def456789",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalMessages: 61,
      sessionCount: 2,
      authorEmail: user.email || "user@example.com",
      repositoryName: "my-awesome-app",
    },
    {
      contextId: "ctx-def456",
      commitSha: "def456ghi789012",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalMessages: 42,
      sessionCount: 1,
      authorEmail: user.email || "user@example.com",
      repositoryName: "another-project",
    },
    {
      contextId: "ctx-ghi789",
      commitSha: "ghi789jkl012345",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalMessages: 28,
      sessionCount: 1,
      authorEmail: user.email || "user@example.com",
      repositoryName: "my-awesome-app",
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contexts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">125</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all repositories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Collaborating users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contexts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Contexts</h2>
            <a
              href="/contexts"
              className="text-sm hover:underline"
              style={{color: 'var(--blue-primary)'}}
            >
              View all →
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockContexts.map((context) => (
              <ContextCard key={context.contextId} {...context} />
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You are signed in as <span className="font-medium text-foreground">{user.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Start capturing Claude conversations by running the CLI in your repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
