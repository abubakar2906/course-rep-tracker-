"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, FileText, Plus, ChevronRight, ChevronDown } from "lucide-react"
import { api } from "@/lib/api"

function calculatePercentage(records: any[], status: string): { completed: number; total: number; percentage: number } {
  const total = records.length
  const completed = records.filter((r: any) => r.status === status).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percentage }
}

export default function TrackersPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const result = await api.getCourses()
      if (result.success) {
        setCourses(result.data)
        setExpandedCourses(new Set(result.data.map((c: any) => c.id)))
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(courseId)) {
        newSet.delete(courseId)
      } else {
        newSet.add(courseId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading trackers...</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-4 p-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trackers</h1>
        </div>
        <div className="text-center py-12 bg-card rounded-xl shadow-sm">
          <p className="text-muted-foreground mb-4">No courses yet. Create a course first!</p>
          <Link
            href="/dashboard/courses/add"
            className="inline-flex items-center rounded-lg bg-yellow-300 px-4 py-2 text-gray-800 transition hover:bg-yellow-400"
          >
            <Plus className="mr-1" size={18} />
            Add Course
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trackers by Course</h1>
        <Link
          href="/dashboard/courses"
          className="text-sm text-primary hover:underline"
        >
          Manage Courses
        </Link>
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const isExpanded = expandedCourses.has(course.id)
          const trackers = course.trackers || []
          const attendanceTrackers = trackers.filter((t: any) => t.type === 'ATTENDANCE')
          const assignmentTrackers = trackers.filter((t: any) => t.type === 'ASSIGNMENT')

          return (
            <div key={course.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="text-muted-foreground" size={20} />
                  ) : (
                    <ChevronRight className="text-muted-foreground" size={20} />
                  )}
                  <div className="text-left">
                    <h2 className="font-semibold text-foreground">
                      {course.code} - {course.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {trackers.length} tracker{trackers.length !== 1 ? 's' : ''}
                      {course.semester && ` • ${course.semester}`}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/trackers/add?courseId=${course.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center rounded-lg bg-yellow-300 px-3 py-1.5 text-sm text-gray-800 transition hover:bg-yellow-400"
                >
                  <Plus size={16} className="mr-1" />
                  Add Tracker
                </Link>
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  {trackers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No trackers yet. Click "Add Tracker" to create one.
                    </p>
                  ) : (
                    <>
                      {attendanceTrackers.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                            <Users size={16} />
                            Attendance ({attendanceTrackers.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {attendanceTrackers.map((tracker: any) => {
                              const { completed, total, percentage } = calculatePercentage(tracker.records || [], 'PRESENT')
                              return (
                                <Link
                                  key={tracker.id}
                                  href={`/dashboard/trackers/${tracker.id}`}
                                  className="block p-3 bg-secondary rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium">{tracker.name}</p>
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span>{completed} / {total} present</span>
                                    <span>{percentage}%</span>
                                  </div>
                                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {assignmentTrackers.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                            <FileText size={16} />
                            Assignments ({assignmentTrackers.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {assignmentTrackers.map((tracker: any) => {
                              const { completed, total, percentage } = calculatePercentage(tracker.records || [], 'SUBMITTED')
                              return (
                                <Link
                                  key={tracker.id}
                                  href={`/dashboard/trackers/${tracker.id}`}
                                  className="block p-3 bg-secondary rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium">{tracker.name}</p>
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span>{completed} / {total} submitted</span>
                                    <span>{percentage}%</span>
                                  </div>
                                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}