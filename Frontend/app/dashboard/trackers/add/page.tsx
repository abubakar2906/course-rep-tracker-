"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TrackerType } from "@/types/tracker"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function AddTrackerPage() {
  const router = useRouter()
  const [type, setType] = useState<TrackerType>("attendance")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Add your form submission logic here
    router.push("/dashboard/trackers")
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
            <Label>Tracker Type</Label>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value: TrackerType) => setType(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="attendance" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Attendance
              </ToggleGroupItem>
              <ToggleGroupItem value="assignment" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Assignment
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course Code</Label>
            <Input id="course" placeholder="e.g. CSC 101" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder={type === "attendance" ? "e.g. Week 1 Lecture" : "e.g. Assignment 1"} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Add any additional details..."
              className="h-32"
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
            <Button type="submit">Create Tracker</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
