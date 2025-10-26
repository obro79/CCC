"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitGraphVisualization } from "@/components/git-graph/GitGraphVisualization";
import { mockGitCommits } from "@/lib/mock-data/git-graph";

export default function GitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Git Status</h2>
        <p className="text-muted-foreground">
          Visualizing Git commits with Claude conversation contexts
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Git Graph - Takes 2 columns on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Git + Claude Context Visualization</CardTitle>
            <CardDescription>Git commits (blue) with Claude contexts (orange)</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto">
            <div className="min-w-[600px] h-[800px]">
              <GitGraphVisualization commits={mockGitCommits} />
            </div>
          </CardContent>
        </Card>

        {/* Git Diff Placeholder - Takes 1 column on large screens */}
        <Card>
          <CardHeader>
            <CardTitle>Git Diff</CardTitle>
            <CardDescription>Changes for selected commit</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <p className="text-sm text-muted-foreground">
              Select a commit to view diff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chat/Context Placeholder - Full width below */}
      <Card>
        <CardHeader>
          <CardTitle>Claude Conversation</CardTitle>
          <CardDescription>Chat history for selected context</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <p className="text-sm text-muted-foreground">
            Select a Claude context to view conversation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
