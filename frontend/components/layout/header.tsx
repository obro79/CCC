import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface HeaderProps {
  title?: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Breadcrumbs / Title */}
      <div className="flex-1">
        {title && (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
        {children}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
