"use client"

import React from "react"
import Link from "next/link"
import { Menu, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  username: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ username, isMobileMenuOpen, setIsMobileMenuOpen }: NavbarProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Page title - only visible on mobile */}
        <h1 className="text-lg font-semibold md:hidden">CourseRep</h1>
        
        {/* Spacer */}
        <div className="flex-1"></div>
        
        {/* User actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex items-center gap-2" 
            asChild
          >
            <Link href="/dashboard/profile">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:inline-block">{username}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
