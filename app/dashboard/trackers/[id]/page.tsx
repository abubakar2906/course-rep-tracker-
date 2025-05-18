"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Check, X, DollarSign, MessageSquare, BarChart2, Users, User, UserRound } from "lucide-react"

// Mock student data
const students = [
  {
    id: 1,
    name: "John Smith",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: true,
    complaints: 0,
    gender: "male",
  },
  {
    id: 2,
    name: "Emma Johnson",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: false,
    complaints: 1,
    gender: "female",
  },
  {
    id: 3,
    name: "Michael Brown",
    image: "/placeholder.svg?height=40&width=40",
    attendance: false,
    fees: true,
    complaints: 0,
    gender: "male",
  },
  {
    id: 4,
    name: "Sophia Williams",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: true,
    complaints: 0,
    gender: "female",
  },
  {
    id: 5,
    name: "James Davis",
    image: "/placeholder.svg?height=40&width=40",
    attendance: false,
    fees: false,
    complaints: 2,
    gender: "male",
  },
  {
    id: 6,
    name: "Olivia Miller",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: true,
    complaints: 0,
    gender: "female",
  },
  {
    id: 7,
    name: "William Wilson",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: false,
    complaints: 1,
    gender: "male",
  },
  {
    id: 8,
    name: "Ava Moore",
    image: "/placeholder.svg?height=40&width=40",
    attendance: true,
    fees: true,
    complaints: 0,
    gender: "female",
  },
]

// Tracker data
const trackerData = {
  attendance: {
    name: "Attendance Tracker",
    description: "Track student attendance for classes and events",
    icon: Users,
    color: "blue",
    stats: {
      total: 120,
      completed: 98,
      percentage: 82,
    },
  },
  fees: {
    name: "Fee Tracker",
    description: "Monitor student fee payments and dues",
    icon: DollarSign,
    color: "green",
    stats: {
      total: 120,
      completed: 78,
      percentage: 65,
    },
  },
  complaints: {
    name: "Complaint Log",
    description: "Record and manage student complaints and issues",
    icon: MessageSquare,
    color: "red",
    stats: {
      total: 120,
      active: 12,
      resolved: 24,
      percentage: 67,
    },
  },
}

export default function TrackerDetailPage({ params }: { params: { id: string } }) {
  const trackerId = params.id
  const tracker = trackerData[trackerId as keyof typeof trackerData]

  const [searchTerm, setSearchTerm] = useState("")
  const [studentData, setStudentData] = useState(students)

  const filteredStudents = studentData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleAttendance = (id: number) => {
    setStudentData((prev) =>
      prev.map((student) => (student.id === id ? { ...student, attendance: !student.attendance } : student)),
    )
  }

  const toggleFees = (id: number) => {
    setStudentData((prev) => prev.map((student) => (student.id === id ? { ...student, fees: !student.fees } : student)))
  }

  const updateComplaints = (id: number, value: number) => {
    setStudentData((prev) => prev.map((student) => (student.id === id ? { ...student, complaints: value } : student)))
  }

  // Calculate stats based on current data
  const calculateStats = () => {
    if (trackerId === "attendance") {
      const attendanceCount = studentData.filter((s) => s.attendance).length
      return {
        present: attendanceCount,
        absent: studentData.length - attendanceCount,
        percentage: Math.round((attendanceCount / studentData.length) * 100),
      }
    } else if (trackerId === "fees") {
      const paidCount = studentData.filter((s) => s.fees).length
      return {
        paid: paidCount,
        unpaid: studentData.length - paidCount,
        percentage: Math.round((paidCount / studentData.length) * 100),
      }
    } else {
      const totalComplaints = studentData.reduce((sum, s) => sum + s.complaints, 0)
      const studentsWithComplaints = studentData.filter((s) => s.complaints > 0).length
      return {
        total: totalComplaints,
        students: studentsWithComplaints,
        percentage: Math.round((studentsWithComplaints / studentData.length) * 100),
      }
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/trackers" className="mr-3 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">{tracker.name}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
            <BarChart2 size={18} className="text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">
            {trackerId === "attendance" ? stats.percentage : trackerId === "fees" ? stats.percentage : stats.percentage}
            %
          </p>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-primary"
              style={{
                width: `${
                  trackerId === "attendance"
                    ? stats.percentage
                    : trackerId === "fees"
                      ? stats.percentage
                      : stats.percentage
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {trackerId === "attendance"
              ? "Attendance Status"
              : trackerId === "fees"
                ? "Payment Status"
                : "Complaint Status"}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {trackerId === "attendance" ? stats.present : trackerId === "fees" ? stats.paid : stats.total}
              </p>
              <p className="text-sm text-muted-foreground">
                {trackerId === "attendance" ? "Present" : trackerId === "fees" ? "Paid" : "Total Complaints"}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-right">
                {trackerId === "attendance" ? stats.absent : trackerId === "fees" ? stats.unpaid : stats.students}
              </p>
              <p className="text-sm text-muted-foreground text-right">
                {trackerId === "attendance" ? "Absent" : trackerId === "fees" ? "Unpaid" : "Students with Issues"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Students</h3>
          <p className="text-3xl font-bold">{studentData.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {trackerId === "attendance"
              ? `${stats.present} present, ${stats.absent} absent`
              : trackerId === "fees"
                ? `${stats.paid} paid, ${stats.unpaid} unpaid`
                : `${stats.students} with complaints`}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search students..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Student list */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center p-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent flex items-center justify-center">
                  {student.gender === "male" ? (
                    <User size={20} className="text-foreground" />
                  ) : (
                    <UserRound size={20} className="text-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{student.name}</h3>
                </div>

                {trackerId === "attendance" && (
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`p-2 rounded-full ${student.attendance ? "bg-green-500/20" : "bg-red-500/20"}`}
                  >
                    {student.attendance ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </button>
                )}

                {trackerId === "fees" && (
                  <button
                    onClick={() => toggleFees(student.id)}
                    className={`p-2 rounded-full ${student.fees ? "bg-green-500/20" : "bg-red-500/20"}`}
                  >
                    <DollarSign size={18} className={student.fees ? "text-green-500" : "text-red-500"} />
                  </button>
                )}

                {trackerId === "complaints" && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateComplaints(student.id, Math.max(0, student.complaints - 1))}
                      className="p-1 rounded-full bg-secondary hover:bg-accent"
                    >
                      <span className="text-foreground">-</span>
                    </button>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                      <span className="text-sm font-medium">{student.complaints}</span>
                    </div>

                    <button
                      onClick={() => updateComplaints(student.id, student.complaints + 1)}
                      className="p-1 rounded-full bg-secondary hover:bg-accent"
                    >
                      <span className="text-foreground">+</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No students found matching "{searchTerm}"</div>
          )}
        </div>
      </div>
    </div>
  )
}
