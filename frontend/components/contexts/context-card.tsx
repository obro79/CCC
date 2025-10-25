import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export interface ContextCardProps {
  contextId: string
  commitSha: string
  timestamp: string
  totalMessages: number
  sessionCount: number
  authorEmail: string
  repositoryName?: string
  variant?: "compact" | "full"
}

export function ContextCard({
  contextId,
  commitSha,
  timestamp,
  totalMessages,
  sessionCount,
  authorEmail,
  repositoryName,
  variant = "compact",
}: ContextCardProps) {
  const initials = authorEmail
    .split("@")[0]
    .split(/[._-]/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  const shortSha = commitSha.slice(0, 7)

  if (variant === "compact") {
    return (
      <Link href={`/contexts/${contextId}`}>
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-foreground/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono text-chart-3">
                  {shortSha}
                </code>
                <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
              </div>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {totalMessages} messages
              </Badge>
              <Badge variant="outline" className="text-xs">
                {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
              </Badge>
            </div>
            {repositoryName && (
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {repositoryName}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Full variant
  return (
    <Link href={`/contexts/${contextId}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-foreground/20">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-chart-3 font-medium">
                  {shortSha}
                </code>
                <Badge variant="secondary" className="text-xs">
                  {contextId}
                </Badge>
              </div>
              {repositoryName && (
                <p className="text-sm text-muted-foreground">{repositoryName}</p>
              )}
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {totalMessages} messages
                </Badge>
                <Badge variant="outline">
                  {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">{authorEmail}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Captured {timeAgo}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
