"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ListChecks,
  FileText,
  User2, // Add this
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  LogOut,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Define the type for navigation items
interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  disabled?: boolean
}

// Define the navigation links
const mainNavItems: NavItemProps[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/students", icon: Users, label: "Students" },
  { href: "/dashboard/trackers", icon: ListChecks, label: "Trackers" },
]

const secondaryNavItems: NavItemProps[] = [
  { href: "/dashboard/profile", icon: User2, label: "Profile" },
  // Add a logout link/button if appropriate for your auth flow
  // { href: "/logout", icon: LogOut, label: "Logout" },
]

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ 
  className,
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: SidebarProps) {
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64", // Collapsed and expanded widths
            "hidden md:flex", // Hide on mobile by default, show on md and up
            className
          )}
        >
          {/* Logo and App Name */}
          <div
            className={cn(
              "flex h-16 items-center border-b px-4",
              isCollapsed ? "justify-between" : "justify-between" // Changed from justify-center/start
            )}
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              {!isCollapsed && (
                <span className="text-lg font-semibold text-foreground">
                  CourseRep
                </span>
              )}
            </Link>
            
            {/* Moved collapse button here */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              />
            ))}
          </nav>

          {/* Secondary Navigation - Remove the collapse button from here */}
          <div className="mt-auto border-t p-2">
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar (drawer) */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out transform",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            "md:hidden" // Only show on mobile
          )}
        >
          {/* Mobile sidebar header with close button */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                CourseRep
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2.5 transition-colors",
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Secondary Navigation */}
          <div className="mt-auto border-t p-2">
            <nav className="space-y-1 pb-2">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}

// Sub-component for individual navigation items
const NavItem: React.FC<{
  item: NavItemProps
  isCollapsed: boolean
  isActive: boolean
}> = ({ item, isCollapsed, isActive }) => {
  const { href, icon: Icon, label, disabled } = item

  const linkContent = (
    <>
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      {!isCollapsed && (
        <span
          className={cn(
            "ml-3 text-sm font-medium",
            isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
          )}
        >
          {label}
        </span>
      )}
    </>
  )

  const linkClasses = cn(
    "group flex items-center rounded-md px-3 py-2.5 transition-colors",
    isCollapsed ? "justify-center" : "",
    isActive ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground",
    disabled ? "cursor-not-allowed opacity-50" : ""
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={disabled ? "#" : href} className={linkClasses} aria-disabled={disabled}>
            {linkContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link href={disabled ? "#" : href} className={linkClasses} aria-disabled={disabled}>
      {linkContent}
    </Link>
  )
}
