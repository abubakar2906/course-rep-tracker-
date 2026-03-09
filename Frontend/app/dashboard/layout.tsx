"use client";
import { useState } from "react";
import type React from "react";
import { Sidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";

function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        <Navbar 
          username={user?.name?.split(' ')[0] || 'User'} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardContent>{children}</DashboardContent>
}