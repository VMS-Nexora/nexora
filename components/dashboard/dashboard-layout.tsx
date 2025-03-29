"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { AIAssistant } from "../ai-assistant/ai-assistant"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - always visible on desktop, controlled by state on mobile */}
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[320px] max-w-full">
            <div className="h-full overflow-hidden">
              <AppSidebar />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="fixed inset-y-0 left-0 z-20 w-[280px] h-screen overflow-hidden">
          <AppSidebar />
        </div>
      )}

      {/* Main content area */}
      <div className={cn("flex flex-1 flex-col w-full h-screen overflow-hidden", !isMobile && "ml-[280px]")}>
        {/* Fixed header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 h-[calc(100vh-56px)]">{children}</main>

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  )
}

