"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background flex-col md:flex-row">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">FinFlow Finance</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">ERP System</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-8 w-40 lg:w-48 pl-8 text-xs bg-secondary border-0"
              />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground relative flex-shrink-0">
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
              SA
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
