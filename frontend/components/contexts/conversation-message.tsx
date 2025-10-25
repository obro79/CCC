import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface ConversationMessageProps {
  type: "user" | "assistant" | "system"
  content: string
  timestamp?: string
  className?: string
}

export function ConversationMessage({
  type,
  content,
  timestamp,
  className,
}: ConversationMessageProps) {
  // System messages (session boundaries, etc.)
  if (type === "system") {
    return (
      <div className={cn("flex justify-center py-6", className)}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px w-12 bg-border" />
          <span className="font-medium uppercase tracking-wide">{content}</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>
    )
  }

  // User messages (right-aligned, Claude's blue accent)
  if (type === "user") {
    return (
      <div className={cn("flex justify-end gap-3 py-4", className)}>
        <div className="flex max-w-[80%] flex-col items-end gap-2">
          <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-white shadow-sm" style={{backgroundColor: 'var(--blue-primary)'}}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {content}
            </p>
          </div>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-white text-xs" style={{backgroundColor: 'var(--blue-primary)'}}>
            U
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  // Assistant messages (left-aligned, neutral)
  return (
    <div className={cn("flex gap-3 py-4", className)}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="flex max-w-[80%] flex-col gap-2">
        <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed m-0">
              {content}
            </p>
          </div>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        )}
      </div>
    </div>
  )
}
