"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronRight, User, UserRound, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddStudentModal } from "@/components/modals/add-student-modal"
import { api } from "@/lib/api"

interface Student {
  id: string
  fullName: string
  matricNumber: string
  gender: string
  cohort?: {
    level: string
  }
}

interface StudentCardProps {
  student: Student
  onClick: (id: string) => void
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <div
      onClick={() => onClick(student.id)}
      className="flex items-center p-4 hover:bg-secondary transition-colors duration-150 cursor-pointer"
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent flex items-center justify-center shrink-0">
        {student.gender === "MALE" ? (
          <User size={20} className="text-foreground" />
        ) : (
          <UserRound size={20} className="text-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{student.fullName}</h3>
        <div className="flex items-center text-sm text-muted-foreground flex-wrap">
          <span className="mr-2 whitespace-nowrap">{student.matricNumber}</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full mx-2 hidden sm:inline-block"></span>
          <span className="ml-0 md:ml-2 whitespace-nowrap">{student.cohort?.level?.replace('LEVEL_', '') || 'Unknown'} Level</span>
        </div>
      </div>

      <ChevronRight size={16} className="text-muted-foreground ml-2 shrink-0" />
    </div>
  )
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
    fetchCohorts()
  }, [])

  const fetchCohorts = async () => {
    try {
      const result = await api.getMyCohorts()
      if (result.success) {
        setCohorts(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch cohorts:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const result = await api.getStudents()
      if (result.success) {
        setStudents(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(lowercasedSearchTerm) ||
        student.matricNumber.toLowerCase().includes(lowercasedSearchTerm),
    )
  }, [searchTerm, students])

  const handleAddStudent = async (newStudent: any) => {
    try {
      const result = await api.createStudent(newStudent)
      if (result.success) {
        await fetchStudents()
        setIsAddModalOpen(false)
      } else {
        alert(result.error || 'Failed to add student')
      }
    } catch (error) {
      alert('Failed to add student')
    }
  }

  const handleStudentClick = (id: string) => {
    router.push(`/dashboard/students/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Students</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-300 text-gray-800 hover:bg-yellow-400"
        >
          <Plus size={18} className="mr-1" />
          Add Student
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search students by name or matric number..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search students"
        />
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onClick={handleStudentClick}
              />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {students.length === 0 
                ? "No students have been added yet." 
                : `No students found matching "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStudent}
        cohorts={cohorts}
      />
    </div>
  )
}