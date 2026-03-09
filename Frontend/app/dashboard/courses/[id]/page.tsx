"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Users, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { notFound, useRouter } from "next/navigation"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchCourse()
  }, [resolvedParams.id])

  const fetchCourse = async () => {
    try {
      const result = await api.getCourse(resolvedParams.id)
      if (result.success) {
        setCourse(result.data)
      } else {
        notFound()
      }
    } catch (error) {
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTracker = async (trackerId: string, trackerName: string) => {
    if (!confirm(`Delete tracker "${trackerName}"?`)) return

    try {
      const result = await api.deleteTracker(trackerId)
      if (result.success) {
        fetchCourse() // Refresh
      } else {
        alert('Failed to delete tracker')
      }
    } catch (error) {
      alert('Failed to delete tracker')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    )
  }

  if (!course) {
    notFound()
  }

  const attendanceTrackers = course.trackers.filter((t: any) => t.type === 'ATTENDANCE')
  const assignmentTrackers = course.trackers.filter((t: any) => t.type === 'ASSIGNMENT')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.code}</h1>
          <p className="text-muted-foreground">{course.name}</p>
          {course.semester && <p className="text-sm text-muted-foreground">{course.semester}</p>}
        </div>
        <Link href={`/dashboard/trackers/add?courseId=${course.id}`}>
          <Button className="bg-yellow-300 text-gray-800 hover:bg-yellow-400">
            <Plus size={18} className="mr-1" />
            Add Tracker
          </Button>
        </Link>
      </div>

      {/* Attendance Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Attendance ({attendanceTrackers.length})
          </h2>
        </div>
        
        {attendanceTrackers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attendance trackers yet</p>
        ) : (
          <div className="space-y-2">
            {attendanceTrackers.map((tracker: any) => (
              <div key={tracker.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <Link href={`/dashboard/trackers/${tracker.id}`} className="flex-1">
                  <p className="font-medium hover:underline">{tracker.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tracker._count.records} student{tracker._count.records !== 1 ? 's' : ''}
                  </p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTracker(tracker.id, tracker.name)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Assignments Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={20} />
            Assignments ({assignmentTrackers.length})
          </h2>
        </div>
        
        {assignmentTrackers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignment trackers yet</p>
        ) : (
          <div className="space-y-2">
            {assignmentTrackers.map((tracker: any) => (
              <div key={tracker.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <Link href={`/dashboard/trackers/${tracker.id}`} className="flex-1">
                  <p className="font-medium hover:underline">{tracker.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tracker._count.records} student{tracker._count.records !== 1 ? 's' : ''}
                  </p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTracker(tracker.id, tracker.name)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}