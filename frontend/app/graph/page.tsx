"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GitGraphViewer } from "@/components/contexts/git-graph-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockContexts, Context, parseJsonlData } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Copy } from "lucide-react"

export default function GraphPage() {
  const [selectedContext, setSelectedContext] = useState<Context | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  return (
    <DashboardLayout title="Git Graph">
      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Left column: Git graph */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Commit History</h2>
            <p className="text-sm text-muted-foreground">
              Commits with Claude conversations are shown in blue
            </p>
          </div>
          <GitGraphViewer
            contexts={mockContexts}
            onCommitClick={setSelectedContext}
          />
        </div>

        {/* Right column: Commit details */}
        <div>
          {selectedContext ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Commit SHA */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Commit SHA
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono text-chart-3 flex-1">
                      {selectedContext.commit_sha.slice(0, 12)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedContext.commit_sha)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Author */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Author
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {selectedContext.author_email
                          .split("@")[0]
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedContext.author_email}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Created
                  </label>
                  <p className="text-sm mt-1">
                    {formatDistanceToNow(new Date(selectedContext.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedContext.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Context Stats */}
                {selectedContext.total_messages > 0 ? (
                  <>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {selectedContext.total_messages} messages
                      </Badge>
                      <Badge variant="outline">
                        {selectedContext.session_count}{" "}
                        {selectedContext.session_count === 1 ? "session" : "sessions"}
                      </Badge>
                    </div>

                    {/* Context ID */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Context ID
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono text-blue-600 flex-1">
                          {selectedContext.session_id}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedContext.session_id)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Preview conversation */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                        Conversation Preview
                      </label>
                      <div className="bg-muted rounded-lg p-3 text-xs space-y-2 max-h-[200px] overflow-y-auto">
                        {parseJsonlData(selectedContext.jsonl_data)
                          .slice(0, 3)
                          .map((msg: any, i: number) => (
                            <div key={i}>
                              <span className="font-medium">
                                {msg.type === "user" ? "You" : "Claude"}:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {msg.content.slice(0, 100)}
                                {msg.content.length > 100 ? "..." : ""}
                              </span>
                            </div>
                          ))}
                        {parseJsonlData(selectedContext.jsonl_data).length > 3 && (
                          <p className="text-muted-foreground italic">
                            + {parseJsonlData(selectedContext.jsonl_data).length - 3}{" "}
                            more messages
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    <Link href={`/contexts/${selectedContext.session_id}`}>
                      <Button className="w-full" style={{backgroundColor: 'var(--blue-primary)'}}>
                        View Full Context
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No Claude context for this commit</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Click a commit to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
