"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Plus, ChevronRight, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const result = await api.getCourses()
      if (result.success) {
        setCourses(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, courseName: string) => {
    if (!confirm(`Delete course "${courseName}"?`)) return

    try {
      const result = await api.deleteCourse(id)
      if (result.success) {
        setCourses(courses.filter(c => c.id !== id))
      } else {
        alert(result.error || 'Failed to delete course')
      }
    } catch (error) {
      alert('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Courses</h1>
        <Link href="/dashboard/courses/add">
          <Button className="bg-yellow-300 text-gray-800 hover:bg-yellow-400">
            <Plus size={18} className="mr-1" />
            {user?.role === 'lecturer' ? 'Add Course' : 'Link Course'}
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl shadow-sm">
          <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {user?.role === 'lecturer' ? 'No courses yet. Create your first one!' : 'No courses yet. Link a course to your cohort!'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center p-4 hover:bg-secondary transition-colors"
              >
                <div className="flex-1">
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <h3 className="font-medium text-foreground hover:underline">
                      {course.code} - {course.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      {course.semester && <span className="mr-3">{course.semester}</span>}
                      <span>{course._count.trackers} tracker{course._count.trackers !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button variant="ghost" size="icon">
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                  {user?.role === 'lecturer' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(course.id, `${course.code} - ${course.name}`)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}