"use client"

import * as React from "react"
import { Users, FileText, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function TrackerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [tracker, setTracker] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [recordStates, setRecordStates] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    fetchTracker()
  }, [resolvedParams.id])

  const fetchTracker = async () => {
    try {
      const result = await api.getTracker(resolvedParams.id)
      if (result.success) {
        setTracker(result.data)
        // Initialize record states
        const states: Record<string, string> = {}
        result.data.records.forEach((record: any) => {
          states[record.id] = record.status
        })
        setRecordStates(states)
      } else {
        notFound()
      }
    } catch (error) {
      console.error('Failed to fetch tracker:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStudent = (recordId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PRESENT' || currentStatus === 'SUBMITTED' 
      ? 'PENDING' 
      : tracker.type === 'ATTENDANCE' ? 'PRESENT' : 'SUBMITTED'
    
    setRecordStates(prev => ({
      ...prev,
      [recordId]: newStatus
    }))
  }
  const handleSaveChanges = async () => {
  setSaving(true)
  try {
    const updates = Object.entries(recordStates).map(([id, status]) => ({
      id,
      status,
    }))

    const result = await api.bulkUpdateRecords(updates)
    if (result.success) {
      alert('Changes saved successfully!')
      await fetchTracker() // Refresh to get updated data
      // Redirect back to show updated stats
      router.push('/dashboard/trackers')
    } else {
      alert('Failed to save changes')
    }
  } catch (error) {
    alert('Failed to save changes')
  } finally {
    setSaving(false)
  }
}

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading tracker...</p>
      </div>
    )
  }

  if (!tracker) {
    notFound()
  }

  const Icon = tracker.type === "ATTENDANCE" ? Users : FileText
  const totalRecords = tracker.records.length
  const completedCount = Object.values(recordStates).filter(
    status => status === 'PRESENT' || status === 'SUBMITTED'
  ).length
  const percentage = totalRecords > 0 ? Math.round((completedCount / totalRecords) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/trackers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{tracker.name}</h1>
          <p className="text-muted-foreground">
            {tracker.type === 'ATTENDANCE' ? 'Attendance Tracker' : 'Assignment Tracker'}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-secondary rounded-full">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">
              {tracker.type === "ATTENDANCE" ? "Attendance Tracker" : "Assignment Tracker"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Created {new Date(tracker.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Total Students</dt>
                <dd className="text-2xl font-bold">{totalRecords}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {tracker.type === "ATTENDANCE" ? "Present" : "Submitted"}
                </dt>
                <dd className="text-2xl font-bold">{completedCount}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Student List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Student List</h3>
          <div className="space-y-4">
            {tracker.records.map((record: any) => {
              const isMarked = recordStates[record.id] === 'PRESENT' || recordStates[record.id] === 'SUBMITTED'
              
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isMarked}
                      onCheckedChange={() => handleToggleStudent(record.id, recordStates[record.id])}
                      id={`record-${record.id}`}
                      disabled={user?.role === 'lecturer' || user?.role === 'student'}
                    />
                    <div>
                      <label
                        htmlFor={`record-${record.id}`}
                        className={`font-medium ${user?.role === 'lecturer' || user?.role === 'student' ? '' : 'cursor-pointer'}`}
                      >
                        {record.student.fullName}
                      </label>
                      <p className="text-sm text-muted-foreground">{record.student.matricNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMarked ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        {tracker.type === "ATTENDANCE" ? "Present" : "Submitted"}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 flex items-center gap-1">
                        <X size={16} />
                        {tracker.type === "ATTENDANCE" ? "Absent" : "Not Submitted"}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Save Button */}
          {user?.role !== 'lecturer' && user?.role !== 'student' && (
            <div className="mt-6 flex justify-end">
              <Button
                className="w-full sm:w-auto"
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}