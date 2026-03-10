"use client"

import { use, useEffect, useState } from "react"
import { ArrowLeft, User, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { api } from "@/lib/api"

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.getStudent(resolvedParams.id)
        if (res.success) {
          setStudent(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch student:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [resolvedParams.id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )

  if (!student) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-muted-foreground">Student not found.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{student.fullName}</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            {student.gender === "MALE" ? (
              <User size={32} className="text-foreground" />
            ) : (
              <UserRound size={32} className="text-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{student.matricNumber}</h2>
            <p className="text-muted-foreground">Level {student.level}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Level</dt>
            <dd className="text-lg font-medium">{student.level}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Gender</dt>
            <dd className="text-lg font-medium capitalize">{student.gender}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Matric Number</dt>
            <dd className="text-lg font-medium">{student.matricNumber}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Full Name</dt>
            <dd className="text-lg font-medium">{student.fullName}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}