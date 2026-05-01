"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ListChecks,
  BookOpen,
  User2,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  X,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  disabled?: boolean
}

// All possible nav items tagged by role
const ALL_NAV_ITEMS: (NavItemProps & { roles: string[] })[] = [
  { href: "/dashboard",          icon: LayoutDashboard, label: "Dashboard",  roles: ['course_rep', 'lecturer', 'student', 'pending'] },
  { href: "/dashboard/courses",  icon: BookOpen,        label: "My Courses", roles: ['course_rep', 'lecturer', 'student'] },
  { href: "/dashboard/students", icon: Users,           label: "Students",   roles: ['course_rep'] },
  { href: "/dashboard/trackers", icon: ListChecks,      label: "Trackers",   roles: ['course_rep', 'lecturer', 'student'] },
]

const secondaryNavItems: NavItemProps[] = [
  { href: "/dashboard/profile", icon: User2, label: "Profile" },
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
  const { user, logout } = useAuth()

  // Filter nav items based on user role
  const mainNavItems = ALL_NAV_ITEMS.filter(item =>
    item.roles.includes(user?.role ?? 'pending')
  )

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

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
            isCollapsed ? "w-16" : "w-64",
            "hidden md:flex",
            className
          )}
        >
          {/* Header */}
          <div className={cn("flex h-16 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <BookOpenCheck className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">CourseRep</span>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          {/* Role badge */}
          {!isCollapsed && user?.role && user.role !== 'pending' && (
            <div className="px-4 py-2 border-b">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                user.role === 'lecturer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                user.role === 'student'  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              )}>
                {user.role === 'lecturer' ? '👨‍🏫 Lecturer' : user.role === 'student' ? '📚 Student' : '🎓 Course Rep'}
              </span>
            </div>
          )}

          {/* Navigation */}
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

          {/* Secondary */}
          <div className="mt-auto border-t p-2">
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} isActive={pathname === item.href} />
              ))}
              
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => logout()} 
                      className="w-full group flex items-center justify-center rounded-md px-3 py-2.5 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>Log Out</TooltipContent>
                </Tooltip>
              ) : (
                <button 
                  onClick={() => logout()} 
                  className="w-full group flex items-center rounded-md px-3 py-2.5 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive" />
                  <span className="ml-3 text-sm font-medium">Log Out</span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out transform",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            "md:hidden"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">CourseRep</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!isCollapsed && user?.role && user.role !== 'pending' && (
            <div className="px-4 py-2 border-b">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                user.role === 'lecturer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                user.role === 'student'  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              )}>
                {user.role === 'lecturer' ? '👨‍🏫 Lecturer' : user.role === 'student' ? '📚 Student' : '🎓 Course Rep'}
              </span>
            </div>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center rounded-md px-3 py-2.5 transition-colors",
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t p-2">
            <nav className="space-y-1 pb-2">
              {secondaryNavItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className={cn("flex items-center rounded-md px-3 py-2.5 transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              <button 
                onClick={() => logout()} 
                className="w-full group flex items-center rounded-md px-3 py-2.5 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5 mr-3 shrink-0 text-muted-foreground group-hover:text-destructive" />
                <span className="text-sm font-medium text-foreground group-hover:text-destructive">Log Out</span>
              </button>
            </nav>
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}

const NavItem: React.FC<{ item: NavItemProps; isCollapsed: boolean; isActive: boolean }> = ({ item, isCollapsed, isActive }) => {
  const { href, icon: Icon, label, disabled } = item
  const linkClasses = cn(
    "group flex items-center rounded-md px-3 py-2.5 transition-colors",
    isCollapsed ? "justify-center" : "",
    isActive ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground",
    disabled ? "cursor-not-allowed opacity-50" : ""
  )

  const content = (
    <>
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {!isCollapsed && (
        <span className={cn("ml-3 text-sm font-medium", isActive ? "text-primary" : "text-foreground group-hover:text-foreground")}>
          {label}
        </span>
      )}
    </>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={disabled ? "#" : href} className={linkClasses} aria-disabled={disabled}>{content}</Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>{label}</TooltipContent>
      </Tooltip>
    )
  }

  return <Link href={disabled ? "#" : href} className={linkClasses} aria-disabled={disabled}>{content}</Link>
}