"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, UserRound, Clock, AlertTriangle, MessageSquare } from "lucide-react"

// Mock student data
const getStudent = (id: string) => {
  return {
    id: Number.parseInt(id),
    name: "Tommy Anderson",
    matricNumber: "CSC/2020/001",
    department: "Computer Science",
    course: "Introduction to Programming",
    level: "200",
    gender: "male",
    phoneNumber: "+234 800 123 4567",
    university: "New York Academy Of Arts",
    activityLog: [
      {
        date: "2023-05-01",
        note: "Student requested extension for assignment submission due to health issues.",
        priority: "normal",
      },
      {
        date: "2023-05-15",
        note: "Failed to submit mid-term project. Needs academic counseling.",
        priority: "high",
      },
      {
        date: "2023-06-02",
        note: "Reported issues with course materials not being accessible.",
        priority: "normal",
      },
    ],
  }
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudent(params.id)

  const [note, setNote] = useState("")
  const [priority, setPriority] = useState("normal")
  const [activityLog, setActivityLog] = useState(student.activityLog)

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()

    if (!note.trim()) return

    const newNote = {
      date: new Date().toISOString().split("T")[0],
      note,
      priority,
    }

    setActivityLog([newNote, ...activityLog])
    setNote("")
    setPriority("normal")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/students" className="mr-3 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Student Profile</h1>
      </div>

      {/* Student ID Card */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary p-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-card flex items-center justify-center bg-card">
              {student.gender === "male" ? (
                <User size={60} className="text-foreground" />
              ) : (
                <UserRound size={60} className="text-foreground" />
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-primary-foreground">{student.name}</h2>
              <p className="text-primary-foreground">ID: {student.matricNumber}</p>
              <p className="text-primary-foreground">{student.department}</p>
              <p className="text-primary-foreground">
                {student.course} - {student.level} Level
              </p>
              <p className="text-primary-foreground">{student.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <h3 className="font-medium mb-4">Add Note</h3>

        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium text-foreground">
              Note
            </label>
            <textarea
              id="note"
              rows={3}
              placeholder="Enter any issues or notes about this student..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium text-foreground">
              Priority
            </label>
            <select
              id="priority"
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>

      {/* Activity Log */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <h3 className="font-medium mb-4">Activity Log</h3>

        <div className="space-y-3">
          {activityLog.length > 0 ? (
            activityLog.map((activity, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  activity.priority === "urgent"
                    ? "border-red-500 bg-red-500/10"
                    : activity.priority === "high"
                      ? "border-orange-500 bg-orange-500/10"
                      : activity.priority === "medium"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-blue-500 bg-blue-500/10"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      activity.priority === "urgent"
                        ? "bg-red-500/20"
                        : activity.priority === "high"
                          ? "bg-orange-500/20"
                          : activity.priority === "medium"
                            ? "bg-yellow-500/20"
                            : "bg-blue-500/20"
                    }`}
                  >
                    {activity.priority === "urgent" || activity.priority === "high" ? (
                      <AlertTriangle
                        size={16}
                        className={activity.priority === "urgent" ? "text-red-500" : "text-orange-500"}
                      />
                    ) : (
                      <MessageSquare
                        size={16}
                        className={activity.priority === "medium" ? "text-yellow-500" : "text-blue-500"}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.note}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock size={12} className="mr-1" />
                      <span>{activity.date}</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-foreground">
                        {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">No activity recorded yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
