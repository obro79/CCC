"use client"

import { Context } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

export interface GitGraphViewerProps {
  contexts: Context[]
  onCommitClick?: (context: Context) => void
}

export function GitGraphViewer({ contexts, onCommitClick }: GitGraphViewerProps) {
  // Sort contexts chronologically
  const sortedContexts = [...contexts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Layout constants
  const commitRadius = 8
  const gitX = 100 // X position for git timeline
  const claudeX = 350 // X position for claude timeline
  const commitSpacing = 80 // Vertical spacing between commits
  const paddingTop = 40
  const paddingBottom = 40

  const svgHeight = sortedContexts.length * commitSpacing + paddingTop + paddingBottom

  // Generate paths for connections
  const generateHorizontalPath = (gitY: number, claudeY: number) => {
    // Bezier curve from git to claude (curving down)
    const midX = (gitX + claudeX) / 2
    return `M ${gitX} ${gitY} C ${midX} ${gitY}, ${midX} ${claudeY}, ${claudeX} ${claudeY}`
  }

  const generateMergePath = (claudeY: number, gitY: number) => {
    // Bezier curve from claude back to git
    const midX = (claudeX + gitX) / 2
    return `M ${claudeX} ${claudeY} C ${midX} ${claudeY}, ${midX} ${gitY}, ${gitX} ${gitY}`
  }

  // Track active session for visualization
  let activeSessionStart: number | null = null
  let lastClaudeY: number | null = null

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

      <div className="min-w-[500px]">
        <svg width="100%" height={svgHeight} className="overflow-visible">
          {/* Git timeline (vertical line) */}
          <line
            x1={gitX}
            y1={paddingTop}
            x2={gitX}
            y2={svgHeight - paddingBottom}
            stroke="#3b82f6"
            strokeWidth="3"
          />

          {/* Branch labels */}
          <g>
            <rect
              x={gitX - 35}
              y={10}
              width="70"
              height="24"
              rx="12"
              fill="#dbeafe"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <text
              x={gitX}
              y={25}
              textAnchor="middle"
              fill="#2563eb"
              fontSize="12"
              fontWeight="bold"
            >
              main
            </text>
          </g>

          <g>
            <rect
              x={claudeX - 40}
              y={10}
              width="80"
              height="24"
              rx="12"
              fill="#ffedd5"
              stroke="#f97316"
              strokeWidth="2"
            />
            <text
              x={claudeX}
              y={25}
              textAnchor="middle"
              fill="#f97316"
              fontSize="12"
              fontWeight="bold"
            >
              claude
            </text>
          </g>

          {/* Render commits and connections */}
          {sortedContexts.map((context, index) => {
            const y = paddingTop + index * commitSpacing
            const shortSha = context.commit_sha.slice(0, 7)
            const hasContext = context.total_messages > 0
            const nextContext = sortedContexts[index + 1]

            // Determine if we should merge and/or branch
            const shouldMerge = hasContext && activeSessionStart !== null && (
              !nextContext ||
              (nextContext.total_messages > 0 && nextContext.new_session)
            )

            const shouldBranch = hasContext && context.new_session

            return (
              <g key={context.commit_sha}>
                {/* Draw merge line before new branch */}
                {shouldMerge && lastClaudeY !== null && shouldBranch && (
                  <path
                    d={generateMergePath(lastClaudeY, y)}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                )}

                {/* Draw horizontal branch line for new session */}
                {shouldBranch && (
                  <>
                    <path
                      d={generateHorizontalPath(y, y)}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      opacity="0.8"
                    />
                    {(() => {
                      activeSessionStart = y
                      lastClaudeY = y
                      return null
                    })()}
                  </>
                )}

                {/* Draw vertical line for continued session */}
                {hasContext && !context.new_session && lastClaudeY !== null && (
                  <>
                    <line
                      x1={claudeX}
                      y1={lastClaudeY}
                      x2={claudeX}
                      y2={y}
                      stroke="#f97316"
                      strokeWidth="3"
                    />
                    {(() => {
                      lastClaudeY = y
                      return null
                    })()}
                  </>
                )}

                {/* Draw merge line at end of session */}
                {shouldMerge && lastClaudeY !== null && !shouldBranch && (
                  <>
                    <path
                      d={generateMergePath(lastClaudeY, y)}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      opacity="0.8"
                    />
                    {(() => {
                      activeSessionStart = null
                      lastClaudeY = null
                      return null
                    })()}
                  </>
                )}

                {/* Git commit circle */}
                <circle
                  cx={gitX}
                  cy={y}
                  r={commitRadius}
                  fill="#3b82f6"
                  stroke="#2563eb"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-700 transition-colors"
                  onClick={() => onCommitClick && !hasContext && onCommitClick(context)}
                />

                {/* Git commit SHA label */}
                <text
                  x={gitX + commitRadius + 10}
                  y={y + 4}
                  fill="#1e40af"
                  fontSize="14"
                  fontFamily="monospace"
                >
                  {shortSha}
                </text>

                {/* Claude commit circle */}
                {hasContext && (
                  <>
                    <circle
                      cx={claudeX}
                      cy={y}
                      r={commitRadius}
                      fill="#f97316"
                      stroke="#ea580c"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-orange-600 transition-colors"
                      onClick={() => onCommitClick && onCommitClick(context)}
                    />

                    {/* Claude message count label */}
                    <text
                      x={claudeX + commitRadius + 10}
                      y={y + 4}
                      fill="#9a3412"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      💬 {context.total_messages} messages
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </Card>
  )
}
