"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: "",
    matricNumber: "",
    department: "",
    course: "",
    level: "",
    gender: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the student data to a database
    console.log("Student data:", formData)
    // Redirect to students list
    window.location.href = "/dashboard/students"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/students" className="mr-3 p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Add New Student</h1>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Matric Number */}
            <div className="space-y-2">
              <label htmlFor="matricNumber" className="text-sm font-medium text-foreground">
                Matric Number <span className="text-red-500">*</span>
              </label>
              <input
                id="matricNumber"
                name="matricNumber"
                type="text"
                required
                placeholder="CSC/2020/001"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.matricNumber}
                onChange={handleChange}
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium text-foreground">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                placeholder="Computer Science"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            {/* Course */}
            <div className="space-y-2">
              <label htmlFor="course" className="text-sm font-medium text-foreground">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                id="course"
                name="course"
                type="text"
                required
                placeholder="Introduction to Programming"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium text-foreground">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                id="level"
                name="level"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">Select Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium text-foreground">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Link
              href="/dashboard/students"
              className="px-6 py-3 rounded-lg border border-border text-foreground mr-2 hover:bg-secondary transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
