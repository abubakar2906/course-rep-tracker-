"use client"

import { Users, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

// Define TypeScript types
type TrackerType = "attendance" | "assignment"

interface TrackerStats {
  total: number
  percentage: number
  present?: number
  submitted?: number
}

interface Tracker {
  type: TrackerType
  title: string
  course: string
  description: string
  icon: React.ElementType
  stats: TrackerStats
}

// Mock data - replace with your data fetching logic
const getMockTracker = (id: string): Tracker | undefined => {
  const trackers: Record<string, Tracker> = {
    attendance: {
      type: "attendance",
      title: "Week 1 Lecture",
      course: "CSC 101",
      description: "Introduction to Computer Science",
      icon: Users,
      stats: {
        total: 120,
        present: 98,
        percentage: 82,
      }
    },
    assignment: {
      type: "assignment",
      title: "Assignment 1",
      course: "CSC 101",
      description: "Basic Programming Concepts",
      icon: FileText,
      stats: {
        total: 120,
        submitted: 78,
        percentage: 65,
      }
    }
  }
  return trackers[id]
}

export default function TrackerDetailPage({ params }: { params: { id: string } }) {
  const tracker = getMockTracker(params.id)

  // Handle invalid tracker IDs
  if (!tracker) {
    notFound()
  }

  const Icon = tracker.type === "attendance" ? Users : FileText

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/trackers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{tracker.course}</h1>
          <p className="text-muted-foreground">{tracker.title}</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-secondary rounded-full">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">{tracker.type === "attendance" ? "Attendance Tracker" : "Assignment Tracker"}</h2>
            <p className="text-sm text-muted-foreground">{tracker.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className="text-sm font-medium">{tracker.stats.percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${tracker.stats.percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Total Students</dt>
                <dd className="text-2xl font-bold">{tracker.stats.total}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {tracker.type === "attendance" ? "Present" : "Submitted"}
                </dt>
                <dd className="text-2xl font-bold">
                  {tracker.type === "attendance" ? tracker.stats.present : tracker.stats.submitted}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
    </div>
  )
}
