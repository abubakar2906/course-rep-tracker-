"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function AddCoursePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    semester: "",
  })

  // For Course Rep flow
  const [searchCode, setSearchCode] = useState("")
  const [foundCourse, setFoundCourse] = useState<any>(null)
  const [cohorts, setCohorts] = useState<any[]>([])
  const [selectedCohortId, setSelectedCohortId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  useEffect(() => {
    if (user?.role === 'course_rep') {
      api.getMyCohorts().then(res => {
        if (res.success) setCohorts(res.data)
      }).catch(err => console.error("Failed to fetch cohorts:", err))
    }
  }, [user?.role])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await api.createCourse(formData)
      if (result.success) {
        router.push('/dashboard/courses')
      } else {
        alert(result.error || 'Failed to create course')
      }
    } catch (error) {
      alert('Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchCode.trim()) return

    setIsSearching(true)
    setSearchError("")
    setFoundCourse(null)

    try {
      const result = await api.findCourseByCode(searchCode.trim())
      if (result.success && result.data) {
        setFoundCourse(result.data)
      } else {
        setSearchError(result.error || "Course not found")
      }
    } catch (error) {
      setSearchError("Error searching for course")
    } finally {
      setIsSearching(false)
    }
  }

  const handleLinkCourse = async () => {
    if (!foundCourse || !selectedCohortId) return

    setLoading(true)
    try {
      const result = await api.linkCourseToCohort(selectedCohortId, foundCourse.id)
      if (result.success) {
        router.push('/dashboard/courses')
      } else {
        alert(result.error || 'Failed to link course')
      }
    } catch (error) {
      alert('Failed to link course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{user?.role === 'lecturer' ? 'Add New Course' : 'Link Course to Cohort'}</h1>
        <p className="text-muted-foreground">
          {user?.role === 'lecturer' 
            ? 'Create a new course to track attendance and assignments' 
            : 'Search for a course created by a lecturer and link it to your cohort'}
        </p>
      </div>

      <Card className="p-6">
        {user?.role === 'lecturer' ? (
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CSC 101"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Introduction to Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester (Optional)</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g. Fall 2024"
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSearchCourse} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="searchCode">Search Course by Code</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <Input
                    id="searchCode"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CSC 101"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSearching || !searchCode.trim()}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </form>

            {searchError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {searchError}
              </div>
            )}

            {foundCourse && (
              <div className="p-4 border rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{foundCourse.code} - {foundCourse.name}</h3>
                  <p className="text-sm text-muted-foreground">Lecturer: {foundCourse.lecturer?.name || 'Unknown'}</p>
                  {foundCourse.semester && <p className="text-sm text-muted-foreground">Semester: {foundCourse.semester}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cohort">Select Cohort to Link</Label>
                  <Select
                    value={selectedCohortId}
                    onValueChange={setSelectedCohortId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cohort" />
                    </SelectTrigger>
                    <SelectContent>
                      {cohorts.map((cohort) => (
                        <SelectItem key={cohort.id} value={cohort.id}>
                          {cohort.program} ({cohort.level.replace('LEVEL_', '')} Level)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleLinkCourse} 
                    disabled={loading || !selectedCohortId}
                    className="bg-yellow-300 text-gray-800 hover:bg-yellow-400"
                  >
                    {loading ? 'Linking...' : 'Link Course'}
                  </Button>
                </div>
              </div>
            )}
            
            {!foundCourse && !searchError && (
              <div className="pt-4 flex gap-4">
                 <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}