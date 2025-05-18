"use client"

import { useState, useMemo } from "react" // Added useMemo
import Link from "next/link"
import { Search, ChevronRight, User, UserRound, Plus } from "lucide-react"

// Define a type for the student object for better type safety and clarity
type Student = {
  id: number
  name: string
  matricNumber: string
  department: string
  level: string
  gender: "male" | "female" // Use a union type for gender
}

// Mock student data
// In a real application, this data would likely come from an API.
// Consider moving this to a separate file (e.g., lib/mockData.ts or app/dashboard/students/data.ts)
// if it grows or is used in multiple places.
const students: Student[] = [
  {
    id: 1,
    name: "John Smith",
    matricNumber: "CSC/2020/001",
    department: "Computer Science",
    level: "200",
    gender: "male",
  },
  {
    id: 2,
    name: "Emma Johnson",
    matricNumber: "EEE/2020/042",
    department: "Electrical Engineering",
    level: "300",
    gender: "female",
  },
  {
    id: 3,
    name: "Michael Brown",
    matricNumber: "MCE/2019/105",
    department: "Mechanical Engineering",
    level: "400",
    gender: "male",
  },
  {
    id: 4,
    name: "Sophia Williams",
    matricNumber: "CSC/2021/023",
    department: "Computer Science",
    level: "100",
    gender: "female",
  },
  {
    id: 5,
    name: "James Davis",
    matricNumber: "CVE/2018/067",
    department: "Civil Engineering",
    level: "500",
    gender: "male",
  },
  {
    id: 6,
    name: "Olivia Miller",
    matricNumber: "CSC/2020/089",
    department: "Computer Science",
    level: "200",
    gender: "female",
  },
  {
    id: 7,
    name: "William Wilson",
    matricNumber: "EEE/2019/112",
    department: "Electrical Engineering",
    level: "400",
    gender: "male",
  },
  {
    id: 8,
    name: "Ava Moore",
    matricNumber: "CSC/2021/045",
    department: "Computer Science",
    level: "100",
    gender: "female",
  },
]

/**
 * Props for the StudentCard component.
 */
interface StudentCardProps {
  student: Student
}

/**
 * StudentCard component to display individual student information.
 * This component is a clickable link that navigates to the student's profile page.
 */
const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <Link
      href={`/dashboard/students/${student.id}`}
      className="flex items-center p-4 hover:bg-secondary transition-colors duration-150" // Added transition-colors for smoother hover
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent flex items-center justify-center shrink-0">
        {/* Display different icons based on gender */}
        {student.gender === "male" ? (
          <User size={20} className="text-foreground" />
        ) : (
          <UserRound size={20} className="text-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow issues with long text */}
        <h3 className="font-medium text-foreground truncate">{student.name}</h3> {/* Added truncate for long names */}
        <div className="flex items-center text-sm text-muted-foreground flex-wrap"> {/* Added flex-wrap for responsiveness */}
          <span className="mr-2 whitespace-nowrap">{student.matricNumber}</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full mx-2 hidden sm:inline-block"></span> {/* Dot separator, hidden on very small screens */}
          <span className="mr-2 whitespace-nowrap truncate">{student.department}</span> {/* Added truncate */}
          <span className="w-1 h-1 bg-muted-foreground rounded-full mx-2 hidden md:inline-block"></span> {/* Dot separator, hidden on small/medium screens */}
          <span className="ml-0 md:ml-2 whitespace-nowrap">{student.level} Level</span>
        </div>
      </div>

      <ChevronRight size={16} className="text-muted-foreground ml-2 shrink-0" /> {/* Added shrink-0 */}
    </Link>
  )
}

/**
 * StudentsPage component displays a list of students with search functionality.
 * It allows users to view student details and add new students.
 */
export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize the filtered students list to avoid re-computation on every render
  // unless the students list or search term changes.
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercasedSearchTerm) ||
        student.department.toLowerCase().includes(lowercasedSearchTerm) ||
        student.matricNumber.toLowerCase().includes(lowercasedSearchTerm),
    )
  }, [searchTerm]) // Dependency array: re-filter only if searchTerm changes (students is stable for now)

  return (
    <div className="space-y-4 p-1">
      {/* Page Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Students</h1>
        <Link
          href="/dashboard/students/add"
          className="px-4 py-2 rounded-lg bg-yellow-300 text-gray-800 font-medium hover:bg-yellow-400 transition flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Student
        </Link>
      </div>

      {/* Search bar */}
      {/* Consider extracting this into a reusable SearchInput component if used elsewhere */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search students by name, ID or department..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search students" // Added aria-label for accessibility
        />
      </div>

      {/* Student list */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              // Use the new StudentCard component
              <StudentCard key={student.id} student={student} />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {/* Provide a more informative message if the students list itself is empty vs. no search results */}
              {students.length === 0 
                ? "No students have been added yet." 
                : `No students found matching "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
