export interface User {
  firstName: string
  lastName: string
  email: string
  phone: string
  office: string
  department: string
  role: string
  about: string
}

// Default user data - in a real app, this would come from authentication/backend
export const defaultUser: User = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@university.edu",
  phone: "+234 123 456 7890",
  office: "Computer Science, Building C, Room 305",
  department: "Computer Science",
  role: "Course Representative",
  about: "Course Representative for Computer Science Department, responsible for tracking student attendance and assignments. Working to improve communication between students and faculty.",
}

