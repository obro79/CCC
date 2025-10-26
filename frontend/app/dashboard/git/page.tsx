"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitGraphVisualization } from "@/components/git-graph/GitGraphVisualization";
import { mockGitCommits } from "@/lib/mock-data/git-graph";
import { Badge } from "@/components/ui/badge";

export default function GitPage() {
  const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(null);

  // Find the selected commit and its context details
  const selectedCommit = selectedCommitSha
    ? mockGitCommits.find((commit) => commit.commit_sha === selectedCommitSha)
    : null;
  const selectedContext = selectedCommit?.claude_context;

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
            <CardDescription>Click on orange nodes to view Claude context</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto">
            <div className="min-w-[750px] h-[1000px]">
              <GitGraphVisualization
                commits={mockGitCommits}
                selectedCommitSha={selectedCommitSha}
                onClaudeNodeClick={setSelectedCommitSha}
              />
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
          <CardDescription>
            {selectedContext ? "Context details" : "Click a Claude node to view conversation"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {selectedContext ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Context ID:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {selectedContext.context_id}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Messages:</span>
                <Badge variant="secondary">{selectedContext.total_messages}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Session Type:</span>
                <Badge variant={selectedContext.new_session ? "default" : "outline"}>
                  {selectedContext.new_session ? "New Session" : "Continuing Session"}
                </Badge>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Chat history will be displayed here in the future
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a Claude context (orange node) to view conversation details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
