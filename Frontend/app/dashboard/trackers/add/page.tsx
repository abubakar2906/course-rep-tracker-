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
  const [cohortId, setCohortId] = useState("")
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const cohortsRes = await api.getMyCohorts()

      if (cohortsRes.success) {
        setCohorts(cohortsRes.data)
        
        // Auto-select cohort if there's only one
        if (cohortsRes.data.length === 1) {
          setCohortId(cohortsRes.data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCohort = cohorts.find(c => c.id === cohortId)
  const availableCourses = selectedCohort?.courses || []

  // Auto-select course if preselectedCourseId matches an available course
  const [courseId, setCourseId] = useState(preselectedCourseId || "")
  
  useEffect(() => {
    if (preselectedCourseId && availableCourses.some((c: any) => c.id === preselectedCourseId)) {
      setCourseId(preselectedCourseId)
    } else if (availableCourses.length === 1) {
      setCourseId(availableCourses[0].id)
    } else if (!availableCourses.some((c: any) => c.id === courseId)) {
      setCourseId("")
    }
  }, [cohortId, availableCourses, preselectedCourseId])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!cohortId) {
      alert('Please select a cohort')
      return
    }

    if (!courseId) {
      alert('Please select a course')
      return
    }

    setSubmitting(true)
    try {
      const result = await api.createTracker({
        name,
        type,
        courseId,
        cohortId,
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

  if (cohorts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Tracker</h1>
          <p className="text-muted-foreground">Create a cohort first to add trackers</p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You need to have at least one cohort before adding trackers</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
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
            <Label>Cohort *</Label>
            <Select value={cohortId} onValueChange={setCohortId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a cohort" />
              </SelectTrigger>
              <SelectContent>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort.id} value={cohort.id}>
                    {cohort.program} ({cohort.level.replace('LEVEL_', '')} Level) - {cohort.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Course *</Label>
            <Select value={courseId} onValueChange={setCourseId} required disabled={!cohortId || availableCourses.length === 0 || !!preselectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder={!cohortId ? "Select a cohort first" : availableCourses.length === 0 ? "No courses linked to this cohort" : "Select a course"} />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course: any) => (
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