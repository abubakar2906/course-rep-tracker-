export type StudentLevel = "100" | "200" | "300" | "400" | "500"

export interface Student {
  id: number
  name: string
  matricNumber: string
  department: string
  level: StudentLevel
  gender: "male" | "female"
}

export const mockStudents: Student[] = [
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
]