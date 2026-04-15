"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoice Voucher", icon: FileText },
  { href: "/receipts", label: "Receipt Voucher", icon: ScrollText },
  { href: "/reports/invoices", label: "Invoice Report", icon: BarChart3 },
  { href: "/reports/receipts", label: "Receipt Report", icon: ClipboardList },
  { href: "/settings/bank-details", label: "Bank Details", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [pathname, isMobile, mobileMenuOpen])

  if (isMobile && !mobileMenuOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-14 left-3 z-40 text-muted-foreground hover:text-foreground md:hidden"
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>
    )
  }

  return (
    <>
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed md:relative flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-40",
          "w-64",
          isMobile && !mobileMenuOpen && "hidden",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex shrink-0 items-center justify-center">
            <span className="text-xl font-bold tracking-wider text-sidebar-foreground">
              <span className="text-primary"></span>FinFlow
            </span>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="size-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))

            const linkContent = (
              <Link
                href={item.href}
                onClick={() => {
                  if (isMobile && mobileMenuOpen) {
                    setMobileMenuOpen(false)
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* Collapse Toggle - Hidden on mobile */}
        <div className="border-t border-sidebar-border p-2 hidden md:block">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
      </aside>
    </>
  )
}
