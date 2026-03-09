"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"

export default function AddTrackerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get('courseId')
  
  const [type, setType] = useState<"ATTENDANCE" | "ASSIGNMENT">("ATTENDANCE")
  const [name, setName] = useState("")
  const [courseId, setCourseId] = useState(preselectedCourseId || "")
  const [courses, setCourses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        api.getCourses(),
        api.getStudents(),
      ])

      if (coursesRes.success) {
        setCourses(coursesRes.data)
      }

      if (studentsRes.success) {
        setStudents(studentsRes.data)
        setSelectedStudents(studentsRes.data.map((s: any) => s.id))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map(s => s.id))
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!courseId) {
      alert('Please select a course')
      return
    }

    if (selectedStudents.length === 0) {
      alert('Please select at least one student')
      return
    }

    setSubmitting(true)
    try {
      const result = await api.createTracker({
        name,
        type,
        courseId,
        studentIds: selectedStudents,
      })

      if (result.success) {
        router.push(`/dashboard/courses/${courseId}`)
      } else {
        alert('Failed to create tracker')
      }
    } catch (error) {
      alert('Failed to create tracker')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Tracker</h1>
          <p className="text-muted-foreground">Create a course first to add trackers</p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You need to create a course before adding trackers</p>
          <Button onClick={() => router.push('/dashboard/courses/add')}>
            Create Course
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Tracker</h1>
        <p className="text-muted-foreground">Create a new attendance or assignment tracker</p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Course *</Label>
            <Select value={courseId} onValueChange={setCourseId} required disabled={!!preselectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tracker Type</Label>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value) => value && setType(value as "ATTENDANCE" | "ASSIGNMENT")}
              className="justify-start"
            >
              <ToggleGroupItem value="ATTENDANCE" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Attendance
              </ToggleGroupItem>
              <ToggleGroupItem value="ASSIGNMENT" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Assignment
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tracker Name *</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "ATTENDANCE" ? "e.g. Week 1 Lecture" : "e.g. Assignment 1"} 
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Students</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleAll}
              >
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label htmlFor={student.id} className="text-sm cursor-pointer">
                    {student.fullName} ({student.matricNumber})
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedStudents.length} of {students.length} students selected
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Tracker'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}