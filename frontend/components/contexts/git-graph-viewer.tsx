"use client"

import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react"
import { Context } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

export interface GitGraphViewerProps {
  contexts: Context[]
  onCommitClick?: (context: Context) => void
}

export function GitGraphViewer({ contexts, onCommitClick }: GitGraphViewerProps) {
  // Sort contexts chronologically to build graph in order
  const sortedContexts = [...contexts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Custom template matching Claude design system
  const claudeTemplate = templateExtend(TemplateName.Metro, {
    colors: ["#2563eb", "#f97316"], // Blue for git, orange for claude
    branch: {
      lineWidth: 3,
      spacing: 60,
      label: {
        font: "bold 12px 'Geist Sans', sans-serif",
      },
    },
    commit: {
      spacing: 80,
      dot: {
        size: 10,
      },
      message: {
        displayAuthor: false,
        displayHash: false,
        font: "normal 12px 'Geist Sans', sans-serif",
      },
    },
  })

  return (
    <Card className="p-6 overflow-x-auto">
      <div className="mb-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
          <span className="text-muted-foreground">Git commits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">Claude contexts</span>
        </div>
      </div>
      <div className="min-w-[700px]">
        <Gitgraph options={{ template: claudeTemplate }}>
          {(gitgraph) => {
            // Create main git branch (bottom)
            const gitBranch = gitgraph.branch({
              name: "main",
              style: {
                label: {
                  color: "#2563eb",
                  strokeColor: "#2563eb",
                  bgColor: "#dbeafe",
                },
              },
            })

            // Create claude branch (top)
            const claudeBranch = gitgraph.branch({
              name: "claude",
              style: {
                label: {
                  color: "#f97316",
                  strokeColor: "#f97316",
                  bgColor: "#ffedd5",
                },
              },
            })

            sortedContexts.forEach((context, index) => {
              const shortSha = context.commit_sha.slice(0, 7)
              const hasContext = context.total_messages > 0

              // Add git commit on main branch
              gitBranch.commit({
                subject: shortSha,
                author: context.author_email.split('@')[0],
                style: {
                  dot: {
                    color: "#3b82f6",
                    strokeColor: "#2563eb",
                    strokeWidth: 2,
                  },
                  message: {
                    color: "#1e40af",
                  },
                },
                onClick: () => {
                  if (onCommitClick && !hasContext) {
                    onCommitClick(context)
                  }
                },
              })

              // If this commit has Claude context, add it to claude branch
              if (hasContext) {
                claudeBranch.commit({
                  subject: `💬 ${context.total_messages} messages`,
                  author: context.author_email.split('@')[0],
                  style: {
                    dot: {
                      color: "#f97316",
                      strokeColor: "#ea580c",
                      strokeWidth: 2,
                    },
                    message: {
                      color: "#9a3412",
                      font: "bold 12px 'Geist Sans', sans-serif",
                    },
                  },
                  onClick: () => {
                    if (onCommitClick) {
                      onCommitClick(context)
                    }
                  },
                  onMessageClick: () => {
                    if (onCommitClick) {
                      onCommitClick(context)
                    }
                  },
                })

                // Merge back to main to show connection
                claudeBranch.merge(gitBranch, {
                  commitOptions: {
                    style: {
                      dot: {
                        size: 0, // Hide the merge commit dot
                      },
                      message: {
                        display: false, // Hide merge message
                      },
                    },
                  },
                })
              }
            })
          }}
        </Gitgraph>
      </div>
    </Card>
  )
}
