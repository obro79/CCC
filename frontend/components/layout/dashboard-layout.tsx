import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  headerContent?: React.ReactNode
}

export function DashboardLayout({ children, title, headerContent }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header title={title}>{headerContent}</Header>
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
