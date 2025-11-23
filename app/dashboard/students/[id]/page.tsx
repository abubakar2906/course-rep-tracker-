"use client"

import { use } from "react"
import { ArrowLeft, User, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

import type { Student } from "@/types/student"
import { mockStudents } from "@/types/mockData"

const getStudent = (id: number): Student | undefined => {
  return mockStudents.find(student => student.id === id)
}

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Properly unwrap params using React.use()
  const resolvedParams = use(params)
  const student = getStudent(parseInt(resolvedParams.id))

  if (!student) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{student.name}</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            {student.gender === "male" ? (
              <User size={32} className="text-foreground" />
            ) : (
              <UserRound size={32} className="text-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{student.matricNumber}</h2>
            <p className="text-muted-foreground">{student.department}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Level</dt>
            <dd className="text-lg font-medium">{student.level}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Department</dt>
            <dd className="text-lg font-medium">{student.department}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Gender</dt>
            <dd className="text-lg font-medium capitalize">{student.gender}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Matric Number</dt>
            <dd className="text-lg font-medium">{student.matricNumber}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
