"use client";
import { useState } from "react";
import type React from "react";
import { Sidebar } from "@/components/sidebar"; // Correct named import
import Navbar from "@/components/navbar"; // Assuming Navbar is a default export

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Pass state and setter to Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Adjust margin based on sidebar state */}
      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        <Navbar 
          username="Sarah" 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  )
}
