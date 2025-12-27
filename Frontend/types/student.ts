export type StudentLevel = "100" | "200" | "300" | "400" | "500"

export interface Student {
  id: number
  name: string
  matricNumber: string
  department: string
  level: StudentLevel
  gender: "male" | "female"
}