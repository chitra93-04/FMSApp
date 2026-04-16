"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Bell, Search, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { useTheme } from "next-themes"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => setMounted(true), [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-6 relative z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">FinFlow Finance</span>
            <span className="text-xs text-muted-foreground">ERP System</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-8 w-48 pl-8 text-xs bg-secondary border-0"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted ? (theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />) : <span className="size-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground relative">
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              SA
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
